export async function getTelegramToken() {
  // call api/private/telegram/link-token
  const res = await fetch('/api/private/telegram/Telegram/link-token');
  console.log('🚀 ~ getTelegramToken ~ res:', res);
  if (!res.ok && res.status == 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Internal server error');
  const data: { linkToken: string } = await res.json();
  return data;
}
export async function isTelegramLinked(): Promise<boolean> {
  const res = await fetch('/api/private/telegram/Telegram/is-linked', {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  // if (res.status === 401) {
  //   // redirectToSignIn();
  //   throw new Error('Redirecting to sign-in');
  // }

  if (!res.ok) {
    throw new Error(`Failed to check Telegram link: ${res.status}`);
  }

  const data = await res.json();
  return Boolean(data?.isLinked);
}
