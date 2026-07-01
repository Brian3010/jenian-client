import { checkAspNetBackendHealth } from '@/lib/api/backend-health.server';

export async function GET() {
  const result = await checkAspNetBackendHealth();

  return Response.json(result, {
    status: result.ok ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
