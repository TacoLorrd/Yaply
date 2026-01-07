
export interface Reply {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: number;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  space: string; 
  timestamp: number;
  reactions: Record<string, string[]>; // emoji -> list of userIds
  replies: Reply[];
  isPinned: boolean;
  isAdminOnly?: boolean;
}

export type UserRole = 'user' | 'moderator' | 'owner';

export interface UserProfile {
  id: string;
  username: string;
  password: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  following: string[]; 
  followers: string[]; 
  createdAt: number;
  role: UserRole;
  isVerified?: boolean;
}

export type ViewState = {
  type: 'feed' | 'profile' | 'space' | 'search';
  profileId?: string;
  spaceId?: string;
};

export type SortOrder = 'newest' | 'oldest' | 'popular';

export interface Space {
  id: string;
  label: string;
  icon: string;
  color: string;
}
