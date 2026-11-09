import React from 'react';
import { Scissors, BookOpen, MapPin, Phone } from 'lucide-react';

export default function LandingPage({ onRateCard, onBookCut, onStaffLogin }) {
  return (
    <div className="landing-page">
      {/* Background shimmer */}
      <div className="landing-bg-shimmer" />

      {/* Top — Circular Logo Badge */}
      <div className="landing-logo-wrap">
        <div className="landing-logo-circle">
          <div className="landing-ring-outer" />
          <div className="landing-ring-inner" />
          <div className="landing-za-text">ZA</div>
          <div className="landing-brand-block">
            <div className="landing-zone-a">ZONE A</div>
            <div className="landing-salon-row">
              <span className="landing-dash">—</span>
              <span className="landing-unisex">UNISEX SALON</span>
              <span className="landing-dash">—</span>
            </div>
            <div className="landing-services-tag">HAIR &nbsp;|&nbsp; BEAUTY &nbsp;|&nbsp; MAKEOVER</div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="landing-address-block">
        <div className="landing-addr-row">
          <MapPin size={13} className="landing-addr-icon" />
          <span>60 Ft. Road, Anna Chauraha, Chishti Nagar, Kanpur</span>
        </div>
        <div className="landing-addr-row">
          <Phone size={13} className="landing-addr-icon" />
          <span>+91 8707271206 &nbsp;/&nbsp; 9807614216</span>
        </div>
      </div>

      {/* Gold divider */}
      <div className="landing-divider">
        <span className="landing-divider-diamond">◆</span>
      </div>

      {/* Welcome text */}
      <p className="landing-welcome-text">Welcome! What would you like to do?</p>

      {/* Two main action cards */}
      <div className="landing-cards-row">
        {/* Card 1 — Rate Card */}
        <button className="landing-card landing-card-menu" onClick={onRateCard}>
          <div className="landing-card-icon-wrap">
            <BookOpen size={36} />
          </div>
          <div className="landing-card-label">See Rate Card</div>
          <div className="landing-card-sub">View all services & prices</div>
          <div className="landing-card-arrow">→</div>
        </button>

        {/* Card 2 — Book Your Cut */}
        <button className="landing-card landing-card-book" onClick={onBookCut}>
          <div className="landing-card-icon-wrap">
            <Scissors size={36} />
          </div>
          <div className="landing-card-label">Book Your Cut</div>
          <div className="landing-card-sub">Join live queue from home</div>
          <div className="landing-card-arrow">→</div>
        </button>
      </div>

      {/* Staff portal link — small and discreet at bottom */}
      <button className="landing-staff-btn" onClick={onStaffLogin}>
        Staff Portal
      </button>
    </div>
  );
}
