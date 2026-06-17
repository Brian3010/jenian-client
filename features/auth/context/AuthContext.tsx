'use client';

import { UserPayload } from '@/lib/auth/session';
import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  userInfo: UserPayload | null;
  loading: boolean;
  // logout: () => Promise<void>;
  // refreshUser: () => Promise<void>;
  addUser: (userInfo: UserPayload) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: UserPayload;
}) {
  const [user, setUser] = useState<UserPayload>(initialUser);
  console.log('🚀 ~ AuthContextProvider ~ user:', user);
  // const [loading, setLoading] = useState<boolean>(true);

  // // logout
  // const logout = async () => {};

  // // refreshUser
  // const refreshUser = async () => {};

  const addUser = (userInfo: UserPayload) => {
    setUser(userInfo);
  };

  // useEffect(() => {
  //   console.log('AuthContextProvider mounted, fetching user info...');
  //   const fetchUser = async () => {
  //     try {
  //       setLoading(true);
  //       const user = await GetUser();
  //       console.log('🚀 ~ fetchUser ~ user:', user);

  //       setUser(user);
  //     } catch (error) {
  //       console.error(error);
  //       setUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // fetchUser();
  // }, []);

  return <AuthContext.Provider value={{ addUser, userInfo: user, loading: false }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used with in AuthProvider');

  return context;
};
