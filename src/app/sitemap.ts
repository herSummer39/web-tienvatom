import type { MetadataRoute } from 'next';
import { INITIAL_POSTS } from '@/lib/studioData';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:6688';
  const staticRoutes = ['', '/dich-vu', '/phan-mem-zalo', '/du-an', '/bao-gia', '/blog', '/lien-he', '/bao-mat', '/dieu-khoan'];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    })),
    ...INITIAL_POSTS.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
