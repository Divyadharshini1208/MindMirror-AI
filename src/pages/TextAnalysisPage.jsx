import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ScanFace, Sparkles, ArrowRight } from 'lucide-react';
import TextAnalyzer from '../components/TextAnalyzer';

export default function TextAnalysisPage({ currentUser }) {
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

        {/* Text Analyzer Component */}
        <TextAnalyzer />
      </div>
    </div>
  );
}
