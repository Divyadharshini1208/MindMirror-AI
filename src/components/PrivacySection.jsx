import React from 'react';
import { Lock, Sliders, CheckCircle2 } from 'lucide-react';

export default function PrivacySection() {
  const items = [
    {
      title: 'Private by design',
      description:
        'Analysis occurs exclusively on signals you deliberately submit in the workspace. The application never engages in passive camera monitoring or background recording.',
      icon: <Lock size={20} style={{ color: '#111111' }} />,
    },
    {
      title: 'Transparent results',
      description:
        'We show full model-calibrated probability distributions rather than opaque, black-box labels, allowing you to evaluate the model’s certainty for each signal.',
      icon: <CheckCircle2 size={20} style={{ color: '#10b981' }} />,
    },
    {
      title: 'User-controlled analysis',
      description:
        'You choose when to analyze and what to submit. Raw images and text are processed in-memory and never permanently retained in cloud storage.',
      icon: <Sliders size={20} style={{ color: '#0284c7' }} />,
    },
  ];

  return (
    <section
      id="privacy"
      style={{
        paddingTop: '96px',
        paddingBottom: '96px',
        backgroundColor: '#ffffff',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">Trust & Integrity</span>
          <h2>Your signals belong to you.</h2>
          <p>
            MirrorMind is designed with privacy in mind. Only implement and claim storage/security
            features that are actually present in the application.
          </p>
        </div>

        {/* 3 Privacy Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '24px',
            maxWidth: '1040px',
            margin: '0 auto',
          }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="surface-card"
              style={{
                padding: '32px 26px',
                borderRadius: '20px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
              }}
            >
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
                }}
              >
                {item.icon}
              </div>

              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#111111',
                  marginBottom: '10px',
                }}
              >
                {item.title}
              </h3>

              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
