import React from 'react';
import { Smile, Clock, CheckCircle2 } from 'lucide-react';

export default function CustomerHistory({ history }) {
  return (
    <section className="glass-panel history-section">
      <h2 className="section-title history-section-header">
        <span className="history-section-title">
          <CheckCircle2 size={22} />
          Recently Served Today
        </span>
        <span className="section-title-count">
          {history.length} completed cuts
        </span>
      </h2>

      {history.length > 0 ? (
        <div className="history-carousel">
          {[...history].reverse().map((item, idx) => (
            <div 
              key={item.id || item.completedAt + idx} 
              className="glass-panel history-card"
            >
              <div className="history-card-header">
                <Smile size={16} className="text-gold" />
                <span className="history-card-client">
                  {item.customerName}
                </span>
              </div>
              <div className="history-card-barber">
                Served by <span className="history-card-barber-name">{item.barberName}</span>
              </div>
              <div className="history-card-time">
                <Clock size={10} />
                <span>{new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="history-empty-placeholder">
          No haircuts completed in this session yet. Our team is ready for the first walk-in!
        </div>
      )}
    </section>
  );
}
