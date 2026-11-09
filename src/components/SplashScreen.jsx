import React, { useState } from 'react';

export default function SplashScreen({ onFinish }) {
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(() => onFinish(), 600);
  };

  return (
    <div className={`splash-screen ${exiting ? 'splash-exit' : 'splash-visible'}`}>
      {/* Clear shop photo background */}
      <div className="splash-bg">
        <img src="/shop-front.jpg" alt="Zone A Unisex Salon" className="splash-bg-img" />
        <div className="splash-bg-overlay" />
      </div>

      {/* Floating gold particles */}
      <div className="splash-particles" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`sp sp-${i}`} />
        ))}
      </div>

      {/* Bottom content panel */}
      <div className="splash-content">
        {/* Scissors animation */}
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
            <div className="strand s6" />
          </div>
        </div>

        {/* Brand */}
        <div className="splash-brand">
          <div className="splash-za-badge anim-pop">ZA</div>
          <h1 className="splash-name anim-slide-up">ZONE A</h1>
          <div className="splash-divider-row anim-slide-up-d1">
            <span className="splash-line anim-grow-left" />
            <span className="splash-label">UNISEX SALON</span>
            <span className="splash-line anim-grow-right" />
          </div>
          <p className="splash-tags anim-slide-up-d2">HAIR &ensp;·&ensp; BEAUTY &ensp;·&ensp; MAKEOVER</p>
        </div>

        {/* Enter button */}
        <button className="splash-enter-btn anim-slide-up-d3" onClick={handleEnter}>
          <span>Enter Shop</span>
          <span className="splash-enter-arrow">→</span>
        </button>
      </div>
    </div>
  );
}
