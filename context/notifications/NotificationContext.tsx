'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type NoticeType = 'success' | 'error' | 'info';

export type Notice = {
  id: string;
  type: NoticeType;
  title?: string;
  message: string;
  createdAt: number;
};

const NotificationContext = createContext<{
  notices: Notice[];
  notifySuccess: (message: string, title?: string) => void;
  notifyError: (message: string, title?: string) => void;
  notifyInfo: (message: string, title?: string) => void;
  removeNotice: (id: string) => void;
} | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([]);

  const remove = useCallback((id: string) => {
    setNotices(prev => prev.filter(notice => notice.id !== id));
  }, []);

  const add = useCallback(
    (notice: Omit<Notice, 'id' | 'createdAt'>) => {
      const id = crypto.randomUUID();
      const createdAt = Date.now();
      setNotices(prev => [...prev, { id, createdAt, ...notice }]);

      // Auto-remove after 3 seconds
      window.setTimeout(() => remove(id), 3000);
    },
    [remove],
  );

  const notifySuccess = useCallback(
    (message: string, title?: string) => add({ type: 'success', message, title }),
    [add],
  );
  const notifyError = useCallback((message: string, title?: string) => add({ type: 'error', message, title }), [add]);
  const notifyInfo = useCallback((message: string, title?: string) => add({ type: 'info', message, title }), [add]);

  const contextValue = useMemo(
    () => ({ notices, notifySuccess, notifyError, notifyInfo, removeNotice: remove }),
    [notices, notifySuccess, notifyError, notifyInfo, remove],
  );

  return <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
