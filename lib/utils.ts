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
