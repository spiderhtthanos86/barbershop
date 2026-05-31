// C:\Users\himanshu\.gemini\antigravity\scratch\barber-queue-app\src\App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import ActiveChairs from './components/ActiveChairs';
import JoinQueueModal from './components/JoinQueueModal';
import AdminPanel from './components/AdminPanel';
import LoginScreen from './components/LoginScreen';
import CustomerHistory from './components/CustomerHistory';

import './index.css';
import './styles/components.css';

// Initial pre-populated default barbers/chairs
const DEFAULT_BARBERS = [
  { id: 'alex', name: 'Alex Rivers', specialty: 'Classic Cuts & Fades', status: 'active', customer: null, startTime: null },
  { id: 'sam', name: 'Sam Thorne', specialty: 'Beards & Hot Shaves', status: 'active', customer: null, startTime: null },
  { id: 'jordan', name: 'Jordan Vance', specialty: 'Modern Styling', status: 'active', customer: null, startTime: null }
];

// Simplified initial queue with some specific & some shared next available clients
const INITIAL_QUEUE = [
  {
    id: 'c-1',
    name: 'Marcus Aurelius',
    preferredBarberId: 'alex',
    preferredBarberName: 'Alex Rivers',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 'c-2',
    name: 'Cleopatra VII',
    preferredBarberId: 'any',
    preferredBarberName: 'Next Available',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 'c-3',
    name: 'Julius Caesar',
    preferredBarberId: 'sam',
    preferredBarberName: 'Sam Thorne',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString()
  }
];

// Helper to synthesize premium sound effects using browser Web Audio API
const playSynthesizedSound = (type, enabled) => {
  if (!enabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'chime') {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now); // E5
      osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6

      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } else if (type === 'snip') {
      const now = ctx.currentTime;
      
      const playSnipBurst = (time) => {
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1500;
        filter.Q.value = 3.0;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.12, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.07);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start(time);
        noise.stop(time + 0.08);
      };

      playSnipBurst(now);
      playSnipBurst(now + 0.15);
    }
  } catch (error) {
    console.warn("Audio Context failed to initialize: ", error);
  }
};

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [myTicketId, setMyTicketId] = useState(localStorage.getItem('myTicketId') || '');

  // Authentication View Controller
  // View states: 'customer' (default waitlist), 'login' (staff credential portal), 'owner' (control panel dashboard)
  const [currentView, setCurrentView] = useState(() => {
    const savedAuth = localStorage.getItem('trimtime_auth');
    return savedAuth === 'true' ? 'owner' : 'customer';
  });

  // Persistent State Collections
  const [barbers, setBarbers] = useState(() => {
    const saved = localStorage.getItem('trimtime_barbers');
    if (saved) return JSON.parse(saved);
    
    const initialBarbers = [...DEFAULT_BARBERS];
    initialBarbers[0].customer = { name: 'Leonidas of Sparta' };
    initialBarbers[0].startTime = new Date(Date.now() - 1000 * 60 * 18).toISOString();

    initialBarbers[1].customer = { name: 'Alexander The Great' };
    initialBarbers[1].startTime = new Date(Date.now() - 1000 * 60 * 8).toISOString();
    
    return initialBarbers;
  });

  const [queue, setQueue] = useState(() => {
    const saved = localStorage.getItem('trimtime_queue');
    return saved ? JSON.parse(saved) : INITIAL_QUEUE;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('trimtime_history');
    return saved ? JSON.parse(saved) : [];
  });

  // LocalStorage Persistors
  useEffect(() => {
    localStorage.setItem('trimtime_barbers', JSON.stringify(barbers));
  }, [barbers]);

  useEffect(() => {
    localStorage.setItem('trimtime_queue', JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem('trimtime_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (myTicketId) {
      localStorage.setItem('myTicketId', myTicketId);
    } else {
      localStorage.removeItem('myTicketId');
    }
  }, [myTicketId]);


  // AUTO-SEATING SCHEDULER
  useEffect(() => {
    if (!isShopOpen) return;

    let queueChanged = false;
    const updatedBarbers = barbers.map(barber => {
      if (barber.customer || barber.status === 'break') return barber;

      const sortedQueue = [...queue].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const nextCustomer = sortedQueue.find(customer => 
        customer.preferredBarberId === 'any' || customer.preferredBarberId === barber.id
      );

      if (nextCustomer) {
        const seatedCustomer = nextCustomer;
        
        const targetIdx = queue.findIndex(c => c.id === seatedCustomer.id);
        if (targetIdx !== -1) {
          queue.splice(targetIdx, 1);
          queueChanged = true;
        }

        playSynthesizedSound('chime', soundEnabled);

        return {
          ...barber,
          customer: seatedCustomer,
          startTime: new Date().toISOString()
        };
      }

      return barber;
    });

    if (queueChanged) {
      setBarbers(updatedBarbers);
      setQueue([...queue]);
    }
  }, [queue, barbers, isShopOpen, soundEnabled]);


  // AUTHENTICATION CONTROLS
  const handleLoginSuccess = () => {
    localStorage.setItem('trimtime_auth', 'true');
    setCurrentView('owner');
    playSynthesizedSound('chime', soundEnabled);
  };

  const handleLogout = () => {
    localStorage.removeItem('trimtime_auth');
    setCurrentView('customer');
    playSynthesizedSound('chime', soundEnabled);
  };


  // DATA ACTION HANDLERS

  const handleJoinQueue = (customerData) => {
    const newCustomer = {
      id: `c-${Date.now()}`,
      name: customerData.name,
      preferredBarberId: customerData.preferredBarberId,
      preferredBarberName: customerData.preferredBarberName,
      createdAt: new Date().toISOString()
    };

    setQueue([...queue, newCustomer]);
    setMyTicketId(newCustomer.id);
    setIsJoinModalOpen(false);
    playSynthesizedSound('chime', soundEnabled);
  };

  const handleRemoveFromQueue = (customerId) => {
    setQueue(queue.filter(c => c.id !== customerId));
    if (customerId === myTicketId) {
      setMyTicketId('');
    }
  };

  const handleCompleteCut = (chairId) => {
    const activeChair = barbers.find(b => b.id === chairId);
    if (!activeChair || !activeChair.customer) return;

    playSynthesizedSound('snip', soundEnabled);

    const completedSession = {
      customerName: activeChair.customer.name,
      barberName: activeChair.name,
      completedAt: new Date().toISOString()
    };

    setHistory(prevHistory => [...prevHistory, completedSession]);

    const updatedBarbers = barbers.map(barber => {
      if (barber.id === chairId) {
        return { ...barber, customer: null, startTime: null };
      }
      return barber;
    });

    setBarbers(updatedBarbers);
  };

  const handleToggleBreak = (chairId) => {
    const updatedBarbers = barbers.map(barber => {
      if (barber.id === chairId && !barber.customer) {
        const nextStatus = barber.status === 'break' ? 'active' : 'break';
        return { ...barber, status: nextStatus };
      }
      return barber;
    });
    setBarbers(updatedBarbers);
  };

  const handleAddBarber = (barberData) => {
    const newBarber = {
      id: `b-${Date.now()}`,
      name: barberData.name,
      specialty: barberData.specialty,
      status: 'active',
      customer: null,
      startTime: null
    };
    setBarbers([...barbers, newBarber]);
  };

  const handleRemoveBarber = (barberId) => {
    const target = barbers.find(b => b.id === barberId);
    if (!target || target.customer) return;

    // Reroute specific queue lists
    setBarbers(barbers.filter(b => b.id !== barberId));

    const updatedQueue = queue.map(customer => {
      if (customer.preferredBarberId === barberId) {
        return {
          ...customer,
          preferredBarberId: 'any',
          preferredBarberName: 'Next Available'
        };
      }
      return customer;
    });
    setQueue(updatedQueue);
  };

  const handleClearQueue = () => {
    if (window.confirm("Are you sure you want to clear the entire waitlist?")) {
      setQueue([]);
      setMyTicketId('');
    }
  };

  const handleResetStats = () => {
    if (window.confirm("Are you sure you want to reset all completed services history logs?")) {
      setHistory([]);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Dynamic Header */}
      <Header
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
        isShopOpen={isShopOpen}
        currentView={currentView}
        onPortalClick={() => setCurrentView('login')}
        onLogout={handleLogout}
      />

      {/* Main View Manager */}
      {currentView === 'login' ? (
        <LoginScreen 
          onLoginSuccess={handleLoginSuccess}
          onBackToCustomer={() => setCurrentView('customer')}
        />
      ) : (
        <>
          {/* Global Statistics Indicators */}
          <StatsPanel 
            queue={queue}
            barbers={barbers}
            history={history}
          />

          {/* Primary Main Stations viewport */}
          <main style={{ width: '100%' }}>
            <ActiveChairs
              chairs={barbers}
              isAdmin={currentView === 'owner'}
              onCompleteCut={handleCompleteCut}
              onToggleBreak={handleToggleBreak}
              queue={queue}
              onRemoveFromQueue={handleRemoveFromQueue}
              myTicketId={myTicketId}
            />
          </main>

          {/* Customer History Log Panel - Visible strictly in customer landing view */}
          {currentView === 'customer' && (
            <CustomerHistory history={history} />
          )}

          {/* Owner Dashboard Control Center - Only visible in authenticated 'owner' mode */}
          {currentView === 'owner' && (
            <AdminPanel
              isShopOpen={isShopOpen}
              toggleShopOpen={() => setIsShopOpen(!isShopOpen)}
              onResetStats={handleResetStats}
              onClearQueue={handleClearQueue}
              onAddBarber={handleAddBarber}
              onRemoveBarber={handleRemoveBarber}
              history={history}
              barbers={barbers}
            />
          )}

          {/* Customer Ticket Reservation Modal (Triggered by Shop Owner in Owner View) */}
          <JoinQueueModal
            isOpen={isJoinModalOpen}
            onClose={() => setIsJoinModalOpen(false)}
            barbers={barbers}
            onJoinQueue={handleJoinQueue}
          />
        </>
      )}
    </div>
  );
}
