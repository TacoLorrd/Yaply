
import React, { useMemo, useState } from 'react';
import { UserProfile, UserRole, Post } from '../types';
import { Icons, SpaceIcon } from './Icons';
import { formatTimeAgo } from '../utils/formatters';
import { SPACES } from '../constants';

interface ModDashboardProps {
  me: UserProfile;
  users: UserProfile[];
  posts: Post[];
  onDeleteUser: (id: string) => void;
  onPromoteUser: (id: string, role: UserRole) => void;
  onDeletePost: (id: string) => void;
  onUpdatePost: (id: string, content: string) => void;
}

const ModDashboard: React.FC<ModDashboardProps> = ({ me, users, posts, onDeleteUser, onPromoteUser, onDeletePost, onUpdatePost }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'system'>('users');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => ({
    totalUsers: users.length,
    totalPosts: posts.length,
    // Fix: Using reactions instead of non-existent likes property
    totalLikes: posts.reduce((acc, p) => acc + Object.values(p.reactions).flat().length, 0),
    totalReplies: posts.reduce((acc, p) => acc + p.replies.length, 0),
  }), [users, posts]);

  const groups = useMemo(() => {
    const filteredUsers = users.filter(u => 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return {
      owners: filteredUsers.filter(u => u.role === 'owner'),
      moderators: filteredUsers.filter(u => u.role === 'moderator'),
      citizens: filteredUsers.filter(u => u.role === 'user'),
    };
  }, [users, searchTerm]);

  const filteredPosts = useMemo(() => {
    return posts.filter(p => 
      p.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  const handleWipeStorage = () => {
    if (confirm("CRITICAL WARNING: This will permanently erase ALL users, posts, and settings from this browser's storage. Proceed with extreme caution.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const RoleIndicator = ({ role }: { role: UserRole }) => {
    switch (role) {
      case 'owner':
        return (
          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30" title="Owner">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
        );
      case 'moderator':
        return (
          <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30" title="Moderator">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center" title="User">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
        );
    }
  };

  const UserRow: React.FC<{ user: UserProfile }> = ({ user }) => {
    const isSelf = user.id === me.id;
    
    return (
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-[2.2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all gap-4 group min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative shrink-0">
            <img src={user.avatarUrl} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800 shadow-sm" alt="" />
            <div className="absolute -bottom-1 -right-1">
              <RoleIndicator role={user.role} />
            </div>
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="font-black text-[13px] text-slate-900 dark:text-white truncate flex items-center gap-2">
              @{user.username} 
              {isSelf && <span className="text-[8px] px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-full font-black tracking-tighter uppercase">Active Session</span>}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{user.displayName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative group/select">
            <select 
              value={user.role}
              onChange={(e) => onPromoteUser(user.id, e.target.value as UserRole)}
              className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-4 pr-10 py-3 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 w-[130px]"
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="owner">Owner</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <Icons.ChevronDown className="w-4 h-4" />
            </div>
          </div>
          
          <button 
            onClick={() => {
              const warning = isSelf 
                ? "DANGER: You are about to delete YOUR OWN account. You will be immediately logged out and all your data will be wiped. Proceed?" 
                : `CRITICAL ACTION: Permanently terminate @${user.username} and erase ALL associated intelligence? This is irreversible.`;
              
              if (confirm(warning)) {
                onDeleteUser(user.id);
              }
            }}
            className="p-3.5 rounded-2xl transition-all border bg-rose-50 dark:bg-rose-900/10 text-rose-500 hover:bg-rose-500 hover:text-white border-rose-100 dark:border-rose-900/40"
            title="Purge Protocol"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const PostRow: React.FC<{ post: Post }> = ({ post }) => {
    const isEditing = editingPostId === post.id;
    const space = SPACES.find(s => s.id === post.space);

    return (
      <div className="p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all gap-4 group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4 overflow-hidden">
            <img src={`https://picsum.photos/seed/${post.username}/100`} className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-slate-800" alt="" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[12px] font-black dark:text-white uppercase tracking-wider truncate">@{post.username}</p>
                {post.isAdminOnly && <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-black uppercase px-2 py-0.5 rounded-md tracking-tighter">Protected</span>}
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{formatTimeAgo(post.timestamp)} in {space?.label}</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {!isEditing ? (
              <button 
                onClick={() => { setEditingPostId(post.id); setEditContent(post.content); }}
                className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/10 text-blue-500 border border-blue-100 dark:border-blue-900/30 hover:bg-blue-100 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
            ) : (
              <button 
                onClick={() => { onUpdatePost(post.id, editContent); setEditingPostId(null); }}
                className="p-3 rounded-2xl bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </button>
            )}
            <button 
              onClick={() => { if(confirm("Delete intelligence node?")) onDeletePost(post.id); }}
              className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-900/10 text-rose-500 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>

        {isEditing ? (
          <textarea 
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white font-medium"
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        ) : (
          <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/50">
            {post.content}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-indigo-600 rounded-[2.2rem] text-white shadow-2xl shadow-indigo-500/40 transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <div>
            <h2 className="text-4xl font-[1000] dark:text-white tracking-tighter leading-none uppercase">Command</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-2">Executive ecosystem</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
             <Icons.Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
              type="text" 
              placeholder="GLOBAL SEARCH..." 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-5 py-3 text-[9px] font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Citizens', value: stats.totalUsers, color: 'text-blue-500', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
           { label: 'Intelligence', value: stats.totalPosts, color: 'text-indigo-500', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
           { label: 'Sentiment', value: stats.totalLikes, color: 'text-rose-500', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
           { label: 'Directives', value: stats.totalReplies, color: 'text-amber-500', icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' },
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:translate-y-[-4px] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 ${stat.color}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
                </div>
              </div>
              <p className="text-3xl font-[1000] dark:text-white tracking-tighter">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
           </div>
         ))}
      </div>

      <div className="flex flex-wrap gap-2 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-[2.5rem] w-full max-w-2xl">
        {[
          { id: 'users', label: 'Identity Protocol', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
          { id: 'posts', label: 'Intelligence Feed', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z' },
          { id: 'system', label: 'Security & Core', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-[2rem] text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'users' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* OWNERS SECTION */}
            {groups.owners.length > 0 && (
              <section className="bg-indigo-50/30 dark:bg-indigo-900/5 rounded-[3.5rem] p-8 border border-indigo-100/50 dark:border-indigo-800/20">
                <div className="flex items-center justify-between mb-8 px-4">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-[1.2rem] bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                    </div>
                    <div>
                      <h3 className="text-base font-black text-indigo-900 dark:text-indigo-100 uppercase tracking-[0.4em]">Authorities</h3>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Full System Governance</p>
                    </div>
                  </div>
                  <span className="px-5 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-widest shadow-sm">{groups.owners.length} UNITS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {groups.owners.map(u => <UserRow key={u.id} user={u} />)}
                </div>
              </section>
            )}

            {/* MODERATORS SECTION */}
            {groups.moderators.length > 0 && (
              <section className="bg-amber-50/30 dark:bg-amber-900/5 rounded-[3.5rem] p-8 border border-amber-100/50 dark:border-amber-800/20">
                <div className="flex items-center justify-between mb-8 px-4">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-[1.2rem] bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-base font-black text-amber-900 dark:text-amber-100 uppercase tracking-[0.4em]">Enforcers</h3>
                      <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest mt-1">Content Regulation</p>
                    </div>
                  </div>
                  <span className="px-5 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[11px] font-black uppercase tracking-widest shadow-sm">{groups.moderators.length} UNITS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {groups.moderators.map(u => <UserRow key={u.id} user={u} />)}
                </div>
              </section>
            )}

            {/* CITIZENS SECTION */}
            <section className="bg-slate-50 dark:bg-slate-800/20 rounded-[3.5rem] p-8 border border-slate-200/50 dark:border-slate-800/40">
              <div className="flex items-center justify-between mb-8 px-4">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-[1.2rem] bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-700 dark:text-slate-200 uppercase tracking-[0.4em]">Citizens</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Standard Interaction</p>
                  </div>
                </div>
                <span className="px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest shadow-sm">{groups.citizens.length} UNITS</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {groups.citizens.length > 0 ? (
                  groups.citizens.map(u => <UserRow key={u.id} user={u} />)
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-400 font-medium italic text-xs">
                    No citizens discovered in current sweep.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 mb-8 ml-2">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em]">Yap Intelligence Feed</h3>
               <div className="flex-grow h-px bg-slate-200 dark:bg-slate-800 ml-4"></div>
            </div>
            <div className="grid gap-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => <PostRow key={post.id} post={post} />)
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-[3rem] py-24 text-center">
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[11px]">Zero intelligence matches found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex items-center justify-center py-12">
            <div className="p-16 md:p-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[5rem] text-center max-w-2xl w-full shadow-2xl relative overflow-hidden group">
               <div className="w-24 h-24 bg-rose-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl transform group-hover:rotate-12 transition-transform">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
               </div>
               <h3 className="text-4xl font-[1000] text-slate-900 dark:text-white tracking-tighter mb-6">NUCLEAR PURGE</h3>
               <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-14 font-medium px-8">
                  Authorize full database reset. All identities, nodes, and connections will be permanently eliminated.
               </p>
               <button 
                onClick={handleWipeStorage}
                className="w-full py-7 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] hover:bg-rose-600 dark:hover:bg-rose-600 dark:hover:text-white transition-all shadow-2xl active:scale-95"
               >
                  Authorize Purge
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModDashboard;
