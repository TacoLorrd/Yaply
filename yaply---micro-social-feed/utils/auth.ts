
import { STORAGE_KEY_USERS, STORAGE_KEY_ME, INITIAL_USERS } from '../constants';
import { UserProfile } from '../types';

/**
 * Validates credentials against localStorage and persists the current user session.
 */
export function login(usernameInput: string, passwordInput: string): UserProfile | null {
  const normalizedUsername = usernameInput.trim().toLowerCase();
  
  const usersJson = localStorage.getItem(STORAGE_KEY_USERS);
  let users: UserProfile[] = [];
  
  try {
    if (usersJson) {
      const parsed = JSON.parse(usersJson);
      if (Array.isArray(parsed)) users = parsed;
    }
    
    // If users list is empty in storage, use the initial users
    if (users.length === 0) {
      users = INITIAL_USERS;
    }
  } catch (e) {
    users = INITIAL_USERS;
  }
  
  const user = users.find(u => 
    u.username.toLowerCase().trim() === normalizedUsername && 
    u.password === passwordInput
  );
  
  if (user) {
    localStorage.setItem(STORAGE_KEY_ME, user.id);
    return user;
  }
  return null;
}

export const hashPassword = async (password: string): Promise<string> => {
  // Keeping it simple for local storage prototype
  return password; 
};
