
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { login } from '../utils/auth';
import { BRAND_AVATAR } from '../constants';

interface AuthProps {
  users: UserProfile[];
  onLogin: (user: UserProfile) => void;
  onRegister: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ users, onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const normalizedUsername = username.trim().toLowerCase();
    const cleanPassword = password;
    
    if (!normalizedUsername || !cleanPassword) {
      setError('Please provide both username and password.');
      return;
    }

    setIsLoading(true);

    if (isLogin) {
      const user = login(normalizedUsername, cleanPassword);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid username or password.');
        setIsLoading(false);
      }
    } else {
      if (!displayName.trim()) {
        setError('Please provide a display name.');
        setIsLoading(false);
        return;
      }

      const exists = users.some(u => u.username.toLowerCase().trim() === normalizedUsername);
      if (exists) {
        setError('Username already taken.');
        setIsLoading(false);
      } else {
        const newUser: UserProfile = {
          id: crypto.randomUUID(),
          username: normalizedUsername,
          password: cleanPassword,
          displayName: displayName.trim(),
          bio: '',
          avatarUrl: BRAND_AVATAR,
          bannerUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1000',
          following: [],
          followers: [],
          createdAt: Date.now(),
          role: 'user',
          isVerified: false
        };
        onRegister(newUser);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 z-[999] overflow-y-auto transition-colors duration-300">
      <div className="max-w-[440px] w-full bg-white dark:bg-slate-900 rounded-[4rem] p-10 md:p-14 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-none border border-white/50 dark:border-slate-800 text-center animate-in fade-in zoom-in duration-700">
        
        <div className="flex flex-col items-center mb-10">
           <div className="w-24 h-24 mb-6 transition-transform hover:scale-110 duration-500">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
                <defs>
                  <linearGradient id="authLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="60%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <path 
                  d="M15,45 C15,22.35 30.67,4 50,4 C69.33,4 85,22.35 85,45 C85,67.65 69.33,86 50,86 C46.12,86 42.41,85.39 38.93,84.27 L22,94 L27.4,78.2 C19.86,70.52 15,60.1 15,45 Z" 
                  fill="url(#authLogoGradient)" 
                />
                <circle cx="35" cy="45" r="4.5" fill="white" fillOpacity="0.9" />
                <circle cx="50" cy="45" r="4.5" fill="white" fillOpacity="0.9" />
                <circle cx="65" cy="45" r="4.5" fill="white" fillOpacity="0.9" />
              </svg>
           </div>
           <h1 className="text-4xl font-[1000] tracking-tighter gradient-text uppercase leading-none">
             Yaply
           </h1>
           <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mt-3">Chat. Share. Connect.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <input 
                required
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-full px-8 py-5 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 dark:text-slate-200 font-semibold shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Full Name"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
              />
            </div>
          )}

          <div className="relative">
            <input 
              required
              type="text" 
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-full px-8 py-5 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 dark:text-slate-200 font-semibold shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="relative">
            <input 
              required
              type="password" 
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-full px-8 py-5 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 dark:text-slate-200 font-semibold shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-[11px] font-black uppercase tracking-widest text-rose-500 animate-pulse">
              {error}
            </p>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 gradient-bg animate-gradient text-white rounded-full font-black text-xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
          >
            {isLoading ? '...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-10">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-blue-500 dark:text-blue-400 text-sm font-black uppercase tracking-widest hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
