import React from 'react';
import BackgroundAnimation from './BackgroundAnimation.jsx';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen relative bg-black"> {/* Ensure base background is dark */}
      {/* Beautiful animated background - Ensure these styles are in admin-style.css and are dark-themed */}
      <div className="admin-bg">
        <BackgroundAnimation /> {/* This component might also need theme adjustments if it has hardcoded colors */}
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