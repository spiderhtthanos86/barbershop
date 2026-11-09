import React from 'react';
import { Shield, Volume2, VolumeX, PlusCircle, LogOut, Lock, ArrowLeft, BookOpen } from 'lucide-react';

export default function Header({
  soundEnabled,
  setSoundEnabled,
  onOpenJoinModal,
  isShopOpen,
  currentView,
  onPortalClick,
  onLogout,
  allowCustomerJoin,
  onBackToLanding
}) {
  return (
    <header className="glass-panel header-wrapper">
      <div className="header-logo-section">
        {/* Zone A — ZA Monogram Logo */}
        <div className="za-logo-mark" aria-hidden="true">
          <span className="za-logo-z">Z</span>
          <span className="za-logo-a">A</span>
        </div>
        <div className="header-title-area">
          <h1 className="header-brand-name">Zone A <span className="header-brand-sub">Unisex Salon</span></h1>
        </div>
      </div>

      <div className="header-actions">
        {/* Shop status badge */}
        {currentView !== 'login' && (
          <div className="shop-status-badge">
            <div
              className={`status-dot status-dot-sm ${isShopOpen ? 'active' : 'break'}`}
            />
            <span className={`shop-status-text ${isShopOpen ? 'open' : 'paused'}`}>
              {isShopOpen ? 'SALON OPEN' : 'PAUSED'}
            </span>
          </div>
        )}

        {/* Audio Toggle */}
        <button
          className="icon-btn"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
          aria-label="Toggle sound effects"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* Back to Home */}
        {(currentView === 'customer' || currentView === 'owner') && onBackToLanding && (
          <button
            className="admin-toggle-btn"
            onClick={onBackToLanding}
            title="Back to Home"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </button>
        )}

        {/* Staff Portal */}
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

        {/* Customer Self-Join */}
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

        {/* Owner View */}
        {currentView === 'owner' && (
          <div className="header-actions">
            <button className="btn-primary" onClick={onOpenJoinModal} title="Add a walk-in customer">
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
