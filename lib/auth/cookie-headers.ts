import { NextResponse } from 'next/server';

type HeadersWithSetCookie = Headers & {
  getSetCookie?: () => string[];
};

export function getSetCookieHeaders(response: Response): string[] {
  const headers = response.headers as HeadersWithSetCookie;
  const setCookieHeaders = headers.getSetCookie?.();

  if (setCookieHeaders?.length) return setCookieHeaders;

  const setCookie = response.headers.get('set-cookie');
  if (!setCookie) return [];

  return splitSetCookieHeader(setCookie);
}

export function splitSetCookieHeader(setCookie: string): string[] {
  return setCookie.split(/,(?=\s*[A-Za-z0-9_\-]+=)/g).map(cookie => cookie.trim());
}

export function getCookieValueFromSetCookie(setCookieHeaders: string[], cookieName: string): string | undefined {
  for (const setCookie of setCookieHeaders) {
    const [nameValue] = setCookie.split(';', 1);
    const separatorIndex = nameValue.indexOf('=');

    if (separatorIndex === -1) continue;

    const name = nameValue.slice(0, separatorIndex).trim();
    const value = nameValue.slice(separatorIndex + 1);

    if (name === cookieName) return value;
  }
}

export function appendSetCookieHeaders(response: NextResponse, setCookieHeaders: string[]) {
  for (const cookie of setCookieHeaders) {
    response.headers.append('Set-Cookie', cookie);
  }
}
