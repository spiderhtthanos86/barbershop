// C:\Users\himanshu\.gemini\antigravity\scratch\barber-queue-app\src\components\StatsPanel.jsx
import React from 'react';
import { Users, Scissors, Smile } from 'lucide-react';

export default function StatsPanel({
  queue,
  barbers,
  history
}) {
  const completedCount = history.length;
  const busyBarbersCount = barbers.filter(b => b.customer).length;

  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      {/* People Waiting */}
      <div className="glass-panel stat-card">
        <div className="stat-header">
          <span>In Waitlist</span>
          <Users size={16} className="text-gold" />
        </div>
        <div className="stat-value">
          {queue.length}
          <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginLeft: '4px' }}>clients</span>
        </div>
        <div className="stat-trend" style={{ color: queue.length > 5 ? 'var(--color-accent-amber)' : 'var(--color-accent-green)' }}>
          {queue.length > 5 ? 'High demand' : 'Smooth traffic'}
        </div>
      </div>

      {/* Active Barbers */}
      <div className="glass-panel stat-card">
        <div className="stat-header">
          <span>Active Barbers</span>
          <Scissors size={16} className="text-gold" />
        </div>
        <div className="stat-value">
          {busyBarbersCount}/{barbers.length}
          <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginLeft: '4px' }}>occupied</span>
        </div>
        <div className="stat-trend">
          {barbers.length - busyBarbersCount} chairs available
        </div>
      </div>

      {/* Completed Cuts */}
      <div className="glass-panel stat-card">
        <div className="stat-header">
          <span>Served Today</span>
          <Smile size={16} className="text-gold" />
        </div>
        <div className="stat-value">
          {completedCount}
          <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginLeft: '4px' }}>clients</span>
        </div>
        <div className="stat-trend" style={{ color: 'var(--color-accent-green)' }}>
          Queue managed manually
        </div>
      </div>
    </div>
  );
}
