// components/BackendHealthCheck.tsx
'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BackendHealthCheck() {
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch('/api/health', {
          cache: 'no-store',
        });
        setBackendAvailable(res.ok);
      } catch {
        setBackendAvailable(false);
      }
    }

    checkBackend();
  }, []);

  if (backendAvailable !== false) {
    return null;
  }
  if (dismissed) return null;

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-amber-800 text-sm">
      <AlertTriangle className="size-4 shrink-0 text-amber-500" />
      <span className="flex-1">
        <span className="font-medium">Backend is currently unavailable.</span> Some features may not work.
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded p-0.5 hover:bg-amber-100 transition-colors text-amber-500 hover:text-amber-700"
        aria-label="Dismiss"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
