import React from 'react';

/**
 * Official Google 4-Color 'G' Logo SVG
 * Strictly adheres to Google Branding guidelines:
 * - Blue: #4285F4
 * - Green: #34A853
 * - Yellow: #FBBC05
 * - Red: #EA4335
 */
export function GoogleLogo({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.59.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

/**
 * Standard Google OAuth Button conforming to Google Identity Branding Specifications
 */
export default function GoogleButton({
  onClick,
  loading = false,
  disabled = false,
  text = 'Continue with Google',
  id = 'google-signin-btn',
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: '100%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '11px 16px',
        backgroundColor: '#ffffff',
        border: '1px solid #dadce0',
        borderRadius: '12px',
        color: '#3c4043',
        fontSize: '0.925rem',
        fontWeight: 600,
        fontFamily: "'Roboto', 'Inter', -apple-system, sans-serif",
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        boxShadow: '0 1px 2px rgba(60, 64, 67, 0.08)',
        transition: 'background-color 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
        opacity: disabled || loading ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = '#f8fafc';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(60, 64, 67, 0.16)';
          e.currentTarget.style.borderColor = '#d2d5da';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(60, 64, 67, 0.08)';
          e.currentTarget.style.borderColor = '#dadce0';
        }
      }}
    >
      <GoogleLogo size={18} />
      <span>{loading ? 'Connecting with Google...' : text}</span>
    </button>
  );
}
