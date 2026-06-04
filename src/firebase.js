// C:\Users\himanshu\.gemini\antigravity\scratch\barber-queue-app\src\firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace the values below with your specific Firebase Project Config keys from the Firebase Console:
// Project Settings -> General -> Your Apps -> Web App
const firebaseConfig = {
  apiKey: "AIzaSyB_zkMBm08kAYKdjwXMxcMi1ih28CB6VLQ",
  authDomain: "trimtime-waitlist.firebaseapp.com",
  projectId: "trimtime-waitlist",
  storageBucket: "trimtime-waitlist.firebasestorage.app",
  messagingSenderId: "410703913057",
  appId: "1:410703913057:web:5a803f63cf0f88251cca20",
  measurementId: "G-SK3KL81QGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export db
export const db = getFirestore(app);
