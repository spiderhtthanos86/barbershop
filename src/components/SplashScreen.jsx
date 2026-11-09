import React, { useState } from 'react';

export default function SplashScreen({ onFinish }) {
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(() => onFinish(), 500);
  };

  return (
    <div className={`splash-screen ${exiting ? 'splash-exit' : 'splash-visible'}`}>
      {/* Clear shop front photo — NO heavy darkening */}
      <div className="splash-bg">
        <img src="/shop-front.jpg" alt="Zone A Unisex Salon" className="splash-bg-img" />
        <div className="splash-bg-overlay" />
      </div>

      {/* Content sits at bottom over the photo */}
      <div className="splash-content">
        {/* Scissors animation — loops forever */}
        <div className="scissors-container">
          <div className="scissor-blade blade-top">
            <div className="blade-body" />
            <div className="blade-handle" />
          </div>
          <div className="scissor-blade blade-bottom">
            <div className="blade-body" />
            <div className="blade-handle" />
          </div>
          <div className="scissor-pivot" />
          <div className="hair-strands">
            <div className="strand s1" />
            <div className="strand s2" />
            <div className="strand s3" />
            <div className="strand s4" />
            <div className="strand s5" />
          </div>
        </div>

        {/* Brand */}
        <div className="splash-brand">
          <div className="splash-za-badge">ZA</div>
          <h1 className="splash-name">ZONE A</h1>
          <div className="splash-divider-row">
            <span className="splash-line" />
            <span className="splash-label">UNISEX SALON</span>
            <span className="splash-line" />
          </div>
          <p className="splash-tags">HAIR &ensp;·&ensp; BEAUTY &ensp;·&ensp; MAKEOVER</p>
        </div>

        {/* Enter Shop button */}
        <button className="splash-enter-btn" onClick={handleEnter}>
          <span>Enter Shop</span>
          <span className="splash-enter-arrow">→</span>
        </button>
      </div>
    </div>
  );
}
