'use client';

import * as React from 'react';

type Options = {
  resetAfter?: number;
  onCopy?: (value: string) => void;
};

export function useCopyToClipboard(options?: Options) {
  const { resetAfter = 1200, onCopy } = options ?? {};

  const [isCopied, setIsCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const resetLater = React.useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setIsCopied(false);
    }, resetAfter);
  }, [resetAfter]);

  const copyToClipboard = React.useCallback(
    async (value: string) => {
      setError(null);

      if (!value) {
        setError('Nothing to copy');
        return false;
      }

      if (typeof window === 'undefined') {
        setError('Clipboard not available in SSR');
        return false;
      }

      // Modern Clipboard API
      if (window.isSecureContext && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(value);
          setIsCopied(true);
          resetLater();
          onCopy?.(value);
          return true;
        } catch (err) {
          console.error('navigator.clipboard.writeText failed:', err);
        }
      }

      // Safari / older browser fallback
      try {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');

        // Better for iOS Safari
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, value.length);

        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (!ok) {
          throw new Error('execCommand copy failed');
        }

        setIsCopied(true);
        resetLater();
        onCopy?.(value);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to copy to clipboard';
        setError(message);
        console.error('Fallback copy failed:', err);
        return false;
      }
    },
    [onCopy, resetLater],
  );

  return { copyToClipboard, isCopied, error };
}
