
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  allUsers: UserProfile[];
  isMe: boolean;
  isFollowing: boolean;
  onFollowToggle: () => void;
  onUpdateProfile: (user: UserProfile) => void;
  onProfileClick: (id: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, allUsers, isMe, isFollowing, onFollowToggle, onUpdateProfile, onProfileClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [viewingList, setViewingList] = useState<'followers' | 'following' | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatarUrl' | 'bannerUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const listUsers = viewingList === 'followers' 
    ? allUsers.filter(u => user.followers.includes(u.id))
    : allUsers.filter(u => user.following.includes(u.id));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="relative group">
        <img src={isEditing ? formData.bannerUrl : user.bannerUrl} className="w-full h-48 object-cover bg-slate-200" alt="Banner" />
        {isEditing && (
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer text-white transition-opacity">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'bannerUrl')} />
          </label>
        )}
      </div>

      <div className="px-6 pb-6 relative">
        <div className="relative -mt-12 flex justify-between items-end mb-6">
          <div className="relative group/avatar">
            <img 
              src={isEditing ? formData.avatarUrl : user.avatarUrl} 
              className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-900 bg-white object-cover shadow-md" 
              alt="Avatar"
            />
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl cursor-pointer text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                {/* Fixed the handler name from handleAvatarChange to handleFileChange as handleAvatarChange was undefined */}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatarUrl')} />
              </label>
            )}
          </div>

          <div>
            {isMe ? (
              isEditing ? (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20">Save Profile</button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Edit Profile</button>
              )
            ) : (
              <button 
                onClick={onFollowToggle}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${isFollowing ? 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-lg'}`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Display Name</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                value={formData.displayName}
                onChange={e => setFormData({ ...formData, displayName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Bio</label>
              <textarea 
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all dark:text-white"
                rows={3}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight flex items-center gap-2">
              {user.displayName}
              {user.isVerified && (
                <svg className="w-6 h-6 text-blue-500 fill-current" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              )}
            </h2>
            <p className="text-slate-500 font-medium">@{user.username}</p>
            <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">{user.bio || 'No bio yet.'}</p>
            
            <div className="flex gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setViewingList(viewingList === 'following' ? null : 'following')}
                className={`flex items-center gap-1.5 p-2 -ml-2 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${viewingList === 'following' ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
              >
                <span className="font-black text-slate-900 dark:text-white">{user.following.length}</span>
                <span className="text-slate-500 text-sm">Following</span>
              </button>
              <button 
                onClick={() => setViewingList(viewingList === 'followers' ? null : 'followers')}
                className={`flex items-center gap-1.5 p-2 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${viewingList === 'followers' ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
              >
                <span className="font-black text-slate-900 dark:text-white">{user.followers.length}</span>
                <span className="text-slate-500 text-sm">Followers</span>
              </button>
            </div>

            {viewingList && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{viewingList}</h3>
                  <button onClick={() => setViewingList(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="space-y-3">
                   {listUsers.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4 italic">No users found here yet.</p>
                   ) : (
                      listUsers.map(u => (
                         <button 
                          key={u.id} 
                          onClick={() => { onProfileClick(u.id); setViewingList(null); }}
                          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all text-left"
                         >
                            <img src={u.avatarUrl} className="w-8 h-8 rounded-lg object-cover" alt="" />
                            <div className="truncate">
                               <p className="text-xs font-bold truncate dark:text-white">{u.displayName}</p>
                               <p className="text-[10px] text-slate-500 font-medium tracking-tight">@{u.username}</p>
                            </div>
                         </button>
                      ))
                   )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
