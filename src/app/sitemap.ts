import type { MetadataRoute } from 'next';
import { loadSite, SITE_URL } from '@/lib/render';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { all, blog } = await loadSite();
  const dates = new Map(blog.posts.map((p: { slug: string; date: string }) => [`blog/${p.slug}`, p.date]));
  const legal = new Set(['bao-mat', 'dieu-khoan']);
  return all.map((p) => ({
    url: p.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${p.slug}`,
    lastModified: dates.get(p.slug) || new Date().toISOString().slice(0, 10),
    priority: p.slug === 'home' ? 1 : legal.has(p.slug) ? 0.3 : p.slug.startsWith('blog/') ? 0.6 : 0.8,
  }));
}
