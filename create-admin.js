// A script to create an admin user for the German Day Admin Panel
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';
import { getFirestore, doc, setDoc } from '@firebase/firestore';

// Firebase configuration
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

async function createAdmin() {
  // Get command line arguments
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'Admin User';
  
  if (!email || !password) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: Email and password are required.');
    console.log('\x1b[33m%s\x1b[0m', 'Usage: node create-admin.js <email> <password> [name]');
    process.exit(1);
  }
  
  try {
    console.log('\x1b[36m%s\x1b[0m', `Creating admin account for ${email}...`);
    
    // Create the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store admin data in Firestore
    await setDoc(doc(db, 'admins', user.uid), {
      email,
      name,
      role: 'admin',
      createdAt: new Date()
    });
    
    console.log('\x1b[32m%s\x1b[0m', `✅ Admin account created successfully for ${email}!`);
    console.log('\x1b[32m%s\x1b[0m', `You can now log in at /admin.html with these credentials.`);
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Error creating admin: ${error.message}`);
    process.exit(1);
  }
}

createAdmin();