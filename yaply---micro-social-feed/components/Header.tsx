
import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  me: UserProfile;
  onHome: () => void;
  onProfile: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme, me, onHome, onProfile, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 bg-white/70 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button onClick={onHome} className="flex items-center gap-3 hover:scale-105 transition-all active:scale-95 group">
            <div className="w-11 h-11 transition-all group-hover:scale-110">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
                <defs>
                  <linearGradient id="headerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="60%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                {/* Fat 3D-style bubble shape */}
                <path 
                  d="M15,45 C15,22.35 30.67,4 50,4 C69.33,4 85,22.35 85,45 C85,67.65 69.33,86 50,86 C46.12,86 42.41,85.39 38.93,84.27 L22,94 L27.4,78.2 C19.86,70.52 15,60.1 15,45 Z" 
                  fill="url(#headerLogoGradient)" 
                />
                {/* Three dots from the brand image */}
                <circle cx="35" cy="45" r="4.5" fill="white" fillOpacity="0.9" />
                <circle cx="50" cy="45" r="4.5" fill="white" fillOpacity="0.9" />
                <circle cx="65" cy="45" r="4.5" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-[950] tracking-tighter gradient-text leading-none">
                Yaply
              </h1>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none mt-1">Network</span>
            </div>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={onToggleTheme}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400 group"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5 group-hover:-rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

            <div className="flex items-center gap-2">
              <button 
                onClick={onProfile}
                className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              >
                <img src={me.avatarUrl} className="w-9 h-9 rounded-xl object-cover shadow-md group-hover:scale-110 transition-transform" alt="" />
                <div className="text-left hidden md:block">
                  <p className="text-[13px] font-[800] leading-none dark:text-white">{me.displayName}</p>
                  <p className="text-[10px] text-slate-500 font-bold tracking-tight">@{me.username}</p>
                </div>
              </button>
              
              <button 
                onClick={onLogout}
                className="p-3 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
