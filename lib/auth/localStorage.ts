export function setLocalStorageJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalStorageJSON<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (raw == null) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback; // corrupted / non-JSON value
  }
}
