'use client';
import { getLocalStorageJSON, setLocalStorageJson } from '@/lib/auth/localStorage';
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
      const localSavedUserInfo = getLocalStorageJSON('UserInfo', null);

      if (localSavedUserInfo) {
        setUserInfo(localSavedUserInfo);
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
        setLocalStorageJson('UserInfo', data);
      } catch (error) {
        console.error('fetchUserInfo error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const AddUserInfo = (userInfo: UserInfo) => {
    setUserInfo(userInfo);
  };

  return <UserInfoContext.Provider value={{ userInfo, AddUserInfo, loading }}>{children}</UserInfoContext.Provider>;
}

export function useUser() {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error('useUser must be used within a NotificationProvider');
  }
  return context;
}
