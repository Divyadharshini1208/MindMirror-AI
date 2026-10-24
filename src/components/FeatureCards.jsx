import React from 'react';
import { ArrowRight, MessageSquare, ScanFace } from 'lucide-react';

export default function FeatureCards({ onExploreModality }) {
  return (
    <section
      id="features"
      style={{
        paddingTop: '96px',
        paddingBottom: '96px',
        backgroundColor: '#f8fafc',
      }}
    >
      <div className="container">
        {/* Section Heading */}
        <div className="section-header">
          <span className="section-eyebrow">Modality Matrix</span>
          <h2>Two signals. One intelligent mirror.</h2>
          <p>
            Written language and facial expressions carry distinct, complementary emotional dimensions. MirrorMind provides
            specialized neural interpreters for both.
          </p>
        </div>

        {/* Three Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '28px',
          }}
        >
          {/* Card 1: TEXT */}
          <div
            className="surface-card"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '3px solid #f9a8d4',
              backgroundColor: '#ffffff',
            }}
          >
            <div>
              {/* Header with pill & icon */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '28px',
                }}
              >
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
                    color: '#db2777',
                  }}
                >
                  <MessageSquare size={22} />
                </div>
                <span className="pill-badge pill-badge-pink">TEXT</span>
              </div>

              <h3
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  marginBottom: '12px',
                  color: '#111111',
                }}
              >
                Understand your words
              </h3>

              <p
                style={{
                  fontSize: '0.975rem',
                  color: '#64748b',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                }}
              >
                Analyze written language to identify emotional patterns and signals.
              </p>
            </div>

            <button
              onClick={() => onExploreModality('text')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 0',
                fontSize: '0.925rem',
                fontWeight: 600,
                color: '#111111',
                borderBottom: '1.5px solid #f9a8d4',
                alignSelf: 'flex-start',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#db2777';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#111111';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span>Explore Text</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: IMAGE */}
          <div
            className="surface-card"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '3px solid #7dd3fc',
              backgroundColor: '#ffffff',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '28px',
                }}
              >
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
                    color: '#0284c7',
                  }}
                >
                  <ScanFace size={22} />
                </div>
                <span className="pill-badge pill-badge-blue">IMAGE</span>
              </div>

              <h3
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  marginBottom: '12px',
                  color: '#111111',
                }}
              >
                Read facial expressions
              </h3>

              <p
                style={{
                  fontSize: '0.975rem',
                  color: '#64748b',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                }}
              >
                Analyze facial expressions from images to identify emotional states.
              </p>
            </div>

            <button
              onClick={() => onExploreModality('image')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 0',
                fontSize: '0.925rem',
                fontWeight: 600,
                color: '#111111',
                borderBottom: '1.5px solid #7dd3fc',
                alignSelf: 'flex-start',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#0284c7';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#111111';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span>Explore Image</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
