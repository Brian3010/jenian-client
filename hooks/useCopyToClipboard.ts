'use client';

import * as React from 'react';

type Options = {
  resetAfter?: number; // how long to show "copied" state
  onCopy?: (value: string) => void; // optional side-effect (toast, analytics, etc.)
};

export function useCopyToClipboard(options?: Options) {
  const { resetAfter = 1200, onCopy } = options ?? {};

  // UI state: show success (e.g., toggle icon) and optional error message
  const [isCopied, setIsCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Keep a ref to the timeout id so we can clear it on unmount or re-trigger
  const timerRef = React.useRef<number | null>(null);

  // Cleanup on unmount: avoid dangling timeouts
  React.useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  // Helper to set isCopied=false after `resetAfter` ms
  const resetLater = React.useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setIsCopied(false), resetAfter);
  }, [resetAfter]);

  // Main copy function
  const copyToClipboard = React.useCallback(
    async (value: string) => {
      setError(null); // reset previous error

      // Guard: nothing to copy (avoid UX confusion)
      if (!value) {
        setError('Nothing to copy');
        return false;
      }

      // Guard: running on the server (during SSR render)
      if (typeof window === 'undefined') {
        setError('Clipboard not available in SSR');
        return false;
      }

      // 1) Preferred path: modern async Clipboard API
      try {
        // Requires secure context (https or localhost). Most modern browsers support this.
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          setIsCopied(true);
          resetLater();
          onCopy?.(value); // optional side-effect (toast etc.)
          return true;
        }
      } catch {
        // Swallow and fall back
      }

      // 2) Fallback path: legacy execCommand("copy")
      // Works on HTTP too, useful for dev/older browsers.
      try {
        // Create an off-screen <textarea>, select, copy, then remove.
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);

        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (!ok) throw new Error('execCommand copy failed');

        setIsCopied(true);
        resetLater();
        onCopy?.(value);
        return true;
      } catch (err) {
        // If both methods fail, surface an error (optional to show)
        setError(err instanceof Error ? err.message : 'Failed to copy to clipboard');
        return false;
      }
    },
    [onCopy, resetLater]
  );

  // The hook API your component consumes
  return { copyToClipboard, isCopied, error };
}
