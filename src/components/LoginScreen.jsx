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
    <div className="login-page-wrapper">
      <div className="glass-panel login-card">
        {/* Back Button */}
        <button
          onClick={onBackToCustomer}
          className="btn-secondary login-back-btn"
        >
          <ArrowLeft size={12} />
          <span>Back to Waitlist</span>
        </button>

        {/* Logo and Greeting */}
        <div className="login-greeting-box">
          <div className="login-icon-box">
            <Lock size={20} className="text-gold" />
          </div>
          <h2 className="login-title">Owner Portal</h2>
          <p className="login-subtitle">
            Please authenticate to access shop administration.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="login-error-alert">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} className="login-input-icon" />
              <input
                id="login-email"
                className="form-input login-input-field"
                type="email"
                placeholder="e.g. shop@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-pass">Passcode</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} className="login-input-icon" />
              <input
                id="login-pass"
                className="form-input login-input-field"
                type="password"
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
            className="btn-primary login-submit-btn"
          >
            <ShieldCheck size={16} />
            <span>Authenticate Portal</span>
          </button>
        </form>
      </div>
    </div>
  );
}
