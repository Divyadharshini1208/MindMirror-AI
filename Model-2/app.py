"""
Facial Emotion Analyzer - Interactive Web Application
====================================================
Streamlit web application for real-time facial expression emotion analysis,
batch image classification, feature attribution heatmaps, and comprehensive
model performance dashboards.
"""

import os
import sys
import io
import time
import base64
from typing import Dict, Any, List, Tuple

import streamlit as st
import numpy as np
import pandas as pd
from PIL import Image
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

# Set page configuration
st.set_page_config(
    page_title="Facial Emotion Analyzer | AI/ML System",
    page_icon="🎭",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom High-End Styling (Dark Mode / Glassmorphism)
CUSTOM_CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
    --bg-dark: #0B0F19;
    --card-bg: rgba(17, 24, 39, 0.75);
    --border-color: rgba(255, 255, 255, 0.08);
    --primary: #8B5CF6;
    --accent: #3B82F6;
    --success: #10B981;
    --warning: #F59E0B;
    --danger: #EF4444;
}

html, body, [class*="css"] {
    font-family: 'Plus Jakarta Sans', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Outfit', sans-serif;
    letter-spacing: -0.02em;
}

/* Main Background */
.stApp {
    background: radial-gradient(circle at 10% 10%, #131B2E 0%, #0B0F19 100%);
    color: #F3F4F6;
}

/* Glassmorphic Cards */
.glass-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(16px);
    margin-bottom: 20px;
    transition: transform 0.2s ease, border-color 0.2s ease;
}

.glass-card:hover {
    border-color: rgba(139, 92, 246, 0.3);
}

/* Hero Banner */
.hero-header {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 20px;
    padding: 32px 36px;
    margin-bottom: 28px;
    position: relative;
    overflow: hidden;
}

.hero-title {
    font-size: 2.4rem;
    font-weight: 800;
    background: linear-gradient(135deg, #FFFFFF 0%, #C4B5FD 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
}

.hero-subtitle {
    font-size: 1.05rem;
    color: #9CA3AF;
    max-width: 800px;
    line-height: 1.6;
}

/* Prediction Badge */
.prediction-badge {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 14px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Metric Pill */
.metric-box {
    background: rgba(31, 41, 55, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
}

.metric-value {
    font-size: 1.8rem;
    font-weight: 800;
    font-family: 'Outfit', sans-serif;
    color: #F9FAFB;
}

.metric-label {
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9CA3AF;
    margin-top: 4px;
}

/* Custom Button */
.stButton>button {
    background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
    color: white;
    font-weight: 700;
    font-size: 1.05rem;
    padding: 12px 28px;
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.39);
    transition: all 0.2s ease-in-out;
}

.stButton>button:hover {
    background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.55);
    transform: translateY(-1px);
}

/* Sidebar Styling */
[data-testid="stSidebar"] {
    background-color: #0d1322;
    border-right: 1px solid rgba(255, 255, 255, 0.06);
}

/* Progress Bar Customization */
.stProgress > div > div > div > div {
    background: linear-gradient(90deg, #8B5CF6 0%, #3B82F6 100%);
}
</style>
"""
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)


# =====================================================================
# Model & Asset Loading Helpers
# =====================================================================

@st.cache_resource(show_spinner="Loading trained ML model bundle...")
def load_model_bundle(model_path: str = "models/best_model.joblib") -> Dict[str, Any]:
    """Load the trained joblib model bundle containing model and metadata."""
    if not os.path.exists(model_path):
        return None
    try:
        bundle = joblib.load(model_path)
        return bundle
    except Exception as e:
        st.error(f"Error loading model bundle: {e}")
        return None


@st.cache_data
def load_metrics_csv(csv_path: str = "outputs/test_metrics.csv") -> pd.DataFrame:
    """Load evaluation test metrics CSV."""
    if os.path.exists(csv_path):
        return pd.read_csv(csv_path)
    return None


@st.cache_data
def load_classification_report(report_path: str = "outputs/classification_report.txt") -> str:
    """Load text classification report."""
    if os.path.exists(report_path):
        with open(report_path, "r", encoding="utf-8") as f:
            return f.read()
    return None


def get_sample_test_images(test_dir: str = "test") -> Dict[str, str]:
    """Retrieve one sample image path per emotion class from the test directory."""
    samples = {}
    if os.path.exists(test_dir):
        for emotion in sorted(os.listdir(test_dir)):
            e_dir = os.path.join(test_dir, emotion)
            if os.path.isdir(e_dir):
                files = [f for f in os.listdir(e_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
                if files:
                    samples[emotion] = os.path.join(e_dir, files[0])
    return samples


def preprocess_pil_image(img: Image.Image, target_size=(48, 48)) -> Tuple[np.ndarray, Image.Image]:
    """Preprocess PIL Image into 48x48 single-channel normalized float array."""
    gray_img = img.convert('L')
    resized_img = gray_img.resize(target_size, Image.Resampling.BILINEAR)
    arr = np.array(resized_img, dtype=np.float32).flatten() / 255.0
    return arr, resized_img


def compute_feature_attribution_map(model_pipeline: Any, img_arr: np.ndarray, pred_class_idx: int) -> np.ndarray:
    """Compute spatial feature contribution map from Linear SVM / SGD coefficients."""
    try:
        scaler = model_pipeline.named_steps.get("scaler")
        clf = model_pipeline.named_steps.get("clf")
        if scaler and clf and hasattr(clf, "coef_"):
            x_scaled = scaler.transform([img_arr])[0]
            coef = clf.coef_[pred_class_idx]
            contrib = (x_scaled * coef).reshape((48, 48))
            return contrib
    except Exception:
        pass
    return None


# =====================================================================
# Main Application Layout
# =====================================================================

def main():
    bundle = load_model_bundle()

    # Sidebar
    with st.sidebar:
        st.markdown("### 🎭 Emotion AI System")
        st.markdown("Production-grade Facial Emotion Recognition system trained on FER-2013 using Scikit-Learn.")

        st.markdown("---")
        st.markdown("#### ⚙️ Active Model Specs")
        if bundle:
            st.success(f"**Model:** {bundle.get('model_name', 'Linear SVM')}")
            st.markdown(f"- **Classes:** 7 Emotions")
            st.markdown(f"- **Input Shape:** 48 × 48 (2,304 features)")
            st.markdown(f"- **Trained Date:** `{bundle.get('trained_at', 'N/A')}`")
            st.markdown(f"- **Test Accuracy:** `{bundle['test_results']['accuracy']*100:.2f}%`")
            st.markdown(f"- **Test Macro F1:** `{bundle['test_results']['macro_f1']:.4f}`")
        else:
            st.warning("⚠️ Model bundle `models/best_model.joblib` not found. Please run `python train_model.py` first.")

        st.markdown("---")
        st.markdown("#### 🏷️ Emotion Class Categories")
        if bundle:
            for cls_name in bundle["classes"]:
                emoji = bundle["emojis"].get(cls_name, "")
                color = bundle["colors"].get(cls_name, "#6B7280")
                st.markdown(
                    f"<div style='display: flex; align-items: center; gap: 8px; margin-bottom: 6px;'>"
                    f"<span style='font-size: 1.2rem;'>{emoji}</span>"
                    f"<span style='font-weight: 600; text-transform: capitalize;'>{cls_name}</span>"
                    f"<span style='margin-left: auto; width: 12px; height: 12px; border-radius: 50%; background: {color};'></span>"
                    f"</div>",
                    unsafe_allow_html=True,
                )

        st.markdown("---")
        st.markdown("Developed with Python, Scikit-Learn & Streamlit.")

    # Hero Header
    st.markdown(
        """
        <div class="hero-header">
            <div class="hero-title">Facial Emotion Analysis System</div>
            <div class="hero-subtitle">
                Accurate, multi-class facial expression classification powered by Linear Support Vector Machine
                with feature scaling and spatial attribution mapping. Upload a face photo or select benchmark samples below.
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    if not bundle:
        st.error(
            "🚨 The trained model artifact was not found at `models/best_model.joblib`. "
            "Please run `python train_model.py` to train and export the model bundle."
        )
        return

    # App Tabs
    tab_live, tab_batch, tab_eval, tab_about = st.tabs([
        "🔍 Single Image Analysis",
        "📂 Batch Image Prediction",
        "📊 Model Evaluation Dashboard",
        "ℹ️ System Architecture",
    ])

    # =================================================================
    # Tab 1: Single Image Analysis
    # =================================================================
    with tab_live:
        col_input, col_output = st.columns([1, 1], gap="large")

        input_image = None
        selected_sample_label = None

        with col_input:
            st.markdown("### 1. Select or Upload Image")
            input_mode = st.radio(
                "Choose Input Source:",
                ["Benchmark Sample Gallery", "Upload Image File"],
                horizontal=True,
            )

            if input_mode == "Benchmark Sample Gallery":
                sample_dict = get_sample_test_images("test")
                if sample_dict:
                    selected_sample_label = st.selectbox(
                        "Choose a genuine test set sample by emotion class:",
                        options=list(sample_dict.keys()),
                        format_func=lambda x: f"{bundle['emojis'].get(x, '')} {x.capitalize()} (Test Split Sample)",
                    )
                    sample_path = sample_dict[selected_sample_label]
                    try:
                        input_image = Image.open(sample_path)
                        st.info(f"Loaded ground-truth sample for: **{selected_sample_label.capitalize()}**")
                    except Exception as e:
                        st.error(f"Error reading sample image: {e}")
                else:
                    st.warning("No sample images discovered in `test/` directory.")

            else:
                uploaded_file = st.file_uploader(
                    "Upload a facial photo (PNG, JPG, JPEG):",
                    type=["jpg", "jpeg", "png"],
                    help="Upload a face crop or portrait for emotion prediction.",
                )
                if uploaded_file is not None:
                    try:
                        input_image = Image.open(uploaded_file)
                    except Exception as e:
                        st.error(f"Invalid image format: {e}")

            if input_image is not None:
                st.image(input_image, caption="Input Facial Image", width=220)

            analyze_btn = st.button("🚀 Analyze Facial Emotion", use_container_width=True)

        with col_output:
            st.markdown("### 2. Emotion Prediction & Analysis")

            if input_image is None:
                st.info("👈 Please select a benchmark sample or upload an image to begin analysis.")
            elif not analyze_btn and selected_sample_label is None and input_mode == "Upload Image File":
                st.info("Click **'Analyze Facial Emotion'** to run the prediction pipeline.")
            else:
                with st.spinner("Processing facial features and classifying emotion..."):
                    img_arr, gray_resized = preprocess_pil_image(input_image)
                    model = bundle["model"]

                    # Predict class
                    pred_class_idx = int(model.predict([img_arr])[0])
                    pred_label = bundle["id_to_label"][pred_class_idx]
                    pred_emoji = bundle["emojis"].get(pred_label, "🎭")
                    pred_color = bundle["colors"].get(pred_label, "#8B5CF6")

                    # Probabilities
                    probs = None
                    if hasattr(model, "predict_proba"):
                        probs = model.predict_proba([img_arr])[0]

                # Display Predicted Emotion Badge
                badge_bg = f"background: {pred_color}22; border: 2px solid {pred_color}; color: #FFFFFF;"
                st.markdown(
                    f"""
                    <div class="prediction-badge" style="{badge_bg}">
                        <span style="font-size: 2.2rem;">{pred_emoji}</span>
                        <div>
                            <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #D1D5DB;">Predicted Emotion</div>
                            <div style="font-size: 1.8rem; font-weight: 800; text-transform: capitalize;">{pred_label}</div>
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

                if selected_sample_label:
                    match = (selected_sample_label == pred_label)
                    if match:
                        st.success(f"✅ Prediction matches ground truth test label: **{selected_sample_label}**")
                    else:
                        st.warning(f"ℹ️ Ground truth test label was **{selected_sample_label}** (Model predicted **{pred_label}**)")

                # Probability Breakdown Bar Chart
                if probs is not None:
                    st.markdown("#### Class Confidence Distribution")
                    prob_df = pd.DataFrame({
                        "Emotion": [f"{bundle['emojis'].get(c, '')} {c.capitalize()}" for c in bundle["classes"]],
                        "Class": bundle["classes"],
                        "Probability": probs,
                    }).sort_values(by="Probability", ascending=True)

                    fig, ax = plt.subplots(figsize=(7, 3.8), dpi=200)
                    fig.patch.set_facecolor('#111827')
                    ax.set_facecolor('#111827')

                    bars = ax.barh(
                        prob_df["Emotion"],
                        prob_df["Probability"],
                        color=[bundle["colors"].get(c, "#8B5CF6") for c in prob_df["Class"]],
                        height=0.6,
                        edgecolor="none",
                    )

                    ax.set_xlim(0, max(max(probs) * 1.25, 0.25))
                    ax.set_xlabel("Calibrated Probability", color="#9CA3AF", fontsize=10, fontweight="bold")
                    ax.tick_params(colors="#E5E7EB", labelsize=9)
                    ax.grid(axis='x', color="#374151", linestyle='--', alpha=0.5)
                    for spine in ax.spines.values():
                        spine.set_visible(False)

                    # Add text values
                    for bar in bars:
                        w = bar.get_width()
                        ax.text(w + 0.01, bar.get_y() + bar.get_height()/2, f"{w*100:.1f}%",
                                va='center', ha='left', color='#F3F4F6', fontsize=9, fontweight='bold')

                    plt.tight_layout()
                    st.pyplot(fig)
                    plt.close()

                # Feature Attribution & Spatial Heatmap
                st.markdown("#### Facial Feature Attribution Analysis")
                feat_col1, feat_col2 = st.columns(2)
                with feat_col1:
                    st.image(gray_resized, caption="48x48 Normalized Input", width=140)

                with feat_col2:
                    contrib_map = compute_feature_attribution_map(model, img_arr, pred_class_idx)
                    if contrib_map is not None:
                        fig_hm, ax_hm = plt.subplots(figsize=(3, 3), dpi=200)
                        fig_hm.patch.set_facecolor('#111827')
                        ax_hm.set_facecolor('#111827')

                        sns.heatmap(
                            contrib_map,
                            cmap="coolwarm",
                            center=0,
                            cbar=False,
                            xticklabels=False,
                            yticklabels=False,
                            ax=ax_hm,
                        )
                        ax_hm.set_title("Model Spatial Weights", color="#E5E7EB", fontsize=9, fontweight="bold")
                        plt.tight_layout()
                        st.pyplot(fig_hm)
                        plt.close()
                    else:
                        st.info("Feature attribution map is not available for this model pipeline.")

    # =================================================================
    # Tab 2: Batch Image Prediction
    # =================================================================
    with tab_batch:
        st.markdown("### 📂 Batch Facial Emotion Prediction")
        st.markdown("Upload multiple facial images to perform bulk classification and download summary results.")

        batch_files = st.file_uploader(
            "Select multiple image files:",
            type=["jpg", "jpeg", "png"],
            accept_multiple_files=True,
            key="batch_uploader",
        )

        if batch_files:
            st.info(f"Loaded **{len(batch_files)}** images for batch processing.")
            if st.button("⚡ Run Batch Classification", key="batch_run_btn"):
                progress_bar = st.progress(0)
                batch_rows = []
                model = bundle["model"]

                for i, file in enumerate(batch_files):
                    try:
                        img = Image.open(file)
                        arr, _ = preprocess_pil_image(img)
                        pred_idx = int(model.predict([arr])[0])
                        pred_label = bundle["id_to_label"][pred_idx]
                        emoji = bundle["emojis"].get(pred_label, "")

                        conf = None
                        if hasattr(model, "predict_proba"):
                            probs = model.predict_proba([arr])[0]
                            conf = probs[pred_idx]

                        batch_rows.append({
                            "Filename": file.name,
                            "Predicted Emotion": pred_label.capitalize(),
                            "Emoji": emoji,
                            "Confidence": f"{conf*100:.1f}%" if conf is not None else "N/A",
                            "Processed Size": f"{img.size[0]}x{img.size[1]}",
                        })
                    except Exception as e:
                        batch_rows.append({
                            "Filename": file.name,
                            "Predicted Emotion": "Error",
                            "Emoji": "⚠️",
                            "Confidence": "0.0%",
                            "Processed Size": str(e),
                        })

                    progress_bar.progress((i + 1) / len(batch_files))

                batch_df = pd.DataFrame(batch_rows)
                st.success(f"Batch prediction complete for {len(batch_rows)} images!")

                # Summary stats
                col_b1, col_b2 = st.columns([1, 1])
                with col_b1:
                    st.markdown("#### Predictions Table")
                    st.dataframe(batch_df, use_container_width=True)

                    # CSV Download button
                    csv_data = batch_df.to_csv(index=False).encode('utf-8')
                    st.download_button(
                        label="📥 Download Batch Predictions CSV",
                        data=csv_data,
                        file_name="batch_emotion_predictions.csv",
                        mime="text/csv",
                    )

                with col_b2:
                    st.markdown("#### Emotion Distribution in Batch")
                    dist_counts = batch_df["Predicted Emotion"].value_counts()
                    fig_dist, ax_dist = plt.subplots(figsize=(6, 4), dpi=200)
                    fig_dist.patch.set_facecolor('#111827')
                    ax_dist.set_facecolor('#111827')

                    ax_dist.bar(
                        dist_counts.index,
                        dist_counts.values,
                        color="#8B5CF6",
                        edgecolor="#4C1D95",
                    )
                    ax_dist.set_ylabel("Count", color="#9CA3AF", fontweight="bold")
                    ax_dist.tick_params(colors="#E5E7EB", labelsize=9)
                    for spine in ax_dist.spines.values():
                        spine.set_visible(False)
                    plt.xticks(rotation=45, ha='right')
                    plt.tight_layout()
                    st.pyplot(fig_dist)
                    plt.close()

    # =================================================================
    # Tab 3: Model Evaluation Dashboard
    # =================================================================
    with tab_eval:
        st.markdown("### 📊 Comprehensive Model Evaluation Dashboard")
        st.markdown("Real measured performance metrics on the untouched test dataset (7,178 images).")

        # Top Metric Cards
        test_res = bundle.get("test_results", {})
        m1, m2, m3, m4 = st.columns(4)
        with m1:
            st.markdown(
                f"""
                <div class="metric-box">
                    <div class="metric-value" style="color: #3B82F6;">{test_res.get('accuracy', 0)*100:.2f}%</div>
                    <div class="metric-label">Test Accuracy</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
        with m2:
            st.markdown(
                f"""
                <div class="metric-box">
                    <div class="metric-value" style="color: #8B5CF6;">{test_res.get('macro_f1', 0):.4f}</div>
                    <div class="metric-label">Test Macro F1</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
        with m3:
            st.markdown(
                f"""
                <div class="metric-box">
                    <div class="metric-value" style="color: #10B981;">{test_res.get('weighted_f1', 0):.4f}</div>
                    <div class="metric-label">Test Weighted F1</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
        with m4:
            st.markdown(
                f"""
                <div class="metric-box">
                    <div class="metric-value" style="color: #F59E0B;">{test_res.get('macro_recall', 0):.4f}</div>
                    <div class="metric-label">Test Macro Recall</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

        st.markdown("<br>", unsafe_allow_html=True)

        # Charts Display
        chart_col1, chart_col2 = st.columns([1, 1], gap="large")

        with chart_col1:
            st.markdown("#### 🔄 Cross-Validation Model Comparison")
            st.markdown("Evaluated on **training data only** using 3-fold cross-validation:")
            cmp_img_path = "outputs/model_comparison.png"
            if os.path.exists(cmp_img_path):
                st.image(cmp_img_path, caption="Cross-Validation Benchmarks (Training Set)", use_container_width=True)
            else:
                st.info("Comparison chart not found in outputs/ directory.")

        with chart_col2:
            st.markdown("#### 🎯 Confusion Matrix Heatmap")
            st.markdown("Evaluated on **untouched test dataset** (7,178 images):")
            cm_img_path = "outputs/confusion_matrix.png"
            if os.path.exists(cm_img_path):
                st.image(cm_img_path, caption="Normalized Confusion Matrix on Test Set", use_container_width=True)
            else:
                st.info("Confusion matrix heatmap not found in outputs/ directory.")

        st.markdown("---")
        # Per-class metrics table
        st.markdown("#### 📋 Detailed Per-Class Metrics Table")
        metrics_df = load_metrics_csv()
        if metrics_df is not None:
            st.dataframe(metrics_df, use_container_width=True, height=350)
        else:
            st.warning("Metrics CSV not found at `outputs/test_metrics.csv`.")

        with st.expander("📄 View Full Scikit-Learn Classification Report"):
            report_text = load_classification_report()
            if report_text:
                st.code(report_text, language="text")
            else:
                st.info("Classification report file not found.")

    # =================================================================
    # Tab 4: System Architecture & Documentation
    # =================================================================
    with tab_about:
        st.markdown("### ℹ️ System Architecture & Engineering Specifications")
        st.markdown(
            """
            This project implements an end-to-end Machine Learning pipeline for Facial Emotion Recognition
            on the standard FER-2013 dataset.

            #### 1. Dataset Integrity & Schema
            - **Training Set:** 28,709 images (48x48 single-channel grayscale)
            - **Testing Set:** 7,178 images (48x48 single-channel grayscale)
            - **Emotion Classes:** 7 distinct expressions:
              - `0: Angry` (😠) | `1: Disgust` (🤢) | `2: Fear` (😨) | `3: Happy` (😊)
              - `4: Neutral` (😐) | `5: Sad` (😢) | `6: Surprise` (😲)
            - **Zero Data Leakage:** Preprocessing scalers and cross-validation hyperparameter evaluation
              were executed strictly on the training set. The test set remained untouched until final evaluation.

            #### 2. Model Training & Comparison
            Three classical machine learning models were trained and benchmarked using Stratified Cross-Validation:
            1. **Multinomial Naive Bayes (`MultinomialNB`):** Baseline probabilistic classifier operating on normalized pixel intensities.
            2. **Logistic Regression (`SGDClassifier(loss='log_loss')`):** Convex multi-class logistic regression with balanced class weights.
            3. **Linear Support Vector Machine (`SGDClassifier(loss='modified_huber')`):** Linear maximum-margin classifier with smooth loss and calibrated probabilities.

            #### 3. Selection Criterion
            - The model with the highest cross-validation **Macro F1-score** was selected to ensure balanced performance across minority classes (such as `disgust` with only 436 training samples).
            - **Linear Support Vector Machine** demonstrated superior generalization with **29.76% accuracy** and **0.2675 Macro F1**, outperforming the 14.3% random baseline on this 7-class benchmark.

            #### 4. Project Directory Structure
            ```
            Model-2/
            ├── train/                    # 28,709 training images
            ├── test/                     # 7,178 testing images
            ├── train_model.py            # Complete training & benchmarking pipeline
            ├── app.py                    # Interactive Streamlit application
            ├── requirements.txt          # Python dependencies
            ├── README.md                 # Complete documentation & commands
            ├── models/
            │   └── best_model.joblib     # Serialized production pipeline
            └── outputs/
                ├── test_metrics.csv      # Full evaluation metrics table
                ├── classification_report.txt
                ├── confusion_matrix.png
                └── model_comparison.png
            ```
            """
        )


if __name__ == "__main__":
    main()
