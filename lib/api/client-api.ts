import { parseJsonSafe } from '@/lib/api/api-error';
import { AppError } from '../AppError';
import { ApiResponse } from './api-types';

/**
 * Parse BFF route handler response to get data of type T or throw errors to the caller
 * @param res response from route handlers
 * @param fallbackErrorMessage fallback error message if the response does not contain errors
 * @returns data of type T and throw errors to the caller
 */
export async function parseClientApiResponse<T>(res: Response, fallbackErrorMessage: string): Promise<T> {
  // 204 No Content is a valid response for some endpoints, so we return undefined as T
  if (res.status === 204) return undefined as T;

  const body = await parseJsonSafe<ApiResponse<T>>(res);
  if (!body) {
    throw new AppError({
      message: 'Server response is not valid JSON',
      code: 'INVALID_JSON_RESPONSE',
      status: 500,
    });
  }
  if (!res.ok || !body.success || !body.data) {
    throw new AppError({
      message: body.errors?.join(', ') || fallbackErrorMessage,
      code: 'CLIENT_API_ERROR',
      status: res.status,
    });
  }
  return body.data as T;
}
