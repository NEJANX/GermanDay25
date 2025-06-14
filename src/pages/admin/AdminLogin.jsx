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
    // Updated main container background
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black to-gray-900">
      {/* Background elements - REMOVED German flag theme, using styles from admin-style.css or similar */}
      <div className="fixed inset-0 z-0">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"></div>
        {/* REMOVED German flag image background */}
        {/* REMOVED German flag top border */}
      </div>
      
      {/* Subtle glass elements - these should be styled by admin-style.css or similar for dark theme */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {[...Array(3)].map((_, i) => {
          const size = Math.random() * 300 + 100;
          const posX = Math.random() * 100;
          const posY = Math.random() * 100;
          
          return (
            <div 
              key={i}
              // Adjusted for darker theme - more subtle white/grey with low opacity
              className="absolute rounded-full backdrop-blur-lg bg-white/[0.01]" 
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${posX}%`,
                top: `${posY}%`,
<<<<<<< Updated upstream
                
=======
>>>>>>> Stashed changes
              }}
            />
          );
        })}
      </div>
      
      {/* Login form container - Updated for black glass theme */}
      <div className="max-w-md w-full relative z-10 backdrop-blur-lg bg-black/50 border border-gray-700/50 rounded-xl p-8 shadow-2xl transform transition-all duration-500">
        {/* REMOVED German flag themed logo - replaced with simple text or a new SVG icon */}
        <div className="text-center mb-8">
          {/* Optional: A simple monochrome icon or logo */}
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          {/* Updated title and subtitle text color */}
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-gray-400 to-gray-500 mb-2">Admin Login</h1>
          <p className="text-gray-400">Sign in to manage German Day registrations</p>
          
          {/* REMOVED German flag bar - Optional: subtle dark-themed accent */}
          {/* <div className="h-1 w-16 mx-auto mt-4 mb-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full"></div> */}
        </div>
        
        {/* Error Message - Updated styles */}
        {error && (
          <div className="bg-red-900/40 border border-red-700/60 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            {/* Updated label text color */}
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Updated icon color */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 pl-10 py-3 bg-gray-800/60 border border-gray-700/70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            {/* Updated label text color */}
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Updated icon color */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 pl-10 py-3 bg-gray-800/60 border border-gray-700/70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500"
                placeholder='********'
                required
              />
            </div>
          </div>
          
          {/* Updated button style */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                {/* Updated spinner color */}
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span className="ml-2">Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        {/* Updated footer text color */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Zeit für Deutschland '25</p>
          <p className="mt-1">© {new Date().getFullYear()} Royal College German Unit</p>
        </div>
      </div>
    </div>
  );
}