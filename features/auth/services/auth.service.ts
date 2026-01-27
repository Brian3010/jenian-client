// const BACKEND_URL = process.env.BACKEND_URL;

type dataT = { ok: boolean; message: string } & {
  ok: boolean;
  message: string;
  user: { id: string; userName: string; email: string };
};

export async function login(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  // console.log(res);

  const data: dataT = await res.json().catch(() => null);
  console.log('🚀 ~ login ~ data:', data);

  if (!res.ok || res.status == 401) {
    throw new Error('Invalid username or password');
  }

  if (res.status == 500) {
    throw new Error('Internal server error');
  }

  // if (!res.ok || !data?.ok) {
  //   throw new Error(data?.message || 'Login failed');
  // }
  data.ok = res.ok;

  // setLocalStorageJson('User', data.user);

  return data;
}
