// C:\Users\himanshu\.gemini\antigravity\scratch\barber-queue-app\src\components\JoinQueueModal.jsx
import React, { useState } from 'react';
import { X, Check, User, AlertCircle, ShieldCheck, Mail } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithRedirect } from 'firebase/auth';

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

  const handleGoogleSignIn = () => {
    setIsSigningIn(true);
    setStep('google-chooser');
  };

  const handleSelectGoogleAccount = (email) => {
    setStep('google-loading');
    setTimeout(() => {
      setIsSigningIn(false);
      completeSubmission(email);
    }, 1500);
  };

  const handleSimulatedSignIn = (e) => {
    e.preventDefault();
    if (!simulatedEmail.trim() || !simulatedEmail.includes('@')) {
      setError('Please enter a valid Google Email Address.');
      return;
    }
    setError('');
    handleSelectGoogleAccount(simulatedEmail.trim());
  };

  const handleClose = () => {
    setName('');
    setPreferredBarberId('any');
    setCost(0);
    setError('');
    setStep('form');
    setGoogleUser(null);
    setSimulatedEmail('');
    setIsSigningIn(false);
    onClose();
  };

  const generatedGoogleEmail = name.trim() 
    ? `${name.trim().toLowerCase().replace(/\s+/g, '.')}@gmail.com` 
    : 'client@gmail.com';

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* iOS-Style Bottom Sheet Drag Handle */}
        <div className="bottom-sheet-handle" />

        <div className="modal-header" style={{ marginBottom: '16px' }}>
          <h2 className="modal-title" style={{ fontSize: '20px' }}>
            {step === 'form' ? 'Add Walk-In Client' : step === 'google-loading' ? 'Verifying Identity...' : 'Google Authorization'}
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

        {step === 'form' && (
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
        )}

        {step === 'google-auth' && (
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

            <button
              type="button"
              onClick={handleGoogleSignIn}
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
              <span>Authorize with Google ID</span>
            </button>
          </div>
        )}

        {step === 'google-chooser' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'slideInUp 0.3s ease-out' }}>
            <div style={{ textAlign: 'center', margin: '4px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.63-1.07-1.39-1.19-2.22z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>Choose an account</h3>
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>to continue to TrimTime Waitlist</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', overflow: 'hidden' }}>
              {/* Primary User Account Option */}
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount(generatedGoogleEmail)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  borderBottom: '1px solid #e5e7eb',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--color-gold)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px'
                }}>
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{name}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>{generatedGoogleEmail}</div>
                </div>
              </button>

              {/* Default Mock Admin Account Option */}
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('guest.user@gmail.com')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  borderBottom: '1px solid #e5e7eb',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#6b7280',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px'
                }}>
                  G
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>TrimTime Guest</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>guest.user@gmail.com</div>
                </div>
              </button>

              {/* Custom Input selector */}
              <button
                type="button"
                onClick={() => setStep('google-input')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#e5e7eb',
                  color: '#4b5563',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px'
                }}>
                  +
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>
                  Use another Google Account
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 'google-input' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'slideInUp 0.3s ease-out' }}>
            <div style={{ textAlign: 'center', margin: '4px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.63-1.07-1.39-1.19-2.22z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>Sign in</h3>
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>with your Google Account to continue</p>
            </div>

            <form onSubmit={handleSimulatedSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    className="form-input"
                    type="email"
                    style={{ paddingLeft: '38px', paddingRight: '12px', fontSize: '14px', width: '100%', height: '40px', background: '#fff', border: '1px solid #d1d5db', color: '#1f2937' }}
                    placeholder="Email or phone"
                    value={simulatedEmail}
                    onChange={(e) => setSimulatedEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setStep('google-chooser')}
                  style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Back to Selector
                </button>
                
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ height: '36px', padding: '0 18px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 600 }}
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'google-loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0', gap: '16px', animation: 'fadeIn 0.3s ease-out' }}>
            {/* Google Logo / Spinner wrapper */}
            <div style={{ position: 'relative', width: '56px', height: '56px' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #1a73e8',
                animation: 'spin 1s linear infinite'
              }} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.63-1.07-1.39-1.19-2.22z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Signing in with Google...</div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Verifying security credentials</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
