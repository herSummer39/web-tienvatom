import { NextResponse } from 'next/server';
import { isSupabaseConfigured, supabaseSelect } from '@/lib/supabase';
import { BlogPost, runtimeStore } from '@/lib/studioData';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:6688';

  let posts = runtimeStore.posts;
  if (isSupabaseConfigured()) {
    const rows = await supabaseSelect<BlogPost>('posts', '?order=created_at.desc&limit=10');
    if (rows && rows.length > 0) posts = rows;
  }

  const lines = [
    '# Studio Thiết kế Website, Web App & Giải pháp AI Automation',
    '',
    '> Team / Studio Freelance tại Việt Nam chuyên xây dựng Website chuẩn SEO tốc độ cao (Next.js + Vercel + Supabase), Web App quản lý theo yêu cầu, và tích hợp Chatbot AI + Automation đẩy lead về Zalo / Fanpage / Telegram.',
    '',
    '## Dịch vụ chính',
    `- [Thiết kế Website chuẩn SEO & Tốc độ cao](${siteUrl}/dich-vu): Giao diện độc quyền, Core Web Vitals 95+, trang quản trị bài viết SEO.`,
    `- [Lập trình Web App theo yêu cầu](${siteUrl}/dich-vu): Hệ thống đặt lịch, quản lý đơn hàng, CRM mini thay thế Excel.`,
    `- [Tích hợp Chatbot AI & Automation](${siteUrl}/dich-vu): Chatbot đọc dữ liệu riêng của doanh nghiệp, tự động thông báo khách mới về Zalo OA / Fanpage / Telegram.`,
    '',
    '## Báo giá tham khảo',
    `- [Công cụ tính báo giá tương tác](${siteUrl}/bao-gia): Website từ 7.000.000đ, Web App từ 15.000.000đ, Chatbot AI +3.000.000đ, Automation Zalo/Fanpage +2.000.000đ, Excel/Google Sheet +1.000.000đ. Website trên 10 trang / hệ thống: liên hệ. Chưa gồm tên miền & hosting; phí API OpenAI của Chatbot do khách chi trả; bảo hành trọn đời.`,
    '',
    '## Dự án & Giải pháp mẫu',
    `- [Portfolio & Live Demo](${siteUrl}/du-an): 2 dự án thực tế và các bản demo giải pháp theo ngành.`,
    '',
    '## Bài viết kiến thức mới nhất',
    ...posts.map((p) => `- [${p.title}](${siteUrl}/blog/${p.slug}): ${p.excerpt}`),
    '',
    '## Liên hệ',
    `- Trang liên hệ: ${siteUrl}/lien-he`,
    '- Khu vực phục vụ: TP. Hồ Chí Minh, Hà Nội và toàn quốc (Việt Nam).',
  ];

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
