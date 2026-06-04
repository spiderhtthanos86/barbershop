// C:\Users\himanshu\.gemini\antigravity\scratch\barber-queue-app\src\components\JoinQueueModal.jsx
import React, { useState } from 'react';
import { X, Check, User, AlertCircle } from 'lucide-react';

export default function JoinQueueModal({
  isOpen,
  onClose,
  barbers,
  queue = [],
  onJoinQueue
}) {
  const [name, setName] = useState('');
  const [preferredBarberId, setPreferredBarberId] = useState('any');
  const [cost, setCost] = useState(0); // Cost field default to 0
  const [error, setError] = useState('');

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
    
    const preferredBarberName = preferredBarberId === 'any' 
      ? 'Next Available' 
      : barbers.find(b => b.id === preferredBarberId)?.name || 'Next Available';

    onJoinQueue({
      name: name.trim(),
      preferredBarberId,
      preferredBarberName,
      cost: Number(cost) || 0 // Parse as number, fallback to 0
    });

    // Reset form
    setName('');
    setPreferredBarberId('any');
    setCost(0);
    setError('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setPreferredBarberId('any');
    setCost(0);
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* iOS-Style Bottom Sheet Drag Handle */}
        <div className="bottom-sheet-handle" />

        <div className="modal-header" style={{ marginBottom: '16px' }}>
          <h2 className="modal-title" style={{ fontSize: '20px' }}>Add Walk-In Client</h2>
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
      </div>
    </div>
  );
}
