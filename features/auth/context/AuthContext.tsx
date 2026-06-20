'use client';

import { UserPayload } from '@/lib/auth/session';
import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  userInfo: UserPayload;
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
  const [userInfo, setUserInfo] = useState<UserPayload>(initialUser);
  console.log('🚀 ~ AuthContextProvider ~ userInfo:', userInfo);

  const addUser = (userInfo: UserPayload) => {
    setUserInfo(userInfo);
  };

  return <AuthContext.Provider value={{ addUser, userInfo }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used with in AuthProvider');

  return context;
};
