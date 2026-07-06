import { getDefaultErrorMessage, parseJsonSafe } from './api-error';
import { ApiResponse, ServerResult } from './api-types';

export async function parseAspnetApiResponse<T>(res: Response, fallbackErrorMessage: string): Promise<ServerResult<T>> {
  // Backend is sometimes unpredictable like 401-empty body, 502 with HTML error page...
  // We cannot always force those errors tobe ApiResponse<T>
  if (!res.ok) {
    // try parsing body when there is ApiResponse type returned.
    const body = await parseJsonSafe<ApiResponse<unknown>>(res);
    const errors = body?.errors.length ? body.errors : [getDefaultErrorMessage(res.status)];

    return {
      ok: false,
      message: errors.join(', '),
      errors,
      status: res.status,
    };
  }

  // ASP.NET returned 2xx, but the body is invalid,
  // empty, not JSON, or not in the expected ApiResponse<T> shape.
  const body = await parseJsonSafe<ApiResponse<T>>(res);

  if (!body)
    return {
      ok: false,
      message: 'Invalid JSON Response from ASP server',
      errors: ['Invalid JSON Response from ASP server'],
      status: 500,
    };

  // ASP.NET returned 2xx with a valid wrapper,
  // but the operation still failed at the API/business level.
  if (!body.success || body.data === null) {
    const errors = body.errors.length ? body.errors : [fallbackErrorMessage];
    return {
      ok: false,
      message: errors.join(', '),
      errors,
      status: res.status,
    };
  }

  return {
    ok: true,
    data: body.data,
  };
}
