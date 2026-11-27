import { loadSite } from '@/lib/render';

export const revalidate = 3600;

export async function GET() {
  const { blog } = await loadSite();
  return new Response(blog.rss, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
