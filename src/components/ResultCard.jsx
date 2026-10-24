import React, { useState } from 'react';
import {
  MessageSquare,
  ScanFace,
  Check,
  Copy,
  RotateCcw,
  Sparkles,
  Bookmark,
} from 'lucide-react';
import EmotionChart from './EmotionChart';
import { MirrorMindLogo } from './Navbar';

export default function ResultCard({ result, onReset, onSave }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!result) return null;

  const {
    emotion,
    confidence = 0,
    distribution = [],
    modality = 'TEXT',
    boundingBoxes,
    timestamp,
  } = result;

  const handleCopy = () => {
    const text = `MirrorMind AI Reflection\nModality: ${modality}\nEmotional Signal: ${emotion}\nConfidence: ${confidence}%\nDate: ${new Date(
      timestamp || Date.now()
    ).toLocaleString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (onSave && !saved) {
      onSave(result);
      setSaved(true);
    }
  };

  const getModalityIcon = () => {
    switch (modality) {
      case 'IMAGE':
        return <ScanFace size={16} style={{ color: '#0284c7' }} />;
      case 'TEXT':
      default:
        return <MessageSquare size={16} style={{ color: '#db2777' }} />;
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        padding: '36px',
        boxShadow:
          '0 20px 25px -5px rgba(17, 17, 17, 0.05), 0 8px 10px -6px rgba(17, 17, 17, 0.02)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative subtle aura accent */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background:
            modality === 'TEXT'
              ? 'radial-gradient(circle, rgba(249, 168, 212, 0.25) 0%, rgba(255, 255, 255, 0) 70%)'
              : modality === 'IMAGE'
              ? 'radial-gradient(circle, rgba(125, 211, 252, 0.25) 0%, rgba(255, 255, 255, 0) 70%)'
              : 'radial-gradient(circle, rgba(249, 168, 212, 0.2) 0%, rgba(125, 211, 252, 0.2) 50%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header bar: MIRRORMIND REFLECTION */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '20px',
          borderBottom: '1px solid #f1f5f9',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MirrorMindLogo size={20} />
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#111111',
            }}
          >
            MIRRORMIND REFLECTION
          </span>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#111111',
          }}
        >
          {getModalityIcon()}
          <span>{modality}</span>
        </div>
      </div>

      {/* Main Signal Result Display */}
      <div>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#64748b',
            display: 'block',
            marginBottom: '4px',
          }}
        >
          Emotional signal
        </span>

        {/* Emotion Heading */}
        <h3
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#111111',
            lineHeight: 1.1,
            marginBottom: '10px',
          }}
        >
          {emotion}
        </h3>

        {/* Confidence Percentage with meter */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e5e7eb',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#111111',
          }}
        >
          <Sparkles size={14} style={{ color: '#f9a8d4' }} />
          <span>{confidence}% confidence</span>
        </div>
      </div>

      {/* Optional Facial Bounding Boxes - ONLY if actually returned by backend */}
      {Array.isArray(boundingBoxes) && boundingBoxes.length > 0 && (
        <div
          style={{
            marginTop: '16px',
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            fontSize: '0.8rem',
            color: '#0369a1',
          }}
        >
          Facial region coordinates detected: {boundingBoxes.length} face region(s) localized.
        </div>
      )}

      {/* Probability Distribution Chart */}
      {distribution && distribution.length > 0 && (
        <EmotionChart distribution={distribution} />
      )}

      {/* Analyzed Through Footer & Action Buttons */}
      <div
        style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '0.825rem', color: '#64748b' }}>
          Analyzed through:{' '}
          <strong style={{ color: '#111111', fontWeight: 600 }}>{modality}</strong>
          {result.modelName && (
            <span
              style={{
                marginLeft: '8px',
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: '#f1f5f9',
                fontSize: '0.75rem',
                color: '#475569',
                fontWeight: 500,
              }}
            >
              NURA {result.modelName}
            </span>
          )}
          {timestamp && (
            <span style={{ marginLeft: '10px', color: '#94a3b8' }}>
              • {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 600,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              color: '#111111',
              transition: 'all 180ms ease',
            }}
          >
            {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {onReset && (
            <button
              onClick={onReset}
              className="btn-primary"
              style={{
                padding: '8px 16px',
                fontSize: '0.825rem',
                borderRadius: '8px',
              }}
            >
              <RotateCcw size={14} />
              <span>Analyze Another</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
