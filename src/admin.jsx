import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './style.css';
import './admin-style.css'; // Import admin-specific styles
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import RegistrationDetails from './pages/admin/RegistrationDetails.jsx';
import AuthProvider, { useAuth } from './components/admin/AuthContext.jsx';
import AdminLayout from './components/admin/ui/AdminLayout.jsx';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Show loading state while auth is being checked
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      </AdminLayout>
    );
  }
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/admin.html" replace />;
  }
  
  return children;
};

const AdminApp = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin.html" element={
            <AdminLayout>
              <AdminLogin />
            </AdminLayout>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/registration/:competitionId/:registrationId" element={
            <ProtectedRoute>
              <AdminLayout>
                <RegistrationDetails />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/admin.html" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById('admin-root')).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);