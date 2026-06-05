// C:\Users\himanshu\.gemini\antigravity\scratch\barber-queue-app\src\App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import ActiveChairs from './components/ActiveChairs';
import JoinQueueModal from './components/JoinQueueModal';
import AdminPanel from './components/AdminPanel';
import LoginScreen from './components/LoginScreen';
import CustomerHistory from './components/CustomerHistory';

// Import Firestore database reference and SDK methods
import { db, auth } from './firebase';
import { getRedirectResult } from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';

import './index.css';
import './styles/components.css';

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
  const [trackName, setTrackName] = useState(localStorage.getItem('trimtime_track_name') || '');
  const [allowCustomerJoin, setAllowCustomerJoin] = useState(false);

  // Authentication View Controller
  const [currentView, setCurrentView] = useState(() => {
    const savedAuth = localStorage.getItem('trimtime_auth');
    return savedAuth === 'true' ? 'owner' : 'customer';
  });

  // Database-Backed States
  const [barbers, setBarbers] = useState([]);
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);

  // 1. Subscribe to Barbers/Chairs Collection (Real-Time)
  useEffect(() => {
    const q = query(collection(db, 'barbers'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      // Sort styling stations by order key
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      setBarbers(list);
    }, (error) => {
      console.warn("Firestore connection inactive (using local mock fallback):", error);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Queue Waitlist Collection (Real-Time)
  useEffect(() => {
    const q = query(collection(db, 'queue'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setQueue(list);
    }, (error) => {
      console.warn("Queue stream inactive:", error);
    });
    return () => unsubscribe();
  }, []);

  // 3. Subscribe to Completed Cuts History Collection (Real-Time)
  useEffect(() => {
    const q = query(collection(db, 'history'), orderBy('completedAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setHistory(list);
    }, (error) => {
      console.warn("History stream inactive:", error);
    });
    return () => unsubscribe();
  }, []);

  // 3b. Subscribe to global Settings configs (Real-Time)
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'config'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setIsShopOpen(data.isShopOpen !== undefined ? data.isShopOpen : true);
        setAllowCustomerJoin(data.allowCustomerJoin || false);
      } else {
        // Initialize default settings doc
        setDoc(doc(db, 'settings', 'config'), {
          isShopOpen: true,
          allowCustomerJoin: false
        });
      }
    }, (error) => {
      console.warn("Settings configuration stream inactive:", error);
    });
    return () => unsubscribe();
  }, []);

  // 3c. Capture Google authentication redirect success
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const pendingDataStr = localStorage.getItem('trimtime_pending_join');
          if (pendingDataStr) {
            const pendingData = JSON.parse(pendingDataStr);
            localStorage.removeItem('trimtime_pending_join');

            // Find full barber name mapping
            let resolvedBarberName = 'Next Available';
            if (pendingData.preferredBarberId !== 'any' && barbers.length > 0) {
              const matchedBarber = barbers.find(b => b.id === pendingData.preferredBarberId);
              if (matchedBarber) {
                resolvedBarberName = matchedBarber.name;
              }
            }

            await handleJoinQueue({
              name: pendingData.name,
              preferredBarberId: pendingData.preferredBarberId,
              preferredBarberName: resolvedBarberName,
              cost: Number(pendingData.cost) || 0,
              authorizedBy: result.user.email
            });

            // Set track name so they see themselves highlighted
            setTrackName(pendingData.name);
            localStorage.setItem('trimtime_track_name', pendingData.name);
          }
        }
      } catch (err) {
        console.error("Authentication redirect check failed:", err);
      }
    };

    if (barbers.length > 0) {
      checkRedirect();
    }
  }, [barbers]);

  // 4. Auto-Seeding Database on Initial Connection (If Collections are Empty)
  useEffect(() => {
    const seedDatabase = async () => {
      try {
        const barbersSnap = await getDocs(collection(db, 'barbers'));
        if (barbersSnap.empty) {
          // Initialize default barbers
          await setDoc(doc(db, 'barbers', 'alex'), {
            name: 'Alex Rivers',
            specialty: 'Classic Cuts & Fades',
            status: 'active',
            customer: { name: 'Leonidas of Sparta', cost: 150 },
            startTime: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
            order: 1
          });
          await setDoc(doc(db, 'barbers', 'sam'), {
            name: 'Sam Thorne',
            specialty: 'Beards & Hot Shaves',
            status: 'active',
            customer: { name: 'Alexander The Great', cost: 200 },
            startTime: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
            order: 2
          });
          await setDoc(doc(db, 'barbers', 'jordan'), {
            name: 'Jordan Vance',
            specialty: 'Modern Styling',
            status: 'active',
            customer: null,
            startTime: null,
            order: 3
          });
        }

        const queueSnap = await getDocs(collection(db, 'queue'));
        if (queueSnap.empty) {
          // Initialize default queue
          await setDoc(doc(db, 'queue', 'c-1'), {
            name: 'Marcus Aurelius',
            preferredBarberId: 'alex',
            preferredBarberName: 'Alex Rivers',
            cost: 150,
            createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
          });
          await setDoc(doc(db, 'queue', 'c-2'), {
            name: 'Cleopatra VII',
            preferredBarberId: 'any',
            preferredBarberName: 'Next Available',
            cost: 100,
            createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
          });
          await setDoc(doc(db, 'queue', 'c-3'), {
            name: 'Julius Caesar',
            preferredBarberId: 'sam',
            preferredBarberName: 'Sam Thorne',
            cost: 120,
            createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString()
          });
        }
      } catch (err) {
        console.warn("Auto-seeding skipped. This is normal if you haven't replaced the placeholder keys in firebase.js yet.", err);
      }
    };
    seedDatabase();
  }, []);

  // Sync myTicketId with localStorage
  useEffect(() => {
    if (myTicketId) {
      localStorage.setItem('myTicketId', myTicketId);
    } else {
      localStorage.removeItem('myTicketId');
    }
  }, [myTicketId]);


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


  // FIREBASE WRITE TRANSACTION HANDLERS

  // Add client to the queue (seating them immediately if an eligible chair is open)
  const handleJoinQueue = async (customerData) => {
    try {
      // Auto-set the tracking name for the user
      setTrackName(customerData.name);
      localStorage.setItem('trimtime_track_name', customerData.name);

      if (isShopOpen) {
        // Scan for active, vacant chairs that fit customer preference
        const freeBarber = barbers.find(b => 
          b.status === 'active' && 
          !b.customer && 
          (customerData.preferredBarberId === 'any' || customerData.preferredBarberId === b.id)
        );

        if (freeBarber) {
          // Seat immediately
          await updateDoc(doc(db, 'barbers', freeBarber.id), {
            customer: { 
              name: customerData.name,
              cost: Number(customerData.cost) || 0,
              authorizedBy: customerData.authorizedBy || 'Guest'
            },
            startTime: new Date().toISOString()
          });
          playSynthesizedSound('chime', soundEnabled);
          return;
        }
      }

      // No vacant chairs or shop paused: write to waitlist queue collection
      const clientId = `c-${Date.now()}`;
      await setDoc(doc(db, 'queue', clientId), {
        name: customerData.name,
        preferredBarberId: customerData.preferredBarberId,
        preferredBarberName: customerData.preferredBarberName,
        cost: Number(customerData.cost) || 0,
        createdAt: new Date().toISOString(),
        authorizedBy: customerData.authorizedBy || 'Guest'
      });

      setMyTicketId(clientId);
      playSynthesizedSound('chime', soundEnabled);
    } catch (err) {
      console.error("Firestore Write Failed:", err);
    }
  };

  // Remove client from waitlist
  const handleRemoveFromQueue = async (customerId) => {
    try {
      await deleteDoc(doc(db, 'queue', customerId));
      if (customerId === myTicketId) {
        setMyTicketId('');
      }
    } catch (err) {
      console.error("Firestore Delete Failed:", err);
    }
  };

  // Complete Cut (Checkout current customer and automatically pull next eligible waitlist doc)
  const handleCompleteCut = async (chairId) => {
    try {
      const activeChair = barbers.find(b => b.id === chairId);
      if (!activeChair || !activeChair.customer) return;

      playSynthesizedSound('snip', soundEnabled);

      // 1. Log completed haircut in history
      await addDoc(collection(db, 'history'), {
        customerName: activeChair.customer.name,
        barberId: chairId,
        barberName: activeChair.name,
        cost: Number(activeChair.customer.cost) || 0,
        completedAt: new Date().toISOString()
      });

      // 2. Scan waitlist queue for next eligible client
      let seatedCustomer = null;
      let targetClientId = null;

      if (isShopOpen) {
        // Waitlist is already sorted chronologically via query subscription
        const nextCustomerDoc = queue.find(c => 
          c.preferredBarberId === 'any' || c.preferredBarberId === chairId
        );
        if (nextCustomerDoc) {
          seatedCustomer = { 
            name: nextCustomerDoc.name,
            cost: Number(nextCustomerDoc.cost) || 0
          };
          targetClientId = nextCustomerDoc.id;
        }
      }

      // 3. Update styling chair state (seat new customer or vacate)
      await updateDoc(doc(db, 'barbers', chairId), {
        customer: seatedCustomer,
        startTime: seatedCustomer ? new Date().toISOString() : null
      });

      // 4. Delete client document from the waitlist
      if (targetClientId) {
        await deleteDoc(doc(db, 'queue', targetClientId));
        playSynthesizedSound('chime', soundEnabled);
      }
    } catch (err) {
      console.error("Firestore Complete Session Transaction Failed:", err);
    }
  };

  // Toggle barber break status (automatically seats waiting client if switching to active)
  const handleToggleBreak = async (chairId) => {
    try {
      const barber = barbers.find(b => b.id === chairId);
      if (!barber || barber.customer) return;

      const nextStatus = barber.status === 'break' ? 'active' : 'break';
      let seatedCustomer = null;
      let targetClientId = null;

      // If returning from break, check if we can seat a client instantly
      if (nextStatus === 'active' && isShopOpen) {
        const nextCustomerDoc = queue.find(c => 
          c.preferredBarberId === 'any' || c.preferredBarberId === chairId
        );
        if (nextCustomerDoc) {
          seatedCustomer = { 
            name: nextCustomerDoc.name,
            cost: Number(nextCustomerDoc.cost) || 0
          };
          targetClientId = nextCustomerDoc.id;
        }
      }

      // Update barber break state
      await updateDoc(doc(db, 'barbers', chairId), {
        status: nextStatus,
        customer: seatedCustomer,
        startTime: seatedCustomer ? new Date().toISOString() : null
      });

      // Remove from waitlist
      if (targetClientId) {
        await deleteDoc(doc(db, 'queue', targetClientId));
        playSynthesizedSound('chime', soundEnabled);
      }
    } catch (err) {
      console.error("Firestore Toggle Break Failed:", err);
    }
  };

  // Toggle Auto-Seating (automatically seats waiting clients when turned ON)
  const handleToggleShopOpen = async () => {
    const nextShopState = !isShopOpen;
    try {
      await updateDoc(doc(db, 'settings', 'config'), { isShopOpen: nextShopState });

      if (nextShopState) {
        // Seating Sweep: check if any vacant active barbers can seat waiting clients
        let currentQueue = [...queue];
        for (const barber of barbers) {
          if (barber.status === 'active' && !barber.customer) {
            const nextIdx = currentQueue.findIndex(c => 
              c.preferredBarberId === 'any' || c.preferredBarberId === barber.id
            );
            if (nextIdx !== -1) {
              const customerToSeat = currentQueue[nextIdx];
              currentQueue.splice(nextIdx, 1);

              // Seat in database
              await updateDoc(doc(db, 'barbers', barber.id), {
                customer: { 
                  name: customerToSeat.name,
                  cost: Number(customerToSeat.cost) || 0
                },
                startTime: new Date().toISOString()
              });
              await deleteDoc(doc(db, 'queue', customerToSeat.id));
            }
          }
        }
      }
    } catch (err) {
      console.error("Firestore Resume Seating Sweep Failed:", err);
    }
  };

  // Toggle Customer self join permissions
  const handleToggleAllowCustomerJoin = async () => {
    try {
      await updateDoc(doc(db, 'settings', 'config'), { allowCustomerJoin: !allowCustomerJoin });
    } catch (err) {
      console.error("Firestore Toggle Allow Customer Join Failed:", err);
    }
  };

  // Add custom styling chair
  const handleAddBarber = async (barberData) => {
    try {
      const id = `b-${Date.now()}`;
      await setDoc(doc(db, 'barbers', id), {
        name: barberData.name,
        specialty: barberData.specialty,
        status: 'active',
        customer: null,
        startTime: null,
        order: barbers.length + 1
      });
    } catch (err) {
      console.error("Firestore Add Chair Failed:", err);
    }
  };

  // Delete styling chair (converts Jordan-specific lines to Next Available)
  const handleRemoveBarber = async (barberId) => {
    try {
      const target = barbers.find(b => b.id === barberId);
      if (!target || target.customer) return;

      // Delete chair
      await deleteDoc(doc(db, 'barbers', barberId));

      // Re-route waiting clients
      for (const customer of queue) {
        if (customer.preferredBarberId === barberId) {
          await updateDoc(doc(db, 'queue', customer.id), {
            preferredBarberId: 'any',
            preferredBarberName: 'Next Available'
          });
        }
      }
    } catch (err) {
      console.error("Firestore Remove Chair Failed:", err);
    }
  };

  // Empty the waitlist collection
  const handleClearQueue = async () => {
    if (!window.confirm("Are you sure you want to clear the entire waitlist?")) return;
    try {
      for (const customer of queue) {
        await deleteDoc(doc(db, 'queue', customer.id));
      }
      setMyTicketId('');
    } catch (err) {
      console.error("Firestore Clear Queue Failed:", err);
    }
  };

  // Reset Completed cuts history log
  const handleResetStats = async () => {
    if (!window.confirm("Are you sure you want to reset all completed services history logs?")) return;
    try {
      for (const item of history) {
        await deleteDoc(doc(db, 'history', item.id));
      }
    } catch (err) {
      console.error("Firestore Reset History Failed:", err);
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
        allowCustomerJoin={allowCustomerJoin}
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

          {/* Customer Self-Tracking Input Banner */}
          {currentView === 'customer' && (
            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', padding: '12px 20px', marginTop: '-8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>🔍</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-gold)' }}>Track Your Turn Live</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Enter your name to highlight your ticket in the queues below</div>
                </div>
              </div>
              <input
                type="text"
                className="form-input"
                style={{ maxWidth: '280px', padding: '8px 12px', fontSize: '13px' }}
                placeholder="Enter your name..."
                value={trackName}
                onChange={(e) => {
                  setTrackName(e.target.value);
                  localStorage.setItem('trimtime_track_name', e.target.value);
                }}
              />
            </div>
          )}

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
              trackName={trackName}
            />
          </main>

          {/* Customer History Log Panel */}
          {currentView === 'customer' && (
            <CustomerHistory history={history} />
          )}

          {/* Owner Dashboard Control Center */}
          {currentView === 'owner' && (
            <AdminPanel
              isShopOpen={isShopOpen}
              toggleShopOpen={handleToggleShopOpen}
              onResetStats={handleResetStats}
              onClearQueue={handleClearQueue}
              onAddBarber={handleAddBarber}
              onRemoveBarber={handleRemoveBarber}
              history={history}
              barbers={barbers}
              allowCustomerJoin={allowCustomerJoin}
              toggleAllowCustomerJoin={handleToggleAllowCustomerJoin}
            />
          )}

          {/* Customer Ticket Reservation Modal */}
          <JoinQueueModal
            isOpen={isJoinModalOpen}
            onClose={() => setIsJoinModalOpen(false)}
            barbers={barbers}
            queue={queue}
            onJoinQueue={handleJoinQueue}
            requireGoogleAuth={currentView === 'customer'}
          />
        </>
      )}
    </div>
  );
}
