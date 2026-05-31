// C:\Users\himanshu\.gemini\antigravity\scratch\barber-queue-app\src\components\CustomerHistory.jsx
import React from 'react';
import { Smile, Clock, CheckCircle2 } from 'lucide-react';

export default function CustomerHistory({ history }) {
  return (
    <section className="glass-panel" style={{ marginTop: '12px', width: '100%' }}>
      <h2 className="section-title" style={{ borderBottom: '1px solid var(--border-gold)', paddingBottom: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-accent-green)' }}>
          <CheckCircle2 size={22} />
          Recently Served Today
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          {history.length} completed cuts
        </span>
      </h2>

      {history.length > 0 ? (
        <div style={{
          display: 'flex',
          gap: '14px',
          overflowX: 'auto',
          padding: '8px 2px 12px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}>
          {[...history].reverse().map((item, idx) => (
            <div 
              key={item.completedAt + idx} 
              className="glass-panel"
              style={{
                minWidth: '240px',
                flex: '0 0 auto',
                background: 'var(--bg-secondary)',
                padding: '12px 18px',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smile size={16} className="text-gold" />
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {item.customerName}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                Served by <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{item.barberName}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                fontSize: '10px', 
                color: 'var(--color-text-muted)',
                marginTop: '4px',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '6px'
              }}>
                <Clock size={10} />
                <span>{new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          padding: '32px 16px', 
          color: 'var(--color-text-muted)', 
          fontSize: '12px', 
          textAlign: 'center',
          border: '1px dashed var(--border-gold)',
          borderRadius: 'var(--radius-md)',
          margin: '8px 0'
        }}>
          No haircuts completed in this session yet. Our team is ready for the first walk-in!
        </div>
      )}
    </section>
  );
}
