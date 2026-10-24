"""
Text Preprocessing Module for Text Emotion Analysis System.

Provides consistent, leak-free normalization for both training and
real-time inference. Preserves emotional indicators while stripping
HTML tags, URLs, stray punctuation, and normalizing contractions.
"""

import re
import html
import unicodedata
from typing import Union, List
import pandas as pd

# Comprehensive English contractions mapping to preserve emotional intent
CONTRACTIONS_MAP = {
    "ain't": "am not",
    "aren't": "are not",
    "can't": "cannot",
    "can't've": "cannot have",
    "'cause": "because",
    "could've": "could have",
    "couldn't": "could not",
    "couldn't've": "could not have",
    "didn't": "did not",
    "doesn't": "does not",
    "don't": "do not",
    "hadn't": "had not",
    "hadn't've": "had not have",
    "hasn't": "has not",
    "haven't": "have not",
    "he'd": "he would",
    "he'd've": "he would have",
    "he'll": "he will",
    "he's": "he is",
    "how'd": "how did",
    "how'll": "how will",
    "how's": "how is",
    "i'd": "i would",
    "i'd've": "i would have",
    "i'll": "i will",
    "i'm": "i am",
    "i've": "i have",
    "isn't": "is not",
    "it'd": "it would",
    "it'll": "it will",
    "it's": "it is",
    "let's": "let us",
    "ma'am": "madam",
    "might've": "might have",
    "mightn't": "might not",
    "must've": "must have",
    "mustn't": "must not",
    "needn't": "need not",
    "oughtn't": "ought not",
    "shan't": "shall not",
    "sha'n't": "shall not",
    "she'd": "she would",
    "she'll": "she will",
    "she's": "she is",
    "should've": "should have",
    "shouldn't": "should not",
    "that'd": "that would",
    "that's": "that is",
    "there'd": "there would",
    "there's": "there is",
    "they'd": "they would",
    "they'll": "they will",
    "they're": "they are",
    "they've": "they have",
    "wasn't": "was not",
    "we'd": "we would",
    "we'll": "we will",
    "we're": "we are",
    "we've": "we have",
    "weren't": "were not",
    "what'll": "what will",
    "what're": "what are",
    "what's": "what is",
    "what've": "what have",
    "when's": "when is",
    "where'd": "where did",
    "where's": "where is",
    "where've": "where have",
    "who'll": "who will",
    "who's": "who is",
    "who've": "who have",
    "why's": "why is",
    "won't": "will not",
    "would've": "would have",
    "wouldn't": "would not",
    "you'd": "you would",
    "you'll": "you will",
    "youre": "you are",
    "you're": "you are",
    "you've": "you have",
    # Common unpunctuated variants
    "cant": "cannot",
    "dont": "do not",
    "didnt": "did not",
    "doesnt": "does not",
    "wont": "will not",
    "im": "i am",
    "ive": "i have",
    "id": "i would",
    "theyre": "they are",
    "wasnt": "was not",
    "isnt": "is not",
    "arent": "are not",
}

CONTRACTIONS_RE = re.compile(
    r"\b(" + "|".join(re.escape(k) for k in sorted(CONTRACTIONS_MAP.keys(), key=len, reverse=True)) + r")\b",
    flags=re.IGNORECASE,
)

# Standard verified label mapping for the Saravia emotion dataset
EMOTION_LABEL_MAP = {
    0: "Sadness",
    1: "Joy",
    2: "Love",
    3: "Anger",
    4: "Fear",
    5: "Surprise",
}

EMOTION_EMOJIS = {
    0: "😢",
    1: "😄",
    2: "❤️",
    3: "😠",
    4: "😨",
    5: "😲",
}

EMOTION_COLORS = {
    0: "#3B82F6",  # Blue (Sadness)
    1: "#10B981",  # Emerald (Joy)
    2: "#EC4899",  # Rose (Love)
    3: "#EF4444",  # Red (Anger)
    4: "#8B5CF6",  # Purple (Fear)
    5: "#F59E0B",  # Amber (Surprise)
}


def expand_contractions(text: str) -> str:
    """Expand standard English contractions to preserve word meaning."""
    def replace(match):
        matched_str = match.group(0).lower()
        return CONTRACTIONS_MAP.get(matched_str, match.group(0))
    return CONTRACTIONS_RE.sub(replace, text)


def clean_text(text: Union[str, float]) -> str:
    """
    Carefully clean and normalize text while preserving emotional signals:
    1. Handle non-string / null types safely
    2. Unescape HTML entities (&amp; -> &)
    3. Remove HTML tags and web artifacts
    4. Remove URLs
    5. Expand contractions (e.g., 'don't' -> 'do not')
    6. Normalize unicode characters (NFKD)
    7. Retain only alphabetic letters and spaces
    8. Lowercase and collapse consecutive whitespace
    """
    if not isinstance(text, str):
        if pd.isna(text):
            return ""
        text = str(text)

    # Decode HTML entities
    text = html.unescape(text)

    # Remove HTML tags (e.g., <a href=...>, <div>, etc.)
    text = re.sub(r"<[^>]+>", " ", text)

    # Remove URLs
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)

    # Unicode normalization
    text = unicodedata.normalize("NFKD", text)

    # Expand contractions
    text = expand_contractions(text)

    # Lowercase
    text = text.lower()

    # Remove non-alphabet characters (preserving single spaces)
    text = re.sub(r"[^a-z\s]", " ", text)

    # Collapse multiple whitespaces and strip boundaries
    text = re.sub(r"\s+", " ", text).strip()

    return text


def clean_corpus(texts: Union[pd.Series, List[str]]) -> List[str]:
    """Batch preprocess a list or pandas Series of texts."""
    return [clean_text(t) for t in texts]
