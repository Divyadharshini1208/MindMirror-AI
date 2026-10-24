import React from 'react';

/**
 * EmotionChart Component
 * Renders probability distribution bars based on actual backend results.
 * Respects strict rule: Never fabricates or hardcodes emotion percentages.
 */
export default function EmotionChart({ distribution = [] }) {
  if (!distribution || distribution.length === 0) {
    return null;
  }

  // Soft palette for emotion distribution bars
  const getBarColor = (index, emotion) => {
    const e = emotion.toLowerCase();
    if (e.includes('happy') || e.includes('joy')) return '#f9a8d4'; // Soft Pink
    if (e.includes('calm') || e.includes('neutral')) return '#7dd3fc'; // Sky Blue
    if (e.includes('surprise')) return '#fed7aa'; // Soft Amber
    if (e.includes('love')) return '#f472b6'; // Rose
    if (e.includes('sad')) return '#93c5fd'; // Soft Blue
    if (e.includes('fear')) return '#c4b5fd'; // Soft Purple
    if (e.includes('ang')) return '#fca5a5'; // Soft Coral

    // Fallback alternating subtle shades
    return index % 2 === 0 ? '#f9a8d4' : '#7dd3fc';
  };

  return (
    <div style={{ marginTop: '20px', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#64748b',
          }}
        >
          Probability Distribution
        </span>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Model calibrated</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {distribution.map((item, idx) => {
          const score = typeof item.score === 'number' ? Math.min(100, Math.max(0, item.score)) : 0;
          const barColor = getBarColor(idx, item.emotion);

          return (
            <div key={item.emotion || idx}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px',
                  fontSize: '0.85rem',
                }}
              >
                <span style={{ fontWeight: 500, color: '#111111' }}>{item.emotion}</span>
                <span style={{ fontWeight: 600, color: '#64748b' }}>{score}%</span>
              </div>
              <div
                style={{
                  height: '7px',
                  width: '100%',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${score}%`,
                    backgroundColor: barColor,
                    borderRadius: '9999px',
                    transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
