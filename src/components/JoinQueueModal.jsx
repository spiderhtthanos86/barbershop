import React, { useState } from 'react';
import { X, Check, User, AlertCircle, ShieldCheck } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';

export default function JoinQueueModal({
  isOpen,
  onClose,
  barbers,
  queue = [],
  onJoinQueue,
  requireGoogleAuth = false
}) {
  const [name, setName] = useState('');
  const [preferredBarberId, setPreferredBarberId] = useState('any');
  const [cost, setCost] = useState(0);
  const [error, setError] = useState('');
  const [step, setStep] = useState('form'); // 'form' or 'google-auth'
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');

    const normalizedName = name.trim().toLowerCase();
    
    // Check seated customers
    const isSeated = barbers.some(b => b.customer?.name?.trim().toLowerCase() === normalizedName);
    
    // Check queued customers
    const isQueued = queue.some(c => c.name?.trim().toLowerCase() === normalizedName);
    
    if (isSeated || isQueued) {
      setError('Enter another name — this name is already present.');
      return;
    }

    if (requireGoogleAuth) {
      setStep('google-auth');
      return;
    }

    // No auth required — submit directly
    completeSubmission('Owner');
  };

  const completeSubmission = (email) => {
    const preferredBarberName = preferredBarberId === 'any' 
      ? 'Next Available' 
      : barbers.find(b => b.id === preferredBarberId)?.name || 'Next Available';

    onJoinQueue({
      name: name.trim(),
      preferredBarberId,
      preferredBarberName,
      cost: Number(cost) || 0,
      authorizedBy: email
    });

    // Reset form
    setName('');
    setPreferredBarberId('any');
    setCost(0);
    setError('');
    setStep('form');
    setIsSigningIn(false);
    onClose();
  };

  // Build the pending data object for localStorage (used by redirect fallback)
  const buildPendingData = () => {
    const preferredBarberName = preferredBarberId === 'any' 
      ? 'Next Available' 
      : barbers.find(b => b.id === preferredBarberId)?.name || 'Next Available';

    return {
      name: name.trim(),
      preferredBarberId,
      preferredBarberName,
      cost: Number(cost) || 0
    };
  };

  // REAL Google Sign-In: Try popup first, auto-fallback to redirect if blocked
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError('');

    try {
      // Attempt 1: Popup (best UX — no page reload, form state preserved)
      const result = await signInWithPopup(auth, googleProvider);
      if (result && result.user) {
        completeSubmission(result.user.email);
      }
    } catch (err) {
      console.warn("Popup sign-in failed, checking error:", err.code);

      if (err.code === 'auth/popup-blocked' || err.code === 'auth/unauthorized-domain') {
        // Popup was blocked by browser — seamlessly fall back to redirect
        // Save form data to localStorage so we can complete after redirect
        console.log("Popup blocked — falling back to redirect sign-in...");
        localStorage.setItem('trimtime_pending_join', JSON.stringify(buildPendingData()));
        
        try {
          await signInWithRedirect(auth, googleProvider);
          // Page navigates away to Google... user will come back after signing in
        } catch (redirectErr) {
          console.error("Redirect sign-in also failed:", redirectErr);
          localStorage.removeItem('trimtime_pending_join');
          setError('Google sign-in failed. Please check your internet connection and try again.');
          setIsSigningIn(false);
        }
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('You closed the Google sign-in window. Please try again.');
        setIsSigningIn(false);
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Ignore — user double-clicked
        setIsSigningIn(false);
      } else {
        setError(`Google sign-in failed: ${err.message || 'Unknown error'}`);
        setIsSigningIn(false);
      }
    }
  };

  const handleClose = () => {
    setName('');
    setPreferredBarberId('any');
    setCost(0);
    setError('');
    setStep('form');
    setIsSigningIn(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* iOS-Style Bottom Sheet Drag Handle */}
        <div className="bottom-sheet-handle" />

        <div className="modal-header">
          <h2 className="modal-title">
            {step === 'form' ? 'Add Walk-In Client' : 'Google Verification'}
          </h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="modal-error-alert">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="customer-name">Client Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} className="input-icon-gold" />
                <input
                  id="customer-name"
                  className="form-input input-with-icon"
                  type="text"
                  placeholder="Enter client's name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={25}
                  autoFocus
                />
              </div>
            </div>

            {/* Barber Selector */}
            <div className="form-group">
              <label className="form-label" htmlFor="barber-select">Barber Preference</label>
              <select
                id="barber-select"
                className="form-select"
                style={{ width: '100%', fontSize: '16px' }}
                value={preferredBarberId}
                onChange={(e) => setPreferredBarberId(e.target.value)}
              >
                <option value="any">Next Available Barber</option>
                {barbers.map(barber => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Cost (Rupees) */}
            <div className="form-group">
              <label className="form-label" htmlFor="service-cost">Cutting Cost (₹)</label>
              <div style={{ position: 'relative' }}>
                <span className="currency-prefix">
                  ₹
                </span>
                <input
                  id="service-cost"
                  className="form-input input-with-icon"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Ticket Live Preview Card */}
            {name.trim().length > 0 && (
              <div className="ticket-preview">
                <div className="ticket-header">
                  VIRTUAL WAIT TICKET
                </div>
                <div className="ticket-summary-label">CLIENT NAME</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'Outfit' }}>
                  {name}
                </div>
                <div className="ticket-number">
                  QUEUED
                </div>
                <div className="ticket-details">
                  <div>
                    <div className="ticket-summary-label">ASSIGNED LINE</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '12px', marginTop: '2px' }}>
                      {preferredBarberId === 'any' ? 'Next Available' : barbers.find(b => b.id === preferredBarberId)?.name.split(' ')[0]}
                    </div>
                  </div>
                  <div>
                    <div className="ticket-summary-label">SERVICE COST</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-accent-green)', fontSize: '12px', marginTop: '2px' }}>
                      ₹ {cost || 0}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button 
              type="submit" 
              className="btn-primary modal-submit-btn" 
            >
              <Check size={18} />
              <span>Confirm & Add to Line</span>
            </button>
          </form>
        )}

        {step === 'google-auth' && (
          <div className="google-auth-wrapper">
            <div className="google-auth-center">
              <div className="google-icon-box">
                <ShieldCheck size={20} className="text-gold" />
              </div>
              <h3 className="google-auth-heading">Google Verification Required</h3>
              <p className="google-auth-desc">
                Sign in with your real Google account to verify your identity and join the queue.
              </p>
            </div>

            {/* Ticket summary before auth */}
            <div className="ticket-summary-card">
              <div>
                <div className="ticket-summary-label">Client</div>
                <div className="ticket-summary-name">{name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="ticket-summary-label">Cost</div>
                <div className="ticket-summary-cost">₹{cost || 0}</div>
              </div>
            </div>

            {/* Real Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="google-signin-btn"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.8 2.7l2.8 2.17c1.63-1.51 2.8-3.73 2.8-6.5z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.8-2.17c-.78.52-1.78.83-2.96.83-2.28 0-4.21-1.54-4.9-3.61L1.4 12.02C2.88 15 6 18 9 18z"/>
                <path fill="#FBBC05" d="M4.1 10.85c-.17-.52-.27-1.07-.27-1.65s.1-1.13.27-1.65L1.4 5.37C.5 7.15 0 9.13 0 11.2s.5 4.05 1.4 5.83l2.7-2.18z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.1C13.46.72 11.42 0 9 0 6 0 2.88 3 1.4 5.98l2.7 2.18C4.79 5.12 6.72 3.58 9 3.58z"/>
              </svg>
              <span>{isSigningIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
            </button>

            <p className="google-auth-notice">
              You'll be securely signed in via your Google account. If a popup doesn't open, you'll be redirected to Google's login page automatically.
            </p>

            {/* Back button */}
            <button
              type="button"
              onClick={() => { setStep('form'); setError(''); setIsSigningIn(false); }}
              className="btn-secondary"
              style={{ justifyContent: 'center', fontSize: '12px' }}
            >
              ← Back to Form
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
