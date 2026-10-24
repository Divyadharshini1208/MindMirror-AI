import React from 'react';
import { Link } from 'react-router-dom';
import { ScanFace, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import ImageAnalyzer from '../components/ImageAnalyzer';

export default function ImageAnalysisPage({ currentUser }) {
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
              backgroundColor: '#f0f9ff',
              color: '#0284c7',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              marginBottom: '12px',
            }}
          >
            <Sparkles size={13} />
            <span>NURA MODEL-2 • FACIAL EXPRESSION RECOGNITION</span>
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
            Image Analysis Workspace
          </h1>
          <p style={{ maxWidth: '620px', margin: '0 auto', fontSize: '1.05rem', color: '#64748b' }}>
            Upload a facial photo (JPG/PNG) to analyze micro-expressions with genuine FER-2013 deep pixel inference. Images are processed in-memory with zero retention.
          </p>

          {/* Quick link to Text Analysis */}
          <div style={{ marginTop: '16px' }}>
            <Link
              to="/text-analysis"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                color: '#db2777',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <MessageSquare size={16} />
              <span>Looking for written emotion analysis? Switch to Text Analysis →</span>
            </Link>
          </div>
        </div>

        {/* Image Analyzer Component */}
        <ImageAnalyzer />
      </div>
    </div>
  );
}
