import { initializeApp } from '@firebase/app';
import { getFirestore } from '@firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // NOTE: Replace these with your actual Firebase config values from the Firebase console
  apiKey: "YOUR_API_KEY",
  authDomain: "german-day-competitions.firebaseapp.com",
  projectId: "german-day-competitions",
  storageBucket: "german-day-competitions.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };