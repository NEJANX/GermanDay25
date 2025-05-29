import { initializeApp } from '@firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from '@firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from '@firebase/firestore';

// Your web app's Firebase configuration from firebase-config.js
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
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Create a new admin account
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @param {string} name - Admin name
 */
async function createAdmin(email, password, name) {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Add user to admins collection in Firestore
    await setDoc(doc(db, 'admins', user.uid), {
      email,
      name,
      role: 'admin',
      createdAt: new Date(),
    });
    
    console.log(`Successfully created admin account for ${email}`);
    return user;
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
}

/**
 * Verify if a user is an admin
 * @param {string} email - Admin email 
 * @param {string} password - Admin password
 */
async function verifyAdmin(email, password) {
  try {
    // Sign in the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if user exists in admins collection
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    
    if (adminDoc.exists()) {
      console.log('User verified as admin');
      return true;
    } else {
      console.log('User is not an admin');
      return false;
    }
  } catch (error) {
    console.error('Error verifying admin:', error);
    return false;
  }
}

// Example usage:
// Run this file to create an admin user
// To use in Node.js environment, uncomment the lines below and run with node:
/*
async function main() {
  try {
    const email = process.argv[2] || 'admin@example.com';
    const password = process.argv[3] || 'securePassword123!';
    const name = process.argv[4] || 'Admin User';
    
    if (!email || !password) {
      console.error('Please provide email and password');
      process.exit(1);
    }
    
    await createAdmin(email, password, name);
    process.exit(0);
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

main();
*/

export { createAdmin, verifyAdmin };