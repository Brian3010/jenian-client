import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ helper to read nested error using the same string path you use for register()
// for example: getByPath(errors, 'GeneralCheck.FreeCages') will return the error message for FreeCages field if it exists
export function getByPath<T>(obj: T, path: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split('.').reduce<any>((acc, key) => (acc ? acc[key] : undefined), obj);
}
