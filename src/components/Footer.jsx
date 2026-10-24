import React from 'react';
import { Link } from 'react-router-dom';
import { MirrorMindLogo } from './Navbar';
import { Mail } from 'lucide-react';

/**
 * MirrorMind AI — Universal Minimal Footer
 *
 * Left side:
 * - MirrorMind AI
 * - "See the signal. Understand the moment."
 *
 * Right side:
 * - Divya Dharshini M.
 * - divyamallayan2007@gmail.com, with a clickable mailto: link.
 *
 * Bottom:
 * - © 2026 MirrorMind AI. All rights reserved.
 */
export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '56px',
        paddingBottom: '36px',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        {/* Main Footer Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '32px',
            marginBottom: '40px',
          }}
        >
          {/* Left Side: Brand & Tagline */}
          <div style={{ maxWidth: '380px' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                marginBottom: '12px',
              }}
            >
              <MirrorMindLogo size={30} />
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  color: '#111111',
                }}
              >
                MirrorMind <span style={{ fontWeight: 400, color: '#64748b' }}>AI</span>
              </span>
            </Link>
            <p
              style={{
                fontSize: '0.95rem',
                color: '#64748b',
                fontWeight: 500,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              "See the signal. Understand the moment."
            </p>
          </div>

          {/* Right Side: Creator & Clickable Email */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              textAlign: 'right',
            }}
            className="footer-creator-block"
          >
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#111111',
                marginBottom: '6px',
                letterSpacing: '-0.01em',
              }}
            >
              Divya Dharshini M.
            </div>
            <a
              href="mailto:divyamallayan2007@gmail.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                color: '#0284c7',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 160ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0369a1')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#0284c7')}
            >
              <Mail size={15} />
              <span>divyamallayan2007@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Bottom Row: Minimal Copyright */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.85rem',
            color: '#94a3b8',
          }}
        >
          <div>© 2026 MirrorMind AI. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.825rem' }}>
            <Link to="/features" style={footerSubLinkStyle}>Features</Link>
            <Link to="/how-it-works" style={footerSubLinkStyle}>How It Works</Link>
            <Link to="/about" style={footerSubLinkStyle}>About</Link>
            <Link to="/text-analysis" style={footerSubLinkStyle}>Text Analysis</Link>
            <Link to="/image-analysis" style={footerSubLinkStyle}>Image Analysis</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const footerSubLinkStyle = {
  color: '#94a3b8',
  textDecoration: 'none',
  transition: 'color 150ms ease',
};
