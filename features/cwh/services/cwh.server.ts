import { ServerResult } from '@/lib/api/api-types';
import { parseAspnetApiResponse } from '@/lib/api/server-api';
import { aspnetFetch } from '@/lib/auth/aspnet';
import 'server-only';
import { EodReportResponse } from '../types';

export async function submitEodReport(reportValues: FormData): Promise<{
  serverResult: ServerResult<EodReportResponse>;
  cookieHeaders: string[];
}> {
  const { res, setCookieHeaders } = await aspnetFetch('/api/CWH/eod-report', {
    method: 'POST',
    body: reportValues,
  });
  const cookieHeaders = setCookieHeaders;

  return {
    serverResult: await parseAspnetApiResponse<EodReportResponse>(res, 'Failed to submit EOD report'),
    cookieHeaders,
  };
}
