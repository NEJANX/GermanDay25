import { initializeApp } from '@firebase/app';
import { getFirestore } from '@firebase/firestore';
import { getAuth } from '@firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAxL9FyyH5XpnkW4gRVPrYsHAihwA1jJfY",
    authDomain: "germanday25.firebaseapp.com",
    projectId: "germanday25",
    storageBucket: "germanday25.firebasestorage.app",
    messagingSenderId: "263383965515",
    appId: "1:263383965515:web:1498af146f1721c1c352ce",
    measurementId: "G-4CV80QWQXG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

export { db, auth };