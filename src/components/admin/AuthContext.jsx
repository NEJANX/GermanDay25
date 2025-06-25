import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from '@firebase/auth';
import { doc, getDoc, getDocs, collection } from '@firebase/firestore';
import { auth, db } from '../../firebase-config';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sign in function
  const login = async (email, password) => {
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      throw err;
    }
  };
  
// useEffect(() => {
//   let hasFetched = false;

//   const fetchAndLogCSV = async () => {
//     if (hasFetched) return; // Prevent duplicate runs
//     hasFetched = true;

//     const competitionIds = ['ttc', 'speech', 'art', 'singing', 'poetry'];
//     const allData = [];
//     const cutoffTime = new Date(Date.UTC(2025, 5, 25, 23, 32, 0)); // June 25, 2025 23:32 IST

//     console.log("🔍 Gathering registration data from all competitions...");

//     for (const compId of competitionIds) {
//       try {
//         const registrationsRef = collection(db, 'submissions');
//         const snapshot = await getDocs(registrationsRef);

//         snapshot.forEach(docSnap => {
//           const data = docSnap.data();
//           const submittedAt = data.submittedAt?.toDate?.();

//           if (submittedAt && submittedAt > cutoffTime) {
//             allData.push({
//               ...data,
//             });
//           }
//         });
//       } catch (err) {
//         console.error(`❌ Error fetching ${compId}:`, err);
//       }
//     }

//     // Remove duplicates
//     const seen = new Set();
//     const uniqueData = allData.filter(entry => {
//       const key = JSON.stringify(entry);
//       if (seen.has(key)) return false;
//       seen.add(key);
//       return true;
//     });

//     if (uniqueData.length === 0) {
//       console.warn("No unique registration data found after cutoff.");
//       return;
//     }

//     const allKeys = Array.from(new Set(uniqueData.flatMap(obj => Object.keys(obj))));
//     const header = allKeys.join(',');
//     const rows = uniqueData.map(row =>
//       allKeys.map(key => JSON.stringify(row[key] ?? '')).join(',')
//     );
//     const csvContent = [header, ...rows].join('\n');

//     console.log("📄 CSV Output:\n", csvContent);

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'submissions.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (adminData && currentUser) {
//     fetchAndLogCSV();
//   }
// }, [adminData, currentUser]);


//   // Sign out function
//   const logout = async () => {
//     try {
//       await signOut(auth);
//     } catch (err) {
//       console.error('Logout error:', err);
//       setError(err.message || 'Failed to logout');
//     }
//   };

  // Setup auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch admin data from admins collection
        try {
          const adminRef = doc(db, 'admins', user.uid);
          const adminSnap = await getDoc(adminRef);
          
          if (adminSnap.exists()) {
            setAdminData(adminSnap.data());
          } else {
            console.warn('No admin data found for user:', user.uid);
            setAdminData(null);
          }
        } catch (err) {
          console.error('Error fetching admin data:', err);
          setAdminData(null);
        }
      } else {
        setAdminData(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  

  const value = {
    currentUser,
    adminData,
    login,
    logout,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}