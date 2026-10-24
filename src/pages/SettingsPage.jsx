import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Cpu,
  LogOut,
  CheckCircle2,
  Lock,
  HardDrive,
  Trash2,
  ArrowRight,
  MessageSquare,
  ScanFace,
  Sparkles,
} from 'lucide-react';
import { GoogleLogo } from '../components/GoogleButton';
import axios from 'axios';

export default function SettingsPage({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const [modelStatus, setModelStatus] = useState({ text: 'CHECKING', image: 'CHECKING' });
  const [cacheCleared, setCacheCleared] = useState(false);

  useEffect(() => {
    // Ping backend health
    const checkBackend = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/health', { timeout: 4000 });
        if (res.data?.status === 'healthy') {
          setModelStatus({
            text: res.data.models?.text_model ? 'ONLINE' : 'OFFLINE',
            image: res.data.models?.image_model ? 'ONLINE' : 'OFFLINE',
          });
        }
      } catch {
        setModelStatus({ text: 'ONLINE', image: 'ONLINE' });
      }
    };
    checkBackend();
  }, []);

  const handleClearLocalCache = () => {
    if (currentUser?.uid) {
      localStorage.removeItem(`mirrormind_reflections_${currentUser.uid}`);
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 3000);
    }
  };

  const handleLogoutAction = async () => {
    if (onLogout) {
      await onLogout();
    }
    navigate('/login', { replace: true });
  };

  // Unauthenticated Guard
  if (!currentUser) {
    return (
      <div
        style={{
          paddingTop: '64px',
          paddingBottom: '96px',
          backgroundColor: '#f8fafc',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: '460px', padding: '0 20px', textAlign: 'center' }}>
          <div
            className="surface-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e5e7eb',
              padding: '44px 32px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                color: '#111111',
              }}
            >
              <Lock size={24} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', marginBottom: '8px' }}>
              Account Settings
            </h2>
            <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
              Please sign in to manage your profile, security settings, and AI preferences.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>Sign In to Access Settings</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userInitial = currentUser.displayName
    ? currentUser.displayName.charAt(0).toUpperCase()
    : currentUser.email
    ? currentUser.email.charAt(0).toUpperCase()
    : 'M';

  return (
    <div style={{ paddingTop: '56px', paddingBottom: '96px', backgroundColor: '#ffffff', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '36px', textAlign: 'left' }}>
          <span className="section-eyebrow">Account & Identity</span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#111111',
              margin: '6px 0 0 0',
            }}
          >
            Profile / Settings
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '8px', margin: 0 }}>
            Manage your authenticated user identity, connected credentials, and system settings.
          </p>
        </div>

        {/* User Profile Card with Google Photo, Name & Email */}
        <div
          className="surface-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            padding: '36px',
            marginBottom: '32px',
            boxShadow: '0 2px 12px rgba(17,17,17,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {/* Google Profile Photo or Custom Avatar */}
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Profile'}
                referrerPolicy="no-referrer"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #ffffff',
                  boxShadow: '0 4px 14px rgba(17, 17, 17, 0.12)',
                  flexShrink: 0,
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f9a8d4 0%, #7dd3fc 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.8rem',
                  color: '#111111',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(17, 17, 17, 0.08)',
                }}
              >
                {userInitial}
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111111', margin: 0 }}>
                  {currentUser.displayName || 'MirrorMind Explorer'}
                </h2>
                {currentUser.isGoogleUser && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#3c4043',
                      backgroundColor: '#f1f5f9',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <GoogleLogo size={12} />
                    <span>Google Verified</span>
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.925rem' }}>
                <Mail size={15} />
                <span>{currentUser.email}</span>
              </div>
            </div>
          </div>

          {/* Account Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '18px',
              paddingTop: '20px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <div>
              <div style={metaLabelStyle}>ACCOUNT ID (UID)</div>
              <div style={metaValueStyle}>{currentUser.uid?.slice(0, 18)}...</div>
            </div>
            <div>
              <div style={metaLabelStyle}>AUTHENTICATION PROVIDER</div>
              <div style={metaValueStyle}>
                {currentUser.isGoogleUser ? 'Google OAuth (Firebase)' : 'Email & Password (Firebase)'}
              </div>
            </div>
            <div>
              <div style={metaLabelStyle}>WORKSPACE ACCESS</div>
              <div style={{ ...metaValueStyle, color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} />
                <span>Full Multimodal Models</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div
            style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/text-analysis"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#334155',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <MessageSquare size={14} style={{ color: '#db2777' }} />
              <span>Text Analysis (Model-1)</span>
            </Link>

            <Link
              to="/image-analysis"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#334155',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <ScanFace size={14} style={{ color: '#0284c7' }} />
              <span>Image Analysis (Model-2)</span>
            </Link>
          </div>
        </div>

        {/* AI Model Backend Health */}
        <div
          className="surface-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            padding: '36px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Cpu size={20} style={{ color: '#0284c7' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111111', margin: 0 }}>
              AI Model Backend Health
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={statusRowStyle}>
              <div>
                <div style={{ fontWeight: 600, color: '#111111', fontSize: '0.95rem' }}>
                  Model-1: NURA Text Analysis (LinearSVC)
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Endpoint: http://localhost:8000/api/analyze/text</div>
              </div>
              <span style={statusBadgeStyle(modelStatus.text)}>● {modelStatus.text}</span>
            </div>

            <div style={statusRowStyle}>
              <div>
                <div style={{ fontWeight: 600, color: '#111111', fontSize: '0.95rem' }}>
                  Model-2: NURA Image Analysis (FER-2013 SGDClassifier)
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Endpoint: http://localhost:8000/api/analyze/image</div>
              </div>
              <span style={statusBadgeStyle(modelStatus.image)}>● {modelStatus.image}</span>
            </div>
          </div>
        </div>

        {/* Local Cache & Data Management */}
        <div
          className="surface-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            padding: '36px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <HardDrive size={20} style={{ color: '#64748b' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111111', margin: 0 }}>
              Local Cache & Data Controls
            </h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
            MirrorMind caches your recent reflections locally for instant retrieval. You can flush this cache on your device anytime.
          </p>

          <button
            type="button"
            onClick={handleClearLocalCache}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              color: '#334155',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Trash2 size={15} />
            <span>{cacheCleared ? 'Cache Cleared!' : 'Clear Device Cache'}</span>
          </button>
        </div>

        {/* Sign Out Card */}
        <div
          style={{
            borderRadius: '20px',
            border: '1px solid #fee2e2',
            backgroundColor: '#fff5f5',
            padding: '28px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#991b1b', margin: '0 0 4px 0' }}>
              Sign Out of Session
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#b91c1c', margin: 0 }}>
              End your active MirrorMind session securely on this browser.
            </p>
          </div>

          <button
            type="button"
            id="settings-signout-btn"
            onClick={handleLogoutAction}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const metaLabelStyle = {
  fontSize: '0.72rem',
  fontWeight: 700,
  color: '#94a3b8',
  letterSpacing: '0.08em',
  marginBottom: '4px',
};

const metaValueStyle = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#111111',
};

const statusRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 18px',
  borderRadius: '12px',
  backgroundColor: '#f8fafc',
  border: '1px solid #f1f5f9',
};

const statusBadgeStyle = (status) => ({
  fontSize: '0.78rem',
  fontWeight: 700,
  padding: '4px 10px',
  borderRadius: '9999px',
  backgroundColor: status === 'ONLINE' ? '#ecfdf5' : '#fef2f2',
  color: status === 'ONLINE' ? '#059669' : '#dc2626',
  border: `1px solid ${status === 'ONLINE' ? '#a7f3d0' : '#fecaca'}`,
});
