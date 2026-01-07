
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { hashPassword } from '../utils/auth';
import { BRAND_AVATAR } from '../constants';

interface OnboardingProps {
  onComplete: (user: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState(BRAND_AVATAR);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !displayName.trim() || !password.trim()) return;

    setIsSubmitting(true);
    try {
      const passwordHash = await hashPassword(password);

      const newUser: UserProfile = {
        id: crypto.randomUUID(),
        username: username.trim().toLowerCase(),
        password: passwordHash, 
        displayName: displayName.trim(),
        bio: '',
        avatarUrl: avatar,
        bannerUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1000',
        following: [],
        followers: [],
        createdAt: Date.now(),
        role: 'user',
        isVerified: false
      };
      onComplete(newUser);
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 z-[999]">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl border border-slate-200 dark:border-slate-800 text-center glass-card animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 mx-auto mb-8 transition-transform hover:rotate-6">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
            <defs>
              <linearGradient id="onboardingLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <path 
              d="M85,45 C85,65 70,80 50,80 C45,80 40,79 35,77 L15,85 L22,65 C18,59 15,52 15,45 C15,25 30,10 50,10 C70,10 85,25 85,45 Z" 
              fill="url(#onboardingLogoGradient)" 
            />
            <circle cx="35" cy="45" r="4" fill="white" />
            <circle cx="50" cy="45" r="4" fill="white" />
            <circle cx="65" cy="45" r="4" fill="white" />
          </svg>
        </div>
        <h1 className="text-4xl font-[950] text-slate-900 dark:text-white mb-2 tracking-tighter">Your Profile.</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Customize your presence on Yaply.</p>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="flex flex-col items-center mb-6">
             <div className="relative group">
                <img src={avatar} className="w-28 h-28 rounded-[2.5rem] object-cover border-4 border-slate-100 dark:border-slate-800 shadow-2xl" alt="Avatar Preview" />
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2.5rem] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
             </div>
             <p className="text-[10px] text-slate-400 font-[900] uppercase mt-4 tracking-[0.3em]">Identity Mark</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block">Handle</label>
              <div className="relative mt-1">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-11 pr-5 py-5 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-medium"
                  placeholder="e.g. big_yapper"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-medium"
                placeholder="e.g. Alex Rivera"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block">Password</label>
              <input 
                required
                type="password" 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-medium"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 gradient-bg animate-gradient text-white rounded-[2rem] font-[900] text-xl uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-2xl shadow-blue-500/30 active:scale-95 disabled:opacity-50 mt-6"
          >
            {isSubmitting ? '...' : 'Launch'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
