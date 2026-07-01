import 'server-only';

const HEALTH_TIMEOUT_MS = 5000;

export async function checkAspNetBackendHealth() {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return {
      ok: false,
      error: 'BACKEND_URL is not configured',
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

  try {
    const res = await fetch(`${backendUrl}/api/Home/health`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });

    return {
      ok: res.ok,
      status: res.status,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Backend unavailable',
    };
  } finally {
    clearTimeout(timeout);
  }
}
