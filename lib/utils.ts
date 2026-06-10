// Re-export for backward compatibility (shadcn components import from @/lib/utils)
export { cn } from './utils/cn';
export { getByPath } from './utils/form';

export function formatDayMonth(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function getHoursBetween(startAt: string, endAt: string): number {
  const start = new Date(startAt);
  const end = new Date(endAt);

  const durationMs = end.getTime() - start.getTime();

  return durationMs / (1000 * 60 * 60);
}

export function formatTime(dateString: string, timezone: string): string {
  return new Intl.DateTimeFormat('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  }).format(new Date(dateString));
}

export function formatDateToDayMonth(dateString: string, timezone: string): string {
  const [year, month, day] = dateString.split('-').map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return date.toLocaleDateString('en-AU', {
    timeZone: timezone,
    day: 'numeric',
    month: 'long',
  });
}

export function formatShortDate(dateString: string, timezone: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', timeZone: timezone });
}

export function formatTime12h(time: string, timezone: string): string {
  const date = new Date(time);
  return date.toLocaleTimeString('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });
}

export function formatTime24h(time?: string | Date, timeZoneId?: string) {
  if (!time) return '';

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timeZoneId,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(time));
}
