export async function getTelegramToken() {
  // call api/private/telegram/link-token
  const res = await fetch('/api/private/telegram/Telegram/link-token');
  if (!res.ok && res.status == 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Internal server error');
  const data: { linkToken: string } = await res.json();
  return data;
}
