import React from 'react';
import { Scissors, BookOpen, MapPin, Phone } from 'lucide-react';

export default function LandingPage({ onRateCard, onBookCut, onStaffLogin }) {
  return (
    <div className="landing-page">
      {/* Subtle shop image background */}
      <div className="landing-bg">
        <img src="/shop-front.jpg" alt="" className="landing-bg-img" />
        <div className="landing-bg-overlay" />
      </div>

      <div className="landing-content">
        {/* Top branding */}
        <div className="landing-brand-section">
          <div className="landing-za-badge">ZA</div>
          <h1 className="landing-brand-title">ZONE A</h1>
          <div className="landing-divider-row">
            <span className="landing-hr" />
            <span className="landing-brand-label">UNISEX SALON</span>
            <span className="landing-hr" />
          </div>
          <p className="landing-brand-tags">HAIR &ensp;·&ensp; BEAUTY &ensp;·&ensp; MAKEOVER</p>
        </div>

        {/* Contact info */}
        <div className="landing-contact">
          <div className="landing-contact-row">
            <MapPin size={14} />
            <span>60 Ft. Road, Anna Chauraha, Chishti Nagar, Kanpur</span>
          </div>
          <div className="landing-contact-row">
            <Phone size={14} />
            <span>+91 8707271206 &nbsp;/&nbsp; 9807614216</span>
          </div>
        </div>

        {/* Two action cards */}
        <div className="landing-actions">
          <button className="landing-action-card" onClick={onRateCard}>
            <div className="landing-action-icon">
              <BookOpen size={28} strokeWidth={1.5} />
            </div>
            <div className="landing-action-text">
              <span className="landing-action-title">Our Services</span>
              <span className="landing-action-desc">View rate card & prices</span>
            </div>
            <span className="landing-action-arrow">›</span>
          </button>

          <button className="landing-action-card landing-action-primary" onClick={onBookCut}>
            <div className="landing-action-icon">
              <Scissors size={28} strokeWidth={1.5} />
            </div>
            <div className="landing-action-text">
              <span className="landing-action-title">Book Your Turn</span>
              <span className="landing-action-desc">Join live queue from home</span>
            </div>
            <span className="landing-action-arrow">›</span>
          </button>
        </div>

        {/* Staff login — discreet */}
        <button className="landing-staff-link" onClick={onStaffLogin}>
          Staff Login →
        </button>
      </div>
    </div>
  );
}
