import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dog, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 md:h-16 bg-white border-b border-gray-200 z-10">
      <div className="max-w-screen-lg mx-auto h-full flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Dog className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold hidden sm:block text-gray-900">Woofstagram</span>
        </Link>

        {/* Search bar - only on desktop */}
        <div className="relative hidden md:block max-w-xs w-full">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none focus:outline-none focus:ring-0 ml-2 w-full text-sm"
            />
          </div>
        </div>

        {/* Navigation links - only on desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-500">
            Home
          </Link>
          <Link to="/explore" className="text-gray-700 hover:text-blue-500">
            Explore
          </Link>
          <Link to="/notifications" className="text-gray-700 hover:text-blue-500">
            Notifications
          </Link>
          <Link 
            to={`/profile/${currentUser?.username}`} 
            className="flex items-center"
          >
            <img
              src={currentUser?.profileImage}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover border border-gray-200"
            />
          </Link>
          <button 
            onClick={handleLogout}
            className="text-gray-700 hover:text-red-500"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;