import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { loginUser, loginWithGoogle, resetPassword } from '../services/auth';
import { MirrorMindLogo } from '../components/Navbar';
import GoogleButton from '../components/GoogleButton';

export default function LoginPage({ currentUser, onAuthSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState({ type: '', text: '' });

  // Destination after login: /text-analysis or the protected page they attempted to visit
  const destination = location.state?.from?.pathname || '/text-analysis';

  // If already logged in, redirect directly to text analysis
  useEffect(() => {
    if (currentUser) {
      navigate('/text-analysis', { replace: true });
    }
  }, [currentUser, navigate]);

  // Handle standard Email & Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const user = await loginUser({ email: email.trim(), password });
      if (onAuthSuccess) onAuthSuccess(user);
      navigate(destination, { replace: true });
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed. Please verify your credentials.');
    }
  };

  // Handle Google OAuth Sign-in
  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const user = await loginWithGoogle();
      if (onAuthSuccess) onAuthSuccess(user);
      navigate(destination, { replace: true });
    } catch (err) {
      setGoogleLoading(false);
      setError(err.message || 'Google Sign-In failed. Please try again.');
    }
  };

  // Handle Forgot Password submission
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetMessage({ type: 'error', text: 'Please enter your registered email address.' });
      return;
    }

    setResetLoading(true);
    setResetMessage({ type: '', text: '' });

    try {
      await resetPassword(resetEmail.trim());
      setResetLoading(false);
      setResetMessage({
        type: 'success',
        text: 'A password reset link has been dispatched to your email address. Please check your inbox.',
      });
    } catch (err) {
      setResetLoading(false);
      setResetMessage({
        type: 'error',
        text: err.message || 'Unable to send reset email. Please verify the address.',
      });
    }
  };

  return (
    <div
      style={{
        paddingTop: '56px',
        paddingBottom: '96px',
        backgroundColor: '#f8fafc',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px', padding: '0 20px' }}>
        <div
          className="surface-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            padding: '40px 36px',
            boxShadow: '0 8px 30px rgba(17, 17, 17, 0.05)',
          }}
        >
          {/* MirrorMindAI Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '14px' }}>
              <MirrorMindLogo size={40} />
            </div>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#111111',
                letterSpacing: '-0.025em',
                marginBottom: '6px',
              }}
            >
              Sign In to MirrorMind
            </h1>
            <p style={{ fontSize: '0.925rem', color: '#64748b', margin: 0 }}>
              Access multimodal emotion intelligence & insights.
            </p>
          </div>

          {/* Clean User-Friendly Error Alert */}
          {error && (
            <div
              id="login-error-alert"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px 14px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                color: '#b91c1c',
                fontSize: '0.85rem',
                marginBottom: '20px',
                lineHeight: 1.5,
              }}
            >
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          {/* Email / Password Login Form */}
          <form onSubmit={handleEmailLogin}>
            {/* Email Input */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#334155',
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
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.925rem',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    transition: 'border-color 150ms ease, box-shadow 150ms ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#111111';
                    e.target.style.boxShadow = '0 0 0 2px rgba(249, 168, 212, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#cbd5e1';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Input & Forgot Password Option */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label
                  htmlFor="login-password"
                  style={{
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: '#334155',
                    margin: 0,
                  }}
                >
                  Password
                </label>
                {/* Forgot Password option */}
                <button
                  type="button"
                  id="forgot-password-toggle"
                  onClick={() => {
                    setResetEmail(email || '');
                    setShowForgotModal(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#111111')}
                  onMouseLeave={(e) => (e.target.style.color = '#64748b')}
                >
                  Forgot password?
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 40px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.925rem',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    transition: 'border-color 150ms ease, box-shadow 150ms ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#111111';
                    e.target.style.boxShadow = '0 0 0 2px rgba(125, 211, 252, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#cbd5e1';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              id="email-login-btn"
              type="submit"
              disabled={loading || googleLoading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading || googleLoading ? 'not-allowed' : 'pointer',
                opacity: loading || googleLoading ? 0.7 : 1,
              }}
            >
              <span>{loading ? 'Logging in...' : 'Login'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider with OR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '22px 0',
              gap: '12px',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em' }}>
              OR
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          </div>

          {/* Continue with Google Button with Official Google "G" Logo */}
          <GoogleButton
            id="google-login-btn"
            text="Continue with Google"
            loading={googleLoading}
            disabled={loading || googleLoading}
            onClick={handleGoogleLogin}
          />

          {/* Register Link */}
          <div style={{ marginTop: '26px', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              id="go-to-register-link"
              style={{
                color: '#111111',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Register →
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Dialog */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(17, 17, 17, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setShowForgotModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#fdf2f8',
                  color: '#db2777',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <KeyRound size={20} />
              </div>
              <h2 id="forgot-modal-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111111', margin: 0 }}>
                Reset Password
              </h2>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
              Enter your email address and Firebase Authentication will send you a secure link to reset your password.
            </p>

            {resetMessage.text && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.825rem',
                  marginBottom: '16px',
                  backgroundColor: resetMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
                  border: `1px solid ${resetMessage.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
                  color: resetMessage.type === 'success' ? '#047857' : '#b91c1c',
                }}
              >
                {resetMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{resetMessage.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordReset}>
              <div style={{ marginBottom: '18px' }}>
                <label
                  htmlFor="reset-email"
                  style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
                >
                  Registered Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="btn-primary"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: resetLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
