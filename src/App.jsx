import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Pages
import TextAnalysisPage from './pages/TextAnalysisPage';
import ImageAnalysisPage from './pages/ImageAnalysisPage';
import SettingsPage from './pages/SettingsPage';

// Services
import { onAuthStateChanged, logoutUser } from './services/auth';

/**
 * ScrollToTop ensures route changes reset scroll to top.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Subscribe to real Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setCurrentUser(user);
      setAuthInitialized(true);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="mirrormind-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Sticky Header Navigation */}
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Dynamic Route Pages */}
        <main style={{ flex: 1 }}>
          <Routes>
            {/* ========================================================= */}
            {/* Public Pages: Accessible without authentication            */}
            {/* ========================================================= */}
            <Route path="/" element={<HomePage currentUser={currentUser} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />

            {/* Authentication Pages */}
            <Route
              path="/login"
              element={<LoginPage currentUser={currentUser} onAuthSuccess={handleAuthSuccess} />}
            />
            <Route
              path="/register"
              element={<RegisterPage currentUser={currentUser} onAuthSuccess={handleAuthSuccess} />}
            />

            {/* ========================================================= */}
            {/* Protected Pages: Require Active Authentication            */}
            {/* ========================================================= */}

            {/* 1. Text Analysis (Model-1) -> /text-analysis */}
            <Route
              path="/text-analysis"
              element={
                <ProtectedRoute currentUser={currentUser} authInitialized={authInitialized}>
                  <TextAnalysisPage currentUser={currentUser} />
                </ProtectedRoute>
              }
            />

            {/* 2. Image Analysis (Model-2) -> /image-analysis */}
            <Route
              path="/image-analysis"
              element={
                <ProtectedRoute currentUser={currentUser} authInitialized={authInitialized}>
                  <ImageAnalysisPage currentUser={currentUser} />
                </ProtectedRoute>
              }
            />

            {/* 3. Profile & Settings -> /profile & /settings */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute currentUser={currentUser} authInitialized={authInitialized}>
                  <SettingsPage currentUser={currentUser} onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute currentUser={currentUser} authInitialized={authInitialized}>
                  <SettingsPage currentUser={currentUser} onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />

            {/* Aliases for removed pages to gracefully redirect */}
            <Route path="/dashboard" element={<Navigate to="/text-analysis" replace />} />
            <Route path="/analyze" element={<Navigate to="/text-analysis" replace />} />
            <Route path="/history" element={<Navigate to="/text-analysis" replace />} />
            <Route path="/voice" element={<Navigate to="/text-analysis" replace />} />
            <Route path="/voice-analysis" element={<Navigate to="/text-analysis" replace />} />
            <Route path="/analyze/voice" element={<Navigate to="/text-analysis" replace />} />

            {/* Fallback Catch-all: Redirect to /text-analysis if logged in, else / */}
            <Route
              path="*"
              element={<Navigate to={currentUser ? '/text-analysis' : '/'} replace />}
            />
          </Routes>
        </main>

        {/* Minimal Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
