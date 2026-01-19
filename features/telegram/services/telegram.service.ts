export async function getTelegramToken() {
  // call api/private/telegram/link-token

  const res = await fetch('/api/private/telegram/Telegram/link-token');

  // return res;
}

export async function isTelegramLinked() {
  // call api/private/telegram/is-linked
}
