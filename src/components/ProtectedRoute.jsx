import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { MirrorMindLogo } from './Navbar';

/**
 * Route protection wrapper for authenticated pages.
 * - While auth is initializing (e.g. Firebase restoring token on page refresh),
 *   displays a lightweight, branded loader to prevent premature redirects.
 * - If unauthenticated after initialization, redirects cleanly to /login
 *   preserving the attempted destination in location.state.from.
 */
export default function ProtectedRoute({ currentUser, authInitialized, children }) {
  const location = useLocation();

  if (!authInitialized) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          gap: '16px',
        }}
      >
        <div style={{ animation: 'pulse 1.8s ease-in-out infinite' }}>
          <MirrorMindLogo size={48} />
        </div>
        <p style={{ fontSize: '0.925rem', color: '#64748b', fontWeight: 500, margin: 0 }}>
          Authenticating MirrorMind session...
        </p>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.96); }
          }
        `}</style>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
