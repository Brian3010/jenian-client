import { aspnetFetch } from '@/lib/auth/aspnet';
const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(_: Request, ctx: RouteContext<'/api/private/telegram/[...path]'>) {
  console.log('private route');
  // call aspfetch here
  const { path } = await ctx.params;

  // const url = `${API}/${ctx.params.path.join("/")}${req ? new URL(req.url).search : ""}`;
  const url = `${BACKEND_URL}/api/${path.join('/')}`;
  console.log('🚀 ~ GET ~ url:', url);
  //TODO: call asp API to get token
  // const aspRes = await aspnetFetch(url, { method: 'GET' });
  // return res;
}
