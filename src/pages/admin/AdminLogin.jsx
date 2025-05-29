import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/admin/AuthContext.jsx';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '../../firebase-config';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      // Check if the user is an admin
      checkAdminStatus(currentUser.uid);
    }
  }, [currentUser, navigate]);
  
  // Check if the logged-in user is an admin
  const checkAdminStatus = async (userId) => {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', userId));
      
      if (adminDoc.exists()) {
        // User is an admin, navigate to dashboard
        navigate('/admin/dashboard');
      } else {
        // User is not an admin, show error and sign out
        setError('You do not have administrator privileges.');
        await logout();
      }
    } catch (err) {
      console.error("Error checking admin status:", err);
      setError('Failed to verify admin status.');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      // Navigation will be handled in the useEffect when currentUser changes
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl transform transition-all duration-500 hover:shadow-yellow-500/10">
        {/* Logo or Brand mark */}
        <div className="text-center mb-8">
          {/* <div className="mb-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🇩🇪</span>
            </div>
          </div> */}
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-full mb-2"></div>
          <p className="text-white/70">Sign in to manage German Day registrations</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 animate-pulse">
            <p className="text-white text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/40" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg> */}
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input pl-10"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/40" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg> */}
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input pl-10"
                placeholder='********'
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                <span className="ml-2">Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
          
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-6"></div>
        </form>
        
        <div className="mt-8 text-center text-sm text-white/50">
          <p>German Day Admin Panel</p>
          <p className="mt-1">© {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}