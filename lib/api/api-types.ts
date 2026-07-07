/**
 * Standard HTTP/API response body shape.
 *
 * Used for:
 * - ASP.NET API responses
 * - Next.js BFF route responses
 *
 * This is the wrapper returned over HTTP.
 */
export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  errors: string[];
};

/**
 * Internal server-side result used by feature server functions.
 *
 * Used inside Next.js server code only.
 * A server function returns either:
 * - ok: true with clean data
 * - ok: false with error details and optional HTTP status
 */
export type ServerResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      message: string;
      errors: string[];
      status?: number;
    };
