import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Layers, BarChart3, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: '56px', paddingBottom: '96px', backgroundColor: '#ffffff' }}>
      <div className="container">
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '64px' }}>
          <span className="section-eyebrow">The MirrorMind Pipeline</span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em' }}>
            How emotional signals become reflections.
          </h1>
          <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '1.1rem' }}>
            MirrorMind AI transforms unstructured human text and facial imagery into calibrated emotional vectors
            through an end-to-end, four-stage inference pipeline.
          </p>
        </div>

        {/* 4 Pipeline Stages */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '64px',
          }}
        >
          {/* Step 1 */}
          <div
            className="surface-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e5e7eb',
              padding: '36px 28px',
              position: 'relative',
            }}
          >
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#f3f4f6',
                position: 'absolute',
                top: '20px',
                right: '24px',
                lineHeight: 1,
              }}
            >
              01
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: '#111111',
              }}
            >
              <Layers size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#111111' }}>
              Signal Capture
            </h3>
            <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.6 }}>
              You provide a signal in the unified workspace — either written text or a facial photograph. Inputs are
              validated client-side before any network transit.
            </p>
          </div>

          {/* Step 2 */}
          <div
            className="surface-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e5e7eb',
              padding: '36px 28px',
              position: 'relative',
            }}
          >
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#f3f4f6',
                position: 'absolute',
                top: '20px',
                right: '24px',
                lineHeight: 1,
              }}
            >
              02
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#fdf2f8',
                border: '1px solid #fbcfe8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: '#db2777',
              }}
            >
              <Cpu size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#111111' }}>
              Preprocessing
            </h3>
            <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.6 }}>
              Text inputs undergo lexical tokenization and TF-IDF N-gram feature mapping. Facial images are resized to
              48x48 grayscale and standardized with a pre-fit pixel scaler.
            </p>
          </div>

          {/* Step 3 */}
          <div
            className="surface-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e5e7eb',
              padding: '36px 28px',
              position: 'relative',
            }}
          >
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#f3f4f6',
                position: 'absolute',
                top: '20px',
                right: '24px',
                lineHeight: 1,
              }}
            >
              03
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: '#0284c7',
              }}
            >
              <Layers size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#111111' }}>
              Neural Inference
            </h3>
            <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.6 }}>
              The serialized machine learning pipeline (NURA LinearSVC or FER-2013 SGDClassifier) executes in the
              FastAPI backend microservice with zero fabricated predictions.
            </p>
          </div>

          {/* Step 4 */}
          <div
            className="surface-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e5e7eb',
              padding: '36px 28px',
              position: 'relative',
            }}
          >
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#f3f4f6',
                position: 'absolute',
                top: '20px',
                right: '24px',
                lineHeight: 1,
              }}
            >
              04
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: '#059669',
              }}
            >
              <BarChart3 size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#111111' }}>
              Calibrated Reflection
            </h3>
            <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.6 }}>
              Outputs are normalized into calibrated probabilities across every candidate emotion class, displayed
              transparently inside the Universal Reflection Card.
            </p>
          </div>
        </div>

        {/* Visual Architectural Flow Box */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '24px',
            padding: '48px',
            textAlign: 'center',
            marginBottom: '64px',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#64748b',
              marginBottom: '12px',
              display: 'inline-block',
            }}
          >
            End-To-End Architecture
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111111', marginBottom: '28px' }}>
            Zero Mock Inferences. 100% Genuine Machine Learning.
          </h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#334155',
            }}
          >
            <div style={tagBoxStyle}>Client Workspace</div>
            <span>→</span>
            <div style={tagBoxStyle}>FastAPI Server (:8000)</div>
            <span>→</span>
            <div style={tagBoxStyle}>NURA Joblib Models</div>
            <span>→</span>
            <div style={tagBoxStyle}>Calibrated Reflection Card</div>
          </div>
        </div>

        {/* Call to action */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/text-analysis')}
            className="btn-primary"
            style={{
              padding: '14px 32px',
              borderRadius: '12px',
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Launch Text Analysis</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const tagBoxStyle = {
  padding: '10px 18px',
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  border: '1px solid #cbd5e1',
  boxShadow: '0 1px 3px rgba(17,17,17,0.04)',
};
