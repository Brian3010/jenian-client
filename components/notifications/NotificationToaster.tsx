// components/notifications/notifications-host.tsx
'use client';

import { useNotifications } from './NotificationContext';

const typeToClass: Record<string, string> = {
  success: 'border-green-500',
  error: 'border-red-500',
  info: 'border-blue-500',
};

export function NotificationsToaster() {
  const { notices, removeNotice } = useNotifications();

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[340px] flex-col gap-2">
      {notices.map(n => (
        <div key={n.id} className={`rounded-md border-l-4 bg-white p-3 shadow ${typeToClass[n.type]}`} role="status">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {n.title ? <div className="font-semibold">{n.title}</div> : null}
              <div className="text-sm text-zinc-700">{n.message}</div>
            </div>

            <button
              onClick={() => removeNotice(n.id)}
              className="shrink-0 rounded px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
