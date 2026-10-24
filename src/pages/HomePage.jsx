import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, ScanFace, Sparkles, CheckCircle2 } from 'lucide-react';
import Hero from '../components/Hero';
import SignalSection from '../components/SignalSection';

export default function HomePage({ currentUser }) {
  const navigate = useNavigate();

  const handleStartAnalyzing = () => {
    if (currentUser) {
      navigate('/text-analysis');
    } else {
      navigate('/login');
    }
  };

  const handleExplore = () => {
    navigate('/features');
  };

  return (
    <div className="home-page">
      {/* 1. Hero Section with Interactive Multimodal Synthesis Visual */}
      <Hero
        onStartAnalyzing={handleStartAnalyzing}
        onExplore={handleExplore}
      />

      {/* 2. The Core Concept ("Emotion isn't expressed in just one way") */}
      <SignalSection />

      {/* 3. Curated Highlights Grid (Navigates to dedicated pages, does not duplicate them) */}
      <section
        style={{
          paddingTop: '88px',
          paddingBottom: '96px',
          backgroundColor: '#ffffff',
        }}
      >
        <div className="container">
          <div className="section-header" style={{ marginBottom: '56px' }}>
            <span className="section-eyebrow">Explore MirrorMind</span>
            <h2>Multimodal intelligence built for human depth.</h2>
            <p>
              Two dedicated neural architectures trained to understand semantic subtext and visual expression cues.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
              marginBottom: '56px',
            }}
          >
            {/* Card 1: Text Intelligence */}
            <div
              className="surface-card"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '24px',
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 240ms ease',
              }}
            >
              <div>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: '#fdf2f8',
                    border: '1px solid #fbcfe8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    color: '#db2777',
                  }}
                >
                  <MessageSquare size={22} />
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#db2777',
                    marginBottom: '8px',
                  }}
                >
                  NURA Model-1
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: '#111111' }}>
                  Natural Language Sentiment
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
                  Analyzes lexical polarity, contextual subtext, and emotional gravity using calibrated Support Vector
                  Machines.
                </p>
              </div>

              <Link
                to="/features"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#111111',
                  textDecoration: 'none',
                }}
              >
                <span>Read Model Specs</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Card 2: Image Intelligence */}
            <div
              className="surface-card"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '24px',
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 240ms ease',
              }}
            >
              <div>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    color: '#0284c7',
                  }}
                >
                  <ScanFace size={22} />
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#0284c7',
                    marginBottom: '8px',
                  }}
                >
                  NURA Model-2
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: '#111111' }}>
                  Facial Expression Recognition
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
                  Decodes subtle micro-expressions, brow tension, and mouth geometry using trained FER-2013 spatial pixel
                  classifiers.
                </p>
              </div>

              <Link
                to="/features"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#111111',
                  textDecoration: 'none',
                }}
              >
                <span>Read Model Specs</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Quick CTA Banner */}
          <div
            style={{
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #18181b 0%, #111111 100%)',
              padding: '48px 40px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              boxShadow: '0 12px 24px -6px rgba(17, 17, 17, 0.2)',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#f9a8d4',
                  marginBottom: '8px',
                }}
              >
                <Sparkles size={14} />
                <span>Ready To Begin</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                Step into Text and Image Analysis.
              </h3>
              <p style={{ color: '#a1a1aa', fontSize: '1rem', margin: 0, maxWidth: '520px' }}>
                Test your text or facial expressions with genuine scikit-learn machine learning inference.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleStartAnalyzing}
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  color: '#111111',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 160ms ease',
                }}
              >
                <span>Launch Workspace</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
