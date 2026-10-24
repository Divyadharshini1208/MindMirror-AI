import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { registerUser, loginWithGoogle } from '../services/auth';
import { MirrorMindLogo } from '../components/Navbar';
import GoogleButton from '../components/GoogleButton';

export default function RegisterPage({ currentUser, onAuthSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Destination after register: /text-analysis or the protected page they attempted to visit
  const destination = location.state?.from?.pathname || '/text-analysis';

  // If already logged in, redirect directly to text analysis
  useEffect(() => {
    if (currentUser) {
      navigate('/text-analysis', { replace: true });
    }
  }, [currentUser, navigate]);

  // Handle standard Email & Password Registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your entries.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const user = await registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });
      if (onAuthSuccess) onAuthSuccess(user);
      navigate(destination, { replace: true });
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  // Handle Google OAuth Sign-in/Sign-up
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
      <div style={{ width: '100%', maxWidth: '460px', padding: '0 20px' }}>
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
          <div style={{ textAlign: 'center', marginBottom: '26px' }}>
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
              Create Account
            </h1>
            <p style={{ fontSize: '0.925rem', color: '#64748b', margin: 0 }}>
              Join MirrorMind for multimodal emotion intelligence.
            </p>
          </div>

          {/* Clean User-Friendly Error Alert */}
          {error && (
            <div
              id="register-error-alert"
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div style={{ marginBottom: '15px' }}>
              <label
                htmlFor="register-name"
                style={{
                  display: 'block',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#334155',
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
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  id="register-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  autoComplete="name"
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

            {/* Email Field */}
            <div style={{ marginBottom: '15px' }}>
              <label
                htmlFor="register-email"
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
                  id="register-email"
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

            {/* Password Field */}
            <div style={{ marginBottom: '15px' }}>
              <label
                htmlFor="register-password"
                style={{
                  display: 'block',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '6px',
                }}
              >
                Password (min. 6 characters)
              </label>
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
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
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

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '22px' }}>
              <label
                htmlFor="register-confirm-password"
                style={{
                  display: 'block',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#334155',
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
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  id="register-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
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
                    e.target.style.boxShadow = '0 0 0 2px rgba(125, 211, 252, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#cbd5e1';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Create Account Button */}
            <button
              id="email-register-btn"
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
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
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
            id="google-register-btn"
            text="Continue with Google"
            loading={googleLoading}
            disabled={loading || googleLoading}
            onClick={handleGoogleLogin}
          />

          {/* Already have an account? Login */}
          <div style={{ marginTop: '26px', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              id="go-to-login-link"
              style={{
                color: '#111111',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
