import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('visible'), 100);
    const t2 = setTimeout(() => setPhase('exit'), 2600);
    const t3 = setTimeout(() => onFinish(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div className={`splash-screen splash-${phase}`}>
      {/* Shop front photo as full background */}
      <div className="splash-bg">
        <img src="/shop-front.jpg" alt="" className="splash-bg-img" />
        <div className="splash-bg-overlay" />
      </div>

      {/* Content */}
      <div className="splash-content">
        {/* Realistic scissors animation */}
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
          {/* Hair strands falling */}
          <div className="hair-strands">
            <div className="strand s1" />
            <div className="strand s2" />
            <div className="strand s3" />
            <div className="strand s4" />
            <div className="strand s5" />
          </div>
        </div>

        {/* Salon name */}
        <div className="splash-brand">
          <div className="splash-za-badge">ZA</div>
          <h1 className="splash-name">ZONE A</h1>
          <div className="splash-divider-row">
            <span className="splash-line" />
            <span className="splash-label">UNISEX SALON</span>
            <span className="splash-line" />
          </div>
        </div>

        {/* Address */}
        <div className="splash-info">
          <p className="splash-addr">60 Ft. Road, Anna Chauraha, Chishti Nagar, Kanpur</p>
          <p className="splash-phone">+91 8707271206 · 9807614216</p>
        </div>
      </div>
    </div>
  );
}
