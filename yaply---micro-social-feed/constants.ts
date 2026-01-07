
import { Post, UserProfile, Space } from './types';

export const BRAND_AVATAR = 'https://img.freepik.com/premium-vector/3d-chat-bubble-icon-concept-social-media-message-communication-style_101434-586.jpg?w=800';

export const SPACES: Space[] = [
  { id: 'general', label: 'General', icon: 'globe', color: 'slate' },
  { id: 'tech', label: 'Tech', icon: 'cpu', color: 'blue' },
  { id: 'gaming', label: 'Gaming', icon: 'gamepad', color: 'indigo' },
  { id: 'school', label: 'School', icon: 'graduation', color: 'orange' },
  { id: 'memes', label: 'Memes', icon: 'shapes', color: 'pink' },
  { id: 'design', label: 'Design', icon: 'palette', color: 'teal' },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'u1',
    username: 'yaply',
    password: 'password', 
    displayName: 'yaplyhq',
    bio: 'The official voice of the Yaply network. Chat. Share. Connect. 🎙️',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    bannerUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1200',
    following: [],
    followers: [],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    role: 'owner',
    isVerified: true
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    username: 'yaply',
    content: 'Welcome to Yaply! 🎙️ This is a local-first micro-social feed built for speed and simplicity. Check out different #Spaces, find people in the search bar, and enjoy the clean, dark-mode-ready design. No cloud, no tracking, just yapping. 🚀',
    space: 'general',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    reactions: { '❤️': ['u1'], '🚀': ['u1'] },
    replies: [],
    isPinned: false
  }
];

export const MAX_CHARS = 280;
export const STORAGE_KEY_POSTS = 'yaply_posts_v8';
export const STORAGE_KEY_USERS = 'yaply_users_v8'; 
export const STORAGE_KEY_ME = 'yaply_me_id_v8';
export const THEME_STORAGE_KEY = 'yaply_theme_v8';
