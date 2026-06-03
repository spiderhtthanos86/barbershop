// C:\Users\himanshu\.gemini\antigravity\scratch\barber-queue-app\src\firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace the values below with your specific Firebase Project Config keys from the Firebase Console:
// Project Settings -> General -> Your Apps -> Web App
const firebaseConfig = {
  apiKey: "PLACEHOLDER_API_KEY",
  authDomain: "barbershop-waiting.firebaseapp.com",
  projectId: "barbershop-waiting",
  storageBucket: "barbershop-waiting.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export db
export const db = getFirestore(app);
