# Facial Emotion Recognition & Analysis System

An end-to-end AI/ML Computer Vision and Facial Emotion Classification system built with Python, scikit-learn, and Streamlit.

---

## 📌 Project Overview

This project implements a complete, production-grade Machine Learning pipeline for 7-class facial expression recognition using the FER-2013 dataset. It features multithreaded image preprocessing, rigorous cross-validation model selection (evaluated strictly on training data), final evaluation on an untouched test set, and an interactive Streamlit web application.

### Key Capabilities

- **Automated Dataset Inspection & Preprocessing:** Verified schema compatibility, validated 48x48 single-channel grayscale images, and confirmed zero corrupted records across 35,887 images.
- **Strict Leakage Prevention:** Feature scalers, cross-validation tuning, and model selection were executed exclusively on the training split.
- **Model Comparison:** Evaluated **Multinomial Naive Bayes**, **Logistic Regression**, and **Linear Support Vector Machine** via Stratified K-Fold cross-validation.
- **Selected Best Model:** **Linear Support Vector Machine** (`SGDClassifier(loss='modified_huber')`), achieving top Macro F1 and Accuracy while natively supporting calibrated probability estimation.
- **Evaluation Artifacts:** Saved confusion matrix heatmaps, cross-validation model comparison charts, detailed per-class classification reports, and test metrics CSV files.
- **Interactive Web Application:** Real-time single image analysis, test sample gallery selector, calibrated probability confidence bars, spatial facial feature attribution heatmaps, batch image prediction with CSV export, and a model evaluation dashboard.

---

## 🗂️ Project Directory Structure

```
Model-2/
├── train/                           # 28,709 training images across 7 emotion folders
│   ├── angry/ (3,995 images)
│   ├── disgust/ (436 images)
│   ├── fear/ (4,097 images)
│   ├── happy/ (7,215 images)
│   ├── neutral/ (4,965 images)
│   ├── sad/ (4,830 images)
│   └── surprise/ (3,171 images)
├── test/                            # 7,178 testing images across 7 emotion folders
│   ├── angry/ (958 images)
│   ├── disgust/ (111 images)
│   ├── fear/ (1,024 images)
│   ├── happy/ (1,774 images)
│   ├── neutral/ (1,233 images)
│   ├── sad/ (1,247 images)
│   └── surprise/ (831 images)
├── train_model.py                   # Complete training, CV benchmarking & evaluation script
├── app.py                           # Interactive Streamlit Web Application
├── requirements.txt                 # Project dependencies
├── README.md                        # Documentation & execution guide
├── models/
│   └── best_model.joblib            # Serialized production pipeline & metadata bundle
└── outputs/
    ├── test_metrics.csv             # Full table of test metrics
    ├── classification_report.txt    # Scikit-learn classification report
    ├── confusion_matrix.png         # Annotated confusion matrix heatmap
    └── model_comparison.png         # Cross-validation model comparison chart
```

---

## 📊 Dataset Inspection & Specifications

- **Total Images:** 35,887 (28,709 Train / 7,178 Test)
- **Input Dimension:** 48 × 48 pixels, Grayscale (`L` mode)
- **Feature Vector:** 2,304 normalized floats in `[0.0, 1.0]`
- **Classes (7):**
  - `0: angry` 😠 (Crimson `#EF4444`)
  - `1: disgust` 🤢 (Emerald `#10B981`)
  - `2: fear` 😨 (Purple `#8B5CF6`)
  - `3: happy` 😊 (Amber `#F59E0B`)
  - `4: neutral` 😐 (Slate `#6B7280`)
  - `5: sad` 😢 (Blue `#3B82F6`)
  - `6: surprise` 😲 (Rose `#EC4899`)

---

## 📈 Model Comparison & Benchmark Results

### 1. Training-Only Cross-Validation Results (3-Fold Stratified CV)

| Model | CV Macro F1 | CV Accuracy | CV Weighted F1 | Training Time |
| :--- | :---: | :---: | :---: | :---: |
| **Multinomial Naive Bayes** | 0.2028 ± 0.0093 | 0.2431 ± 0.0084 | 0.2372 | 6.62s |
| **Logistic Regression** | 0.2510 ± 0.0136 | 0.2766 ± 0.0202 | 0.2789 | 14.30s |
| **Linear Support Vector Machine** 🏆 | **0.2582 ± 0.0041** | **0.2909 ± 0.0137** | **0.2918** | **9.77s** |

*The Linear Support Vector Machine was selected as the optimal model based on its superior cross-validation Macro F1-score.*

### 2. Final Evaluation on Untouched Testing Dataset (7,178 Images)

| Evaluation Metric | Measured Score |
| :--- | :---: |
| **Test Accuracy** | **29.76%** |
| **Macro Precision** | **0.2827** |
| **Macro Recall** | **0.2738** |
| **Macro F1-Score** | **0.2675** |
| **Weighted F1-Score** | **0.2965** |
| **Test Inference Duration** | **0.051s** (51 ms for 7,178 images) |

### 3. Per-Class Test Performance Breakdown

| Emotion Class | Precision | Recall | F1-Score | Support |
| :--- | :---: | :---: | :---: | :---: |
| **Angry** 😠 | 0.2128 | 0.1420 | 0.1703 | 958 |
| **Disgust** 🤢 | 0.0852 | 0.1712 | 0.1138 | 111 |
| **Fear** 😨 | 0.2011 | 0.2051 | 0.2031 | 1,024 |
| **Happy** 😊 | 0.4405 | 0.3777 | 0.4067 | 1,774 |
| **Neutral** 😐 | 0.2455 | 0.4574 | 0.3195 | 1,233 |
| **Sad** 😢 | 0.2409 | 0.1652 | 0.1960 | 1,247 |
| **Surprise** 😲 | 0.5526 | 0.3983 | 0.4629 | 831 |
| **Macro Average** | **0.2827** | **0.2738** | **0.2675** | **7,178** |
| **Weighted Average** | **0.3153** | **0.2976** | **0.2965** | **7,178** |

---

## 🚀 Getting Started & Execution Guide

Follow these exact Windows terminal commands to activate your environment, train the model, and launch the web application.

### 1. Open Terminal and Navigate to Project Directory

```powershell
cd "c:\Users\divya\OneDrive\Desktop\Projects\Model-2"
```

### 2. (Optional) Create & Activate Virtual Environment

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 4. Run the Training & Evaluation Pipeline

```powershell
python train_model.py
```

*This will automatically inspect the dataset, run cross-validation model selection, fit the final model, evaluate on `test/`, and generate all files in `models/` and `outputs/`.*

### 5. Launch the Streamlit Web Application

```powershell
streamlit run app.py
```

Open your browser at `http://localhost:8501` to use the interactive application.

---

## 🖥️ Streamlit App Features

1. **Single Image Live Analysis:**
   - Upload any face portrait (PNG, JPG, JPEG) or pick an instant benchmark test sample from any of the 7 emotion categories.
   - Real-time classification badge with custom emotion colors and emojis.
   - Calibrated class probability breakdown horizontal bar chart.
   - Spatial feature attribution heatmap overlay showing which facial areas (eyes, eyebrows, mouth) contributed to the classification.
2. **Batch Image Prediction:**
   - Upload multiple image files at once.
   - Instant multi-image tabular predictions with thumbnails and confidence scores.
   - Emotion frequency distribution chart.
   - One-click CSV export of batch predictions.
3. **Model Evaluation Dashboard:**
   - Interactive display of real measured test set metrics.
   - Confusion matrix heatmap viewer with normalized recall and sample counts.
   - Cross-validation model comparison chart.
   - Full scikit-learn classification report viewer.
