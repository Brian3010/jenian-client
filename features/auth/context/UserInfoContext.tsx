'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export type UserInfo = {
  username: string;
  isTelegramConnected: boolean;
  email: string;
};

const UserInfoContext = createContext<{
  userInfo: UserInfo | null;
  AddUserInfo: (userInfo: UserInfo) => void;
  loading: boolean;
} | null>(null);

export function UserInfoContextProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const sessionSavedUserInfo = sessionStorage.getItem('UserInfo');

      if (sessionSavedUserInfo) {
        setUserInfo(JSON.parse(sessionSavedUserInfo));
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('api/auth/me');

        if (!res.ok) {
          setUserInfo(null);
          return;
        }

        const data: UserInfo = await res.json();
        setUserInfo(data);
        sessionStorage.setItem('UserInfo', JSON.stringify(data));
      } catch (error) {
        console.error('fetchUserInfo error:', error);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const AddUserInfo = (userInfo: UserInfo) => {
    setUserInfo(userInfo);
    sessionStorage.setItem('UserInfo', JSON.stringify(userInfo));
  };

  return <UserInfoContext.Provider value={{ userInfo, AddUserInfo, loading }}>{children}</UserInfoContext.Provider>;
}

export function useUser() {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error('useUser must be used within a UserInfoContextProvider');
  }
  return context;
}
