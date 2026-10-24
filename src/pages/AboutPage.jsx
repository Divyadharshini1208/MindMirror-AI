import React from 'react';
import { Mail, Shield, Heart, Sparkles, User, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '56px', paddingBottom: '96px', backgroundColor: '#ffffff' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '56px', textAlign: 'left' }}>
          <span className="section-eyebrow">About MirrorMind AI</span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em' }}>
            A mirror that reflects how we communicate.
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#64748b', lineHeight: 1.65 }}>
            Human emotion is multidimensional. Words, facial expressions, and vocal cadence all tell parts of a
            deeper story. MirrorMind AI brings them together into a unified experience.
          </p>
        </div>

        {/* Section: The Core Philosophy */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Why We Built MirrorMind
          </h2>
          <p style={{ fontSize: '1.025rem', color: '#475569', lineHeight: 1.7, marginBottom: '16px' }}>
            Traditional emotion detection tools treat communication like a single-variable equation: they score words in
            isolation or examine an expression detached from context. But real human feelings rarely exist in a silo.
          </p>
          <p style={{ fontSize: '1.025rem', color: '#475569', lineHeight: 1.7 }}>
            MirrorMind AI acts as a digital mirror. It does not label or categorize people; rather, it reflects
            statistical signals to foster self-awareness, communication empathy, and deeper understanding.
          </p>
        </div>

        {/* Section: Responsible AI & Trust */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '56px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Shield size={22} style={{ color: '#0284c7' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111111', margin: 0 }}>
              Responsible AI Charter
            </h2>
          </div>
          <p style={{ fontSize: '0.975rem', color: '#475569', lineHeight: 1.65, marginBottom: '16px' }}>
            MirrorMind is an exploratory artificial intelligence system built for personal reflection and communication
            insight. It is not a clinical diagnostic instrument, psychiatric diagnostic tool, or lie detector.
          </p>
          <ul style={{ paddingLeft: '20px', color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>
            <li>
              <strong>Statistical Probabilities:</strong> Model inferences are calibrated mathematical scores derived from
              training datasets, not absolute psychological truths.
            </li>
            <li>
              <strong>Context is Essential:</strong> Facial gestures and language depend heavily on individual culture,
              environment, and personal context.
            </li>
            <li>
              <strong>Human Agency First:</strong> MirrorMind leaves the interpretation and meaning of emotional moments
              entirely in the hands of the user.
            </li>
          </ul>
        </div>

        {/* Section: Privacy Commitments */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Data Privacy & Security
          </h2>
          <p style={{ fontSize: '1.025rem', color: '#475569', lineHeight: 1.7, marginBottom: '16px' }}>
            Your signals belong exclusively to you. MirrorMind is engineered around strict privacy principles:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            <div style={privacyBoxStyle}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111111', marginBottom: '6px' }}>
                Zero Photo Retention
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Uploaded images are processed in-memory by Model-2 and discarded immediately. No raw photos are ever saved
                to cloud buckets.
              </p>
            </div>
            <div style={privacyBoxStyle}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111111', marginBottom: '6px' }}>
                No Passive Monitoring
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                The application never engages in background listening, camera monitoring, or passive biometric recording.
              </p>
            </div>
          </div>
        </div>

        {/* Section: Project Creator */}
        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.08em', marginBottom: '4px' }}>
              Project Creator & Lead Engineer
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111111' }}>
              Divya Dharshini M.
            </div>
          </div>

          <a
            href="mailto:divyamallayan2007@gmail.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#0284c7',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            <Mail size={16} />
            <span>divyamallayan2007@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  );
}

const privacyBoxStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  border: '1px solid #e5e7eb',
  padding: '20px 24px',
};
