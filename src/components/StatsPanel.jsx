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
    <div className="stats-grid">
      {/* People Waiting */}
      <div className="glass-panel stat-card">
        <div className="stat-header">
          <span>In Waitlist</span>
          <Users size={16} className="text-gold" />
        </div>
        <div className="stat-value">
          {queue.length}
          <span className="stat-value-unit">clients</span>
        </div>
        <div className={`stat-trend ${queue.length > 5 ? 'stat-trend-amber' : 'stat-trend-green'}`}>
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
          <span className="stat-value-unit">occupied</span>
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
          <span className="stat-value-unit">clients</span>
        </div>
        <div className="stat-trend stat-trend-green">
          Queue managed manually
        </div>
      </div>
    </div>
  );
}
