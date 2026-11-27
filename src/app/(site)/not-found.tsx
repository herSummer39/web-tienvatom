import { loadSite } from '@/lib/render';
import { PageView } from './view';

export default async function NotFound() {
  const { bySlug } = await loadSite();
  const base = bySlug.get('lien-he')!;
  const page = {
    ...base,
    slug: '404',
    show: [],
    after: '',
    content: `<section class="tcp-wrap"><header class="tcp-hero"><span class="tcp-sticker tcp-bg-pink">404</span><h1 class="tcp-title">Không tìm thấy<br>trang này</h1><p class="tcp-lead">Đường dẫn có thể đã đổi hoặc không còn nữa.</p><div class="tcp-actions"><a class="tcp-btn" href="/"><span>Về trang chủ</span></a><a class="tcp-btn" data-variant="ghost" href="/du-an"><span>Xem dự án</span></a></div></header></section>`,
  };
  return <PageView page={page} />;
}
