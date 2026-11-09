import React from 'react';
import { Scissors, BookOpen, MapPin, Phone } from 'lucide-react';

export default function LandingPage({ onRateCard, onBookCut, onStaffLogin }) {
  return (
    <div className="landing-page">
      {/* Same shop image background */}
      <div className="landing-bg">
        <img src="/shop-front.jpg" alt="" className="landing-bg-img" />
        <div className="landing-bg-overlay" />
      </div>

      {/* Floating particles */}
      <div className="splash-particles" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`sp sp-${i}`} />
        ))}
      </div>

      <div className="landing-content">
        {/* Brand */}
        <div className="landing-brand-section">
          <div className="landing-za-badge anim-pop">ZA</div>
          <h1 className="landing-brand-title anim-slide-up">ZONE A</h1>
          <div className="landing-divider-row anim-slide-up-d1">
            <span className="landing-hr anim-grow-left" />
            <span className="landing-brand-label">UNISEX SALON</span>
            <span className="landing-hr anim-grow-right" />
          </div>
          <p className="landing-brand-tags anim-slide-up-d2">HAIR &ensp;·&ensp; BEAUTY &ensp;·&ensp; MAKEOVER</p>
        </div>

        {/* Contact */}
        <div className="landing-contact anim-fade-in-d2">
          <div className="landing-contact-row">
            <MapPin size={14} />
            <span>60 Ft. Road, Anna Chauraha, Chishti Nagar, Kanpur</span>
          </div>
          <div className="landing-contact-row">
            <Phone size={14} />
            <span>+91 8707271206 &nbsp;/&nbsp; 9807614216</span>
          </div>
        </div>

        {/* Action cards — staggered animation */}
        <div className="landing-actions">
          <button className="landing-action-card anim-card-in-1" onClick={onRateCard}>
            <div className="landing-action-icon">
              <BookOpen size={26} strokeWidth={1.5} />
            </div>
            <div className="landing-action-text">
              <span className="landing-action-title">Our Services</span>
              <span className="landing-action-desc">View rate card & prices</span>
            </div>
            <span className="landing-action-arrow">›</span>
          </button>

          <button className="landing-action-card landing-action-primary anim-card-in-2" onClick={onBookCut}>
            <div className="landing-action-icon">
              <Scissors size={26} strokeWidth={1.5} />
            </div>
            <div className="landing-action-text">
              <span className="landing-action-title">Book Your Turn</span>
              <span className="landing-action-desc">Join live queue from home</span>
            </div>
            <span className="landing-action-arrow">›</span>
          </button>
        </div>

        <button className="landing-staff-link anim-fade-in-d3" onClick={onStaffLogin}>
          Staff Login →
        </button>
      </div>
    </div>
  );
}
