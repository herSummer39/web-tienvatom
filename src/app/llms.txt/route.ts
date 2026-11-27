import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import { SITE } from '@/lib/siteConfig';
import { SERVICES } from '@/lib/services';
import { SITE_URL } from '@/lib/render';

export const dynamic = 'force-dynamic';

export async function GET() {
  const siteUrl = SITE_URL;
  const posts = (await getAllPosts()).slice(0, 10);

  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    '## Về tụi mình',
    ...SITE.about,
    '',
    '## Dịch vụ',
    ...SERVICES.map(
      (s) => `- [${s.name}](${siteUrl}${s.id === 'zalo' ? '/phan-mem-zalo' : `/dich-vu#${s.id}`}): ${s.pain} Giá: ${s.price}.`
    ),
    '',
    '## Báo giá',
    `- [Công cụ tính báo giá](${siteUrl}/bao-gia): Website đến 10 trang 7.000.000đ, trên 10 trang liên hệ. Tính năng thêm: Chatbot AI +3.000.000đ (phí API OpenAI hằng tháng do khách trả), báo khách mới về Zalo/Telegram/Google Sheet +2.000.000đ, thanh toán trực tuyến +2.500.000đ, xuất Excel/Google Sheet +1.000.000đ.`,
    '- Giá chưa gồm tên miền và hosting. Website được bảo hành trọn đời.',
    '',
    ...(posts.length
      ? ['## Bài viết mới', ...posts.map((p) => `- [${p.title}](${siteUrl}/blog/${p.slug}): ${p.excerpt}`), '']
      : []),
    '## Liên hệ',
    `- Zalo / điện thoại: ${SITE.zalo}`,
    `- Trang liên hệ: ${siteUrl}/lien-he`,
  ];

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
