import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('enter'); // enter → visible → exit

  useEffect(() => {
    // Visible for 2.2 seconds then fade out
    const t1 = setTimeout(() => setPhase('exit'), 2200);
    const t2 = setTimeout(() => onFinish(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onFinish]);

  return (
    <div className={`splash-screen ${phase}`}>
      {/* Gold shimmer particles */}
      <div className="splash-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`splash-particle p${i + 1}`} />
        ))}
      </div>

      {/* Main logo circle — matches Zone A circular badge */}
      <div className="splash-logo-circle">
        {/* Double gold ring */}
        <div className="splash-ring-outer" />
        <div className="splash-ring-inner" />

        {/* ZA monogram */}
        <div className="splash-za-text">ZA</div>

        {/* Brand name below ZA */}
        <div className="splash-brand-block">
          <div className="splash-zone-a">ZONE A</div>
          <div className="splash-salon-row">
            <span className="splash-dash">—</span>
            <span className="splash-unisex">UNISEX SALON</span>
            <span className="splash-dash">—</span>
          </div>
          <div className="splash-services">HAIR &nbsp;|&nbsp; BEAUTY &nbsp;|&nbsp; MAKEOVER</div>
        </div>
      </div>

      {/* Scissors cutting animation */}
      <div className="splash-scissors-wrap">
        <div className="splash-scissors">✂</div>
        <div className="splash-cut-line">
          <div className="splash-cut-progress" />
        </div>
      </div>

      {/* Address */}
      <div className="splash-address-block">
        <div className="splash-address-line">
          📍 60 Ft. Road, Anna Chauraha, Chishti Nagar, Kanpur
        </div>
        <div className="splash-phone-line">
          📞 +91 8707271206 &nbsp;|&nbsp; 9807614216
        </div>
      </div>
    </div>
  );
}
