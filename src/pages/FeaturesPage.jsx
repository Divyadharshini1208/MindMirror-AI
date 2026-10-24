import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ScanFace, ArrowRight, CheckCircle2, Cpu, Zap, Shield, Sparkles } from 'lucide-react';

export default function FeaturesPage() {
  const navigate = useNavigate();

  const handleLaunchMode = (mode) => {
    navigate(mode === 'image' ? '/image-analysis' : '/text-analysis');
  };

  return (
    <div style={{ paddingTop: '56px', paddingBottom: '96px', backgroundColor: '#ffffff' }}>
      <div className="container">
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '64px' }}>
          <span className="section-eyebrow">Neural Architectures & Features</span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em' }}>
            Two specialized models. One digital mirror.
          </h1>
          <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '1.1rem' }}>
            Explore the exact machine learning architectures, preprocessing pipelines, and probability calibration
            engines powering MirrorMind AI.
          </p>
        </div>

        {/* Feature Deep Dive: Model-1 (Text) */}
        <div
          className="surface-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            padding: '48px',
            marginBottom: '40px',
            boxShadow: '0 4px 12px rgba(17, 17, 17, 0.03)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  backgroundColor: '#fdf2f8',
                  border: '1px solid #fbcfe8',
                  color: '#db2777',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '14px',
                }}
              >
                <MessageSquare size={14} />
                <span>NURA Model-1 • Text Intelligence</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', marginBottom: '10px' }}>
                Calibrated Linear Support Vector Classifier
              </h2>
              <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '720px', lineHeight: 1.6 }}>
                Model-1 operates on natural language inputs using word and subword N-gram TF-IDF vectorization coupled
                with a Calibrated LinearSVC pipeline. It measures emotional valence, lexical polarity, and sentiment
                nuance across seven distinct human emotional registers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleLaunchMode('text')}
              className="btn-primary"
              style={{
                padding: '12px 22px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Test Text Model</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              paddingTop: '28px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <div style={specCardStyle}>
              <div style={specLabelStyle}>PIPELINE ARCHITECTURE</div>
              <div style={specValueStyle}>TF-IDF + Calibrated LinearSVC</div>
            </div>
            <div style={specCardStyle}>
              <div style={specLabelStyle}>EMOTION TAXONOMY</div>
              <div style={specValueStyle}>Joy, Sadness, Anger, Fear, Love, Surprise</div>
            </div>
            <div style={specCardStyle}>
              <div style={specLabelStyle}>CALIBRATION ENGINE</div>
              <div style={specValueStyle}>Isotonic / Platt Probability Scaling</div>
            </div>
            <div style={specCardStyle}>
              <div style={specLabelStyle}>AVG INFERENCE LATENCY</div>
              <div style={specValueStyle}>&lt; 35 milliseconds</div>
            </div>
          </div>
        </div>

        {/* Feature Deep Dive: Model-2 (Image) */}
        <div
          className="surface-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            padding: '48px',
            marginBottom: '40px',
            boxShadow: '0 4px 12px rgba(17, 17, 17, 0.03)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  color: '#0284c7',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '14px',
                }}
              >
                <ScanFace size={14} />
                <span>NURA Model-2 • Facial Expression Recognition</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', marginBottom: '10px' }}>
                FER-2013 Spatial Pixel Classifier
              </h2>
              <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '720px', lineHeight: 1.6 }}>
                Model-2 ingests facial portrait images, normalizes pixel luminance across 48x48 spatial grids via a
                fitted StandardScaler, and classifies subtle facial action coordinates using a Stochastic Gradient Descent
                Classifier configured with modified Huber loss for well-calibrated confidence vectors.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleLaunchMode('image')}
              className="btn-primary"
              style={{
                padding: '12px 22px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Test Image Model</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              paddingTop: '28px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <div style={specCardStyle}>
              <div style={specLabelStyle}>TRAINING BENCHMARK</div>
              <div style={specValueStyle}>FER-2013 Facial Dataset (35K+ Faces)</div>
            </div>
            <div style={specCardStyle}>
              <div style={specLabelStyle}>CLASSIFIER TYPE</div>
              <div style={specValueStyle}>StandardScaler + SGDClassifier</div>
            </div>
            <div style={specCardStyle}>
              <div style={specLabelStyle}>LOSS FUNCTION</div>
              <div style={specValueStyle}>Modified Huber (Probabilistic)</div>
            </div>
            <div style={specCardStyle}>
              <div style={specLabelStyle}>ACCEPTED FORMATS</div>
              <div style={specValueStyle}>JPG, JPEG, PNG (Up to 10MB)</div>
            </div>
          </div>
        </div>

        {/* Comparative Capabilities Table */}
        <div style={{ marginTop: '56px' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', marginBottom: '24px', letterSpacing: '-0.02em' }}>
            Model Capabilities Comparison
          </h3>
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.925rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={thStyle}>Capability</th>
                  <th style={thStyle}>Text Model (Model-1)</th>
                  <th style={thStyle}>Image Model (Model-2)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyleBold}>Input Format</td>
                  <td style={tdStyle}>Raw UTF-8 text string</td>
                  <td style={tdStyle}>JPG, JPEG, PNG image files</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyleBold}>Core Feature Space</td>
                  <td style={tdStyle}>Word & character N-gram frequencies</td>
                  <td style={tdStyle}>48x48 Grayscale pixel intensity vectors</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyleBold}>Output Distribution</td>
                  <td style={tdStyle}>Full calibrated probability across 6 emotions</td>
                  <td style={tdStyle}>Full calibrated probability across 7 emotions</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyleBold}>Client Storage</td>
                  <td style={tdStyle}>Session only; never stored on external server</td>
                  <td style={tdStyle}>Processed in-memory; discarded immediately</td>
                </tr>
                <tr>
                  <td style={tdStyleBold}>Workspace Integration</td>
                  <td style={tdStyle}>Unified Analyze Workspace (/analyze)</td>
                  <td style={tdStyle}>Unified Analyze Workspace (/analyze)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const specCardStyle = {
  backgroundColor: '#f8fafc',
  borderRadius: '14px',
  padding: '16px 20px',
  border: '1px solid #e2e8f0',
};

const specLabelStyle = {
  fontSize: '0.72rem',
  fontWeight: 700,
  color: '#64748b',
  letterSpacing: '0.08em',
  marginBottom: '6px',
};

const specValueStyle = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: '#111111',
};

const thStyle = {
  padding: '16px 24px',
  fontWeight: 700,
  color: '#111111',
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle = {
  padding: '16px 24px',
  color: '#475569',
};

const tdStyleBold = {
  padding: '16px 24px',
  color: '#111111',
  fontWeight: 600,
};
