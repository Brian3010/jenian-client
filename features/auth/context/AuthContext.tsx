'use client';

import { GetUser } from '@/features/auth/services/auth.service';
import { AuthContextType, User } from '@/features/auth/types';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  console.log('🚀 ~ AuthContextProvider ~ user:', user);
  const [loading, setLoading] = useState<boolean>(true);

  // logout
  const logout = async () => {};

  // refreshUser
  const refreshUser = async () => {};

  const addUser = (userInfo: User) => {
    setUser(userInfo);
  };

  useEffect(() => {
    console.log('AuthContextProvider mounted, fetching user info...');
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await GetUser();
        console.log('🚀 ~ fetchUser ~ user:', user);

        setUser(user);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ addUser, logout, refreshUser, userInfo: user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used with in AuthProvider');

  return context;
};
