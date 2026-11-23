import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import { SITE } from '@/lib/siteConfig';

export const dynamic = 'force-dynamic';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:6688';
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
    `- [Website trọn gói](${siteUrl}/dich-vu): Thiết kế giao diện, lập trình, trang quản trị để khách tự đăng bài làm marketing. Từ 7.000.000đ.`,
    `- [Thiết kế giao diện](${siteUrl}/dich-vu): Thiết kế trên Figma, bàn giao cho đội lập trình. Từ 4.500.000đ.`,
    `- [Phần mềm theo nhu cầu](${siteUrl}/dich-vu): Quản lý bán hàng, kho, đặt lịch… làm riêng theo doanh nghiệp. Giá: liên hệ.`,
    `- [Phần mềm Zalo Marketing](${siteUrl}/phan-mem-zalo): Quản lý nhiều tài khoản Zalo trên một màn hình, trả lời tự động, hẹn giờ gửi tin, đăng bài nhóm. Giá: liên hệ.`,
    '',
    '## Báo giá',
    `- [Công cụ tính báo giá](${siteUrl}/bao-gia): Website từ 7.000.000đ (1–3 trang), 5 trang +2.000.000đ, trên 10 trang liên hệ. Tính năng thêm: Chatbot AI +3.000.000đ (phí API OpenAI hằng tháng do khách trả), báo khách mới về Zalo/Telegram/Google Sheet +2.000.000đ, thanh toán trực tuyến +2.500.000đ, xuất Excel/Google Sheet +1.000.000đ.`,
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
