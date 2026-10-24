import React from 'react';
import { MirrorMindLogo } from './Navbar';

export default function About() {
  return (
    <section
      id="about"
      style={{
        paddingTop: '88px',
        paddingBottom: '96px',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #f1f5f9',
      }}
    >
      <div className="container-narrow">
        <div
          className="surface-card"
          style={{
            textAlign: 'center',
            padding: '56px 40px',
            borderRadius: '24px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(17, 17, 17, 0.03)',
          }}
        >
          <div style={{ display: 'inline-block', marginBottom: '20px' }}>
            <MirrorMindLogo size={36} />
          </div>

          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#111111',
              marginBottom: '20px',
            }}
          >
            Why MirrorMind?
          </h2>

          <p
            style={{
              fontSize: '1.15rem',
              lineHeight: 1.7,
              color: '#475569',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            "Human emotion is multidimensional. MirrorMind AI brings different forms of communication
            together so users can explore emotional signals through language and facial expression
            in one unified experience."
          </p>

          <div
            style={{
              marginTop: '32px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 18px',
              borderRadius: '9999px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e5e7eb',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#111111',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#f9a8d4',
              }}
            />
            <span>See the signal. Understand the moment.</span>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#7dd3fc',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
