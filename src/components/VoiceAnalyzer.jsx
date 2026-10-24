import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Upload,
  ArrowRight,
  AlertCircle,
  AudioWaveform,
  RotateCcw,
} from 'lucide-react';
import { analyzeVoice } from '../services/api';
import ResultCard from './ResultCard';

export default function VoiceAnalyzer({ onReflectionComplete }) {
  const [inputMode, setInputMode] = useState('record'); // 'record' | 'upload'
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioElementRef = useRef(null);
  const fileInputRef = useRef(null);

  // Clean up audio objects on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [audioUrl]);

  // Start Voice Recording
  const startRecording = async () => {
    setError('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Audio analysis for real-time waveform drawing
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;
        drawWaveform();
      } catch (e) {
        console.warn('Audio visualization not supported:', e);
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop all mic tracks
        stream.getTracks().forEach((track) => track.stop());
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      setError('Microphone access is required to record voice. Please grant permission or upload an audio file.');
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  // Draw Waveform Canvas
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        // Subtle pink to blue gradient for live waveform
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#f9a8d4');
        gradient.addColorStop(1, '#7dd3fc');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    };
    render();
  };

  // Handle Playback Toggle
  const togglePlayAudio = () => {
    if (!audioElementRef.current) return;
    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  // Delete / Reset Recording
  const handleDeleteAudio = () => {
    if (isPlaying && audioElementRef.current) {
      audioElementRef.current.pause();
    }
    setIsPlaying(false);
    setRecordedBlob(null);
    setUploadedFile(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingDuration(0);
    setError('');
  };

  // Upload File handler
  const handleUploadFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/webm', 'audio/ogg', 'audio/m4a', 'audio/x-m4a'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|m4a|ogg|webm)$/i)) {
      setError('Please upload a valid audio file (WAV, MP3, M4A, OGG, or WEBM).');
      return;
    }

    setError('');
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
  };

  // Analyze Voice
  const handleAnalyze = async () => {
    const fileToAnalyze = inputMode === 'record' ? recordedBlob : uploadedFile;
    if (!fileToAnalyze) return;

    setError('');
    setLoading(true);

    try {
      const response = await analyzeVoice(fileToAnalyze);
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
    handleDeleteAudio();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
                backgroundColor: '#f5f3ff',
                border: '1px solid #ddd6fe',
                color: '#6d28d9',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '10px',
              }}
            >
              <AudioWaveform size={13} />
              <span>VOICE PATTERN REFLECTION</span>
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
              Let MirrorMind hear the signal.
            </h3>
            <p style={{ fontSize: '0.925rem', color: '#64748b' }}>
              Analyze vocal pitch, tempo, and acoustic harmonics for emotional cues.
            </p>
          </div>

          {/* Mode Switcher: Record Voice or Upload Audio */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '28px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setInputMode('record');
                handleDeleteAudio();
              }}
              style={{
                padding: '8px 18px',
                fontSize: '0.875rem',
                fontWeight: 600,
                borderRadius: '9px',
                color: inputMode === 'record' ? '#111111' : '#64748b',
                backgroundColor: inputMode === 'record' ? '#ffffff' : 'transparent',
                boxShadow: inputMode === 'record' ? '0 1px 2px rgba(17,17,17,0.06)' : 'none',
                transition: 'all 180ms ease',
              }}
            >
              Record Voice
            </button>
            <button
              type="button"
              onClick={() => {
                setInputMode('upload');
                handleDeleteAudio();
              }}
              style={{
                padding: '8px 18px',
                fontSize: '0.875rem',
                fontWeight: 600,
                borderRadius: '9px',
                color: inputMode === 'upload' ? '#111111' : '#64748b',
                backgroundColor: inputMode === 'upload' ? '#ffffff' : 'transparent',
                boxShadow: inputMode === 'upload' ? '0 1px 2px rgba(17,17,17,0.06)' : 'none',
                transition: 'all 180ms ease',
              }}
            >
              Upload Audio
            </button>
          </div>

          {/* Hidden HTML audio element for preview */}
          {audioUrl && (
            <audio
              ref={audioElementRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              style={{ display: 'none' }}
            />
          )}

          {/* RECORD VOICE MODE */}
          {inputMode === 'record' && (
            <div
              style={{
                backgroundColor: '#fafafa',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '40px 24px',
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              {!audioUrl ? (
                <div>
                  {/* Beautiful Circular Microphone Button */}
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
                    {isRecording && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-12px',
                          left: '-12px',
                          right: '-12px',
                          bottom: '-12px',
                          borderRadius: '50%',
                          border: '2px solid #f9a8d4',
                          animation: 'pulseSubtle 1.2s infinite ease-in-out',
                        }}
                      />
                    )}
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: '50%',
                        backgroundColor: isRecording ? '#ef4444' : '#111111',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isRecording
                          ? '0 0 25px rgba(239, 68, 68, 0.4)'
                          : '0 8px 20px rgba(17, 17, 17, 0.15)',
                        transition: 'all 200ms ease',
                        cursor: 'pointer',
                      }}
                      title={isRecording ? 'Stop recording' : 'Start voice recording'}
                    >
                      {isRecording ? <Square size={28} /> : <Mic size={32} />}
                    </button>
                  </div>

                  {isRecording ? (
                    <div>
                      <div
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: '#ef4444',
                          marginBottom: '8px',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {formatTime(recordingDuration)}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
                        Listening... Click to stop recording
                      </div>

                      {/* Real-time reactive waveform canvas */}
                      <canvas
                        ref={canvasRef}
                        width={280}
                        height={40}
                        style={{
                          display: 'block',
                          margin: '0 auto',
                          borderRadius: '8px',
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#111111',
                          marginBottom: '4px',
                        }}
                      >
                        Tap the microphone to speak
                      </div>
                      <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                        Speak naturally for 3 to 10 seconds for clearest signal analysis
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Recording Completed Preview Controls */
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      color: '#15803d',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      marginBottom: '18px',
                    }}
                  >
                    <span>Recording ready ({formatTime(recordingDuration || 4)})</span>
                  </div>

                  {/* Play / Pause / Re-record / Delete Controls */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '14px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={togglePlayAudio}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        borderRadius: '12px',
                        backgroundColor: '#111111',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      <span>{isPlaying ? 'Pause' : 'Play Preview'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDeleteAudio}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        color: '#64748b',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      <Trash2 size={16} />
                      <span>Delete / Re-record</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* UPLOAD AUDIO MODE */}
          {inputMode === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={handleUploadFile}
              />

              {!uploadedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #e2e8f0',
                    backgroundColor: '#fafafa',
                    borderRadius: '20px',
                    padding: '48px 24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginBottom: '24px',
                    transition: 'all 200ms ease',
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
                      color: '#6366f1',
                      margin: '0 auto 16px auto',
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
                    Click to select audio file or drag & drop
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                    Supports WAV, MP3, M4A, OGG, and WEBM
                  </div>
                </div>
              ) : (
                /* Uploaded File Preview */
                <div
                  style={{
                    backgroundColor: '#fafafa',
                    borderRadius: '18px',
                    border: '1px solid #e2e8f0',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '24px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#111111', marginBottom: '4px' }}>
                      {uploadedFile.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {(uploadedFile.size / 1024).toFixed(1)} KB • Audio
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={togglePlayAudio}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        backgroundColor: '#111111',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                      <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDeleteAudio}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        color: '#64748b',
                        fontSize: '0.85rem',
                      }}
                    >
                      <Trash2 size={15} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Alert */}
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

          {/* Processing or Action Button */}
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
              <span>MirrorMind is listening for emotional patterns...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!audioUrl}
                className="btn-primary"
                style={{
                  padding: '13px 26px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  opacity: !audioUrl ? 0.5 : 1,
                  cursor: !audioUrl ? 'not-allowed' : 'pointer',
                }}
              >
                <span>Reflect on Voice</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
