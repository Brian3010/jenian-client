// Re-export for backward compatibility (shadcn components import from @/lib/utils)
export { cn } from './utils/cn';
export { getByPath } from './utils/form';

export function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request.';
    case 401:
      return 'You are not authorised. Please sign in again.';
    case 403:
      return 'You do not have permission to access this.';
    case 404:
      return 'The requested resource was not found.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
      return 'Backend service is unavailable.';
    default:
      return 'Something went wrong.';
  }
}

export async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export function formatDayMonth(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}
