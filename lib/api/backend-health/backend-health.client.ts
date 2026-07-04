export async function checkBackend(): Promise<boolean> {
  try {
    const res = await fetch('/api/health', {
      method: 'GET',
      cache: 'no-store',
    });

    return res.ok;
  } catch {
    return false;
  }
}
