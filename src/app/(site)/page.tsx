import { loadSite } from '@/lib/render';
import { metaFor, PageView } from './view';

export const revalidate = 300;

export async function generateMetadata() {
  const { bySlug } = await loadSite();
  return metaFor(bySlug.get('home')!);
}

export default async function Home() {
  const { bySlug } = await loadSite();
  return <PageView page={bySlug.get('home')!} />;
}
