import React, { useState, useRef } from 'react';
import {
  Upload,
  ScanFace,
  ArrowRight,
  AlertCircle,
  X,
  FileImage,
  Sparkles,
} from 'lucide-react';
import { analyzeImage } from '../services/api';
import ResultCard from './ResultCard';

export default function ImageAnalyzer({ onReflectionComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, JPEG, or PNG image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file is too large. Maximum size is 10MB.');
      return;
    }

    setError('');
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setError('');
    setLoading(true);

    try {
      const response = await analyzeImage(selectedFile);
      setResult(response);
      setLoading(false);
      if (onReflectionComplete) {
        onReflectionComplete(response);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'This MirrorMind capability is currently unavailable.');
    }
  };

  const handleReset = () => {
    setResult(null);
    handleClearImage();
  };

  return (
    <div>
      {result ? (
        <ResultCard
          result={result}
          onReset={handleReset}
        />
      ) : (
        <div
          className="surface-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            padding: '36px',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                color: '#0369a1',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '10px',
              }}
            >
              <ScanFace size={13} />
              <span>FACIAL EXPRESSION REFLECTION</span>
            </div>
            <h3
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#111111',
                letterSpacing: '-0.02em',
                marginBottom: '6px',
              }}
            >
              Show MirrorMind an expression.
            </h3>
            <p style={{ fontSize: '0.925rem', color: '#64748b' }}>
              Upload a facial image to analyze visible emotional signals.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {!previewUrl ? (
            /* Upload Drop Area */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? '#7dd3fc' : '#e2e8f0'}`,
                backgroundColor: isDragging ? '#f0f9ff' : '#fafafa',
                borderRadius: '20px',
                padding: '48px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284c7',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 2px 4px rgba(17,17,17,0.03)',
                }}
              >
                <Upload size={24} />
              </div>

              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#111111',
                  marginBottom: '6px',
                }}
              >
                Drag & drop your facial image here, or{' '}
                <span style={{ color: '#0284c7', textDecoration: 'underline' }}>browse</span>
              </div>
              <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                Supports JPG, JPEG, and PNG (up to 10MB)
              </div>
            </div>
          ) : (
            /* Preview Container */
            <div
              style={{
                position: 'relative',
                borderRadius: '18px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                padding: '20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap',
              }}
            >
              <img
                src={previewUrl}
                alt="Selected expression preview"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                }}
              />
              <div style={{ flex: 1, minWidth: '180px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600,
                    color: '#111111',
                    marginBottom: '4px',
                  }}
                >
                  <FileImage size={16} style={{ color: '#0284c7' }} />
                  <span
                    style={{
                      maxWidth: '220px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {selectedFile?.name}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
                  {(selectedFile?.size / 1024).toFixed(1)} KB • {selectedFile?.type}
                </div>

                <button
                  type="button"
                  onClick={handleClearImage}
                  disabled={loading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                  }}
                >
                  <X size={14} />
                  <span>Choose another image</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: '#fff1f2',
                border: '1px solid #ffe4e6',
                borderRadius: '12px',
                color: '#be123c',
                fontSize: '0.875rem',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Loading or Action Button */}
          {loading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                borderRadius: '14px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#111111',
                fontSize: '0.95rem',
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid #e2e8f0',
                  borderTopColor: '#7dd3fc',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <span>MirrorMind is observing the expression...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!selectedFile}
                className="btn-primary"
                style={{
                  padding: '13px 26px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  opacity: !selectedFile ? 0.5 : 1,
                  cursor: !selectedFile ? 'not-allowed' : 'pointer',
                }}
              >
                <span>Reflect on Image</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
