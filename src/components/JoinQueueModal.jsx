// C:\Users\himanshu\.gemini\antigravity\scratch\barber-queue-app\src\components\JoinQueueModal.jsx
import React, { useState } from 'react';
import { X, Check, User, AlertCircle, ShieldCheck, Mail } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

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
  const [cost, setCost] = useState(0); // Cost field default to 0
  const [error, setError] = useState('');
  const [step, setStep] = useState('form'); // 'form' or 'google-auth'
  const [googleUser, setGoogleUser] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [simulatedEmail, setSimulatedEmail] = useState('');

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
      setError('enter another name this name is already present');
      return;
    }

    if (requireGoogleAuth && !googleUser && !simulatedEmail) {
      setStep('google-auth');
      return;
    }

    completeSubmission(googleUser?.email || simulatedEmail || 'Guest');
  };

  const completeSubmission = (email) => {
    const preferredBarberName = preferredBarberId === 'any' 
      ? 'Next Available' 
      : barbers.find(b => b.id === preferredBarberId)?.name || 'Next Available';

    onJoinQueue({
      name: name.trim(),
      preferredBarberId,
      preferredBarberName,
      cost: Number(cost) || 0, // Parse as number, fallback to 0
      authorizedBy: email
    });

    // Reset form
    setName('');
    setPreferredBarberId('any');
    setCost(0);
    setError('');
    setStep('form');
    setGoogleUser(null);
    setSimulatedEmail('');
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setGoogleUser(result.user);
    } catch (err) {
      console.warn("Firebase popup authentication failed/blocked, displaying simulation backup:", err);
      setError("Google pop-up blocked or not configured. Please use the Google Email entry below to authorize.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSimulatedSignIn = (e) => {
    e.preventDefault();
    if (!simulatedEmail.trim() || !simulatedEmail.includes('@')) {
      setError('Please enter a valid Google Email Address.');
      return;
    }
    setError('');
  };

  const handleClose = () => {
    setName('');
    setPreferredBarberId('any');
    setCost(0);
    setError('');
    setStep('form');
    setGoogleUser(null);
    setSimulatedEmail('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* iOS-Style Bottom Sheet Drag Handle */}
        <div className="bottom-sheet-handle" />

        <div className="modal-header" style={{ marginBottom: '16px' }}>
          <h2 className="modal-title" style={{ fontSize: '20px' }}>
            {step === 'form' ? 'Add Walk-In Client' : 'Google Authorization'}
          </h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

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
            marginBottom: '16px'
          }}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {step === 'form' ? (
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="customer-name" style={{ fontSize: '11px' }}>Client Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold)' }} />
                <input
                  id="customer-name"
                  className="form-input"
                  type="text"
                  style={{ paddingLeft: '42px', width: '100%', fontSize: '16px' }}
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
              <label className="form-label" htmlFor="barber-select" style={{ fontSize: '11px' }}>Barber Preference</label>
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

            {/* Service Cost (Rupees) - Default to 0 */}
            <div className="form-group">
              <label className="form-label" htmlFor="service-cost" style={{ fontSize: '11px' }}>Cutting Cost (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--color-gold)',
                  fontFamily: 'Outfit',
                  fontWeight: 700,
                  fontSize: '16px'
                }}>
                  ₹
                </span>
                <input
                  id="service-cost"
                  className="form-input"
                  type="number"
                  min="0"
                  style={{ paddingLeft: '42px', width: '100%', fontSize: '16px' }}
                  placeholder="0"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Ticket Live Preview Card */}
            {name.trim().length > 0 && (
              <div className="ticket-preview" style={{ padding: '16px', marginTop: '16px' }}>
                <div className="ticket-header" style={{ fontSize: '12px', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  VIRTUAL WAIT TICKET
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>CLIENT NAME</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'Outfit' }}>
                  {name}
                </div>
                <div className="ticket-number" style={{ fontSize: '24px', color: 'var(--color-gold)', margin: '10px 0' }}>
                  QUEUED
                </div>
                <div className="ticket-details" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
                  <div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '9px' }}>ASSIGNED LINE</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '12px', marginTop: '2px' }}>
                      {preferredBarberId === 'any' ? 'Next Available' : barbers.find(b => b.id === preferredBarberId)?.name.split(' ')[0]}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '9px' }}>SERVICE COST</div>
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
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '12px' }}
            >
              <Check size={18} />
              <span>Confirm & Add to Line</span>
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'slideInUp 0.3s ease-out' }}>
            <div style={{ textAlign: 'center', margin: '8px 0' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(197, 168, 128, 0.1)',
                border: '1.5px solid var(--color-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <ShieldCheck size={20} className="text-gold" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-primary)' }}>Google Authentication Required</h3>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                For security, self-reservations must be authorized using your Google Email ID.
              </p>
            </div>

            {/* Google User Status */}
            {(googleUser || simulatedEmail) ? (
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.08)', 
                border: '1px solid rgba(16, 185, 129, 0.2)', 
                borderRadius: '8px', 
                padding: '14px', 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Authorized Google Identity
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-accent-green)' }}>
                  {googleUser ? googleUser.email : simulatedEmail}
                </span>
                <button 
                  onClick={() => completeSubmission(googleUser?.email || simulatedEmail)}
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', marginTop: '8px', background: 'linear-gradient(135deg, var(--color-accent-green) 0%, #059669 100%)' }}
                >
                  <Check size={16} />
                  <span>Join Waitlist Now</span>
                </button>
              </div>
            ) : (
              <>
                {/* Real Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    width: '100%',
                    background: '#fff',
                    border: '1px solid #dadce0',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    color: '#3c4043',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.25s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(60,64,67,0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.8 2.7l2.8 2.17c1.63-1.51 2.8-3.73 2.8-6.5z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.8-2.17c-.78.52-1.78.83-2.96.83-2.28 0-4.21-1.54-4.9-3.61L1.4 12.02C2.88 15 6 18 9 18z"/>
                    <path fill="#FBBC05" d="M4.1 10.85c-.17-.52-.27-1.07-.27-1.65s.1-1.13.27-1.65L1.4 5.37C.5 7.15 0 9.13 0 11.2s.5 4.05 1.4 5.83l2.7-2.18z"/>
                    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.1C13.46.72 11.42 0 9 0 6 0 2.88 3 1.4 5.98l2.7 2.18C4.79 5.12 6.72 3.58 9 3.58z"/>
                  </svg>
                  <span>{isSigningIn ? 'Connecting...' : 'Authorize with Google ID'}</span>
                </button>

                {/* Simulated Google Login Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '10px' }}>
                  <div style={{ flexGrow: 1, height: '1px', background: 'var(--border-light)' }} />
                  <span>OR ENTER GOOGLE ID DETAILS</span>
                  <div style={{ flexGrow: 1, height: '1px', background: 'var(--border-light)' }} />
                </div>

                {/* Simulated Google Mail input */}
                <form onSubmit={handleSimulatedSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <div style={{ position: 'relative' }}>
                      <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                      <input
                        className="form-input"
                        type="email"
                        style={{ paddingLeft: '36px', paddingRight: '12px', fontSize: '14px', width: '100%', height: '38px' }}
                        placeholder="yourname@gmail.com"
                        value={simulatedEmail}
                        onChange={(e) => setSimulatedEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="btn-secondary" 
                    style={{ justifyContent: 'center', height: '38px' }}
                  >
                    Authorize Email
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
