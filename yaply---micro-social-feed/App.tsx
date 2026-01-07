
import React, { useState, useEffect, useMemo } from 'react';
import { Post, UserProfile, ViewState, SortOrder } from './types';
import { 
  INITIAL_POSTS, 
  INITIAL_USERS, 
  STORAGE_KEY_POSTS, 
  STORAGE_KEY_USERS, 
  STORAGE_KEY_ME, 
  THEME_STORAGE_KEY,
  SPACES
} from './constants';
import Header from './components/Header';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import Sidebar from './components/Sidebar';
import SearchFilter from './components/SearchFilter';
import ProfileView from './components/ProfileView';
import Auth from './components/Auth';
import { Icons, SpaceIcon } from './components/Icons';

const App: React.FC = () => {
  // --- STATE INITIALIZATION ---
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { console.error("User storage corrupt", e); }
    }
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_POSTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error("Post storage corrupt", e); }
    }
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_ME);
  });

  const [view, setView] = useState<ViewState>({ type: 'feed' });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const persistUsers = (newUsers: UserProfile[]) => {
    setUsers([...newUsers]);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(newUsers));
  };

  const persistPosts = (newPosts: Post[]) => {
    setPosts([...newPosts]);
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(newPosts));
  };

  const persistMe = (id: string | null) => {
    setCurrentUserId(id);
    if (id) localStorage.setItem(STORAGE_KEY_ME, id);
    else localStorage.removeItem(STORAGE_KEY_ME);
  };

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const me = useMemo(() => users.find(u => u.id === currentUserId), [users, currentUserId]);

  const handleLogout = () => {
    persistMe(null);
    setView({ type: 'feed' });
  };

  const addPost = (content: string, spaceId: string = 'general') => {
    if (!me) return;
    const newPost: Post = {
      id: crypto.randomUUID(),
      userId: me.id,
      username: me.username,
      content,
      space: spaceId,
      timestamp: Date.now(),
      reactions: {},
      replies: [],
      isPinned: false
    };
    persistPosts([newPost, ...posts]);
  };

  const handleReaction = (postId: string, emoji: string) => {
    if (!currentUserId) return;
    const newPosts = posts.map(p => {
      if (p.id === postId) {
        const currentReactions = { ...p.reactions };
        const usersForEmoji = currentReactions[emoji] || [];
        
        if (usersForEmoji.includes(currentUserId)) {
          currentReactions[emoji] = usersForEmoji.filter(id => id !== currentUserId);
          if (currentReactions[emoji].length === 0) delete currentReactions[emoji];
        } else {
          currentReactions[emoji] = [...usersForEmoji, currentUserId];
        }
        
        return { ...p, reactions: currentReactions };
      }
      return p;
    });
    persistPosts(newPosts);
  };

  const deletePost = (id: string) => {
    persistPosts(posts.filter(p => p.id !== id));
  };

  const updatePost = (id: string, newContent: string) => {
    const post = posts.find(p => p.id === id);
    if (!post || post.userId !== currentUserId) return;
    const newPosts = posts.map(p => p.id === id ? { ...p, content: newContent } : p);
    persistPosts(newPosts);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    const newUsers = users.map(u => u.id === updated.id ? updated : u);
    persistUsers(newUsers);
  };

  const handleProfileClick = (id: string) => {
    setView({ type: 'profile', profileId: id });
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const trendingTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    posts.forEach(p => {
      const tags = p.content.match(/#[a-z0-9_]+/gi) || [];
      tags.forEach(t => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [posts]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { posts: [], users: [] };
    const q = searchQuery.toLowerCase().trim();
    
    // People search
    const matchedUsers = users.filter(u => 
      u.username.toLowerCase().includes(q) || 
      u.displayName.toLowerCase().includes(q)
    );

    // Post search
    const matchedPosts = posts.filter(p => {
      // Fix potential 'never' type inference issue by ensuring type context for string properties
      const content = p.content || '';
      const username = p.username || '';
      const textMatch = content.toLowerCase().includes(q);
      const usernameMatch = username.toLowerCase().includes(q);
      
      // Specific Hashtag check if q starts with #
      if (q.startsWith('#')) {
        // Explicitly type hashtags to prevent the compiler from inferring 'never[]'
        const hashtags: string[] = content.match(/#[a-z0-9_]+/gi) || [];
        return hashtags.some(h => (h as string).toLowerCase() === q);
      }
      return textMatch || usernameMatch;
    });

    return { posts: matchedPosts, users: matchedUsers };
  }, [posts, users, searchQuery]);

  const filteredPosts = useMemo(() => {
    if (searchQuery.trim()) {
      return searchResults.posts.sort((a, b) => b.timestamp - a.timestamp);
    }

    let result = [...posts];
    if (view.type === 'profile' && view.profileId) {
      result = result.filter(p => p.userId === view.profileId);
    } 
    else if (view.type === 'space' && view.spaceId) {
      result = result.filter(p => p.space === view.spaceId);
    }

    result.sort((a, b) => {
      if (sortOrder === 'popular') {
        const aCount = Object.values(a.reactions).flat().length;
        const bCount = Object.values(b.reactions).flat().length;
        return bCount - aCount;
      }
      if (sortOrder === 'oldest') return a.timestamp - b.timestamp;
      return b.timestamp - a.timestamp;
    });

    return result;
  }, [posts, view, searchQuery, searchResults, sortOrder]);

  if (!currentUserId || !me) {
    return (
      <Auth 
        users={users}
        onLogin={(user) => persistMe(user.id)}
        onRegister={(user) => {
          const newUsers = [...users, user];
          persistUsers(newUsers);
          persistMe(user.id);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-[#020617]">
      <Header 
        isDarkMode={isDarkMode} 
        onToggleTheme={() => setIsDarkMode(prev => !prev)} 
        me={me} 
        onHome={() => { setView({ type: 'feed' }); setSearchQuery(''); }}
        onProfile={() => handleProfileClick(me.id)}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4 shrink-0 hidden lg:block">
          <Sidebar 
            me={me} 
            posts={posts} 
            trendingTags={trendingTags}
            view={view}
            onViewChange={(v) => { setView(v); setSearchQuery(''); }}
            onEditProfile={() => handleProfileClick(me.id)}
            onTagClick={(tag) => setSearchQuery(tag)}
          />
        </aside>
        <section className="lg:w-2/4 flex flex-col gap-6">
          {view.type === 'profile' && view.profileId && !searchQuery ? (
            <ProfileView 
              key={view.profileId}
              user={users.find(u => u.id === view.profileId)!} 
              allUsers={users}
              isMe={view.profileId === me.id}
              isFollowing={me.following.includes(view.profileId)}
              onFollowToggle={() => {}} 
              onUpdateProfile={handleUpdateProfile}
              onProfileClick={handleProfileClick}
            />
          ) : (
            <>
              {searchQuery && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <h2 className="text-xl font-black gradient-text tracking-tight flex items-center gap-3">
                    <Icons.Globe className="w-6 h-6 text-blue-500" />
                    Search Results for "{searchQuery}"
                  </h2>
                  {searchResults.users.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.users.map(u => (
                        <button 
                          key={u.id}
                          onClick={() => handleProfileClick(u.id)}
                          className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all text-left"
                        >
                          <img src={u.avatarUrl} className="w-10 h-10 rounded-xl object-cover" alt="" />
                          <div className="truncate">
                            <p className="font-bold text-sm dark:text-white truncate">{u.displayName}</p>
                            <p className="text-[10px] text-slate-500 font-bold tracking-tight">@{u.username}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {!searchQuery && (
                <PostForm 
                  onPost={addPost} 
                  me={me} 
                  defaultSpace={view.type === 'space' ? view.spaceId : 'general'} 
                />
              )}
              <SearchFilter 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                sortOrder={sortOrder} 
                setSortOrder={setSortOrder}
                activeFilter={null}
                clearFilter={() => setSearchQuery('')}
              />
            </>
          )}
          
          <PostList 
            posts={filteredPosts} 
            users={users}
            currentUserId={me.id}
            onDelete={deletePost}
            onUpdate={updatePost}
            onReaction={handleReaction}
            onReply={() => {}} 
            onProfileClick={handleProfileClick}
            onMentionClick={(val) => {
              if (val.startsWith('#')) setSearchQuery(val);
              else {
                const username = val.replace('@', '');
                const user = users.find(u => u.username === username);
                if (user) handleProfileClick(user.id);
              }
            }}
            viewType={view.type}
            spaceId={view.spaceId}
          />
        </section>
      </main>
    </div>
  );
};

export default App;
