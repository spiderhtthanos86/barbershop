import React from 'react';
import { Shield, Volume2, VolumeX, PlusCircle, LogOut, Lock } from 'lucide-react';

export default function Header({
  soundEnabled,
  setSoundEnabled,
  onOpenJoinModal,
  isShopOpen,
  currentView,
  onPortalClick,
  onLogout,
  allowCustomerJoin
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
          <div className="shop-status-badge">
            <div 
              className={`status-dot status-dot-sm ${isShopOpen ? 'active' : 'break'}`}
            />
            <span className={`shop-status-text ${isShopOpen ? 'open' : 'paused'}`}>
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

        {/* Customer Self-Join Button (Only visible when allowed by Owner!) */}
        {currentView === 'customer' && allowCustomerJoin && (
          <button 
            className="btn-primary" 
            onClick={onOpenJoinModal} 
            title="Join the waiting queue"
          >
            <PlusCircle size={18} />
            <span>Join Waitlist</span>
          </button>
        )}

        {/* Owner View Mode Status & Actions */}
        {currentView === 'owner' && (
          <div className="header-actions">
            {/* Add Walk-In Customer (Only available to Shop Owner in Owner View!) */}
            <button className="btn-primary" onClick={onOpenJoinModal} title="Add a walk-in customer to the waitlist">
              <PlusCircle size={18} />
              <span>Add Walk-In</span>
            </button>

            <div className="owner-mode-badge">
              <Shield size={12} />
              <span>Owner Mode</span>
            </div>
            
            <button 
              className="admin-toggle-btn logout-btn"
              onClick={onLogout}
              title="Logout from Owner Portal"
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
