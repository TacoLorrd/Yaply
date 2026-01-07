
import React, { useState, useRef, useEffect } from 'react';
import { MAX_CHARS, SPACES } from '../constants';
import { UserProfile } from '../types';
import { SpaceIcon, Icons } from './Icons';

interface PostFormProps {
  onPost: (content: string, spaceId: string) => void;
  me: UserProfile;
  defaultSpace?: string;
}

const PostForm: React.FC<PostFormProps> = ({ onPost, me, defaultSpace = 'general' }) => {
  const [content, setContent] = useState('');
  const [selectedSpace, setSelectedSpace] = useState(defaultSpace);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedSpace(defaultSpace);
  }, [defaultSpace]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHARS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isOverLimit) {
      onPost(content.trim(), selectedSpace);
      setContent('');
    }
  };

  const currentSpace = SPACES.find(s => s.id === selectedSpace) || SPACES[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200 dark:border-slate-800 transition-all focus-within:ring-4 focus-within:ring-blue-500/10 dark:focus-within:ring-blue-500/5">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-5">
          <div className="shrink-0">
            <img 
              src={me.avatarUrl} 
              alt="Avatar" 
              className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-slate-50 dark:border-slate-800"
            />
          </div>
          <div className="grow space-y-4">
            <textarea
              ref={textAreaRef}
              rows={3}
              placeholder="What's on your mind?"
              className="w-full bg-transparent border-none text-xl font-medium resize-none focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-slate-700 dark:text-slate-100 min-h-[100px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            <div className="flex flex-wrap items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800 gap-4">
              <div className="flex items-center gap-2">
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all outline-none"
                  >
                    <SpaceIcon icon={currentSpace.icon} className="w-4 h-4 text-blue-500" />
                    {currentSpace.label}
                    <Icons.ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute bottom-full mb-3 left-0 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                      <div className="p-2 space-y-1">
                        {SPACES.map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => { setSelectedSpace(s.id); setIsDropdownOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${selectedSpace === s.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                          >
                            <SpaceIcon icon={s.icon} className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{s.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5 ml-auto">
                <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${isOverLimit ? 'text-rose-500' : 'text-slate-400'}`}>
                  {charCount}/{MAX_CHARS}
                </span>
                <button
                  type="submit"
                  disabled={!content.trim() || isOverLimit}
                  className="px-10 py-3.5 gradient-bg animate-gradient text-white rounded-2xl font-[800] text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                >
                  Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
