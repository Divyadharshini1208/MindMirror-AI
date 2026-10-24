import axios from 'axios';

/**
 * MirrorMind AI — Multimodal API Client
 *
 * Configured for production deployment with Render backend:
 * - Production base URL: https://mindmirror-ai-at2e.onrender.com
 * - Configurable via VITE_API_BASE_URL with graceful fallback
 * - Automatic prevention of accidental localhost calls in production builds
 * - Proper multipart form handling (lets browser generate boundary)
 * - Clear error handling with standard fallback message
 */

const DEFAULT_PROD_URL = 'https://mindmirror-ai-at2e.onrender.com';

function getResolvedBaseUrl() {
  const envBase = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envBase) {
    // If in production build and envBase accidentally points to localhost, use production URL
    if (import.meta.env.PROD && (envBase.includes('localhost') || envBase.includes('127.0.0.1'))) {
      return DEFAULT_PROD_URL;
    }
    return envBase.replace(/\/+$/, '');
  }
  return DEFAULT_PROD_URL;
}

const API_BASE_URL = getResolvedBaseUrl();

function resolveEndpoint(envOverride, path) {
  if (envOverride?.trim()) {
    const override = envOverride.trim();
    if (import.meta.env.PROD && (override.includes('localhost') || override.includes('127.0.0.1'))) {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `${DEFAULT_PROD_URL}${cleanPath}`;
    }
    return override;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export const TEXT_API_URL = resolveEndpoint(import.meta.env.VITE_TEXT_API_URL, '/api/analyze/text');
export const IMAGE_API_URL = resolveEndpoint(import.meta.env.VITE_IMAGE_API_URL, '/api/analyze/image');
export const VOICE_API_URL = resolveEndpoint(import.meta.env.VITE_VOICE_API_URL, '/api/analyze/voice');
export const HEALTH_API_URL = `${API_BASE_URL}/api/health`;

const UNAVAILABLE_MESSAGE = 'This MirrorMind capability is currently unavailable.';

/**
 * Normalizes backend emotion prediction response into the standard MirrorMind reflection format.
 */
function normalizeResult(data, modality) {
  if (!data) {
    throw new Error(UNAVAILABLE_MESSAGE);
  }

  // Support common backend response structures
  const emotion = data.emotion || data.label || data.prediction || data.top_emotion;
  if (!emotion) {
    throw new Error(UNAVAILABLE_MESSAGE);
  }

  // Normalized confidence as a percentage integer (e.g. 92)
  let confidence = data.confidence ?? data.score ?? data.probability;
  if (typeof confidence === 'number') {
    if (confidence <= 1) {
      confidence = Math.round(confidence * 100);
    } else {
      confidence = Math.round(confidence);
    }
  } else {
    confidence = 0;
  }

  // Distribution chart data
  let distribution = [];
  if (Array.isArray(data.distribution)) {
    distribution = data.distribution.map((item) => ({
      emotion: item.emotion || item.label || item.name,
      score: typeof item.score === 'number' && item.score <= 1 ? Math.round(item.score * 100) : Math.round(item.score || 0),
    }));
  } else if (data.probabilities && typeof data.probabilities === 'object') {
    distribution = Object.entries(data.probabilities).map(([key, val]) => ({
      emotion: key.charAt(0).toUpperCase() + key.slice(1),
      score: typeof val === 'number' && val <= 1 ? Math.round(val * 100) : Math.round(val || 0),
    }));
  } else if (data.scores && typeof data.scores === 'object') {
    distribution = Object.entries(data.scores).map(([key, val]) => ({
      emotion: key.charAt(0).toUpperCase() + key.slice(1),
      score: typeof val === 'number' && val <= 1 ? Math.round(val * 100) : Math.round(val || 0),
    }));
  }

  return {
    modality,
    emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    confidence,
    distribution: distribution.sort((a, b) => b.score - a.score),
    boundingBoxes: Array.isArray(data.bounding_boxes) ? data.bounding_boxes : null,
    modelName: data.model_name || null,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Check backend service health and model readiness status.
 * @returns {Promise<Object>}
 */
export async function checkBackendHealth() {
  try {
    const res = await axios.get(HEALTH_API_URL, { timeout: 8000 });
    return res.data;
  } catch (err) {
    console.warn('Backend health check error:', err);
    throw err;
  }
}

/**
 * Analyze written text for emotional signals.
 * @param {string} text
 * @returns {Promise<Object>}
 */
export async function analyzeText(text) {
  if (!text || !text.trim()) {
    throw new Error('Please enter some text to reflect upon.');
  }

  try {
    const response = await axios.post(
      TEXT_API_URL,
      { text: text.trim() },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 25000,
      }
    );
    return normalizeResult(response.data, 'TEXT');
  } catch (error) {
    console.error('MirrorMind Text API Error:', error);
    const detail = error.response?.data?.detail;
    throw new Error(detail || UNAVAILABLE_MESSAGE);
  }
}

/**
 * Analyze facial expressions from an uploaded image file.
 * NOTE: Does NOT manually set Content-Type header so the browser
 * automatically computes the boundary for multipart/form-data.
 * @param {File} file
 * @returns {Promise<Object>}
 */
export async function analyzeImage(file) {
  if (!file) {
    throw new Error('Please select an image file to analyze.');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('image', file);

    // Omit explicit Content-Type header so browser appends the multipart boundary
    const response = await axios.post(IMAGE_API_URL, formData, {
      timeout: 30000,
    });
    return normalizeResult(response.data, 'IMAGE');
  } catch (error) {
    console.error('MirrorMind Image API Error:', error);
    const detail = error.response?.data?.detail;
    throw new Error(detail || UNAVAILABLE_MESSAGE);
  }
}

/**
 * Analyze vocal characteristics and patterns from an audio file.
 * @param {Blob|File} file
 * @returns {Promise<Object>}
 */
export async function analyzeVoice(file) {
  if (!file) {
    throw new Error('Please record or upload audio to analyze.');
  }

  try {
    const formData = new FormData();
    formData.append('file', file, file.name || 'recording.webm');
    formData.append('audio', file, file.name || 'recording.webm');

    const response = await axios.post(VOICE_API_URL, formData, {
      timeout: 30000,
    });
    return normalizeResult(response.data, 'VOICE');
  } catch (error) {
    console.error('MirrorMind Voice API Error:', error);
    const detail = error.response?.data?.detail;
    throw new Error(detail || UNAVAILABLE_MESSAGE);
  }
}

export default {
  analyzeText,
  analyzeImage,
  analyzeVoice,
  checkBackendHealth,
  TEXT_API_URL,
  IMAGE_API_URL,
  VOICE_API_URL,
  API_BASE_URL,
};
