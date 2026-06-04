// C:\Users\himanshu\.gemini\antigravity\scratch\barber-queue-app\src\components\AdminPanel.jsx
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
  barbers
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
    <section className="glass-panel" style={{ marginTop: '12px' }}>
      <h2 className="section-title" style={{ borderBottom: '1px solid var(--color-gold)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-gold)' }}>
          <ShieldAlert size={22} />
          Shop Owner Control Center
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-accent-red)', fontWeight: 700, background: 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', borderRadius: '50px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1, justifyContent: 'center' }}>
            <button
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: !isShopOpen ? '1px solid var(--color-accent-amber)' : '' }}
              onClick={toggleShopOpen}
            >
              <Ban size={14} style={{ color: !isShopOpen ? 'var(--color-accent-amber)' : 'inherit' }} />
              <span>{isShopOpen ? 'Pause Auto-Seating' : 'Resume Auto-Seating'}</span>
            </button>
            
            <button 
              className="btn-danger"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={onClearQueue}
            >
              <Users size={14} />
              <span>Clear Entire Waitlist</span>
            </button>

            <button
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
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

          {barbers.length > 2 && (
            <div style={{ marginTop: '8px', borderTop: '1px solid var(--border-gold)', paddingTop: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Remove Chair (Must be empty):
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {barbers.map(barber => (
                  <button
                    key={barber.id}
                    className="btn-danger"
                    style={{ padding: '3px 8px', fontSize: '10px' }}
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
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>All-Day Shop Revenue</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-accent-green)', fontFamily: 'Outfit', marginTop: '2px' }}>
                ₹{totalEarnings}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                From {history.length} completed cuts today
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Chair-Wise Breakdown:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '110px', overflowY: 'auto' }}>
                {chairEarnings.map(chair => (
                  <div key={chair.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '11px', color: 'var(--color-text-primary)' }}>{chair.name.split(' ')[0]}</span>
                      <span style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}> ({chair.cutsCount} cuts)</span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-gold)' }}>₹{chair.earnings}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* History Log Card */}
        <div className="admin-action-card">
          <h3 className="admin-card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={16} className="text-gold" />
              Served History Log
            </span>
          </h3>
          
          <div className="history-list">
            {history.length > 0 ? (
              [...history].reverse().map((item, idx) => (
                <div key={item.completedAt + idx} className="history-item">
                  <div>
                    <span className="history-name">{item.customerName}</span>
                    <span className="history-details"> by {item.barberName}</span>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)', fontSize: '11px', textAlign: 'center', padding: '12px' }}>
                No completed cuts in this session yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
