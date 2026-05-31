// C:\Users\himanshu\.gemini\antigravity\scratch\barber-queue-app\src\components\Header.jsx
import React from 'react';
import { Shield, Volume2, VolumeX, PlusCircle, LogOut, Lock } from 'lucide-react';

export default function Header({
  soundEnabled,
  setSoundEnabled,
  onOpenJoinModal,
  isShopOpen,
  currentView,
  onPortalClick,
  onLogout
}) {
  return (
    <header className="glass-panel header-wrapper">
      <div className="header-logo-section">
        {/* Visual spinning barber pole */}
        <div className="barber-pole-icon" />
        <div className="header-title-area">
          <span>Barber Waiting System</span>
          <h1>TrimTime</h1>
        </div>
      </div>

      <div className="header-actions">
        {/* Shop status badge - Only visible if not in login view */}
        {currentView !== 'login' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '12px' }}>
            <div 
              className={`status-dot ${isShopOpen ? 'active' : 'break'}`}
              style={{ position: 'relative', display: 'inline-block', width: '10px', height: '10px' }} 
            />
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', color: isShopOpen ? 'var(--color-accent-green)' : 'var(--color-accent-amber)' }}>
              {isShopOpen ? 'SHOP OPEN' : 'PAUSED'}
            </span>
          </div>
        )}

        {/* Audio Toggle Button */}
        <button 
          className="icon-btn" 
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
          aria-label="Toggle sound effects"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* Staff Portal login link */}
        {currentView === 'customer' && (
          <button 
            className="admin-toggle-btn"
            onClick={onPortalClick}
            title="Open Staff Owner Login"
          >
            <Lock size={14} />
            <span>Staff Portal</span>
          </button>
        )}

        {/* Owner View Mode Status & Actions */}
        {currentView === 'owner' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Add Walk-In Customer (Only available to Shop Owner in Owner View!) */}
            <button className="btn-primary" onClick={onOpenJoinModal} title="Add a walk-in customer to the waitlist">
              <PlusCircle size={18} />
              <span>Add Walk-In</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(197, 168, 128, 0.1)',
              color: 'var(--color-gold)',
              padding: '6px 14px',
              borderRadius: '50px',
              fontSize: '12px',
              fontWeight: 700,
              border: '1px solid var(--border-gold)',
              boxShadow: 'var(--glow-gold)'
            }}>
              <Shield size={12} />
              <span>Owner Mode</span>
            </div>
            
            <button 
              className="admin-toggle-btn"
              onClick={onLogout}
              title="Logout from Owner Portal"
              style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--color-accent-red)' }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
