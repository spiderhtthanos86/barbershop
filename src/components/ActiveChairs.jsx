import React, { useState, useEffect, useMemo } from 'react';
import { Scissors, UserCheck, Coffee, Users, Trash2, Clock, XCircle } from 'lucide-react';

function ChairCard({ chair, isAdmin, onCompleteCut, onToggleBreak, onRemoveWithoutService }) {
  const customer = chair.customer;
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

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

  const isBreak = chair.status === 'break';

  return (
    <div className={`glass-panel chair-card chair-card-compact ${customer ? 'occupied glow-active' : isBreak ? 'chair-is-break' : 'empty'}`}>
      <div className="chair-header">
        <div className="barber-info">
          <div className="barber-avatar-container">
            <div className="barber-avatar">
              {chair.name.charAt(0)}
            </div>
            <div className={`status-dot ${isBreak ? 'break' : customer ? 'active' : 'offline'}`} />
          </div>
          <div>
            <h3 className="barber-name">{chair.name}</h3>
            <span className="barber-role">{chair.specialty || 'Stylist'}</span>
          </div>
        </div>

        {/* Status Indicator & Break Toggle */}
        <div className="chair-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Status badge - visible to both Customer and Owner */}
          <span className={`chair-status-pill ${isBreak ? 'pill-break' : customer ? 'pill-busy' : 'pill-free'}`}>
            {isBreak ? 'â˜• On Break' : customer ? 'âœ‚ï¸ In Service' : 'ðŸŸ¢ Free'}
          </span>

          {/* Owner Break Button in Header (when chair is empty) */}
          {isAdmin && !customer && (
            <button
              className={`btn-break-toggle ${isBreak ? 'on-break' : ''}`}
              onClick={() => onToggleBreak(chair.id)}
              title={isBreak ? "End break & make chair available" : "Put this chair on break"}
            >
              <Coffee size={13} style={{ color: isBreak ? 'var(--color-accent-amber)' : 'inherit' }} />
              <span>{isBreak ? 'Resume' : 'Break'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="chair-body">
        {customer ? (
          <div className="active-customer-container" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="customer-serving-label">
              Currently Serving
            </span>
            <div className="active-customer-name" style={{ fontSize: '18px' }}>
              {customer.name}
            </div>

            {/* Live Elapsed Serving Stopwatch - Visible to BOTH Customer and Owner! */}
            <div className="stopwatch-container">
              <Clock size={12} className="text-gold stopwatch-icon" />
              <span className="stopwatch-label">
                Serving: <span className="stopwatch-value">{formatStopwatch(elapsedSeconds)}</span>
              </span>
            </div>
            
            {/* Prominent Admin Checkout Action Button */}
            {isAdmin ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                <button
                  onClick={() => onCompleteCut(chair.id)}
                  className="btn-primary btn-complete-service"
                  title="Complete session and automatically pull next customer in line"
                >
                  <UserCheck size={14} />
                  <span>Complete & Seat Next</span>
                </button>
                <button
                  onClick={() => onRemoveWithoutService(chair.id)}
                  className="btn-remove-service"
                  title="Remove customer from chair without logging service or cost"
                >
                  <XCircle size={13} />
                  <span>Remove without Service</span>
                </button>
              </div>
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
            {isBreak ? (
              <div className="chair-break-box">
                <Coffee size={28} className="break-icon-amber" />
                <span className="break-title-text">Barber on Short Break</span>
                <span className="break-sub-text">Chair is paused Â· Not accepting next in line</span>
                {isAdmin && (
                  <button
                    onClick={() => onToggleBreak(chair.id)}
                    className="btn-primary btn-resume-chair"
                    title="End break and allow auto-seating"
                  >
                    <UserCheck size={14} />
                    <span>End Break (Make Free)</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="chair-available-box">
                <Scissors size={26} className="available-icon-gold" />
                <span className="available-title-text">Chair Available</span>
                <span className="available-sub-text">
                  {isAdmin ? 'Ready to seat next waiting client' : 'Ready for next client'}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => onToggleBreak(chair.id)}
                    className="btn-secondary btn-take-break-card"
                    title="Take a short break"
                  >
                    <Coffee size={13} />
                    <span>Put Chair on Break</span>
                  </button>
                )}
              </div>
            )}
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
  onRemoveWithoutService,
  queue,
  onRemoveFromQueue,
  myTicketId,
  trackName = ''
}) {
  // Mobile Capsule Tab Selector: 'all' or specific barber id
  const [activeTab, setActiveTab] = useState('all');

  // Memoize queue distribution across chairs so it only re-computes when chairs or queue changes
  const chairQueueMap = useMemo(() => {
    const map = {};
    chairs.forEach(c => { map[c.id] = []; });

    // Sorted queue (chronological)
    const sortedQueue = [...queue].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // First pass: assign customers with a specific barber preference
    const anyCustomers = [];
    sortedQueue.forEach(customer => {
      if (customer.preferredBarberId === 'any') {
        anyCustomers.push(customer);
      } else if (map[customer.preferredBarberId]) {
        map[customer.preferredBarberId].push(customer);
      }
    });

    // Second pass: distribute 'any' customers round-robin across active chairs
    const activeChairIds = chairs.filter(c => c.status === 'active').map(c => c.id);
    if (activeChairIds.length > 0) {
      anyCustomers.forEach((customer, idx) => {
        const targetChairId = activeChairIds[idx % activeChairIds.length];
        map[targetChairId].push(customer);
      });
    } else if (chairs.length > 0) {
      // Fallback: if no active chairs, distribute across all chairs
      anyCustomers.forEach((customer, idx) => {
        const targetChairId = chairs[idx % chairs.length].id;
        map[targetChairId].push(customer);
      });
    }

    // Sort each chair's queue chronologically
    Object.values(map).forEach(q => q.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));

    return map;
  }, [chairs, queue]);

  return (
    <section className="glass-panel main-stations-container">
      <h2 className="section-title">
        <span className="section-title-left">
          <Scissors size={22} className="text-gold" />
          Styling Stations
        </span>
        <span className="section-title-count">
          {chairs.length} Active Barbers
        </span>
      </h2>

      {/* Horizontal capsule mobile-first tabs bar - HIDDEN on Laptop/Desktop screens via CSS! */}
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

      {/* Parent Stations Grid */}
      <div className={`stations-grid-container tab-active-${activeTab}`}>
        {chairs.map((chair, index) => {
          const chairQueue = chairQueueMap[chair.id] || [];

          // Cycle through color themes (blue, orange, purple) for any added stylists
          const themes = ['theme-blue', 'theme-orange', 'theme-purple'];
          const themeClass = themes[index % themes.length];
          const colClass = `barber-col-${chair.id}`;

          return (
            <div 
              key={chair.id} 
              className={`station-column ${themeClass} ${colClass}`}
              style={{ animation: 'fadeIn 0.3s ease-out' }}
            >
              {/* Styling Chair card */}
              <ChairCard 
                chair={chair} 
                isAdmin={isAdmin}
                onCompleteCut={onCompleteCut}
                onToggleBreak={onToggleBreak}
                onRemoveWithoutService={onRemoveWithoutService}
              />

              {/* Specific Waitlist Column directly below chair */}
              <div className="glass-panel waitlist-column-panel">
                <div className="waitlist-column-header">
                  <span className="waitlist-barber-title">
                    {chair.name.split(' ')[0]}'s Waitlist
                  </span>
                  <span className="waitlist-count-badge">
                    <Users size={11} />
                    {chairQueue.length} waiting
                  </span>
                </div>

                <div className="waitlist-items-container">
                  {chairQueue.length > 0 ? (
                    chairQueue.map((customer, idx) => {
                      const isMyTicket = customer.id === myTicketId;
                      const isTracked = trackName && customer.name.trim().toLowerCase() === trackName.trim().toLowerCase();
                      const isShared = customer.preferredBarberId === 'any';

                      const itemStateClass = isTracked
                        ? 'is-tracked'
                        : isMyTicket
                          ? 'is-my-ticket'
                          : isShared
                            ? 'is-shared'
                            : '';

                      return (
                        <div 
                          key={customer.id} 
                          className={`queue-item-card ${itemStateClass}`}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Position badge */}
                            <div className="queue-position" style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                              {idx + 1}
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span className="queue-customer-name" style={{ fontSize: '13px' }}>
                                  {customer.name}
                                </span>
                                {isAdmin && customer.cost > 0 && (
                                  <span className="badge-cost">
                                    Ã¢â€šÂ¹{customer.cost}
                                  </span>
                                )}
                                {isMyTicket && (
                                  <span className="badge-my-ticket">
                                    You
                                  </span>
                                )}
                                {isTracked && !isMyTicket && (
                                  <span className="badge-tracked">
                                    You
                                  </span>
                                )}
                              </div>
                              
                              {/* Shared tag */}
                              {isShared && (
                                <span className="tag-next-available">
                                  Next Available
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Delete actions */}
                          {isAdmin && (
                            <button
                              className="remove-queue-btn btn-remove-queue"
                              onClick={() => onRemoveFromQueue(customer.id)}
                              title="Remove customer"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="empty-queue-placeholder">
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
  );
}