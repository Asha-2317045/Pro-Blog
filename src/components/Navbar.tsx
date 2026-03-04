import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LogOut, PenSquare, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          ProBlog
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/feed" className="text-sm font-medium text-zinc-600 hover:text-black transition-colors">
            Feed
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-zinc-600 hover:text-black transition-colors flex items-center gap-2">
                <PenSquare className="w-4 h-4" />
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-zinc-600 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-zinc-600 hover:text-black transition-colors">
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
