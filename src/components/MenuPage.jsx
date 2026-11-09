import React, { useState } from 'react';
import { ArrowLeft, Scissors, ChevronDown, ChevronUp } from 'lucide-react';

// ── All services extracted from Zone A menu cards ──────────────────────────
const MENU_DATA = [
  {
    id: 'haircut',
    emoji: '✂️',
    title: 'Hair Cutting',
    type: 'simple',
    items: [
      { name: 'Male Any Hair Cut', price: 79 },
      { name: 'Female Any Hair Cut', price: 99 },
      { name: 'Male Hair Wash', price: 50 },
      { name: 'Female Hair Wash', price: 100 },
      { name: 'Male Head Massage', price: 200 },
      { name: 'Female Head Massage', price: 300 },
      { name: 'Body Oil Massage', price: 800 },
    ]
  },
  {
    id: 'threading',
    emoji: '🧵',
    title: 'Threading',
    type: 'simple',
    items: [
      { name: 'Threading', price: 20 },
      { name: 'Forehead', price: 10 },
      { name: 'Upper Lips', price: 10 },
      { name: 'Chin', price: 10 },
      { name: 'Full Face', price: 100 },
      { name: 'Side Lock', price: 50 },
    ]
  },
  {
    id: 'wax',
    emoji: '🕯️',
    title: 'Waxing',
    type: 'dual',
    colHeaders: ['Normal', 'Rica'],
    items: [
      { name: 'Full Arms', normal: 200, rica: 350 },
      { name: 'Under Arms', normal: 50, rica: 80 },
      { name: 'Full Leg', normal: 300, rica: 450 },
      { name: 'Half Leg', normal: 200, rica: 250 },
      { name: 'Chin', normal: 20, rica: 30 },
      { name: 'Upper Lips', normal: 20, rica: 30 },
      { name: 'Side Lock', normal: 40, rica: 70 },
      { name: 'Full Face', normal: 150, rica: 200 },
      { name: 'Back', normal: 200, rica: 250 },
      { name: 'Full Back', normal: 350, rica: 500 },
      { name: 'Full Body', normal: 1500, rica: 1800 },
    ]
  },
  {
    id: 'dtan',
    emoji: '✨',
    title: 'D~Tan',
    type: 'simple',
    items: [
      { name: 'Normal', price: 200 },
      { name: 'Ozon', price: 250 },
      { name: 'Sara', price: 300 },
      { name: 'O3+ Whitting', price: 300 },
      { name: 'Scrub D-Tan', price: 300 },
    ]
  },
  {
    id: 'bleach',
    emoji: '💎',
    title: 'Bleach',
    type: 'simple',
    items: [
      { name: 'Fruit Bleach', price: 150 },
      { name: 'Diamond Bleach', price: 200 },
      { name: 'Gold Bleach', price: 200 },
      { name: 'Oxy Bleach', price: 250 },
      { name: 'Ozon Bleach', price: 300 },
      { name: 'O3+ Bleach', price: 300 },
      { name: 'Back Bleach', price: 400 },
      { name: 'Hand Bleach', price: 400 },
      { name: 'Body Bleach', price: 1000 },
    ]
  },
  {
    id: 'cleanup',
    emoji: '🌿',
    title: 'Cleanup',
    type: 'simple',
    items: [
      { name: 'Fruit Cleanup', price: 300 },
      { name: 'Aroma', price: 400 },
      { name: 'VLCC', price: 400 },
      { name: 'Sara', price: 400 },
      { name: 'D-Tan', price: 400 },
      { name: 'Ozon', price: 400 },
      { name: 'Rich Feel', price: 500 },
      { name: 'Red Wine', price: 500 },
      { name: 'Vitamin C', price: 500 },
      { name: 'Shahnaaz', price: 600 },
      { name: 'Lotus', price: 600 },
      { name: 'Lotus 4 Layer', price: 600 },
      { name: 'O3+ Whitting', price: 800 },
      { name: 'O3+ Diamond', price: 800 },
      { name: 'Corian', price: 1000 },
      { name: 'Casmara', price: 1500 },
    ]
  },
  {
    id: 'hairspa',
    emoji: '💆',
    title: 'Hair Spa',
    type: 'simple',
    items: [
      { name: 'Matrix', price: 500 },
      { name: 'Loreal', price: 500 },
      { name: 'Wella', price: 700 },
      { name: 'Treatment Spa', price: 800 },
      { name: 'Dry & Damage Treatment', price: 1500 },
      { name: 'Dandruff Treatment', price: 300 },
    ]
  },
  {
    id: 'roottouchup',
    emoji: '🎨',
    title: 'Root Touchup',
    type: 'simple',
    items: [
      { name: 'Streax', price: 300 },
      { name: 'Matrix', price: 400 },
      { name: 'Loreal', price: 500 },
      { name: 'Wella', price: 800 },
    ]
  },
  {
    id: 'globalcolouring',
    emoji: '🌈',
    title: 'Global Colouring',
    type: 'simple',
    items: [
      { name: 'Streax', price: 1500 },
      { name: 'Matrix', price: 1800 },
      { name: 'Loreal', price: 2000 },
      { name: 'Wella', price: 2500 },
    ]
  },
  {
    id: 'hairtreatment',
    emoji: '💫',
    title: 'Hair Treatment',
    type: 'dual',
    colHeaders: ['Male', 'Female'],
    items: [
      { name: 'Smoothing', normal: 700, rica: 3500 },
      { name: 'Rebounding', normal: 700, rica: 3500 },
      { name: 'Keratin', normal: 1500, rica: 4000 },
      { name: 'Botox', normal: 1500, rica: 4000 },
      { name: 'Nano Plastic', normal: 2000, rica: 4500 },
    ]
  },
  {
    id: 'fashioncolouring',
    emoji: '✦',
    title: 'Fashion Colouring',
    type: 'simple',
    items: [
      { name: 'Highlight', price: 150 },
      { name: 'Global Highlight', price: 3000 },
      { name: 'Global Highlight Colour', price: 3000 },
    ]
  },
  {
    id: 'maniPedi',
    emoji: '💅',
    title: 'Manicure & Pedicure',
    type: 'dual',
    colHeaders: ['Manicure', 'Pedicure'],
    items: [
      { name: 'Normal', normal: 200, rica: 250 },
      { name: 'Aroma', normal: 250, rica: 350 },
      { name: 'Sara', normal: 250, rica: 350 },
      { name: 'VLCC', normal: 300, rica: 400 },
      { name: 'Lotus', normal: 400, rica: 500 },
      { name: 'Crystal Advance', normal: 600, rica: 800 },
    ]
  },
  {
    id: 'makeup',
    emoji: '👄',
    title: 'Makeup',
    type: 'makeup',
    groups: [
      {
        groupName: 'Party Makeup',
        items: [
          { name: 'Kryolon', male: 1500, female: 1500 },
          { name: 'Mac HD', male: 2000, female: 2000 },
        ]
      },
      {
        groupName: 'Groom Makeup',
        items: [
          { name: 'Kryolon', male: 1500, female: null },
          { name: 'Mac HD', male: 2000, female: null },
        ]
      }
    ]
  },
  {
    id: 'bridal',
    emoji: '👰',
    title: 'Bridal Package',
    type: 'bridal',
    packages: [
      {
        name: 'Bridal Package',
        price: 10000,
        note: 'Includes Makeup',
        services: [
          'Bridal Facial', 'Bleach / D-Tan', 'Hand Spa',
          'Foot Spa', 'Hand Waxing', 'Leg Waxing', 'T.F.U.', 'Hair Cut'
        ]
      },
      {
        name: 'Luxury Bridal Package',
        price: 14000,
        note: 'Includes Air Brush Makeup',
        services: [
          'Bridal Luxury Facial', 'Bleach / D-Tan', 'Glow Power Mask',
          'Hand Spa', 'Foot Spa', 'Treatment Hair Spa',
          'Body Waxing', 'Body Polishing', 'T.F.U.'
        ]
      }
    ]
  }
];

// ── Service Category Card ──────────────────────────────────────────────────
function ServiceCard({ category }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`menu-card ${open ? 'menu-card-open' : ''}`}>
      {/* Header — click to expand */}
      <button className="menu-card-header" onClick={() => setOpen(!open)}>
        <span className="menu-card-emoji">{category.emoji}</span>
        <span className="menu-card-title">{category.title}</span>
        <span className="menu-card-chevron">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {/* Body */}
      {open && (
        <div className="menu-card-body">
          {/* Simple price list */}
          {category.type === 'simple' && category.items.map((item, i) => (
            <div key={i} className="menu-row">
              <span className="menu-row-name">{item.name}</span>
              <span className="menu-row-price">₹{item.price}</span>
            </div>
          ))}

          {/* Dual column (Normal/Rica, Male/Female, Manicure/Pedicure) */}
          {category.type === 'dual' && (
            <>
              <div className="menu-dual-header">
                <span className="menu-dual-service">Service</span>
                <span className="menu-dual-col">{category.colHeaders[0]}</span>
                <span className="menu-dual-col">{category.colHeaders[1]}</span>
              </div>
              {category.items.map((item, i) => (
                <div key={i} className="menu-dual-row">
                  <span className="menu-dual-name">{item.name}</span>
                  <span className="menu-dual-price">₹{item.normal}</span>
                  <span className="menu-dual-price">₹{item.rica}</span>
                </div>
              ))}
            </>
          )}

          {/* Makeup groups */}
          {category.type === 'makeup' && category.groups.map((group, gi) => (
            <div key={gi} className="menu-makeup-group">
              <div className="menu-makeup-group-title">{group.groupName}</div>
              <div className="menu-dual-header">
                <span className="menu-dual-service">Type</span>
                <span className="menu-dual-col">Male</span>
                <span className="menu-dual-col">Female</span>
              </div>
              {group.items.map((item, i) => (
                <div key={i} className="menu-dual-row">
                  <span className="menu-dual-name">{item.name}</span>
                  <span className="menu-dual-price">₹{item.male}</span>
                  <span className="menu-dual-price">{item.female ? `₹${item.female}` : '—'}</span>
                </div>
              ))}
            </div>
          ))}

          {/* Bridal packages */}
          {category.type === 'bridal' && category.packages.map((pkg, i) => (
            <div key={i} className="menu-bridal-pkg">
              <div className="menu-bridal-pkg-header">
                <span className="menu-bridal-pkg-name">{pkg.name}</span>
                <span className="menu-bridal-pkg-price">₹{pkg.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="menu-bridal-note">✦ {pkg.note}</div>
              <div className="menu-bridal-services">
                {pkg.services.map((s, si) => (
                  <span key={si} className="menu-bridal-service-tag">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main MenuPage ──────────────────────────────────────────────────────────
export default function MenuPage({ onBack }) {
  return (
    <div className="menu-page">
      {/* Header */}
      <div className="menu-page-header">
        <button className="menu-back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div className="menu-page-title-wrap">
          <div className="menu-page-za">ZA</div>
          <div>
            <div className="menu-page-title">Rate Card</div>
            <div className="menu-page-sub">Zone A Unisex Salon</div>
          </div>
        </div>
        <Scissors size={20} style={{ color: 'var(--color-gold)', opacity: 0.5 }} />
      </div>

      {/* Gold divider */}
      <div className="menu-gold-divider">
        <div className="menu-divider-line" />
        <span className="menu-divider-diamond">◆</span>
        <div className="menu-divider-line" />
      </div>

      {/* Service Cards — all collapsible */}
      <div className="menu-cards-list">
        {MENU_DATA.map(cat => (
          <ServiceCard key={cat.id} category={cat} />
        ))}
      </div>

      {/* Footer */}
      <div className="menu-page-footer">
        <div className="menu-footer-addr">
          📍 60 Ft. Road, Anna Chauraha, Chishti Nagar, Kanpur
        </div>
        <div className="menu-footer-phone">
          📞 +91 8707271206 &nbsp;/&nbsp; 9807614216
        </div>
        <div className="menu-footer-note">
          Prices may vary. Contact salon for latest rates.
        </div>
      </div>
    </div>
  );
}
