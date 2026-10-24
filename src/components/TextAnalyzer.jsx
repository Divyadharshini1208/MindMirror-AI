import React, { useState } from 'react';
import { ArrowRight, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';
import { analyzeText } from '../services/api';
import ResultCard from './ResultCard';

const SAMPLE_PROMPTS = [
  "I finally finished the project I've been pouring my soul into for months.",
  "I feel a gentle sense of quiet and clarity as the morning begins.",
  "The endless backlog is beginning to feel heavy and overwhelming.",
  "I wasn't expecting this unexpected news at all, completely caught off guard.",
];

export default function TextAnalyzer({ onReflectionComplete }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!text.trim()) return;

    setError('');
    setLoading(true);

    try {
      const response = await analyzeText(text);
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
    setText('');
    setError('');
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
                backgroundColor: '#fdf2f8',
                border: '1px solid #fbcfe8',
                color: '#9d174d',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '10px',
              }}
            >
              <MessageSquare size={13} />
              <span>TEXT REFLECTION</span>
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
              Express what is on your mind.
            </h3>
            <p style={{ fontSize: '0.925rem', color: '#64748b' }}>
              MirrorMind analyzes lexical patterns, sentiment weight, and emotional nuance.
            </p>
          </div>

          {/* Quick sample prompt chips */}
          <div style={{ marginBottom: '20px' }}>
            <span
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#94a3b8',
                marginBottom: '8px',
              }}
            >
              Or try a sample reflection:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SAMPLE_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setText(prompt)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                    textAlign: 'left',
                    transition: 'all 180ms ease',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.color = '#111111';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#475569';
                  }}
                >
                  "{prompt.length > 50 ? prompt.slice(0, 50) + '...' : prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Large Minimalist Textarea */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <textarea
              rows={6}
              disabled={loading}
              placeholder="Write something that expresses how you feel..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                fontSize: '1rem',
                lineHeight: 1.6,
                color: '#111111',
                backgroundColor: '#ffffff',
                resize: 'vertical',
                transition: 'border-color 180ms ease, box-shadow 180ms ease',
                boxShadow: 'inset 0 1px 2px rgba(17, 17, 17, 0.03)',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#111111')}
              onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
            />

            {/* Character Count */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '6px',
                fontSize: '0.8rem',
                color: '#94a3b8',
              }}
            >
              {text.length} characters
            </div>
          </div>

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

          {/* Processing / Button State */}
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
                  borderTopColor: '#f9a8d4',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <span>MirrorMind is reading between the lines...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!text.trim()}
                className="btn-primary"
                style={{
                  padding: '13px 26px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  opacity: !text.trim() ? 0.5 : 1,
                  cursor: !text.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                <span>Reflect on Text</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
