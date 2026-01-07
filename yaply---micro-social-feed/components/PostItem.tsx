
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Post, UserProfile, Reply } from '../types';
import { formatTimeAgo, parseContent } from '../utils/formatters';
import { SPACES } from '../constants';
import { SpaceIcon, Icons } from './Icons';

interface PostItemProps {
  post: Post;
  users: UserProfile[];
  currentUserId: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onReaction: (postId: string, emoji: string) => void;
  onReply: (postId: string, content: string) => void;
  onProfileClick: (id: string) => void;
  onMentionClick: (username: string) => void;
}

const REACTION_EMOJIS = ['❤️', '🔥', '😂', '🚀', '😯', '✨', '👏', '🥳', '🧐', '👀'];

const PostItem: React.FC<PostItemProps> = ({ 
  post, 
  users,
  currentUserId, 
  onDelete, 
  onUpdate,
  onReaction, 
  onReply, 
  onProfileClick,
  onMentionClick
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [customEmoji, setCustomEmoji] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowReactionPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const author = useMemo(() => users.find(u => u.id === post.userId) || {
    id: post.userId || 'unknown',
    username: post.username,
    displayName: post.username,
    avatarUrl: `https://picsum.photos/seed/${post.username}/100`,
    role: 'user',
    isVerified: false
  } as UserProfile, [users, post.userId, post.username]);

  const postSpace = useMemo(() => SPACES.find(s => s.id === post.space) || SPACES[0], [post.space]);

  const isOwner = post.userId === currentUserId;

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(post.id, replyContent.trim());
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editContent.trim()) {
      onUpdate(post.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      setIsDeleting(true);
      setTimeout(() => onDelete(post.id), 300);
    }
  };

  const contentParts = parseContent(post.content);

  const getReplyAuthor = (reply: Reply) => {
    return users.find(u => u.id === reply.userId) || {
      id: reply.userId,
      displayName: reply.username,
      avatarUrl: `https://picsum.photos/seed/${reply.username}/100`,
      isVerified: false
    };
  };

  const handleCustomEmojiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmoji.trim()) {
      onReaction(post.id, customEmoji.trim());
      setCustomEmoji('');
      setShowReactionPicker(false);
    }
  };

  const totalReactions = Object.values(post.reactions).flat().length;

  return (
    <div className={`relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-7 shadow-sm border transition-all duration-300 transform ${isDeleting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'} border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-none group`}>
      <div className="flex gap-5">
        <button onClick={() => onProfileClick(author.id)} className="shrink-0 group/avatar">
          <img src={author.avatarUrl} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-transparent group-hover/avatar:ring-blue-500/10 transition-all shadow-md border-2 border-slate-50 dark:border-slate-800" alt="" />
        </button>

        <div className="grow">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={() => onProfileClick(author.id)} className="flex items-center gap-1 font-[800] text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors">
                {author.displayName}
                {author.isVerified && (
                  <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                )}
              </button>
              <span className="text-slate-400 text-xs font-semibold tracking-tight">@{author.username} · {formatTimeAgo(post.timestamp)}</span>
              
              <div className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 ml-1">
                 <SpaceIcon icon={postSpace.icon} className="w-3.5 h-3.5 text-blue-500" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{postSpace.label}</span>
              </div>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isOwner && (
                <>
                  <button onClick={() => setIsEditing(!isEditing)} className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title="Edit Yap">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={handleDelete} className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all" title="Delete Yap">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mt-2 space-y-3">
              <textarea
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-blue-500/20 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white"
                rows={3}
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => {setIsEditing(false); setEditContent(post.content);}} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Save Changes</button>
              </div>
            </form>
          ) : (
            <p className="text-[17px] text-slate-800 dark:text-slate-200 leading-relaxed break-words whitespace-pre-wrap mt-1 font-medium">
              {contentParts.map((part, i) => (
                <span key={i}>
                  {part.type === 'hashtag' ? (
                    <span className="text-blue-500 hover:underline font-bold cursor-pointer" onClick={() => onMentionClick(part.value)}>{part.original}</span>
                  ) : part.type === 'mention' ? (
                    <button onClick={() => onMentionClick(part.value)} className="text-fuchsia-500 hover:underline font-bold">{part.original}</button>
                  ) : (
                    part.original
                  )}
                  {' '}
                </span>
              ))}
            </p>
          )}

          <div className="flex items-center gap-6 mt-6">
            <div className="relative" ref={pickerRef}>
              <button 
                onClick={() => setShowReactionPicker(!showReactionPicker)} 
                className={`flex items-center gap-2 text-xs font-black transition-all ${totalReactions > 0 ? 'text-blue-500' : 'text-slate-400 hover:text-blue-500'}`}
              >
                <div className={`p-3 rounded-2xl transition-all ${showReactionPicker ? 'bg-blue-50 dark:bg-blue-900/20 scale-110' : 'hover:bg-blue-50 dark:hover:bg-blue-900/10'}`}>
                   <Icons.MessageCircle className="w-5 h-5" />
                </div>
                <span className="tabular-nums text-sm">{totalReactions}</span>
              </button>

              {showReactionPicker && (
                <div className="absolute bottom-full mb-3 left-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 shadow-2xl z-20 animate-in slide-in-from-bottom-2 duration-200 w-64">
                  <div className="grid grid-cols-5 gap-1 mb-3">
                    {REACTION_EMOJIS.map(emoji => (
                      <button 
                        key={emoji} 
                        onClick={() => { onReaction(post.id, emoji); setShowReactionPicker(false); }}
                        className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all hover:scale-125 ${post.reactions[emoji]?.includes(currentUserId) ? 'bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500/20' : ''}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <form onSubmit={handleCustomEmojiSubmit} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add any emoji..." 
                      className="grow bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                      value={customEmoji}
                      onChange={e => setCustomEmoji(e.target.value)}
                    />
                    <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </form>
                </div>
              )}
            </div>

            <button onClick={() => setShowReplyForm(!showReplyForm)} className={`flex items-center gap-2 text-xs font-black transition-all ${showReplyForm ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}>
              <div className={`p-3 rounded-2xl transition-all ${showReplyForm ? 'bg-indigo-50 dark:bg-indigo-900/20 scale-110' : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/10'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <span className="tabular-nums text-sm">{post.replies.length}</span>
            </button>
          </div>

          {/* Reaction Summary Bar */}
          {totalReactions > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(post.reactions).map(([emoji, userIds]) => {
                if (userIds.length === 0) return null;
                const hasReacted = userIds.includes(currentUserId);
                return (
                  <button 
                    key={emoji} 
                    onClick={() => onReaction(post.id, emoji)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${hasReacted ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500'}`}
                  >
                    <span>{emoji}</span>
                    <span className="tabular-nums">{userIds.length}</span>
                  </button>
                );
              })}
            </div>
          )}

          {showReplyForm && (
            <form onSubmit={handleReplySubmit} className="mt-5 flex gap-3 animate-in slide-in-from-top-4 duration-300">
              <input autoFocus type="text" placeholder="Add your reply..." className="grow bg-slate-50 dark:bg-slate-800/80 border-none rounded-[1.4rem] px-6 py-4 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none dark:text-white shadow-inner" value={replyContent} onChange={e => setReplyContent(e.target.value)} />
              <button type="submit" disabled={!replyContent.trim()} className="px-8 py-4 gradient-bg animate-gradient text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-30 shadow-lg active:scale-95 transition-all">Reply</button>
            </form>
          )}

          {post.replies.length > 0 && (
            <div className="mt-6 space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              {post.replies.map(reply => {
                const replyAuthor = getReplyAuthor(reply);
                return (
                  <div key={reply.id} className="flex gap-4 group/reply">
                    <button onClick={() => onProfileClick(replyAuthor.id || '')} className="shrink-0">
                      <img src={replyAuthor.avatarUrl} className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover/reply:scale-105 transition-transform border border-slate-100 dark:border-slate-800" alt="" />
                    </button>
                    <div className="grow bg-slate-50 dark:bg-slate-800/40 p-5 rounded-[1.8rem] border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => onProfileClick(replyAuthor.id || '')} className="font-black text-[13px] text-slate-900 dark:text-slate-100 hover:text-blue-500 transition-colors">
                          {replyAuthor.displayName}
                          {replyAuthor.isVerified && (
                            <svg className="w-3.5 h-3.5 text-blue-500 fill-current inline-block ml-0.5" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                          )}
                        </button>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formatTimeAgo(reply.timestamp)}</span>
                      </div>
                      <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed">{reply.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostItem;
