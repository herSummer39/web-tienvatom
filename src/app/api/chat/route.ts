import { NextResponse } from 'next/server';

const STUDIO_CONTEXT = `
Bạn là trợ lý tư vấn AI của Studio Thiết kế Web, Web App & Giải pháp AI Automation (hoạt động tại Việt Nam theo mô hình Team / Studio Freelance trực tiếp với kỹ sư).
Thông tin chính xác để tư vấn (tuyệt đối không bịa giá ngoài bảng này):
1. Thiết kế + Lập trình Website chuẩn SEO (Next.js / Vercel / Supabase): từ 7.000.000đ - 15.000.000đ tùy số trang & tính năng.
2. Lập trình Web App quản lý (đặt lịch, quản lý đơn hàng, CRM mini thay thế Excel): từ 15.000.000đ+.
3. Tính năng Add-on:
   - Chatbot AI đọc đúng bảng giá/tài liệu riêng của doanh nghiệp: +3.000.000đ
   - Automation đẩy Lead tự động về Zalo OA / Fanpage / Telegram / Google Sheet: +2.000.000đ
   - Thanh toán trực tuyến (VietQR / MoMo / VNPay): +2.500.000đ
   - Trang quản trị bài viết chuẩn SEO Google + llms.txt: +2.000.000đ
4. Thời gian hoàn thành: 5 - 14 ngày làm việc.
Hãy trả lời ngắn gọn, thân thiện, thực tế, bằng tiếng Việt. Nếu khách quan tâm, gợi ý họ bấm vào trang /bao-gia để tự tính chi phí hoặc để lại SĐT/Zalo ngay trong khung chat.
`;

function fallbackReply(message: string): string {
  const q = message.toLowerCase();
  if (q.includes('giá') || q.includes('bao nhiêu') || q.includes('chi phí')) {
    return 'Chi phí bên mình phụ thuộc vào nhu cầu thực tế:\n• Website chuẩn SEO trọn gói: từ 7 – 12 triệu\n• Chatbot AI đọc đúng bảng giá riêng: +3 triệu\n• Automation đẩy đơn về Zalo / Fanpage: +2 triệu\n• Web App quản lý nội bộ: từ 15 triệu\n\nBạn có thể tự chọn tính năng ở trang Báo giá (/bao-gia) hoặc để lại SĐT/Zalo tại đây để team gửi demo nhé!';
  }
  if (q.includes('chatbot') || q.includes('ai') || q.includes('zalo') || q.includes('automation')) {
    return 'Bên mình tích hợp Chatbot AI đọc đúng dữ liệu bảng giá/sản phẩm của doanh nghiệp (không trả lời bừa) và tự động đẩy thông tin khách hàng mới về Zalo, Fanpage hoặc Telegram ngay lập tức. Bạn đang kinh doanh ngành nào để mình tư vấn luồng phù hợp?';
  }
  if (q.includes('bao lâu') || q.includes('thời gian')) {
    return 'Thời gian hoàn thành trung bình từ 5–10 ngày cho Website chuẩn SEO + Chatbot AI, và 2–4 tuần cho Web App quản lý riêng. Bạn cần triển khai gấp trong tháng này không?';
  }
  return 'Chào bạn! Mình là trợ lý AI của Studio Web & Automation. Team mình chuyên làm Website tốc độ cao (Next.js + Supabase), Web App quản lý và Chatbot AI đẩy lead về Zalo/Fanpage. Bạn đang muốn tìm hiểu làm Web mới, Web App hay tự động hóa quy trình?';
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const text = String(message || '').trim();
    if (!text) return NextResponse.json({ reply: 'Bạn cứ nhắn câu hỏi nhé!' });

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: STUDIO_CONTEXT },
              { role: 'user', content: text },
            ],
            temperature: 0.4,
            max_tokens: 350,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data?.choices?.[0]?.message?.content;
          if (reply) return NextResponse.json({ reply });
        }
      } catch {
        // Fallback below
      }
    }

    return NextResponse.json({ reply: fallbackReply(text) });
  } catch {
    return NextResponse.json({ reply: 'Có lỗi kết nối, bạn thử lại hoặc liên hệ Zalo nhé!' });
  }
}
