import React, { useState } from 'react';
import {
  ArrowRight,
  MessageSquare,
  ScanFace,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { MirrorMindLogo } from './Navbar';

export default function Hero({ onStartAnalyzing, onExplore }) {
  const [activeSignal, setActiveSignal] = useState('text');

  return (
    <section
      id="home"
      style={{
        paddingTop: '64px',
        paddingBottom: '80px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      }}
    >
      {/* Subtle ambient gradient backdrop */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '780px',
          height: '420px',
          background:
            'radial-gradient(ellipse at center, rgba(249, 168, 212, 0.15) 0%, rgba(125, 211, 252, 0.15) 45%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Top Content */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
          {/* Small Uppercase Eyebrow Label */}
          <div style={{ marginBottom: '20px' }}>
            <span
              className="pill-badge"
              style={{
                borderColor: '#e2e8f0',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 2px rgba(17, 17, 17, 0.04)',
              }}
            >
              <Sparkles size={13} style={{ color: '#f9a8d4' }} />
              <span>Multimodal Emotion Intelligence</span>
            </span>
          </div>

          {/* Main Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.2vw, 4.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.08,
              marginBottom: '24px',
              color: '#111111',
            }}
          >
            Meet the mirror that{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #f9a8d4 0%, #7dd3fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              understands
            </span>{' '}
            more than words.
          </h1>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              lineHeight: 1.6,
              color: '#64748b',
              maxWidth: '680px',
              margin: '0 auto 36px auto',
            }}
          >
            MirrorMind AI brings together text analysis and facial expression recognition to reveal
            the emotional signals behind human communication.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
              marginBottom: '32px',
            }}
          >
            <button
              onClick={onStartAnalyzing}
              className="btn-primary"
              style={{
                padding: '14px 28px',
                fontSize: '1rem',
                borderRadius: '12px',
              }}
            >
              <span>Start Analyzing</span>
              <ArrowRight size={17} />
            </button>

            <button
              onClick={onExplore}
              className="btn-secondary"
              style={{
                padding: '14px 26px',
                fontSize: '1rem',
                borderRadius: '12px',
              }}
            >
              <span>Explore MirrorMind</span>
              <ChevronDown size={17} style={{ color: '#64748b' }} />
            </button>
          </div>

          {/* Minimal Under-Button Modality Row */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '18px',
              color: '#64748b',
              fontSize: '0.85rem',
              fontWeight: 500,
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid #e5e7eb',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={13} style={{ color: '#f9a8d4' }} /> Text
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ScanFace size={13} style={{ color: '#7dd3fc' }} /> Image
            </span>
          </div>
        </div>

        {/* ===================================================================
            SECTION 7: HERO VISUAL (Multimodal Convergence Experience)
            =================================================================== */}
        <div
          style={{
            marginTop: '56px',
            maxWidth: '960px',
            marginLeft: 'auto',
            marginRight: 'auto',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            boxShadow:
              '0 20px 40px -15px rgba(17, 17, 17, 0.05), 0 1px 3px rgba(17, 17, 17, 0.03)',
            padding: '40px 32px',
            position: 'relative',
          }}
        >
          {/* Top visual label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '36px',
              paddingBottom: '16px',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                }}
              />
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#64748b',
                }}
              >
                Multimodal Synthesis Pipeline
              </span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Interactive Concept</span>
          </div>

          {/* Three Input Signals Flowing In */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginBottom: '36px',
            }}
          >
            {/* Signal 1: TEXT */}
            <div
              onMouseEnter={() => setActiveSignal('text')}
              style={{
                padding: '22px',
                borderRadius: '16px',
                border: `1.5px solid ${activeSignal === 'text' ? '#f9a8d4' : '#e5e7eb'}`,
                backgroundColor: activeSignal === 'text' ? '#fdf2f8' : '#ffffff',
                transition: 'all 240ms ease',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#fce7f3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#db2777',
                    }}
                  >
                    <MessageSquare size={16} />
                  </div>
                  <span style={{ fontSize: '0.825rem', fontWeight: 700, letterSpacing: '0.06em' }}>
                    TEXT
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#9d174d',
                    backgroundColor: '#fff',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    border: '1px solid #fbcfe8',
                  }}
                >
                  Semantic
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.925rem',
                  color: '#111111',
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                "I finally achieved what I've been working for."
              </p>
            </div>

            {/* Signal 2: IMAGE */}
            <div
              onMouseEnter={() => setActiveSignal('image')}
              style={{
                padding: '22px',
                borderRadius: '16px',
                border: `1.5px solid ${activeSignal === 'image' ? '#7dd3fc' : '#e5e7eb'}`,
                backgroundColor: activeSignal === 'image' ? '#f0f9ff' : '#ffffff',
                transition: 'all 240ms ease',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#e0f2fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0284c7',
                    }}
                  >
                    <ScanFace size={16} />
                  </div>
                  <span style={{ fontSize: '0.825rem', fontWeight: 700, letterSpacing: '0.06em' }}>
                    IMAGE
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#0369a1',
                    backgroundColor: '#fff',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    border: '1px solid #bae6fd',
                  }}
                >
                  Visual
                </span>
              </div>
              {/* Minimal abstract facial representation (sleek geometric line contour) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '8px 0',
                }}
              >
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <circle cx="22" cy="22" r="20" stroke="#7dd3fc" strokeWidth="1.5" />
                  {/* Subtle eyes */}
                  <circle cx="16" cy="19" r="2.2" fill="#0284c7" />
                  <circle cx="28" cy="19" r="2.2" fill="#0284c7" />
                  {/* Gentle genuine smile curve */}
                  <path
                    d="M16 27C17.5 30 26.5 30 28 27"
                    stroke="#0284c7"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Cheek highlights */}
                  <circle cx="12" cy="24" r="1.5" fill="#f9a8d4" />
                  <circle cx="32" cy="24" r="1.5" fill="#f9a8d4" />
                </svg>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111111' }}>
                    Facial Expression
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                    Micro-expression geometry
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Central Convergence Point */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              paddingTop: '12px',
            }}
          >
            {/* SVG Connecting Flow Lines */}
            <svg
              width="100%"
              height="40"
              viewBox="0 0 600 40"
              style={{ maxWidth: '480px', display: 'block' }}
            >
              <defs>
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F9A8D4" />
                  <stop offset="50%" stopColor="#7DD3FC" />
                  <stop offset="100%" stopColor="#F9A8D4" />
                </linearGradient>
              </defs>
              <path
                d="M 60 0 Q 150 35 300 38 Q 450 35 540 0"
                fill="none"
                stroke="url(#flowGrad)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>

            {/* Central Element: MirrorMind AI with subtle pink + sky-blue aura */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                borderRadius: '16px',
                backgroundColor: '#111111',
                color: '#ffffff',
                boxShadow:
                  '0 0 0 1px rgba(255,255,255,0.1), 0 0 35px -5px rgba(249, 168, 212, 0.4), 0 0 25px -5px rgba(125, 211, 252, 0.4)',
                marginBottom: '16px',
                zIndex: 2,
              }}
            >
              <MirrorMindLogo size={24} />
              <span style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                MirrorMind AI
              </span>
            </div>

            {/* Output: Emotional Signal Detected */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 18px',
                borderRadius: '9999px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(17, 17, 17, 0.05)',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#64748b',
                }}
              >
                Emotional Signal Detected:
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#111111',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                  }}
                />
                {activeSignal === 'text'
                  ? 'Joy & Pride (92%)'
                  : activeSignal === 'image'
                  ? 'Genuine Happiness (89%)'
                  : 'Confident & Calm (91%)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
