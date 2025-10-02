// components/layout/Header.jsx - Responsive Version
'use client';
import { useState } from 'react';

export default function Header({ user, onNavigate, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg">
      {/* Main Header */}
      <div className="flex justify-between items-center p-4 lg:p-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="font-bold text-xl lg:text-2xl">🌟 HRMS</div>
          <div className="text-white/85 text-sm hidden sm:block">Hire faster. Manage better.</div>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden lg:flex gap-4 items-center">
          <button 
            onClick={() => onNavigate('home')} 
            className="bg-transparent border-none text-white cursor-pointer text-base hover:text-blue-200 transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate('user')} 
            className="bg-transparent border-none text-white cursor-pointer text-base hover:text-blue-200 transition-colors"
          >
            Candidates
          </button>
          <button 
            onClick={() => onNavigate('staff')} 
            className="bg-transparent border-none text-white cursor-pointer text-base hover:text-blue-200 transition-colors"
          >
            Staff
          </button>
        </nav>

        {/* User Info / Auth Buttons - Desktop */}
        <div className="hidden lg:block">
          {user ? (
            <div className="flex gap-3 items-center">
              <div className="text-right">
                <div className="font-semibold">{user.username}</div>
                <div className="text-xs text-white/90">{user.role}</div>
              </div>
              <button 
                onClick={onLogout} 
                className="px-4 py-2 bg-red-500 border-none text-white rounded-lg cursor-pointer hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => onNavigate('user')} 
                className="px-4 py-2 bg-white/12 border border-white/20 text-white rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-6 h-6 flex flex-col justify-center gap-1">
            <div className={`h-0.5 w-full bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`h-0.5 w-full bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`h-0.5 w-full bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/10 border-t border-white/20 p-4 rounded-b-lg">
          {/* Navigation Links */}
          <div className="flex flex-col gap-3 mb-4">
            <button 
              onClick={() => {
                onNavigate('home');
                setIsMenuOpen(false);
              }} 
              className="w-full text-left p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => {
                onNavigate('user');
                setIsMenuOpen(false);
              }} 
              className="w-full text-left p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              Candidates
            </button>
            <button 
              onClick={() => {
                onNavigate('staff');
                setIsMenuOpen(false);
              }} 
              className="w-full text-left p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              Staff
            </button>
          </div>

          {/* User Info / Auth Buttons - Mobile */}
          {user ? (
            <div className="border-t border-white/20 pt-4">
              <div className="text-center mb-3">
                <div className="font-semibold text-white">{user.username}</div>
                <div className="text-sm text-white/90">{user.role}</div>
              </div>
              <button 
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }} 
                className="w-full p-3 bg-red-500 border-none text-white rounded-lg cursor-pointer hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="border-t border-white/20 pt-4">
              <button 
                onClick={() => {
                  onNavigate('user');
                  setIsMenuOpen(false);
                }} 
                className="w-full p-3 bg-white/12 border border-white/20 text-white rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
} 