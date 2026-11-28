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
    '## Bảng giá',
    `- [Bảng giá](${siteUrl}/bao-gia): Báo giá riêng theo đúng nhu cầu, gửi yêu cầu trong 30 giây. Tính năng gắn thêm: Chatbot AI (phí API OpenAI hằng tháng do khách trả), báo khách mới về Zalo/Telegram/Google Sheet, thanh toán trực tuyến, xuất Excel/Google Sheet.`,
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
