
import React, { useMemo } from 'react';
import { Post, UserProfile, ViewState } from '../types';
import { SPACES } from '../constants';
import { Icons, SpaceIcon } from './Icons';

interface SidebarProps {
  me: UserProfile;
  posts: Post[];
  trendingTags: { tag: string; count: number }[];
  view: ViewState;
  onViewChange: (v: ViewState) => void;
  onEditProfile: () => void;
  onTagClick: (tag: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ me, posts, trendingTags, view, onViewChange, onEditProfile, onTagClick }) => {
  const stats = useMemo(() => {
    const myPosts = posts.filter(p => p.userId === me.id);
    return {
      postsCount: myPosts.length,
      likesCount: myPosts.reduce((acc, p) => acc + Object.values(p.reactions).flat().length, 0),
    };
  }, [posts, me.id]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200 dark:border-slate-800 transition-all">
        <div className="h-32 gradient-bg animate-gradient relative">
          <img src={me.bannerUrl} className="w-full h-full object-cover opacity-60" alt="" />
        </div>
        <div className="px-8 pb-8">
          <div className="relative -mt-14 mb-5 inline-block">
            <img src={me.avatarUrl} className="w-24 h-24 rounded-[2rem] border-4 border-white dark:border-slate-900 shadow-2xl object-cover bg-white" alt="" />
          </div>
          <div className="flex items-center gap-2">
             <h2 className="text-2xl font-[900] dark:text-white leading-tight tracking-tight flex items-center gap-1.5">
               {me.displayName}
               {me.isVerified && (
                 <svg className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 24 24">
                   <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                 </svg>
               )}
             </h2>
          </div>
          <p className="text-slate-500 font-semibold text-sm">@{me.username}</p>
          
          <div className="flex gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="flex-1">
              <p className="text-2xl font-[900] dark:text-white leading-none mb-2">{stats.postsCount}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Yaps</p>
            </div>
            <div className="flex-1">
              <p className="text-2xl font-[900] dark:text-white leading-none mb-2">{me.following.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Following</p>
            </div>
            <div className="flex-1">
              <p className="text-2xl font-[900] dark:text-white leading-none mb-2">{me.followers.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Followers</p>
            </div>
          </div>
          
          <button 
            onClick={onEditProfile}
            className="w-full mt-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-300"
          >
            Manage Profile
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 mb-3">Feeds</h3>
          <div className="space-y-1">
            <button 
              onClick={() => onViewChange({ type: 'feed' })}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-[0.2em] ${view.type === 'feed' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-l-4 border-blue-500' : 'text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 group'}`}
            >
              <Icons.BookGlobe className={`w-5 h-5 transition-transform group-hover:scale-110 ${view.type === 'feed' ? 'text-blue-500' : 'text-slate-400'}`} />
              Global
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 mb-3">Spaces</h3>
          <div className="space-y-1">
            {SPACES.map(space => {
              const isActive = view.type === 'space' && view.spaceId === space.id;
              return (
                <button 
                  key={space.id}
                  onClick={() => onViewChange({ type: 'space', spaceId: space.id })}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-[0.2em] ${isActive ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-l-4 border-blue-500' : 'text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 group'}`}
                >
                  <SpaceIcon icon={space.icon} className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                  {space.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200 dark:border-slate-800">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-1">Trending Now</h3>
        <div className="space-y-6">
          {trendingTags.length > 0 ? trendingTags.map((topic, i) => (
            <div key={i} className="group cursor-pointer" onClick={() => onTagClick(topic.tag)}>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors">{topic.tag}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{topic.count} yaps total</p>
            </div>
          )) : (
            <p className="text-xs text-slate-400 font-bold italic">No trends yet...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
