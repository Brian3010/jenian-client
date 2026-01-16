// const BACKEND_URL = process.env.BACKEND_URL;

export async function login(email: string, password: string, deviceName: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, deviceName }),
    credentials: 'include',
  });
  // console.log(res);

  const data = await res.json().catch(() => null);

  if (!res.ok || res.status == 401) {
    console.log({ ok: res.ok, status: res.status });
    throw new Error('Invalid username or password');
  }
  if (!res.ok || !data?.ok) {
    throw new Error(data?.message || 'Login failed');
  }

  return data as { ok: true; user: { id: string; email: string; userName: string } | null };
}
