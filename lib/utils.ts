// Re-export for backward compatibility (shadcn components import from @/lib/utils)
export { cn } from './utils/cn';
export { getByPath } from './utils/form';
import { DateTime } from 'luxon';

export function formatDateDayMonth(date: string): string {
  const dateTime = DateTime.fromISO(date, {
    zone: 'UTC',
  }).setLocale('en-AU');

  if (!dateTime.isValid) {
    return date;
  }

  return dateTime.toFormat('d LLLL');
}

// hours between two ISO date strings
export function getHoursBetween(startAt: string, endAt: string): number {
  const start = new Date(startAt);
  const end = new Date(endAt);

  const durationMs = end.getTime() - start.getTime();

  return durationMs / (1000 * 60 * 60);
}

// hours between 2 string times in format 'HH:mm', e.g. '09:30' to '17:00'
export function getHoursBetweenTimes(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const start = new Date();
  start.setHours(startHours, startMinutes, 0, 0);
  const end = new Date();
  end.setHours(endHours, endMinutes, 0, 0);

  const durationMs = end.getTime() - start.getTime();
  return durationMs / (1000 * 60 * 60);
}

// format to short date with day, e.g. Wed 1 Jan
export function formatWorkDate(date: string): string {
  const dateTime = DateTime.fromISO(date, {
    zone: 'UTC',
  }).setLocale('en-AU');

  if (!dateTime.isValid) {
    return date;
  }

  return dateTime.toFormat('ccc, d LLLL');
}

// convert utc iso string to local date and time with timezone info, e.g. 2024-01-01T14:30:00+11:00 to { date: '2024-01-01', time: '14:30' }
export function convertUtcIsoToLocalDateAndTime(
  utcDateTime: string,
  timeZoneId: string,
): {
  date: string;
  time: string;
} {
  if (!utcDateTime) {
    throw new Error('utcDateTime is required');
  }

  if (!timeZoneId) {
    throw new Error('timeZoneId is required');
  }

  const dateTime = DateTime.fromISO(utcDateTime, {
    zone: 'utc',
  }).setZone(timeZoneId);

  if (!dateTime.isValid) {
    throw new Error(dateTime.invalidExplanation ?? 'Invalid UTC datetime');
  }

  return {
    date: dateTime.toFormat('yyyy-MM-dd'),
    time: dateTime.toFormat('HH:mm'),
  };
}

// convert local date and time with timezone info to utc iso string, e.g. { date: '2024-01-01', time: '14:30' } to 2024-01-01T03:30:00Z
export function convertLocalDateAndTimeToUtcIso(date: string, time: string, timeZoneId: string): string {
  if (!date) {
    throw new Error('date is required');
  }

  if (!time) {
    throw new Error('time is required');
  }

  if (!timeZoneId) {
    throw new Error('timeZoneId is required');
  }

  const dateTime = DateTime.fromFormat(`${date} ${time}`, 'yyyy-MM-dd HH:mm', {
    zone: timeZoneId,
  }).setZone('utc');

  if (!dateTime.isValid) {
    throw new Error(dateTime.invalidExplanation ?? 'Invalid local date and time');
  }

  return dateTime.toISO({ suppressMilliseconds: false })!;
}

export function formatTime12h(time24h: string): string {
  const [hoursString, minutesString] = time24h.split(':');

  const hours = Number(hoursString);
  const minutes = Number(minutesString);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return time24h;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;

  return `${hours12}:${minutesString.padStart(2, '0')} ${period}`;
}
