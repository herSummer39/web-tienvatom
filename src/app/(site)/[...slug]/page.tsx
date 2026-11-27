import { notFound, permanentRedirect } from 'next/navigation';
import { loadSite } from '@/lib/render';
import { metaFor, PageView } from '../view';

// trang tĩnh, làm mới mỗi 5 phút (để bài đăng từ /admin hiện lên blog)
export const revalidate = 300;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  const { all } = await loadSite();
  return all.filter((p) => p.slug !== 'home').map((p) => ({ slug: p.slug.split('/') }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { bySlug } = await loadSite();
  const page = bySlug.get(slug.join('/'));
  return page ? metaFor(page) : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const key = slug.map(decodeURIComponent).join('/');
  if (key === 'home') permanentRedirect('/');
  const { bySlug } = await loadSite();
  const page = bySlug.get(key);
  if (!page) notFound();
  return <PageView page={page} />;
}
