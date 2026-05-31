// C:\Users\himanshu\.gemini\antigravity\scratch\barber-queue-app\src\components\LoginScreen.jsx
import React, { useState } from 'react';
import { Lock, Mail, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginScreen({ onLoginSuccess, onBackToCustomer }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Predefined login verification
    if (email.trim().toLowerCase() === 'shop@gmail.com' && password === '123434') {
      onLoginSuccess();
    } else {
      setError('Invalid email or passcode. Please check credentials and try again.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      padding: '8px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '32px 20px',
        animation: 'slideInUp 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: 'var(--shadow-md), var(--glow-gold)'
      }}>
        {/* Back Button */}
        <button
          onClick={onBackToCustomer}
          className="btn-secondary"
          style={{
            padding: '6px 12px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '20px'
          }}
        >
          <ArrowLeft size={12} />
          <span>Back to Waitlist</span>
        </button>

        {/* Logo and Greeting */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-round)',
            background: 'rgba(197, 168, 128, 0.1)',
            border: '1.5px solid var(--color-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: 'var(--glow-gold)'
          }}>
            <Lock size={20} className="text-gold" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)' }}>Owner Portal</h2>
          <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Please authenticate to access shop administration.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--color-accent-red)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '11px',
            lineHeight: '1.4',
            marginBottom: '16px',
            animation: 'pulseGlow 2s infinite ease-in-out'
          }}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email Input - 16px prevents iOS zoom */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="login-email" style={{ fontSize: '11px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                id="login-email"
                className="form-input"
                type="email"
                style={{ paddingLeft: '38px', width: '100%', fontSize: '16px' }}
                placeholder="e.g. shop@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input - 16px prevents iOS zoom */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="login-pass" style={{ fontSize: '11px' }}>Passcode</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                id="login-pass"
                className="form-input"
                type="password"
                style={{ paddingLeft: '38px', width: '100%', fontSize: '16px' }}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
              fontSize: '13px',
              marginTop: '8px'
            }}
          >
            <ShieldCheck size={16} />
            <span>Authenticate Portal</span>
          </button>
        </form>
      </div>
    </div>
  );
}
