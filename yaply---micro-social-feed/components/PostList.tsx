
import React from 'react';
import { Post, UserProfile } from '../types';
import PostItem from './PostItem';
import { SPACES } from '../constants';
import { SpaceIcon, Icons } from './Icons';

interface PostListProps {
  posts: Post[];
  users: UserProfile[];
  currentUserId: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onReaction: (postId: string, emoji: string) => void;
  onReply: (postId: string, content: string) => void;
  onProfileClick: (id: string) => void;
  onMentionClick: (username: string) => void;
  viewType: string;
  spaceId?: string;
}

const PostList: React.FC<PostListProps> = ({ 
  posts, 
  users,
  currentUserId, 
  onDelete, 
  onUpdate,
  onReaction, 
  onReply, 
  onProfileClick,
  onMentionClick,
  viewType,
  spaceId
}) => {
  if (posts.length === 0) {
    const space = SPACES.find(s => s.id === spaceId);
    
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-800 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
          {space ? (
            <SpaceIcon icon={space.icon} className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          ) : (
            <Icons.MessageCircle className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          )}
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.3em] text-[11px] text-center px-4">
          {space ? `Silence in ${space.label}` : 'No yaps discovered'}
        </p>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-3 font-medium text-center px-8 max-w-sm leading-relaxed">
          {space ? `Be the architect of conversation. Start the first thread in this space.` : 'The digital void is quiet. Try refining your search parameters or explore the global feed.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostItem 
          key={post.id} 
          post={post} 
          users={users}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onReaction={onReaction}
          onReply={onReply}
          onProfileClick={onProfileClick}
          onMentionClick={onMentionClick}
        />
      ))}
    </div>
  );
};

export default PostList;
