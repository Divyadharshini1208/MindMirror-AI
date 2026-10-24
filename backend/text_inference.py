"""
NURA Text Emotion Analysis Inference Service
============================================
Loads and serves predictions using the genuine Model-1 text emotion classification artifact.
Preserves original text preprocessing (clean_text) and label mappings.
"""

import os
import sys
from typing import Dict, Any, List

# Ensure Model-1 directory is in sys.path so unpickling resolves `preprocess` module
MODEL_1_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Model-1"))
if MODEL_1_DIR not in sys.path:
    sys.path.insert(0, MODEL_1_DIR)

import joblib
import numpy as np

MODEL_PATH = os.path.join(MODEL_1_DIR, "models", "best_model.joblib")

_model_artifact = None
_pipeline = None
_label_map = None
_target_names = None


def load_text_model() -> bool:
    """Load the trained text emotion model artifact once at application startup."""
    global _model_artifact, _pipeline, _label_map, _target_names
    if _pipeline is not None:
        return True

    if not os.path.exists(MODEL_PATH):
        print(f"[TextInference] Model file not found at: {MODEL_PATH}")
        return False

    try:
        _model_artifact = joblib.load(MODEL_PATH)
        _pipeline = _model_artifact["pipeline"]
        _label_map = _model_artifact["label_map"]
        _target_names = _model_artifact.get("target_names", list(_label_map.values()))
        print(f"[TextInference] Successfully loaded NURA Text Model from {MODEL_PATH}")
        print(f"[TextInference] Best Model: {_model_artifact.get('best_model_name', 'Linear SVM')}")
        print(f"[TextInference] Classes: {_target_names}")
        return True
    except Exception as e:
        print(f"[TextInference] Failed to load model artifact: {e}")
        return False


def predict_text_emotion(text: str) -> Dict[str, Any]:
    """
    Run genuine emotion prediction on raw input text.

    Args:
        text (str): Input text (e.g. user reflection or sentence).

    Returns:
        dict: Standardized emotion prediction, confidence percentage, and distribution.
    """
    if _pipeline is None:
        loaded = load_text_model()
        if not loaded or _pipeline is None:
            raise RuntimeError("NURA Text Emotion Model is currently unavailable on this system.")

    cleaned_input = str(text or "").strip()
    if not cleaned_input:
        raise ValueError("Input text cannot be empty.")

    if len(cleaned_input) > 5000:
        cleaned_input = cleaned_input[:5000]

    # Predict class and probabilities using calibrated pipeline
    preds = _pipeline.predict([cleaned_input])
    pred_idx = int(preds[0])
    predicted_emotion = _label_map.get(pred_idx, str(pred_idx))

    distribution: List[Dict[str, Any]] = []
    top_confidence = 0

    if hasattr(_pipeline, "predict_proba"):
        probas = _pipeline.predict_proba([cleaned_input])[0]
        for idx, prob in enumerate(probas):
            emotion_name = _label_map.get(idx, f"Class_{idx}")
            score_pct = int(round(float(prob) * 100))
            distribution.append({
                "emotion": emotion_name,
                "score": score_pct,
            })
        top_confidence = int(round(float(np.max(probas)) * 100))
    elif hasattr(_pipeline, "decision_function"):
        dec = _pipeline.decision_function([cleaned_input])[0]
        exp_dec = np.exp(dec - np.max(dec))
        probas = exp_dec / np.sum(exp_dec)
        for idx, prob in enumerate(probas):
            emotion_name = _label_map.get(idx, f"Class_{idx}")
            score_pct = int(round(float(prob) * 100))
            distribution.append({
                "emotion": emotion_name,
                "score": score_pct,
            })
        top_confidence = int(round(float(np.max(probas)) * 100))
    else:
        top_confidence = 90
        distribution.append({"emotion": predicted_emotion, "score": 90})

    # Sort distribution descending by score
    distribution.sort(key=lambda item: item["score"], reverse=True)

    return {
        "emotion": predicted_emotion,
        "confidence": top_confidence,
        "distribution": distribution,
        "modality": "TEXT",
        "model_name": _model_artifact.get("best_model_name", "Linear Support Vector Machine"),
    }


if __name__ == "__main__":
    # Self-test
    print("Testing NURA Text Inference Module independently...")
    if load_text_model():
        test_samples = [
            "I finally got the job offer I was dreaming of, feeling ecstatic!",
            "I feel so lonely and hopeless today, nothing seems to work out.",
            "I can't stand the blatant disrespect and rude attitude, absolutely infuriated.",
            "I'm terrified about the upcoming medical results, heart is pounding.",
            "I never expected to see my old childhood friend at the airport!",
            "You mean the world to me and I will always cherish our moments together.",
        ]
        for s in test_samples:
            res = predict_text_emotion(s)
            print(f"Text: '{s[:45]}...' -> Emotion: {res['emotion']} ({res['confidence']}%)")
    else:
        print("Failed to initialize text model.")
