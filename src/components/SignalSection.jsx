import React from 'react';
import { MessageSquare, ScanFace, AudioWaveform, ArrowDown } from 'lucide-react';
import { MirrorMindLogo } from './Navbar';

export default function SignalSection() {
  return (
    <section
      id="core-idea"
      style={{
        paddingTop: '88px',
        paddingBottom: '96px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      <div className="container">
        {/* Large Signature Statement */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 64px auto' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#64748b',
              display: 'inline-block',
              marginBottom: '16px',
            }}
          >
            The Core Concept
          </span>
          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: '#111111',
            }}
          >
            "Emotion isn't expressed in just one way."
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: '#64748b',
              marginTop: '16px',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Human feelings reveal themselves across words, subtle expressions, and acoustic cadence.
            MirrorMind unifies them into a coherent digital mirror.
          </p>
        </div>

        {/* Three Columns: Words, Expressions, Voice */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '1020px',
            margin: '0 auto 48px auto',
          }}
        >
          {/* Column 1: WORDS */}
          <div
            className="surface-card"
            style={{
              textAlign: 'center',
              padding: '36px 28px',
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#fdf2f8',
                border: '1px solid #fbcfe8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#db2777',
                margin: '0 auto 20px auto',
              }}
            >
              <MessageSquare size={24} />
            </div>
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#111111',
                marginBottom: '8px',
              }}
            >
              WORDS
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500 }}>
              What you write.
            </p>
            <p
              style={{
                fontSize: '0.85rem',
                color: '#94a3b8',
                marginTop: '10px',
                lineHeight: 1.5,
              }}
            >
              Lexical sentiment, emotional polarity, and underlying narrative intent.
            </p>
          </div>

          {/* Column 2: EXPRESSIONS */}
          <div
            className="surface-card"
            style={{
              textAlign: 'center',
              padding: '36px 28px',
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7',
                margin: '0 auto 20px auto',
              }}
            >
              <ScanFace size={24} />
            </div>
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#111111',
                marginBottom: '8px',
              }}
            >
              EXPRESSIONS
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500 }}>
              What your face communicates.
            </p>
            <p
              style={{
                fontSize: '0.85rem',
                color: '#94a3b8',
                marginTop: '10px',
                lineHeight: 1.5,
              }}
            >
              Micro-expressions, brow activation, and spatial facial contours.
            </p>
          </div>

          {/* Column 3: VOICE */}
          <div
            className="surface-card"
            style={{
              textAlign: 'center',
              padding: '36px 28px',
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a',
                margin: '0 auto 20px auto',
              }}
            >
              <AudioWaveform size={24} />
            </div>
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#111111',
                marginBottom: '8px',
              }}
            >
              VOICE
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500 }}>
              How you sound.
            </p>
            <p
              style={{
                fontSize: '0.85rem',
                color: '#94a3b8',
                marginTop: '10px',
                lineHeight: 1.5,
              }}
            >
              Vocal pitch, energy modulation, acoustic tempo, and timber dynamics.
            </p>
          </div>
        </div>

        {/* Signature Visual Identity: Visual Connection Flow */}
        <div
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            backgroundColor: '#f8fafc',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '36px 24px',
            textAlign: 'center',
          }}
        >
          {/* Signal equation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '20px',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            <span
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #fbcfe8',
                color: '#9d174d',
                padding: '6px 14px',
                borderRadius: '8px',
              }}
            >
              WORDS
            </span>
            <span style={{ color: '#94a3b8', fontSize: '1.1rem' }}>+</span>
            <span
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #bae6fd',
                color: '#0369a1',
                padding: '6px 14px',
                borderRadius: '8px',
              }}
            >
              EXPRESSIONS
            </span>
            <span style={{ color: '#94a3b8', fontSize: '1.1rem' }}>+</span>
            <span
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #bbf7d0',
                color: '#15803d',
                padding: '6px 14px',
                borderRadius: '8px',
              }}
            >
              VOICE
            </span>
          </div>

          {/* Flow Connector Arrow */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '8px 0',
              color: '#94a3b8',
            }}
          >
            <ArrowDown size={20} />
          </div>

          {/* Center MirrorMind Hub */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#111111',
              color: '#ffffff',
              padding: '12px 26px',
              borderRadius: '14px',
              margin: '10px 0',
              boxShadow:
                '0 4px 14px rgba(17, 17, 17, 0.12), 0 0 20px -3px rgba(249, 168, 212, 0.3)',
            }}
          >
            <MirrorMindLogo size={22} />
            <span style={{ fontSize: '1rem', fontWeight: 700 }}>MirrorMind AI</span>
          </div>

          {/* Flow Connector Arrow */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '8px 0',
              color: '#94a3b8',
            }}
          >
            <ArrowDown size={20} />
          </div>

          {/* Final Output: EMOTIONAL SIGNAL */}
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#ffffff',
              border: '2px solid #111111',
              padding: '10px 24px',
              borderRadius: '9999px',
              marginTop: '8px',
            }}
          >
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                background: 'linear-gradient(135deg, #111111 0%, #334155 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              EMOTIONAL SIGNAL
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
