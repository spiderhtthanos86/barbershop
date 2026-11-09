import React, { useState } from 'react';
import { ShieldAlert, Plus, Users, Ban, RefreshCw, BarChart3, Clock, TrendingUp } from 'lucide-react';

export default function AdminPanel({
  isShopOpen,
  toggleShopOpen,
  onResetStats,
  onClearQueue,
  onAddBarber,
  onRemoveBarber,
  history,
  barbers,
  allowCustomerJoin,
  toggleAllowCustomerJoin,
  requireAuth = true,
  toggleRequireAuth
}) {
  const [newBarberName, setNewBarberName] = useState('');
  const [newBarberSpecialty, setNewBarberSpecialty] = useState('Hair Master');

  const handleAddBarber = (e) => {
    e.preventDefault();
    if (!newBarberName.trim()) return;
    onAddBarber({
      name: newBarberName.trim(),
      specialty: newBarberSpecialty.trim()
    });
    setNewBarberName('');
  };

  // Calculate earnings metrics
  const totalEarnings = history.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);

  const chairEarnings = barbers.map(barber => {
    const cuts = history.filter(item => item.barberId === barber.id || item.barberName === barber.name);
    const earnings = cuts.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
    return {
      id: barber.id,
      name: barber.name,
      earnings,
      cutsCount: cuts.length
    };
  });

  return (
    <section className="glass-panel admin-section">
      <h2 className="section-title admin-section-header">
        <span className="admin-header-title">
          <ShieldAlert size={22} />
          Shop Owner Control Center
        </span>
        <span className="admin-badge">
          ADMIN MODE ACTIVE
        </span>
      </h2>

      <div className="admin-grid">
        {/* Quick Operations Card */}
        <div className="admin-action-card">
          <h3 className="admin-card-title">
            <RefreshCw size={16} className="text-gold" />
            Queue Operations
          </h3>
          <div className="admin-ops-list">
            <button
              className="btn-secondary btn-ops"
              style={{ border: !isShopOpen ? '1px solid var(--color-accent-amber)' : undefined }}
              onClick={toggleShopOpen}
            >
              <Ban size={14} style={{ color: !isShopOpen ? 'var(--color-accent-amber)' : 'inherit' }} />
              <span>{isShopOpen ? 'Pause Auto-Seating' : 'Resume Auto-Seating'}</span>
            </button>

            <button
              className="btn-secondary btn-ops"
              style={{ border: allowCustomerJoin ? '1.5px solid var(--color-gold)' : undefined }}
              onClick={toggleAllowCustomerJoin}
            >
              <Users size={14} style={{ color: allowCustomerJoin ? 'var(--color-gold)' : 'inherit' }} />
              <span>{allowCustomerJoin ? 'Disable Customer Self-Join' : 'Enable Customer Self-Join'}</span>
              <span className={`status-pill ${allowCustomerJoin ? 'on' : 'off'}`}>
                {allowCustomerJoin ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              className="btn-secondary btn-ops"
              style={{ border: requireAuth ? '1.5px solid var(--color-gold)' : undefined }}
              onClick={toggleRequireAuth}
            >
              <ShieldAlert size={14} style={{ color: requireAuth ? 'var(--color-gold)' : 'inherit' }} />
              <span>{requireAuth ? 'Disable Google Auth' : 'Enable Google Auth'}</span>
              <span className={`status-pill ${requireAuth ? 'on' : 'off'}`}>
                {requireAuth ? 'ON' : 'OFF'}
              </span>
            </button>
            
            <button 
              className="btn-danger btn-ops"
              onClick={onClearQueue}
            >
              <Users size={14} />
              <span>Clear Entire Waitlist</span>
            </button>

            <button
              className="btn-secondary btn-ops"
              onClick={onResetStats}
            >
              <RefreshCw size={14} />
              <span>Reset Completed Log</span>
            </button>
          </div>
        </div>

        {/* Add/Remove Barbers Card */}
        <div className="admin-action-card">
          <h3 className="admin-card-title">
            <Plus size={16} className="text-gold" />
            Manage Active Chairs
          </h3>
          <form onSubmit={handleAddBarber} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '13px' }}
              placeholder="Barber Name..."
              value={newBarberName}
              onChange={(e) => setNewBarberName(e.target.value)}
              required
            />
            <select
              className="form-select"
              style={{ padding: '8px 12px', fontSize: '13px', backgroundPosition: 'right 12px center' }}
              value={newBarberSpecialty}
              onChange={(e) => setNewBarberSpecialty(e.target.value)}
            >
              <option value="Hair Master">Hair Master</option>
              <option value="Beard Architect">Beard Architect</option>
              <option value="Styling Expert">Styling Expert</option>
              <option value="Shave Specialist">Shave Specialist</option>
            </select>
            <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', justifyContent: 'center' }}>
              <Plus size={14} />
              <span>Add Styling Chair</span>
            </button>
          </form>

          {barbers.length > 0 && (
            <div className="chair-remove-section">
              <span className="chair-remove-label">
                Remove Chair (Must be empty):
              </span>
              <div className="chair-remove-list">
                {barbers.map(barber => (
                  <button
                    key={barber.id}
                    className="btn-danger btn-remove-chair"
                    onClick={() => onRemoveBarber(barber.id)}
                  >
                    Remove {barber.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Shop Earnings Report Card */}
        <div className="admin-action-card">
          <h3 className="admin-card-title">
            <TrendingUp size={16} className="text-gold" />
            Shop Earnings Report
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', height: '100%' }}>
            <div className="revenue-stat-box">
              <div className="revenue-stat-label">All-Day Shop Revenue</div>
              <div className="revenue-stat-amount">
                ₹{totalEarnings}
              </div>
              <div className="revenue-stat-sub">
                From {history.length} completed cuts today
              </div>
            </div>
            
            <div className="chair-breakdown-wrapper">
              <span className="chair-breakdown-title">Chair-Wise Breakdown:</span>
              <div className="chair-earnings-list">
                {chairEarnings.map(chair => (
                  <div key={chair.id} className="chair-earning-row">
                    <div>
                      <span className="chair-earning-name">{chair.name.split(' ')[0]}</span>
                      <span className="chair-earning-cuts"> ({chair.cutsCount} cuts)</span>
                    </div>
                    <span className="chair-earning-val">₹{chair.earnings}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* History Log Card - Grouped by Chair/Barber */}
        <div className="admin-action-card">
          <h3 className="admin-card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={16} className="text-gold" />
              Served History Log
            </span>
          </h3>
          
          <div className="history-list" style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {barbers.map(barber => {
              const barberHistory = history.filter(item => item.barberId === barber.id || item.barberName === barber.name);
              
              return (
                <div key={barber.id} style={{ marginBottom: '14px' }}>
                  {/* Chair Header */}
                  <div className="chair-group-header">
                    <span>{barber.name}</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>({barberHistory.length} served)</span>
                  </div>

                  {/* Customers Served under this chair */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {barberHistory.length > 0 ? (
                      [...barberHistory].reverse().map((item, idx) => (
                        <div key={item.id || item.completedAt + idx} className="history-item" style={{ padding: '6px 10px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span className="history-name" style={{ fontSize: '12px', fontWeight: 600 }}>{item.customerName}</span>
                            {item.authorizedBy && (
                              <span style={{ fontSize: '8px', color: 'var(--color-text-muted)' }}>Auth: {item.authorizedBy}</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-accent-green)' }}>
                              ₹{item.cost || 0}
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <Clock size={10} />
                              {new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontStyle: 'italic', paddingLeft: '4px' }}>
                        No clients served today.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
