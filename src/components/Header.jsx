import React from 'react';
import { Shield, Volume2, VolumeX, PlusCircle, LogOut, Lock, ArrowLeft, Scissors } from 'lucide-react';

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

      {/* ── ROW 1: Brand identity + sound toggle always on one line ── */}
      <div className="header-row-top">
        <div className="header-logo-section">
          <div className="za-logo-mark" aria-hidden="true">
            <span className="za-logo-z">Z</span>
            <span className="za-logo-a">A</span>
          </div>
          <div className="header-title-area">
            <h1 className="header-brand-name">Zone A <span className="header-brand-sub">Unisex Salon</span></h1>
          </div>
        </div>

        {/* Sound toggle — always visible, top-right */}
        <button
          className="icon-btn header-sound-btn"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
          aria-label="Toggle sound effects"
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      {/* ── ROW 2: Status + nav actions (customer view) ── */}
      {currentView === 'customer' && (
        <div className="header-row-bottom">
          {/* Salon Open/Closed status */}
          <div className="shop-status-badge">
            <div className={`status-dot status-dot-sm ${isShopOpen ? 'active' : 'break'}`} />
            <span className={`shop-status-text ${isShopOpen ? 'open' : 'paused'}`}>
              {isShopOpen ? 'OPEN' : 'PAUSED'}
            </span>
          </div>

          <div className="header-nav-group">
            <button className="header-nav-btn" onClick={onBackToLanding} title="Back to Home">
              <ArrowLeft size={13} />
              <span>Home</span>
            </button>

            <button className="header-nav-btn" onClick={onPortalClick} title="Staff Login">
              <Lock size={13} />
              <span>Staff</span>
            </button>
          </div>
        </div>
      )}

      {/* ── ROW 2: Status + nav actions (login view) ── */}
      {currentView === 'login' && (
        <div className="header-row-bottom">
          <div className="shop-status-badge">
            <div className={`status-dot status-dot-sm ${isShopOpen ? 'active' : 'break'}`} />
            <span className={`shop-status-text ${isShopOpen ? 'open' : 'paused'}`}>
              {isShopOpen ? 'OPEN' : 'PAUSED'}
            </span>
          </div>
        </div>
      )}

      {/* ── ROW 2: Owner controls ── */}
      {currentView === 'owner' && (
        <div className="header-row-bottom">
          <div className="shop-status-badge">
            <div className={`status-dot status-dot-sm ${isShopOpen ? 'active' : 'break'}`} />
            <span className={`shop-status-text ${isShopOpen ? 'open' : 'paused'}`}>
              {isShopOpen ? 'OPEN' : 'PAUSED'}
            </span>
          </div>

          <div className="header-nav-group">
            <button className="btn-primary header-walkin-btn" onClick={onOpenJoinModal} title="Add a walk-in customer">
              <PlusCircle size={15} />
              <span>Add Walk-In</span>
            </button>

            <div className="owner-mode-badge">
              <Shield size={11} />
              <span>Owner</span>
            </div>

            <button className="header-nav-btn header-logout-btn" onClick={onLogout} title="Logout">
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
}