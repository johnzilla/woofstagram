import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MobileNavbar from './MobileNavbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar (desktop) */}
      <Navbar />
      
      {/* Main content */}
      <main className="pt-14 pb-16 md:pt-16 md:pb-0 md:ml-0">
        <div className="max-w-screen-md mx-auto px-4">
          <Outlet />
        </div>
      </main>
      
      {/* Bottom navigation bar (mobile) */}
      <MobileNavbar />
    </div>
  );
};

export default Layout;