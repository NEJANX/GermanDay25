import React from 'react';
import BackgroundAnimation from './BackgroundAnimation.jsx';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen relative">
      {/* Beautiful animated background */}
      <div className="admin-bg">
        <BackgroundAnimation />
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}