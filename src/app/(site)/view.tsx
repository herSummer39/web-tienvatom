import type { Metadata } from 'next';
import { renderPage, SITE_URL, type SitePage } from '@/lib/render';

export function metaFor(page: SitePage): Metadata {
  const url = page.slug === 'home' ? SITE_URL + '/' : `${SITE_URL}/${page.slug}`;
  const images = page.ogImage ? [SITE_URL + page.ogImage] : ['/framer/framerusercontent.com/assets/Hy1b1B1dstnjPd5prUh5KIBcLc.png'];
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: url,
      ...(page.slug === 'blog' ? { types: { 'application/rss+xml': `${SITE_URL}/blog/rss.xml` } } : {}),
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: page.ogType === 'article' ? 'article' : 'website',
      locale: 'vi_VN',
      siteName: 'Tiệm Code',
      images,
    },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description, images },
  };
}

export function PageView({ page }: { page: SitePage }) {
  const { top, main } = renderPage(page);
  const ld = page.head ? page.head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) : null;
  return (
    <>
      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld[1] }} />}
      {top && <div id="tc-top" data-page={page.slug} dangerouslySetInnerHTML={{ __html: top }} />}
      <div id="main" data-page={page.slug} dangerouslySetInnerHTML={{ __html: main }} />
    </>
  );
}
