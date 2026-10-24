import React from 'react';
import { Eye, ShieldCheck, HeartHandshake, Info } from 'lucide-react';

export default function ResponsibleAI() {
  const principles = [
    {
      title: 'Model predictions',
      description:
        'Outputs reflect statistical probabilities based on training data distributions, not definitive assessments of your internal psychological reality.',
      icon: <Eye size={20} style={{ color: '#0284c7' }} />,
    },
    {
      title: 'Context matters',
      description:
        'A smile can express courtesy, amusement, or quiet relief. AI observes the surface geometry; human context always provides the true meaning.',
      icon: <Info size={20} style={{ color: '#0284c7' }} />,
    },
    {
      title: 'Human judgment matters',
      description:
        'MirrorMind serves as a reflective prompt for curiosity and self-awareness, leaving interpretation, decision-making, and emotional agency in your hands.',
      icon: <HeartHandshake size={20} style={{ color: '#0284c7' }} />,
    },
  ];

  return (
    <section
      id="responsible-ai"
      style={{
        paddingTop: '96px',
        paddingBottom: '96px',
        backgroundColor: '#f0f9ff',
        borderTop: '1px solid #e0f2fe',
        borderBottom: '1px solid #e0f2fe',
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '48px' }}>
          <span
            className="pill-badge"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#bae6fd',
              color: '#0369a1',
              marginBottom: '16px',
            }}
          >
            <ShieldCheck size={13} />
            <span>Responsible Intelligence</span>
          </span>
          <h2 style={{ color: '#0f172a' }}>
            "AI can interpret signals. It shouldn't define you."
          </h2>
          <p style={{ color: '#475569' }}>
            Emotion recognition is an interpretive lens, not an immutable diagnosis. We design
            multimodal models with humility and clarity.
          </p>
        </div>

        {/* 3 Responsible AI Principles */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '24px',
            maxWidth: '1040px',
            margin: '0 auto',
          }}
        >
          {principles.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #bae6fd',
                borderRadius: '20px',
                padding: '32px 26px',
                boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.04)',
                transition: 'all 200ms ease',
              }}
            >
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
                }}
              >
                {item.icon}
              </div>

              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: '10px',
                }}
              >
                {item.title}
              </h3>

              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
