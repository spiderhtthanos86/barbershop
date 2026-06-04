// C:\Users\himanshu\.gemini\antigravity\scratch\barber-queue-app\src\components\ActiveChairs.jsx
import React, { useState, useEffect } from 'react';
import { Scissors, UserCheck, Coffee, Users, Trash2, UserX, Clock } from 'lucide-react';

function ChairCard({ chair, isAdmin, onCompleteCut, onToggleBreak }) {
  const customer = chair.customer;
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Second-by-second elapsed stopwatch calculation
  useEffect(() => {
    if (!customer || !chair.startTime) {
      setElapsedSeconds(0);
      return;
    }

    const calculateElapsed = () => {
      const start = new Date(chair.startTime).getTime();
      const now = Date.now();
      return Math.max(0, Math.floor((now - start) / 1000));
    };

    setElapsedSeconds(calculateElapsed());

    const interval = setInterval(() => {
      setElapsedSeconds(calculateElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [customer, chair.startTime]);

  // Format seconds to MM:SS
  const formatStopwatch = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`glass-panel chair-card ${customer ? 'occupied glow-active' : 'empty'}`} style={{ minHeight: '200px', margin: 0 }}>
      <div className="chair-header">
        <div className="barber-info">
          <div className="barber-avatar-container">
            <div className="barber-avatar">
              {chair.name.charAt(0)}
            </div>
            <div className={`status-dot ${chair.status === 'break' ? 'break' : customer ? 'active' : 'offline'}`} />
          </div>
          <div>
            <h3 className="barber-name">{chair.name}</h3>
            <span className="barber-role">{chair.specialty || 'Stylist'}</span>
          </div>
        </div>

        {/* Top-right quick actions (like Toggle Break for empty chairs) */}
        {isAdmin && !customer && (
          <button
            className="icon-btn"
            style={{ width: '32px', height: '32px', border: chair.status === 'break' ? '1px solid var(--color-accent-amber)' : '1px solid var(--border-gold)' }}
            onClick={() => onToggleBreak(chair.id)}
            title={chair.status === 'break' ? "End break" : "Take a short break"}
          >
            <Coffee size={14} style={{ color: chair.status === 'break' ? 'var(--color-accent-amber)' : 'inherit' }} />
          </button>
        )}
      </div>

      <div className="chair-body">
        {customer ? (
          <div className="active-customer-container" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Currently Serving
            </span>
            <div className="active-customer-name" style={{ fontSize: '18px' }}>
              {customer.name}
            </div>

            {/* Live Elapsed Serving Stopwatch & Cost Row */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
              {/* Serving cost */}
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.1)', 
                border: '1px solid rgba(16, 185, 129, 0.2)', 
                color: 'var(--color-accent-green)',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                ₹ {customer.cost || 0}
              </div>

              {/* Stopwatch */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-light)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                <Clock size={10} className="text-gold" style={{ opacity: 0.8 }} />
                <span style={{ fontSize: '10px', fontWeight: 650, color: 'var(--color-text-secondary)' }}>
                  {formatStopwatch(elapsedSeconds)}
                </span>
              </div>
            </div>
            
            {/* Prominent Admin Checkout Action Button */}
            {isAdmin ? (
              <button
                onClick={() => onCompleteCut(chair.id)}
                className="btn-primary"
                style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  background: 'linear-gradient(135deg, var(--color-accent-green) 0%, #059669 100%)',
                  color: '#fff',
                  width: '100%',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)'
                }}
                title="Complete session and automatically pull next customer in line"
              >
                <UserCheck size={14} />
                <span>Complete & Seat Next</span>
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <span className="active-service-badge">
                  ACTIVE SESSION
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-chair-placeholder">
            <Scissors size={24} />
            <span>
              {chair.status === 'break' ? 'Barber on Break' : 'Chair Available'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ActiveChairs({
  chairs,
  isAdmin,
  onCompleteCut,
  onToggleBreak,
  queue,
  onRemoveFromQueue,
  myTicketId,
  trackName = ''
}) {
  // Mobile Capsule Tab Selector: 'all' or specific barber id (Only active on mobile widths via CSS!)
  const [activeTab, setActiveTab] = useState('all');

  return (
    <section className="glass-panel" style={{ width: '100%' }}>
      <h2 className="section-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Scissors size={22} className="text-gold" />
          Styling Stations
        </span>
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
          {chairs.length} Active Barbers
        </span>
      </h2>

      <div className="mobile-tab-bar">
        <button 
          className={`tab-pill ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Stations ({chairs.length})
        </button>
        {chairs.map(chair => (
          <button 
            key={chair.id}
            className={`tab-pill ${activeTab === chair.id ? 'active' : ''}`}
            onClick={() => setActiveTab(chair.id)}
          >
            {chair.name.split(' ')[0]} ({chair.customer ? 'Busy' : 'Free'})
          </button>
        ))}
      </div>

      <div className={`stations-grid-container tab-active-${activeTab}`}>
        {chairs.map((chair, index) => {
          const chairQueue = queue
            .filter(c => c.preferredBarberId === chair.id || c.preferredBarberId === 'any')
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

          const themes = ['theme-blue', 'theme-orange', 'theme-purple'];
          const themeClass = themes[index % themes.length];
          const colClass = `barber-col-${chair.id}`;

          return (
            <div 
              key={chair.id} 
              className={`station-column ${themeClass} ${colClass}`}
              style={{ animation: 'fadeIn 0.3s ease-out' }}
            >
              <ChairCard 
                chair={chair} 
                isAdmin={isAdmin}
                onCompleteCut={onCompleteCut}
                onToggleBreak={onToggleBreak}
              />

              <div className="glass-panel" style={{ 
                background: 'var(--bg-secondary)', 
                borderWidth: '1px',
                borderRadius: 'var(--radius-md)', 
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                minHeight: '120px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border-gold)',
                  paddingBottom: '6px',
                  marginBottom: '2px'
                }}>
                  <span style={{ fontStyle: 'normal', fontWeight: 700, fontSize: '13px', color: 'var(--color-gold)' }}>
                    {chair.name.split(' ')[0]}'s Waitlist
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={11} />
                    {chairQueue.length} waiting
                  </span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '6px', 
                  overflowY: 'auto',
                  maxHeight: '280px',
                  paddingRight: '2px'
                }}>
                  {chairQueue.length > 0 ? (
                    chairQueue.map((customer, idx) => {
                      const isMyTicket = customer.id === myTicketId;
                      const isTracked = trackName && customer.name.trim().toLowerCase() === trackName.trim().toLowerCase();
                      const isShared = customer.preferredBarberId === 'any';

                      return (
                        <div 
                          key={customer.id} 
                          className="queue-item-card"
                          style={{
                            padding: '8px 10px',
                            border: isTracked
                              ? '1.5px solid #00d2ff'
                              : isMyTicket 
                                ? '1.5px solid var(--color-gold)' 
                                : isShared 
                                  ? '1px dashed rgba(255, 255, 255, 0.15)' 
                                  : '1px solid var(--border-gold)',
                            boxShadow: isTracked
                              ? '0 0 12px rgba(0, 210, 255, 0.25)'
                              : isMyTicket 
                                ? '0 0 10px rgba(197, 168, 128, 0.1)' 
                                : 'none',
                            animation: 'slideInUp 0.25s ease-out'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div className="queue-position" style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                                {idx + 1}
                              </div>
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span className="queue-customer-name" style={{ fontSize: '13px' }}>
                                    {customer.name}
                                  </span>
                                  {isMyTicket && (
                                    <span style={{
                                      background: 'var(--color-gold)',
                                      color: 'var(--bg-primary)',
                                      fontSize: '8px',
                                      fontWeight: 800,
                                      padding: '1px 3px',
                                      borderRadius: '2px',
                                      textTransform: 'uppercase'
                                    }}>
                                      You
                                    </span>
                                  )}
                                  {isTracked && !isMyTicket && (
                                    <span style={{
                                      background: '#00d2ff',
                                      color: 'var(--bg-primary)',
                                      fontSize: '8px',
                                      fontWeight: 800,
                                      padding: '1px 4px',
                                      borderRadius: '2px',
                                      textTransform: 'uppercase',
                                      boxShadow: '0 0 6px rgba(0, 210, 255, 0.4)'
                                    }}>
                                      You
                                    </span>
                                  )}
                                </div>
                                
                                {isShared && (
                                  <span style={{
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    color: 'var(--color-accent-amber)',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                    padding: '1px 4px',
                                    borderRadius: '3px',
                                    fontSize: '7px',
                                    fontWeight: 600,
                                    width: 'fit-content',
                                    textTransform: 'uppercase'
                                  }}>
                                    Next Available
                                  </span>
                                )}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ 
                                fontSize: '11px', 
                                fontWeight: 700, 
                                color: 'var(--color-accent-green)',
                                background: 'rgba(16, 185, 129, 0.08)',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}>
                                ₹ {customer.cost || 0}
                              </span>

                              {isAdmin && (
                                <button
                                  className="remove-queue-btn"
                                  onClick={() => onRemoveFromQueue(customer.id)}
                                  title="Remove customer"
                                  style={{ padding: '4px' }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ 
                      padding: '20px 10px', 
                      color: 'var(--color-text-muted)', 
                      fontSize: '11px', 
                      textAlign: 'center',
                      border: '1px dashed var(--border-gold)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      No one in line
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
}
