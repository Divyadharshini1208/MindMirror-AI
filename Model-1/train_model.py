"""
Text Emotion and Sentiment Analysis System - Model Training & Evaluation Pipeline
=================================================================================
Automated pipeline for dataset inspection, preprocessing, TF-IDF feature extraction,
training and benchmarking multiple models (MultinomialNB, Logistic Regression, Linear SVM),
evaluating with comprehensive metrics, and exporting production-ready artifacts.
"""

import os
import sys
import time
import argparse
import logging
from datetime import datetime
from typing import Tuple, Dict, Any, List

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
)

# Import local text normalization and label definitions
from preprocess import (
    clean_text,
    EMOTION_LABEL_MAP,
    EMOTION_EMOJIS,
    EMOTION_COLORS,
)

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("TrainEmotionModel")


def detect_columns(df: pd.DataFrame) -> Tuple[str, str]:
    """
    Automatically detect the text column and target label column in the dataframe.
    Falls back to heuristics if standard names are not found.
    """
    text_col = None
    label_col = None

    # Candidate column names
    text_candidates = ["text", "sentence", "content", "tweet", "phrase", "utterance", "comment"]
    label_candidates = ["label", "emotion", "target", "category", "sentiment", "class"]

    cols_lower = {col.lower(): col for col in df.columns}

    # Match text column
    for candidate in text_candidates:
        if candidate in cols_lower:
            text_col = cols_lower[candidate]
            break

    # Match label column
    for candidate in label_candidates:
        if candidate in cols_lower:
            label_col = cols_lower[candidate]
            break

    # If still not found, inspect data types
    if text_col is None:
        for col in df.columns:
            if df[col].dtype == object and df[col].nunique() > 100:
                text_col = col
                break

    if label_col is None:
        for col in df.columns:
            if col != text_col and (pd.api.types.is_numeric_dtype(df[col]) or df[col].nunique() <= 20):
                label_col = col
                break

    if text_col is None or label_col is None:
        raise ValueError(
            f"Could not automatically identify columns in CSV. Available columns: {list(df.columns)}. "
            f"Detected text={text_col}, label={label_col}"
        )

    return text_col, label_col


def inspect_and_clean_dataset(
    csv_path: str,
    sample_size: int = None,
    random_state: int = 42,
) -> Tuple[pd.DataFrame, str, str, Dict[int, str]]:
    """
    Inspect the dataset structure, missing values, duplicates, and class balance.
    Cleans duplicates and nulls safely without modifying the original CSV file.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset file not found at: {csv_path}")

    logger.info(f"Loading raw dataset from '{csv_path}'...")
    raw_df = pd.read_csv(csv_path)
    total_raw_rows = len(raw_df)
    logger.info(f"Loaded raw dataset with {total_raw_rows:,} records and {raw_df.shape[1]} columns.")

    text_col, label_col = detect_columns(raw_df)
    logger.info(f"Identified columns: Text Column='{text_col}', Target Label Column='{label_col}'")

    # Audit null values
    null_counts = raw_df[[text_col, label_col]].isnull().sum()
    logger.info(f"Missing values check: {text_col}={null_counts[text_col]}, {label_col}={null_counts[label_col]}")

    # Drop nulls if any exist
    df = raw_df.dropna(subset=[text_col, label_col]).copy()

    # Cast label to integer if numeric
    if pd.api.types.is_numeric_dtype(df[label_col]):
        df[label_col] = df[label_col].astype(int)

    # Check and remove duplicates in text column
    duplicate_count = df[text_col].duplicated().sum()
    logger.info(f"Duplicate text records detected: {duplicate_count:,} ({duplicate_count/total_raw_rows*100:.2f}%)")
    df = df.drop_duplicates(subset=[text_col]).reset_index(drop=True)
    logger.info(f"Dataset size after deduplication: {len(df):,} unique records.")

    # Validate label distribution
    label_counts = df[label_col].value_counts().sort_index()
    logger.info("Class distribution in deduplicated dataset:")
    for lbl, count in label_counts.items():
        name = EMOTION_LABEL_MAP.get(lbl, f"Class_{lbl}")
        pct = (count / len(df)) * 100
        logger.info(f"  * Label {lbl} ({name}): {count:,} samples ({pct:.2f}%)")

    # Optional subsampling for rapid development or constrained environments
    if sample_size and sample_size < len(df):
        logger.info(f"Subsampling {sample_size:,} records with stratified sampling (random_state={random_state})...")
        df, _ = train_test_split(
            df,
            train_size=sample_size,
            random_state=random_state,
            stratify=df[label_col],
        )
        df = df.reset_index(drop=True)
        logger.info(f"Sampled dataset size: {len(df):,} records.")

    # Verified label mapping
    unique_labels = sorted(df[label_col].unique())
    label_map = {lbl: EMOTION_LABEL_MAP.get(lbl, f"Class_{lbl}") for lbl in unique_labels}

    return df, text_col, label_col, label_map


def build_models(random_state: int = 42) -> Dict[str, Any]:
    """
    Construct the candidate models with appropriate hyperparameters:
    1. Multinomial Naive Bayes (Fast probabilistic baseline)
    2. Logistic Regression (High performance linear classifier with balanced class weights)
    3. Linear Support Vector Machine with Calibrated Probabilities (State of the art margin classifier)
    """
    models = {
        "Multinomial Naive Bayes": MultinomialNB(alpha=0.1),
        "Logistic Regression": LogisticRegression(
            C=1.5,
            max_iter=1000,
            class_weight="balanced",
            random_state=random_state,
            solver="lbfgs",
        ),
        "Linear Support Vector Machine": CalibratedClassifierCV(
            estimator=LinearSVC(
                C=1.0,
                dual=False,
                class_weight="balanced",
                max_iter=2500,
                random_state=random_state,
            ),
            cv=3,
            method="sigmoid",
        ),
    }
    return models


def evaluate_predictions(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    target_names: List[str],
) -> Dict[str, float]:
    """Calculate standard evaluation metrics for multi-class classification."""
    metrics = {
        "Accuracy": float(accuracy_score(y_true, y_pred)),
        "Precision (Macro)": float(precision_score(y_true, y_pred, average="macro", zero_division=0)),
        "Recall (Macro)": float(recall_score(y_true, y_pred, average="macro", zero_division=0)),
        "Macro F1-Score": float(f1_score(y_true, y_pred, average="macro", zero_division=0)),
        "Weighted F1-Score": float(f1_score(y_true, y_pred, average="weighted", zero_division=0)),
    }
    return metrics


def train_and_benchmark(
    df: pd.DataFrame,
    text_col: str,
    label_col: str,
    label_map: Dict[int, str],
    output_dir: str = "outputs",
    model_dir: str = "models",
    random_state: int = 42,
    test_size: float = 0.2,
) -> Dict[str, Any]:
    """
    Execute full training, benchmarking, evaluation visual generation, and model export.
    """
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(model_dir, exist_ok=True)

    logger.info(f"Splitting dataset into train ({1-test_size:.0%}) and test ({test_size:.0%}) sets...")
    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        df[text_col],
        df[label_col],
        test_size=test_size,
        random_state=random_state,
        stratify=df[label_col],
    )
    logger.info(f"Train samples: {len(X_train_raw):,}, Test samples: {len(X_test_raw):,}")

    # Build clean TF-IDF Vectorizer
    # Fit strictly on the training set to prevent data leakage!
    logger.info("Initializing and fitting TF-IDF Vectorizer on training data...")
    t0 = time.time()
    vectorizer = TfidfVectorizer(
        preprocessor=clean_text,
        ngram_range=(1, 2),
        max_features=30000,
        sublinear_tf=True,
        min_df=2,
    )
    X_train_vec = vectorizer.fit_transform(X_train_raw)
    X_test_vec = vectorizer.transform(X_test_raw)
    vocab_size = len(vectorizer.vocabulary_)
    logger.info(f"TF-IDF fitted in {time.time()-t0:.2f}s. Vocabulary size: {vocab_size:,} features.")

    candidate_models = build_models(random_state=random_state)
    comparison_results = []
    trained_estimators = {}
    test_predictions = {}

    unique_classes = sorted(list(label_map.keys()))
    target_names = [label_map[c] for c in unique_classes]

    logger.info("=== Starting Model Benchmark Training ===")
    for name, model in candidate_models.items():
        logger.info(f"Training '{name}'...")
        t_start = time.time()
        model.fit(X_train_vec, y_train)
        train_time = time.time() - t_start

        logger.info(f"Evaluating '{name}' on unseen test set...")
        y_pred = model.predict(X_test_vec)
        eval_metrics = evaluate_predictions(y_test, y_pred, target_names)

        eval_metrics["Model"] = name
        eval_metrics["Train Time (s)"] = round(train_time, 2)
        comparison_results.append(eval_metrics)

        trained_estimators[name] = model
        test_predictions[name] = y_pred

        logger.info(
            f"  -> {name} | Macro F1: {eval_metrics['Macro F1-Score']:.4f} | "
            f"Accuracy: {eval_metrics['Accuracy']:.4f} | Time: {train_time:.2f}s"
        )

    # Compile comparison DataFrame
    comparison_df = pd.DataFrame(comparison_results)
    # Reorder columns
    cols_order = [
        "Model",
        "Macro F1-Score",
        "Accuracy",
        "Precision (Macro)",
        "Recall (Macro)",
        "Weighted F1-Score",
        "Train Time (s)",
    ]
    comparison_df = comparison_df[cols_order].sort_values(by="Macro F1-Score", ascending=False)

    # Save comparison CSV
    comparison_csv_path = os.path.join(output_dir, "model_comparison.csv")
    comparison_df.to_csv(comparison_csv_path, index=False)
    logger.info(f"Saved model comparison table to '{comparison_csv_path}'")

    # Select best model based on Macro F1-score
    best_model_name = comparison_df.iloc[0]["Model"]
    best_f1 = comparison_df.iloc[0]["Macro F1-Score"]
    best_estimator = trained_estimators[best_model_name]
    best_pred = test_predictions[best_model_name]

    logger.info(f"\n=======================================================")
    logger.info(f"  BEST MODEL SELECTED: {best_model_name}")
    logger.info(f"  Macro F1-Score: {best_f1:.4f}")
    logger.info(f"=======================================================\n")

    # Generate and save classification report
    report_text = (
        f"Text Emotion & Sentiment Analysis - Classification Report\n"
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        f"Selected Best Model: {best_model_name}\n"
        f"Total Test Set Records: {len(y_test):,}\n"
        f"-----------------------------------------------------------\n\n"
        f"{classification_report(y_test, best_pred, target_names=target_names, digits=4, zero_division=0)}\n"
    )
    report_file_path = os.path.join(output_dir, "classification_report.txt")
    with open(report_file_path, "w", encoding="utf-8") as f:
        f.write(report_text)
    logger.info(f"Saved classification report to '{report_file_path}'")
    print("\n" + report_text)

    # Visual 1: Model Comparison Bar Chart
    plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
    fig, ax = plt.subplots(figsize=(10, 5.5), dpi=150)
    metrics_to_plot = ["Macro F1-Score", "Accuracy", "Weighted F1-Score"]
    melted = comparison_df.melt(id_vars="Model", value_vars=metrics_to_plot, var_name="Metric", value_name="Score")

    palette = ["#4361EE", "#4CC9F0", "#7209B7"]
    sns.barplot(data=melted, x="Model", y="Score", hue="Metric", ax=ax, palette=palette)
    ax.set_ylim(0, 1.08)
    ax.set_title("Model Benchmark Comparison on Text Emotion Dataset", fontsize=14, fontweight="bold", pad=15)
    ax.set_ylabel("Score (0.0 - 1.0)", fontsize=11)
    ax.set_xlabel("Candidate Model Architecture", fontsize=11)
    ax.legend(frameon=True, loc="lower right")

    # Add numeric labels on bars
    for p in ax.patches:
        height = p.get_height()
        if height > 0.01:
            ax.annotate(
                f"{height:.3f}",
                (p.get_x() + p.get_width() / 2.0, height),
                ha="center",
                va="bottom",
                fontsize=8,
                xytext=(0, 2),
                textcoords="offset points",
            )

    plt.tight_layout()
    comparison_png_path = os.path.join(output_dir, "model_comparison.png")
    plt.savefig(comparison_png_path, dpi=200)
    plt.close(fig)
    logger.info(f"Saved model comparison plot to '{comparison_png_path}'")

    # Visual 2: Normalized Confusion Matrix
    cm = confusion_matrix(y_test, best_pred, labels=unique_classes)
    cm_norm = cm.astype("float") / cm.sum(axis=1)[:, np.newaxis]

    fig_cm, ax_cm = plt.subplots(figsize=(8, 6.5), dpi=150)
    sns.heatmap(
        cm_norm,
        annot=True,
        fmt=".2%",
        cmap="Blues",
        xticklabels=target_names,
        yticklabels=target_names,
        cbar_kws={"label": "Normalized Recall"},
        ax=ax_cm,
        linewidths=0.5,
        linecolor="#E2E8F0",
    )
    ax_cm.set_title(
        f"Normalized Confusion Matrix - {best_model_name}",
        fontsize=13,
        fontweight="bold",
        pad=15,
    )
    ax_cm.set_xlabel("Predicted Emotion Category", fontsize=11, labelpad=10)
    ax_cm.set_ylabel("True Emotion Category", fontsize=11, labelpad=10)
    plt.tight_layout()

    cm_png_path = os.path.join(output_dir, "confusion_matrix.png")
    plt.savefig(cm_png_path, dpi=200)
    plt.close(fig_cm)
    logger.info(f"Saved confusion matrix plot to '{cm_png_path}'")

    # Create end-to-end Inference Pipeline
    production_pipeline = Pipeline([
        ("tfidf", vectorizer),
        ("classifier", best_estimator),
    ])

    # Package metadata alongside model
    model_artifact = {
        "pipeline": production_pipeline,
        "best_model_name": best_model_name,
        "label_map": label_map,
        "target_names": target_names,
        "unique_classes": unique_classes,
        "metrics": comparison_df[comparison_df["Model"] == best_model_name].iloc[0].to_dict(),
        "all_comparisons": comparison_df.to_dict(orient="records"),
        "timestamp": datetime.now().isoformat(),
        "total_training_records": len(X_train_raw),
        "total_test_records": len(X_test_raw),
    }

    best_model_path = os.path.join(model_dir, "best_model.joblib")
    joblib.dump(model_artifact, best_model_path, compress=3)
    logger.info(f"Saved complete production model artifact to '{best_model_path}'")

    return model_artifact


def main():
    parser = argparse.ArgumentParser(description="Train and evaluate text emotion classification models.")
    parser.add_argument("--data", type=str, default="text.csv", help="Path to input text.csv dataset.")
    parser.add_argument(
        "--sample_size",
        type=int,
        default=None,
        help="Optional number of samples to train on (e.g., 100000). Defaults to full clean dataset.",
    )
    parser.add_argument("--output_dir", type=str, default="outputs", help="Directory for evaluation artifacts.")
    parser.add_argument("--model_dir", type=str, default="models", help="Directory for saved model.")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility.")

    args = parser.parse_args()

    print("\n" + "=" * 70)
    print("   TEXT EMOTION ANALYSIS SYSTEM - TRAINING & BENCHMARK PIPELINE")
    print("=" * 70 + "\n")

    start_time = time.time()

    # Step 1: Inspect & clean
    df, text_col, label_col, label_map = inspect_and_clean_dataset(
        csv_path=args.data,
        sample_size=args.sample_size,
        random_state=args.seed,
    )

    # Step 2 & 3 & 4: Train, Benchmark, Evaluate, Export
    artifact = train_and_benchmark(
        df=df,
        text_col=text_col,
        label_col=label_col,
        label_map=label_map,
        output_dir=args.output_dir,
        model_dir=args.model_dir,
        random_state=args.seed,
    )

    elapsed = time.time() - start_time
    print("\n" + "=" * 70)
    print(f"   TRAINING & BENCHMARK COMPLETE (Total time: {elapsed:.1f}s)")
    print(f"   Best Model: {artifact['best_model_name']}")
    print(f"   Macro F1:   {artifact['metrics']['Macro F1-Score']:.4f}")
    print(f"   Accuracy:   {artifact['metrics']['Accuracy']:.4f}")
    print(f"   Saved at:   {os.path.join(args.model_dir, 'best_model.joblib')}")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()
