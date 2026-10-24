import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ScanFace, Sparkles, CheckCircle2 } from 'lucide-react';
import TextAnalyzer from '../components/TextAnalyzer';
import { saveUserReflection } from '../services/auth';

export default function TextAnalysisPage({ currentUser }) {
  const [saveNotice, setSaveNotice] = useState(null);

  const handleReflectionComplete = (result) => {
    if (currentUser?.uid && result) {
      saveUserReflection(currentUser.uid, result);
      setSaveNotice('Prediction recorded to your private account history.');
      setTimeout(() => setSaveNotice(null), 4000);
    }
  };

  return (
    <div style={{ paddingTop: '48px', paddingBottom: '96px', backgroundColor: '#ffffff', minHeight: '80vh' }}>
      <div className="container-narrow">
        {/* Workspace Header */}
        <div className="section-header" style={{ marginBottom: '36px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: '#fdf2f8',
              color: '#db2777',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              marginBottom: '12px',
            }}
          >
            <Sparkles size={13} />
            <span>NURA MODEL-1 • TEXT INTELLIGENCE</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 3.8vw, 3rem)',
              fontWeight: 800,
              marginBottom: '12px',
              letterSpacing: '-0.025em',
              color: '#111111',
            }}
          >
            Text Analysis Workspace
          </h1>
          <p style={{ maxWidth: '620px', margin: '0 auto', fontSize: '1.05rem', color: '#64748b' }}>
            Enter personal reflections, journal entries, or message transcripts to measure emotional valence across 7 calibrated classes.
          </p>

          {/* Quick link to Image Analysis */}
          <div style={{ marginTop: '16px' }}>
            <Link
              to="/image-analysis"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                color: '#0284c7',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <ScanFace size={16} />
              <span>Looking for facial expression analysis? Switch to Image Analysis →</span>
            </Link>
          </div>
        </div>

        {/* Private History Notification Toast */}
        {saveNotice && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 18px',
              borderRadius: '12px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '24px',
              animation: 'fadeIn 180ms ease',
            }}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{saveNotice}</span>
          </div>
        )}

        {/* Text Analyzer Component */}
        <TextAnalyzer onReflectionComplete={handleReflectionComplete} />
      </div>
    </div>
  );
}
