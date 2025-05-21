import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MobileNavbar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex items-center justify-around h-16">
        <Link to="/" className={`flex flex-col items-center justify-center ${isActive('/') ? 'text-blue-500' : 'text-gray-500'}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link to="/explore" className={`flex flex-col items-center justify-center ${isActive('/explore') ? 'text-blue-500' : 'text-gray-500'}`}>
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Explore</span>
        </Link>
        
        <Link to="/upload" className={`flex flex-col items-center justify-center ${isActive('/upload') ? 'text-blue-500' : 'text-gray-500'}`}>
          <PlusSquare className="h-6 w-6" />
          <span className="text-xs mt-1">Upload</span>
        </Link>
        
        <Link to="/notifications" className={`flex flex-col items-center justify-center ${isActive('/notifications') ? 'text-blue-500' : 'text-gray-500'}`}>
          <Heart className="h-6 w-6" />
          <span className="text-xs mt-1">Activity</span>
        </Link>
        
        <Link to={`/profile/${currentUser?.username}`} className={`flex flex-col items-center justify-center ${isActive(`/profile/${currentUser?.username}`) ? 'text-blue-500' : 'text-gray-500'}`}>
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavbar;