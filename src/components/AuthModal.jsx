import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Lock, Mail, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { registerUser, loginUser } from '../services/auth';
import { MirrorMindLogo } from './Navbar';

export default function AuthModal({ isOpen, initialMode = 'register', onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'register' | 'login'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (mode === 'register') {
        user = await registerUser({
          fullName,
          email,
          password,
          confirmPassword,
        });
      } else {
        user = await loginUser({
          email,
          password,
        });
      }

      setLoading(false);
      onSuccess(user);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(17, 17, 17, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e5e7eb',
          boxShadow:
            '0 25px 50px -12px rgba(17, 17, 17, 0.18), 0 0 0 1px rgba(17, 17, 17, 0.04)',
          padding: '36px 32px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            backgroundColor: '#f8fafc',
            border: '1px solid #e5e7eb',
            transition: 'all 180ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#111111';
            e.currentTarget.style.backgroundColor = '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }}
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Brand Mark & Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-block', marginBottom: '14px' }}>
            <MirrorMindLogo size={36} />
          </div>

          <h2
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#111111',
              marginBottom: '8px',
            }}
          >
            Step into your MirrorMind.
          </h2>

          <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.5 }}>
            Create an account to unlock multimodal emotion analysis.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '24px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '9px 0',
              fontSize: '0.875rem',
              fontWeight: 600,
              borderRadius: '9px',
              color: mode === 'register' ? '#111111' : '#64748b',
              backgroundColor: mode === 'register' ? '#ffffff' : 'transparent',
              boxShadow: mode === 'register' ? '0 1px 2px rgba(17,17,17,0.06)' : 'none',
              transition: 'all 180ms ease',
            }}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '9px 0',
              fontSize: '0.875rem',
              fontWeight: 600,
              borderRadius: '9px',
              color: mode === 'login' ? '#111111' : '#64748b',
              backgroundColor: mode === 'login' ? '#ffffff' : 'transparent',
              boxShadow: mode === 'login' ? '0 1px 2px rgba(17,17,17,0.06)' : 'none',
              transition: 'all 180ms ease',
            }}
          >
            Login
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              color: '#b91c1c',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              lineHeight: 1.45,
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#111111',
                  marginBottom: '6px',
                }}
              >
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: '#111111',
                marginBottom: '6px',
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: '#111111',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  padding: '2px',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#111111',
                  marginBottom: '6px',
                }}
              >
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '13px 20px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              marginTop: '8px',
              opacity: loading ? 0.8 : 1,
            }}
          >
            <span>{loading ? 'Verifying...' : mode === 'register' ? 'Create Account' : 'Login'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Footer Toggle */}
        <div style={{ textAlign: 'center', marginTop: '22px' }}>
          {mode === 'register' ? (
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                style={{
                  color: '#111111',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Login
              </button>
            </p>
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                style={{
                  color: '#111111',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '11px 14px 11px 38px',
  borderRadius: '10px',
  border: '1px solid #e5e7eb',
  fontSize: '0.9rem',
  color: '#111111',
  backgroundColor: '#ffffff',
  transition: 'border-color 180ms ease, box-shadow 180ms ease',
};
