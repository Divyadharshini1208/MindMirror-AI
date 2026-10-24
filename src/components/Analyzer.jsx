import React, { useState } from 'react';
import { MessageSquare, ScanFace, AudioWaveform, Lock, ArrowRight } from 'lucide-react';
import TextAnalyzer from './TextAnalyzer';
import ImageAnalyzer from './ImageAnalyzer';
import VoiceAnalyzer from './VoiceAnalyzer';
import { saveUserReflection } from '../services/auth';

export default function Analyzer({
  currentUser,
  activeModality = 'text',
  onModalityChange,
  onRequireAuth,
}) {
  const [currentTab, setCurrentTab] = useState(activeModality);

  // Sync with prop if it changes externally
  React.useEffect(() => {
    if (activeModality) {
      setCurrentTab(activeModality);
    }
  }, [activeModality]);

  const handleTabClick = (tab) => {
    if (!currentUser) {
      onRequireAuth('login');
      return;
    }
    setCurrentTab(tab);
    if (onModalityChange) {
      onModalityChange(tab);
    }
  };

  return (
    <section
      id="analyzer"
      style={{
        paddingTop: '96px',
        paddingBottom: '108px',
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      <div className="container-narrow">
        {/* Workspace Heading */}
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <span className="section-eyebrow">Multimodal Workspace</span>
          <h2>What would you like MirrorMind to see?</h2>
          <p>Choose a signal and let AI interpret the emotional patterns.</p>
        </div>

        {/* Clean Segmented Control: TEXT | IMAGE | VOICE */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '36px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '6px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              gap: '6px',
            }}
          >
            <button
              type="button"
              onClick={() => handleTabClick('text')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 24px',
                borderRadius: '11px',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'all 200ms ease',
                backgroundColor: currentTab === 'text' ? '#111111' : '#ffffff',
                color: currentTab === 'text' ? '#ffffff' : '#111111',
                border: currentTab === 'text' ? '1px solid #111111' : '1px solid #e5e7eb',
                boxShadow: currentTab === 'text' ? '0 2px 6px rgba(17,17,17,0.1)' : 'none',
              }}
            >
              <MessageSquare size={16} style={{ color: currentTab === 'text' ? '#f9a8d4' : '#64748b' }} />
              <span>TEXT</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('image')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 24px',
                borderRadius: '11px',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'all 200ms ease',
                backgroundColor: currentTab === 'image' ? '#111111' : '#ffffff',
                color: currentTab === 'image' ? '#ffffff' : '#111111',
                border: currentTab === 'image' ? '1px solid #111111' : '1px solid #e5e7eb',
                boxShadow: currentTab === 'image' ? '0 2px 6px rgba(17,17,17,0.1)' : 'none',
              }}
            >
              <ScanFace size={16} style={{ color: currentTab === 'image' ? '#7dd3fc' : '#64748b' }} />
              <span>IMAGE</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('voice')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 24px',
                borderRadius: '11px',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'all 200ms ease',
                backgroundColor: currentTab === 'voice' ? '#111111' : '#ffffff',
                color: currentTab === 'voice' ? '#ffffff' : '#111111',
                border: currentTab === 'voice' ? '1px solid #111111' : '1px solid #e5e7eb',
                boxShadow: currentTab === 'voice' ? '0 2px 6px rgba(17,17,17,0.1)' : 'none',
              }}
            >
              <AudioWaveform size={16} style={{ color: currentTab === 'voice' ? '#93c5fd' : '#64748b' }} />
              <span>VOICE</span>
            </button>
          </div>
        </div>

        {/* Analyzer Content Container */}
        {!currentUser ? (
          /* Unauthenticated Gated State */
          <div
            className="surface-card"
            style={{
              textAlign: 'center',
              padding: '60px 32px',
              borderRadius: '24px',
              backgroundColor: '#ffffff',
              border: '1.5px dashed #cbd5e1',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '18px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                color: '#111111',
              }}
            >
              <Lock size={26} />
            </div>

            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '10px',
                color: '#111111',
              }}
            >
              Log in to step into your MirrorMind
            </h3>

            <p
              style={{
                fontSize: '0.95rem',
                color: '#64748b',
                maxWidth: '460px',
                margin: '0 auto 28px auto',
                lineHeight: 1.6,
              }}
            >
              Multimodal analysis requires an active account to process text, expressions, or voice
              signals through dedicated AI models.
            </p>

            <button
              onClick={() => onRequireAuth('login')}
              className="btn-primary"
              style={{
                padding: '13px 26px',
                borderRadius: '12px',
                fontSize: '0.95rem',
              }}
            >
              <span>Login or Create Account</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          /* Active Analyzer based on selected segmented tab */
          <div>
            {currentTab === 'text' && <TextAnalyzer />}
            {currentTab === 'image' && <ImageAnalyzer />}
            {currentTab === 'voice' && <VoiceAnalyzer />}
          </div>
        )}
      </div>
    </section>
  );
}
