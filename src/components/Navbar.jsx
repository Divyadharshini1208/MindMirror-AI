import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  LogOut,
  User,
  Menu,
  X,
  MessageSquare,
  ScanFace,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { GoogleLogo } from './GoogleButton';

/**
 * Geometric Brand Logo Mark for MirrorMind AI
 * A minimal abstract mirror contour combined with a subtle mind arc.
 * Elegant soft pink and sky blue accents.
 */
export function MirrorMindLogo({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mirrorGradNav" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9A8D4" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>
      </defs>
      {/* Outer abstract geometric mirror oval */}
      <rect x="3" y="3" width="26" height="26" rx="8" fill="#111111" />
      {/* Curved resonant mind arc */}
      <path
        d="M10 16C10 11.5 13.5 8 18 8C22.5 8 26 11.5 26 16C26 20.5 22.5 24 18 24"
        stroke="url(#mirrorGradNav)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Inner reflective focal points */}
      <circle cx="16" cy="16" r="2.8" fill="#FFFFFF" />
      <circle cx="10" cy="16" r="1.5" fill="#7DD3FC" />
    </svg>
  );
}

export default function Navbar({ currentUser, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawers & dropdowns on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitial = currentUser?.displayName
    ? currentUser.displayName.charAt(0).toUpperCase()
    : currentUser?.email
    ? currentUser.email.charAt(0).toUpperCase()
    : 'M';

  const handleLogoutClick = async () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onLogout) {
      await onLogout();
    }
    navigate('/login', { replace: true });
  };

  const getNavLinkStyle = ({ isActive }) => ({
    fontSize: '0.925rem',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? '#111111' : '#64748b',
    textDecoration: 'none',
    position: 'relative',
    padding: '6px 2px',
    transition: 'color 160ms ease',
    borderBottom: isActive ? '2px solid #111111' : '2px solid transparent',
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.94)' : '#ffffff',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: `1px solid ${scrolled ? '#e5e7eb' : 'transparent'}`,
        boxShadow: scrolled ? '0 1px 4px rgba(17, 17, 17, 0.04)' : 'none',
        transition: 'all 200ms ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}
      >
        {/* Brand Logo & Name -> / */}
        <Link
          to="/"
          id="nav-brand-logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
        >
          <MirrorMindLogo size={32} />
          <span
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#111111',
            }}
          >
            MirrorMind <span style={{ fontWeight: 400, color: '#64748b' }}>AI</span>
          </span>
        </Link>

        {/* Center Main Navigation (Desktop) */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '26px',
          }}
          className="desktop-nav"
        >
          <NavLink to="/" end style={getNavLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/features" style={getNavLinkStyle}>
            Features
          </NavLink>
          <NavLink to="/how-it-works" style={getNavLinkStyle}>
            How It Works
          </NavLink>
          <NavLink to="/about" style={getNavLinkStyle}>
            About
          </NavLink>

          {/* Authenticated Navigation Links: Text Analysis & Image Analysis */}
          {currentUser && (
            <>
              <NavLink to="/text-analysis" style={getNavLinkStyle}>
                Text Analysis
              </NavLink>
              <NavLink to="/image-analysis" style={getNavLinkStyle}>
                Image Analysis
              </NavLink>
            </>
          )}
        </nav>

        {/* Right Action Controls (Desktop) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
          className="desktop-nav"
        >
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Quick Launch CTA to Text Analysis */}
              <Link
                to="/text-analysis"
                id="nav-text-analysis-btn"
                className="btn-primary"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                }}
              >
                <span>Try Models</span>
                <ArrowRight size={14} />
              </Link>

              {/* Profile Dropdown Trigger */}
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  id="profile-dropdown-trigger"
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 10px 4px 5px',
                    borderRadius: '9999px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: profileDropdownOpen ? '#f1f5f9' : '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 160ms ease',
                    boxShadow: '0 1px 2px rgba(17,17,17,0.04)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    if (!profileDropdownOpen) {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }
                  }}
                >
                  {/* Google Profile Photo or Initial Avatar */}
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Profile'}
                      referrerPolicy="no-referrer"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f9a8d4 0%, #7dd3fc 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        color: '#111111',
                      }}
                    >
                      {userInitial}
                    </div>
                  )}

                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#111111',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>

                  <ChevronDown
                    size={14}
                    style={{
                      color: '#64748b',
                      transform: profileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 180ms ease',
                    }}
                  />
                </button>

                {/* Profile Dropdown Menu (Without Dashboard, Analyze, or History) */}
                {profileDropdownOpen && (
                  <div
                    id="profile-dropdown-menu"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '260px',
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 12px 32px rgba(17, 17, 17, 0.1)',
                      padding: '8px',
                      zIndex: 200,
                      animation: 'fadeInSlide 180ms ease-out',
                    }}
                  >
                    {/* User Identity Header */}
                    <div
                      style={{
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        marginBottom: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        {currentUser.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt={currentUser.displayName || 'Profile'}
                            referrerPolicy="no-referrer"
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '1px solid #cbd5e1',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #f9a8d4 0%, #7dd3fc 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.95rem',
                              color: '#111111',
                            }}
                          >
                            {userInitial}
                          </div>
                        )}

                        <div style={{ overflow: 'hidden' }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              color: '#111111',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {currentUser.displayName || 'MirrorMind User'}
                          </div>
                          <div
                            style={{
                              fontSize: '0.78rem',
                              color: '#64748b',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={currentUser.email}
                          >
                            {currentUser.email}
                          </div>
                        </div>
                      </div>

                      {/* Provider Badge */}
                      {currentUser.isGoogleUser ? (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: '#3c4043',
                            backgroundColor: '#ffffff',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            border: '1px solid #e5e7eb',
                          }}
                        >
                          <GoogleLogo size={12} />
                          <span>Google Sign-In</span>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: '#059669',
                            backgroundColor: '#ecfdf5',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            border: '1px solid #a7f3d0',
                          }}
                        >
                          <span>Email Account</span>
                        </div>
                      )}
                    </div>

                    {/* Menu Options: Text Analysis, Image Analysis, Profile */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <Link
                        to="/text-analysis"
                        id="dropdown-text-link"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={dropdownItemStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <MessageSquare size={15} style={{ color: '#db2777' }} />
                        <span>Text Analysis</span>
                      </Link>

                      <Link
                        to="/image-analysis"
                        id="dropdown-image-link"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={dropdownItemStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <ScanFace size={15} style={{ color: '#0284c7' }} />
                        <span>Image Analysis</span>
                      </Link>

                      <Link
                        to="/profile"
                        id="dropdown-profile-link"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={dropdownItemStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <User size={15} style={{ color: '#64748b' }} />
                        <span>Profile & Settings</span>
                      </Link>
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '6px 0' }} />

                    {/* Logout Option */}
                    <button
                      type="button"
                      id="dropdown-logout-btn"
                      onClick={handleLogoutClick}
                      style={{
                        ...dropdownItemStyle,
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        color: '#dc2626',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <LogOut size={15} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to="/login"
                id="nav-login-btn"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#111111',
                  textDecoration: 'none',
                  borderRadius: '9px',
                  transition: 'background-color 160ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Login
              </Link>

              <Link
                to="/register"
                id="nav-register-btn"
                className="btn-primary"
                style={{
                  padding: '9px 18px',
                  fontSize: '0.875rem',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                }}
              >
                <span>Get Started</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            color: '#111111',
            cursor: 'pointer',
          }}
          className="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            padding: '16px 20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
          className="mobile-drawer"
        >
          {/* User profile card on mobile */}
          {currentUser && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '14px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                marginBottom: '8px',
              }}
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Profile'}
                  referrerPolicy="no-referrer"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f9a8d4 0%, #7dd3fc 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: '#111111',
                  }}
                >
                  {userInitial}
                </div>
              )}
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111111' }}>
                  {currentUser.displayName || 'MirrorMind User'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{currentUser.email}</div>
              </div>
            </div>
          )}

          <NavLink to="/" end style={getNavLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/features" style={getNavLinkStyle}>
            Features
          </NavLink>
          <NavLink to="/how-it-works" style={getNavLinkStyle}>
            How It Works
          </NavLink>
          <NavLink to="/about" style={getNavLinkStyle}>
            About
          </NavLink>

          {currentUser ? (
            <>
              <NavLink to="/text-analysis" style={getNavLinkStyle}>
                Text Analysis
              </NavLink>
              <NavLink to="/image-analysis" style={getNavLinkStyle}>
                Image Analysis
              </NavLink>
              <NavLink to="/profile" style={getNavLinkStyle}>
                Profile / Settings
              </NavLink>
              <div style={{ paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #fecaca',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                to="/login"
                style={{
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  textDecoration: 'none',
                  color: '#111111',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary"
                style={{
                  textAlign: 'center',
                  padding: '11px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                }}
              >
                Create Account →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Inline styles */}
      <style>{`
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 860px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}

const dropdownItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 12px',
  borderRadius: '8px',
  color: '#334155',
  fontSize: '0.85rem',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'background-color 140ms ease',
};
