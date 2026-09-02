export const BACKEND_READY_COOKIE = 'backendReady';
export const BACKEND_READY_MAX_AGE_SECONDS = 30;

const WAKE_TIMEOUT_MS = 45_000;
const REQUEST_TIMEOUT_MS = 8_000;
const RETRY_DELAY_MS = 2_000;
const TRANSIENT_BACKEND_STATUSES = new Set([502, 503, 504]);

export function getSafeWakeReturnTo(fallbackReturnTo: string, value?: string | string[]) {
  const returnTo = Array.isArray(value) ? value[0] : value;

  if (!returnTo) return fallbackReturnTo;

  try {
    const baseUrl = new URL('https://jenian.internal');
    const destination = new URL(returnTo, baseUrl);

    if (
      destination.origin !== baseUrl.origin ||
      !returnTo.startsWith('/') ||
      destination.pathname === '/wake' ||
      destination.pathname.startsWith('/wake/') ||
      destination.pathname === '/api' ||
      destination.pathname.startsWith('/api/') ||
      destination.pathname.startsWith('/_next/')
    ) {
      return fallbackReturnTo;
    }

    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return fallbackReturnTo;
  }
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getBackendUrl(backendUrl: string, path: string) {
  return `${backendUrl.replace(/\/$/, '')}${path}`;
}

async function checkBackend(backendUrl: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(getBackendUrl(backendUrl, '/api/Home/health'), {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function wakeBackend(backendUrl: string) {
  const deadline = Date.now() + WAKE_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const remainingMs = deadline - Date.now();
    const healthy = await checkBackend(backendUrl, Math.min(REQUEST_TIMEOUT_MS, remainingMs));

    if (healthy) return true;

    const delayMs = Math.min(RETRY_DELAY_MS, deadline - Date.now());
    if (delayMs > 0) await wait(delayMs);
  }

  return false;
}

export async function fetchBackendWithWakeRetry(backendUrl: string, path: string, init: RequestInit = {}) {
  const execute = () =>
    fetch(getBackendUrl(backendUrl, path), {
      ...init,
      cache: 'no-store',
    });

  let response: Response;

  try {
    response = await execute();
  } catch (error) {
    const healthy = await wakeBackend(backendUrl);
    if (!healthy) throw error;

    return execute();
  }

  if (!TRANSIENT_BACKEND_STATUSES.has(response.status)) return response;

  const healthy = await wakeBackend(backendUrl);
  if (!healthy) return response;

  await response.body?.cancel();
  return execute();
}
