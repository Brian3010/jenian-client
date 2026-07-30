'use client';

import type { UserPayloadWithBooleanDemo } from '@/lib/auth/session';
import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  user: UserPayloadWithBooleanDemo;
  setUser: (user: UserPayloadWithBooleanDemo) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: UserPayloadWithBooleanDemo;
}) {
  const [user, setUser] = useState<UserPayloadWithBooleanDemo>(initialUser);

  return <AuthContext.Provider value={{ setUser, user }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used with in AuthProvider');

  return context;
};
