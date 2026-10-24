"""
Facial Emotion Recognition System - Model Training & Evaluation Pipeline
========================================================================
Automated ML pipeline for dataset inspection, image preprocessing, feature extraction,
training and benchmarking classical ML models (MultinomialNB, Logistic Regression, Linear SVM),
cross-validation model selection, final evaluation on an untouched test set, and exporting
production-ready artifacts and metrics.
"""

import os
import sys
import time
import argparse
import logging
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from typing import Tuple, Dict, Any, List

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image
import joblib

from sklearn.preprocessing import StandardScaler
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import SGDClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
)

# Set up clean logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("TrainEmotionModel")

# Emotion definitions
EMOTION_CLASSES = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]
EMOTION_LABEL_MAP = {name: idx for idx, name in enumerate(EMOTION_CLASSES)}
EMOTION_ID_TO_LABEL = {idx: name for idx, name in enumerate(EMOTION_CLASSES)}

EMOTION_EMOJIS = {
    "angry": "😠",
    "disgust": "🤢",
    "fear": "😨",
    "happy": "😊",
    "neutral": "😐",
    "sad": "😢",
    "surprise": "😲",
}

EMOTION_COLORS = {
    "angry": "#EF4444",     # Crimson Red
    "disgust": "#10B981",   # Emerald Green
    "fear": "#8B5CF6",      # Purple
    "happy": "#F59E0B",     # Amber Gold
    "neutral": "#6B7280",   # Slate Gray
    "sad": "#3B82F6",       # Blue
    "surprise": "#EC4899",  # Rose Pink
}

IMAGE_SIZE = (48, 48)
FEATURE_DIM = IMAGE_SIZE[0] * IMAGE_SIZE[1]  # 2304


# =====================================================================
# 1. Dataset Inspection & Loading
# =====================================================================

def inspect_dataset_directory(dir_path: str, split_name: str) -> Dict[str, Any]:
    """
    Inspect an emotion dataset directory and verify folder structure,
    image counts, dimensions, file formats, and class balance.
    """
    if not os.path.exists(dir_path):
        raise FileNotFoundError(f"Dataset directory '{dir_path}' does not exist.")

    class_counts = {}
    corrupted_files = []
    shapes = set()
    modes = set()
    total_images = 0

    classes_found = sorted([
        d for d in os.listdir(dir_path)
        if os.path.isdir(os.path.join(dir_path, d))
    ])

    for c in classes_found:
        c_dir = os.path.join(dir_path, c)
        files = [
            f for f in os.listdir(c_dir)
            if f.lower().endswith(('.jpg', '.jpeg', '.png'))
        ]
        class_counts[c] = len(files)
        total_images += len(files)

        # Inspect first 10 images per class for shape and validity
        for f in files[:10]:
            img_path = os.path.join(c_dir, f)
            try:
                with Image.open(img_path) as img:
                    shapes.add(img.size)
                    modes.add(img.mode)
            except Exception as e:
                corrupted_files.append((img_path, str(e)))

    stats = {
        "split": split_name,
        "path": dir_path,
        "total_images": total_images,
        "classes": class_counts,
        "image_shapes": list(shapes),
        "image_modes": list(modes),
        "corrupted_count": len(corrupted_files),
        "corrupted_files": corrupted_files,
    }

    logger.info(f"=== {split_name.upper()} DATASET INSPECTION ===")
    logger.info(f"Total images: {total_images:,}")
    logger.info(f"Classes ({len(class_counts)}): {class_counts}")
    logger.info(f"Observed shapes: {shapes}, Color modes: {modes}")
    if corrupted_files:
        logger.warning(f"Corrupted images detected: {len(corrupted_files)}")
    else:
        logger.info("Integrity check: PASSED (Zero corrupted images)")

    return stats


def preprocess_image(image_path: str) -> np.ndarray:
    """
    Load an image, convert to single-channel grayscale (L),
    resize to 48x48, and flatten to 2304 normalized floats in [0, 1].
    """
    with Image.open(image_path) as img:
        if img.mode != 'L':
            img = img.convert('L')
        if img.size != IMAGE_SIZE:
            img = img.resize(IMAGE_SIZE, Image.Resampling.BILINEAR)
        arr = np.array(img, dtype=np.float32).flatten() / 255.0
        return arr


def load_dataset(dir_path: str, max_workers: int = 16) -> Tuple[np.ndarray, np.ndarray, List[str]]:
    """
    Load and preprocess all images from class subdirectories using multithreading.
    Returns:
        X: numpy array of shape (N, 2304)
        y: numpy array of shape (N,) containing integer labels
        image_paths: list of source image paths
    """
    items = []
    classes = sorted([
        d for d in os.listdir(dir_path)
        if os.path.isdir(os.path.join(dir_path, d))
    ])

    for c in classes:
        if c not in EMOTION_LABEL_MAP:
            continue
        c_dir = os.path.join(dir_path, c)
        label_id = EMOTION_LABEL_MAP[c]
        for f in os.listdir(c_dir):
            if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                items.append((os.path.join(c_dir, f), label_id))

    def _worker(item):
        path, lbl = item
        try:
            feats = preprocess_image(path)
            return feats, lbl, path
        except Exception:
            return None

    logger.info(f"Loading and preprocessing {len(items):,} images from '{dir_path}'...")
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=max_workers) as pool:
        results = list(pool.map(_worker, items))

    # Filter any failed reads
    valid_results = [r for r in results if r is not None]
    X = np.array([r[0] for r in valid_results], dtype=np.float32)
    y = np.array([r[1] for r in valid_results], dtype=np.int64)
    paths = [r[2] for r in valid_results]

    elapsed = time.time() - t0
    logger.info(f"Loaded {len(X):,} images in {elapsed:.2f}s | Matrix shape: {X.shape}")
    return X, y, paths


# =====================================================================
# 2. Model Pipelines & Training
# =====================================================================

def build_candidate_models() -> Dict[str, Any]:
    """
    Build the three candidate machine learning model pipelines:
    1. Multinomial Naive Bayes (operating on non-negative [0, 1] pixel features)
    2. Logistic Regression (SGD log_loss with balanced class weights & StandardScaler)
    3. Linear Support Vector Machine (SGD modified_huber with balanced class weights & StandardScaler)
    """
    models = {
        "Multinomial Naive Bayes": MultinomialNB(
            alpha=1.0,
            fit_prior=True,
        ),
        "Logistic Regression": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", SGDClassifier(
                loss="log_loss",
                penalty="l2",
                alpha=1e-4,
                max_iter=300,
                tol=1e-3,
                early_stopping=True,
                n_iter_no_change=5,
                class_weight="balanced",
                random_state=42,
            )),
        ]),
        "Linear Support Vector Machine": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", SGDClassifier(
                loss="modified_huber",
                penalty="l2",
                alpha=1e-4,
                max_iter=300,
                tol=1e-3,
                early_stopping=True,
                n_iter_no_change=5,
                class_weight="balanced",
                random_state=42,
            )),
        ]),
    }
    return models


def compare_models_cross_validation(
    models: Dict[str, Any],
    X_train: np.ndarray,
    y_train: np.ndarray,
    cv_folds: int = 5,
    output_dir: str = "outputs",
) -> Tuple[str, Dict[str, Dict[str, float]], pd.DataFrame]:
    """
    Benchmark candidate models using Stratified K-Fold Cross-Validation on TRAINING DATA ONLY.
    Never touches testing data. Generates model comparison visualization.
    """
    logger.info(f"Starting {cv_folds}-fold Stratified Cross-Validation on training data ({len(X_train):,} samples)...")
    cv = StratifiedKFold(n_splits=cv_folds, shuffle=True, random_state=42)

    scoring = {
        "accuracy": "accuracy",
        "macro_f1": "f1_macro",
        "weighted_f1": "f1_weighted",
        "macro_precision": "precision_macro",
        "macro_recall": "recall_macro",
    }

    cv_results = {}
    summary_rows = []

    for name, model in models.items():
        logger.info(f"Running cross-validation for: {name}...")
        t0 = time.time()
        scores = cross_validate(
            model,
            X_train,
            y_train,
            cv=cv,
            scoring=scoring,
            n_jobs=-1,
            return_train_score=False,
        )
        elapsed = time.time() - t0

        acc_mean = float(scores["test_accuracy"].mean())
        acc_std = float(scores["test_accuracy"].std())
        macro_f1_mean = float(scores["test_macro_f1"].mean())
        macro_f1_std = float(scores["test_macro_f1"].std())
        weighted_f1_mean = float(scores["test_weighted_f1"].mean())
        prec_mean = float(scores["test_macro_precision"].mean())
        rec_mean = float(scores["test_macro_recall"].mean())

        cv_results[name] = {
            "accuracy_mean": acc_mean,
            "accuracy_std": acc_std,
            "macro_f1_mean": macro_f1_mean,
            "macro_f1_std": macro_f1_std,
            "weighted_f1_mean": weighted_f1_mean,
            "precision_mean": prec_mean,
            "recall_mean": rec_mean,
            "cv_time_sec": elapsed,
        }

        summary_rows.append({
            "Model": name,
            "CV Macro F1": macro_f1_mean,
            "CV Macro F1 (Std)": macro_f1_std,
            "CV Accuracy": acc_mean,
            "CV Accuracy (Std)": acc_std,
            "CV Weighted F1": weighted_f1_mean,
            "CV Macro Precision": prec_mean,
            "CV Macro Recall": rec_mean,
            "CV Duration (s)": round(elapsed, 2),
        })

        logger.info(
            f"  {name} -> CV Macro F1: {macro_f1_mean:.4f} (+/- {macro_f1_std:.4f}) | "
            f"CV Accuracy: {acc_mean:.4f} (+/- {acc_std:.4f}) | Time: {elapsed:.2f}s"
        )

    summary_df = pd.DataFrame(summary_rows)

    # Determine best model based on CV Macro F1-score
    best_model_name = summary_df.sort_values(by="CV Macro F1", ascending=False).iloc[0]["Model"]
    logger.info(f">>> BEST MODEL SELECTED VIA CV MACRO F1: {best_model_name} <<<")

    # Generate Model Comparison Visualization
    os.makedirs(output_dir, exist_ok=True)
    comparison_chart_path = os.path.join(output_dir, "model_comparison.png")
    plot_model_comparison(summary_df, comparison_chart_path)

    return best_model_name, cv_results, summary_df


def plot_model_comparison(summary_df: pd.DataFrame, output_path: str):
    """
    Generate a modern, high-resolution comparative bar chart for CV metrics.
    """
    plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)

    models = summary_df["Model"].tolist()
    macro_f1 = summary_df["CV Macro F1"].tolist()
    accuracy = summary_df["CV Accuracy"].tolist()
    weighted_f1 = summary_df["CV Weighted F1"].tolist()

    x = np.arange(len(models))
    width = 0.25

    rects1 = ax.bar(x - width, macro_f1, width, label='CV Macro F1', color='#8B5CF6', edgecolor='#4C1D95', alpha=0.9)
    rects2 = ax.bar(x, accuracy, width, label='CV Accuracy', color='#3B82F6', edgecolor='#1E3A8A', alpha=0.9)
    rects3 = ax.bar(x + width, weighted_f1, width, label='CV Weighted F1', color='#10B981', edgecolor='#064E3B', alpha=0.9)

    ax.set_ylabel('Score (0.0 to 1.0)', fontsize=12, fontweight='bold', color='#1F2937')
    ax.set_title('Cross-Validation Model Performance Comparison\n(Evaluated on Training Data Only)', fontsize=14, fontweight='bold', pad=15, color='#111827')
    ax.set_xticks(x)
    ax.set_xticklabels(models, fontsize=11, fontweight='semibold')
    ax.set_ylim(0, max(max(macro_f1), max(accuracy), max(weighted_f1)) * 1.35)
    ax.legend(frameon=True, facecolor='white', framealpha=0.9, fontsize=11)

    # Attach text labels above bars
    def autolabel(rects):
        for rect in rects:
            height = rect.get_height()
            ax.annotate(f'{height:.3f}',
                        xy=(rect.get_x() + rect.get_width() / 2, height),
                        xytext=(0, 4),  # 4 points vertical offset
                        textcoords="offset points",
                        ha='center', va='bottom', fontsize=9, fontweight='bold', color='#1F2937')

    autolabel(rects1)
    autolabel(rects2)
    autolabel(rects3)

    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    logger.info(f"Model comparison chart saved to: {output_path}")


# =====================================================================
# 3. Final Evaluation on Untouched Testing Dataset
# =====================================================================

def evaluate_final_model(
    model: Any,
    model_name: str,
    X_test: np.ndarray,
    y_test: np.ndarray,
    output_dir: str = "outputs",
) -> Dict[str, Any]:
    """
    Evaluate the selected best model on the untouched testing dataset.
    Generates:
      - test_metrics.csv
      - classification_report.txt
      - confusion_matrix.png
    """
    logger.info(f"Evaluating final model '{model_name}' on untouched test dataset ({len(X_test):,} images)...")
    t0 = time.time()
    y_pred = model.predict(X_test)
    eval_time = time.time() - t0

    # Probability predictions if supported
    has_proba = hasattr(model, "predict_proba")
    y_proba = model.predict_proba(X_test) if has_proba else None

    # Compute overall metrics
    acc = float(accuracy_score(y_test, y_pred))
    macro_prec = float(precision_score(y_test, y_pred, average="macro", zero_division=0))
    macro_rec = float(recall_score(y_test, y_pred, average="macro", zero_division=0))
    macro_f1 = float(f1_score(y_test, y_pred, average="macro", zero_division=0))
    weighted_f1 = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))

    # Per-class metrics
    class_prec = precision_score(y_test, y_pred, average=None, zero_division=0)
    class_rec = recall_score(y_test, y_pred, average=None, zero_division=0)
    class_f1 = f1_score(y_test, y_pred, average=None, zero_division=0)

    # Classification report
    clf_report_str = classification_report(
        y_test,
        y_pred,
        target_names=EMOTION_CLASSES,
        digits=4,
        zero_division=0,
    )
    clf_report_dict = classification_report(
        y_test,
        y_pred,
        target_names=EMOTION_CLASSES,
        output_dict=True,
        zero_division=0,
    )

    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred, labels=list(range(len(EMOTION_CLASSES))))

    os.makedirs(output_dir, exist_ok=True)

    # Save classification report text
    report_file = os.path.join(output_dir, "classification_report.txt")
    with open(report_file, "w", encoding="utf-8") as f:
        f.write("========================================================================\n")
        f.write(f"TEST DATASET EVALUATION REPORT - {model_name}\n")
        f.write(f"Evaluation Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Test Set Size: {len(X_test):,} images\n")
        f.write(f"Inference Duration: {eval_time:.3f} seconds\n")
        f.write("========================================================================\n\n")
        f.write("Overall Metrics:\n")
        f.write(f"  Accuracy:         {acc:.4f} ({acc*100:.2f}%)\n")
        f.write(f"  Macro Precision:  {macro_prec:.4f}\n")
        f.write(f"  Macro Recall:     {macro_rec:.4f}\n")
        f.write(f"  Macro F1-Score:   {macro_f1:.4f}\n")
        f.write(f"  Weighted F1-Score:{weighted_f1:.4f}\n\n")
        f.write("Per-Class Classification Report:\n")
        f.write(clf_report_str)
        f.write("\n\nConfusion Matrix (Row = True, Col = Predicted):\n")
        f.write(np.array2string(cm, separator=', '))
        f.write("\n")
    logger.info(f"Classification report saved to: {report_file}")

    # Save metrics CSV
    metrics_rows = [
        {"Category": "Overall", "Metric": "Accuracy", "Value": round(acc, 4)},
        {"Category": "Overall", "Metric": "Macro Precision", "Value": round(macro_prec, 4)},
        {"Category": "Overall", "Metric": "Macro Recall", "Value": round(macro_rec, 4)},
        {"Category": "Overall", "Metric": "Macro F1-Score", "Value": round(macro_f1, 4)},
        {"Category": "Overall", "Metric": "Weighted F1-Score", "Value": round(weighted_f1, 4)},
        {"Category": "Performance", "Metric": "Test Inference Time (s)", "Value": round(eval_time, 4)},
    ]

    for i, c in enumerate(EMOTION_CLASSES):
        metrics_rows.append({"Category": f"Class: {c}", "Metric": "Precision", "Value": round(class_prec[i], 4)})
        metrics_rows.append({"Category": f"Class: {c}", "Metric": "Recall", "Value": round(class_rec[i], 4)})
        metrics_rows.append({"Category": f"Class: {c}", "Metric": "F1-Score", "Value": round(class_f1[i], 4)})

    metrics_df = pd.DataFrame(metrics_rows)
    metrics_csv = os.path.join(output_dir, "test_metrics.csv")
    metrics_df.to_csv(metrics_csv, index=False)
    logger.info(f"Test metrics CSV saved to: {metrics_csv}")

    # Generate Confusion Matrix Heatmap
    cm_plot_path = os.path.join(output_dir, "confusion_matrix.png")
    plot_confusion_matrix(cm, EMOTION_CLASSES, cm_plot_path, model_name, acc, macro_f1)

    results = {
        "model_name": model_name,
        "accuracy": acc,
        "macro_precision": macro_prec,
        "macro_recall": macro_rec,
        "macro_f1": macro_f1,
        "weighted_f1": weighted_f1,
        "confusion_matrix": cm,
        "classification_report_dict": clf_report_dict,
        "has_proba": has_proba,
        "eval_time": eval_time,
    }
    return results


def plot_confusion_matrix(
    cm: np.ndarray,
    class_names: List[str],
    output_path: str,
    model_name: str,
    acc: float,
    macro_f1: float,
):
    """
    Generate an annotated confusion matrix heatmap with counts and percentages.
    """
    cm_normalized = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
    fig, ax = plt.subplots(figsize=(8.5, 7), dpi=300)

    # Format annotations with count and percentage
    annot = np.empty_like(cm, dtype=object)
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            annot[i, j] = f"{cm[i, j]:,}\n({cm_normalized[i, j]*100:.1f}%)"

    sns.heatmap(
        cm_normalized,
        annot=annot,
        fmt="",
        cmap="Blues",
        xticklabels=class_names,
        yticklabels=class_names,
        cbar_kws={'label': 'Normalized Recall (True Positive Rate)'},
        linewidths=1.0,
        linecolor="#E5E7EB",
        ax=ax,
    )

    ax.set_title(
        f"Confusion Matrix on Test Dataset\nModel: {model_name} | Accuracy: {acc*100:.2f}% | Macro F1: {macro_f1:.4f}",
        fontsize=13,
        fontweight='bold',
        pad=15,
        color="#111827",
    )
    ax.set_xlabel("Predicted Emotion Label", fontsize=11, fontweight='bold', labelpad=10, color="#1F2937")
    ax.set_ylabel("True Emotion Label", fontsize=11, fontweight='bold', labelpad=10, color="#1F2937")
    plt.xticks(rotation=45, ha='right', fontsize=10, fontweight='semibold')
    plt.yticks(rotation=0, fontsize=10, fontweight='semibold')

    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    logger.info(f"Confusion matrix heatmap saved to: {output_path}")


# =====================================================================
# 4. Save Final Model Artifact
# =====================================================================

def save_production_model(
    model: Any,
    model_name: str,
    cv_summary: Dict[str, Any],
    test_results: Dict[str, Any],
    output_path: str = "models/best_model.joblib",
):
    """
    Save the complete fitted pipeline and metadata using joblib.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    payload = {
        "model": model,
        "model_name": model_name,
        "classes": EMOTION_CLASSES,
        "label_map": EMOTION_LABEL_MAP,
        "id_to_label": EMOTION_ID_TO_LABEL,
        "emojis": EMOTION_EMOJIS,
        "colors": EMOTION_COLORS,
        "image_size": IMAGE_SIZE,
        "cv_summary": cv_summary,
        "test_results": {
            "accuracy": test_results["accuracy"],
            "macro_precision": test_results["macro_precision"],
            "macro_recall": test_results["macro_recall"],
            "macro_f1": test_results["macro_f1"],
            "weighted_f1": test_results["weighted_f1"],
            "confusion_matrix": test_results["confusion_matrix"].tolist(),
        },
        "trained_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
    joblib.dump(payload, output_path, compress=3)
    logger.info(f"Production model bundle successfully saved to: {output_path}")


# =====================================================================
# Main Execution Entrypoint
# =====================================================================

def main():
    parser = argparse.ArgumentParser(description="Train and evaluate facial emotion classification pipeline.")
    parser.add_argument("--train-dir", type=str, default="train", help="Path to training dataset directory")
    parser.add_argument("--test-dir", type=str, default="test", help="Path to testing dataset directory")
    parser.add_argument("--models-dir", type=str, default="models", help="Directory to save fitted model")
    parser.add_argument("--outputs-dir", type=str, default="outputs", help="Directory to save evaluation artifacts")
    parser.add_argument("--cv-folds", type=int, default=3, help="Cross-validation folds for model comparison (default: 3)")
    args = parser.parse_args()

    print("=" * 80)
    print("FACIAL EMOTION RECOGNITION - TRAINING & EVALUATION PIPELINE")
    print("=" * 80)

    # 1. Dataset Inspection
    train_stats = inspect_dataset_directory(args.train_dir, "train")
    test_stats = inspect_dataset_directory(args.test_dir, "test")

    # 2. Data Loading & Preprocessing
    X_train, y_train, _ = load_dataset(args.train_dir)
    X_test, y_test, _ = load_dataset(args.test_dir)

    # 3. Build & Compare Candidate Models (TRAIN DATA ONLY)
    candidate_models = build_candidate_models()
    best_model_name, cv_results, cv_summary_df = compare_models_cross_validation(
        candidate_models,
        X_train,
        y_train,
        cv_folds=args.cv_folds,
        output_dir=args.outputs_dir,
    )

    # 4. Fit Final Best Model on Full Training Set
    best_model = candidate_models[best_model_name]
    logger.info(f"Fitting final selected model '{best_model_name}' on entire training dataset ({len(X_train):,} samples)...")
    t0 = time.time()
    best_model.fit(X_train, y_train)
    fit_duration = time.time() - t0
    logger.info(f"Final model fitted in {fit_duration:.2f} seconds.")

    # 5. Evaluate Final Model on Untouched Test Dataset
    test_results = evaluate_final_model(
        best_model,
        best_model_name,
        X_test,
        y_test,
        output_dir=args.outputs_dir,
    )

    # 6. Save Model Bundle
    model_bundle_path = os.path.join(args.models_dir, "best_model.joblib")
    save_production_model(
        best_model,
        best_model_name,
        cv_results,
        test_results,
        output_path=model_bundle_path,
    )

    print("\n" + "=" * 80)
    print("PIPELINE EXECUTION COMPLETED SUCCESSFULLY!")
    print(f"Best Model Selected:   {best_model_name}")
    print(f"Test Accuracy:         {test_results['accuracy']*100:.2f}%")
    print(f"Test Macro F1:         {test_results['macro_f1']:.4f}")
    print(f"Test Weighted F1:      {test_results['weighted_f1']:.4f}")
    print(f"Artifacts Generated:")
    print(f"  - Model:             {model_bundle_path}")
    print(f"  - Metrics CSV:       {os.path.join(args.outputs_dir, 'test_metrics.csv')}")
    print(f"  - Report Text:       {os.path.join(args.outputs_dir, 'classification_report.txt')}")
    print(f"  - Confusion Matrix:  {os.path.join(args.outputs_dir, 'confusion_matrix.png')}")
    print(f"  - Model Comparison:  {os.path.join(args.outputs_dir, 'model_comparison.png')}")
    print("=" * 80)


if __name__ == "__main__":
    main()
