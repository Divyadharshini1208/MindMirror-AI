import React from 'react';
import { Layers, Cpu, Compass } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Choose a signal',
      description: 'Text, image, or voice.',
      detail:
        'Select the channel through which you want to communicate. Each modality preserves distinct emotional cues.',
      icon: <Layers size={22} style={{ color: '#db2777' }} />,
      accentBg: '#fdf2f8',
      accentBorder: '#fbcfe8',
    },
    {
      number: '02',
      title: 'MirrorMind analyzes',
      description: 'A dedicated AI model processes the selected input.',
      detail:
        'Custom neural pipelines extract high-dimensional semantic, spatial, or acoustic features in real time.',
      icon: <Cpu size={22} style={{ color: '#0284c7' }} />,
      accentBg: '#f0f9ff',
      accentBorder: '#bae6fd',
    },
    {
      number: '03',
      title: 'See the reflection',
      description: 'Receive the detected emotional signal and confidence.',
      detail:
        'Review the calibrated probability distribution and understand the primary emotional patterns detected.',
      icon: <Compass size={22} style={{ color: '#6366f1' }} />,
      accentBg: '#f5f3ff',
      accentBorder: '#ddd6fe',
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        paddingTop: '96px',
        paddingBottom: '96px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #f1f5f9',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">The Architecture</span>
          <h2>How MirrorMind sees emotion.</h2>
          <p>
            A streamlined process transforming complex human signals into clear, interpretable
            reflections.
          </p>
        </div>

        {/* Steps Container with Flow Connector */}
        <div style={{ position: 'relative', maxWidth: '1060px', margin: '0 auto' }}>
          {/* Desktop Thin Flowing Pink → Sky-Blue Visual Connector Line */}
          <div
            className="flow-connector-line"
            style={{
              position: 'absolute',
              top: '48px',
              left: '12%',
              right: '12%',
              height: '2px',
              background: 'linear-gradient(90deg, #f9a8d4 0%, #7dd3fc 50%, #c4b5fd 100%)',
              zIndex: 0,
            }}
          />

          {/* 3 Step Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {steps.map((step) => (
              <div
                key={step.number}
                className="surface-card"
                style={{
                  padding: '36px 28px',
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {/* Step Circle with Icon */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    backgroundColor: step.accentBg,
                    border: `1px solid ${step.accentBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    boxShadow: '0 4px 10px rgba(17, 17, 17, 0.03)',
                  }}
                >
                  {step.icon}
                </div>

                {/* Step Number Tag */}
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: '#94a3b8',
                    marginBottom: '8px',
                  }}
                >
                  STEP {step.number}
                </span>

                {/* Step Title */}
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#111111',
                    marginBottom: '8px',
                  }}
                >
                  {step.title}
                </h3>

                {/* Short Description */}
                <p
                  style={{
                    fontSize: '0.925rem',
                    fontWeight: 600,
                    color: '#111111',
                    marginBottom: '10px',
                  }}
                >
                  {step.description}
                </p>

                {/* Detail */}
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.55 }}>
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .flow-connector-line {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
