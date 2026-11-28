import { NextResponse } from 'next/server';
import { SITE } from '@/lib/siteConfig';
import { FAQS, PROCESS, SERVICES } from '@/lib/services';

const STUDIO_CONTEXT = `
Bạn là trợ lý tư vấn của Tiệm Code (Việt Nam). Xưng "mình", gọi khách là "bạn", nói về studio là "tụi mình".
Về tụi mình (trả lời khi khách hỏi "bên bạn là ai", "có uy tín không"): ${SITE.about.join(" ")}
Thông tin chính xác để tư vấn (tuyệt đối không bịa giá hay dịch vụ ngoài danh sách này):
Dịch vụ (website nhiều tính năng / hệ thống: liên hệ báo giá riêng):
${SERVICES.map((s, i) => `${i + 1}. ${s.name} — Giá: ${s.price}. Phù hợp khi: ${s.pain} Gồm: ${s.points.join('; ')}.`).join('\n')}
Quy trình: ${PROCESS.map((p, i) => `${i + 1}. ${p.title}`).join(' → ')}.
Câu hỏi thường gặp:
${FAQS.map((f) => `- ${f.q} ${f.a}`).join('\n')}
Tính năng thêm cho website:
   - Chatbot AI tư vấn theo bảng giá / tài liệu của khách: +3.000.000đ (phí API OpenAI hằng tháng do khách hàng chi trả)
   - Báo khách mới tự động về Zalo / Telegram / Google Sheet: +2.000.000đ
   - Thanh toán trực tuyến (VietQR / MoMo / VNPay): +2.500.000đ
   - Xuất báo cáo Excel / đồng bộ Google Sheet: +1.000.000đ
- Giá chưa bao gồm tên miền và hosting (khách tự đăng ký, tụi mình hỗ trợ cài đặt).
- Bảo hành trọn đời: website tụi mình làm gặp sự cố hay ngừng chạy thì tụi mình sửa miễn phí (không áp dụng khi tên miền/hosting hết hạn hoặc bên khác sửa mã nguồn).
- Thời gian làm website: khoảng 5–14 ngày làm việc.
- Liên hệ: Zalo / điện thoại ${SITE.zalo}.
Trả lời ngắn gọn, thân thiện, bằng tiếng Việt. Khi khách quan tâm, gợi ý vào trang /bao-gia để tự tính chi phí hoặc để lại SĐT/Zalo ngay trong khung chat.
`;

function fallbackReply(message: string): string {
  const q = message.toLowerCase();
  if (q.includes("zalo") && (q.includes("phần mềm") || q.includes("tool") || q.includes("marketing"))) {
    return `Phần mềm Zalo Marketing của tụi mình giúp bạn quản lý nhiều tài khoản Zalo trên một màn hình, trả lời tin nhắn tự động, tự động đăng bài theo giờ, hỗ trợ tìm khách và quét thành viên nhóm ẩn. Bạn nhắn Zalo ${SITE.zalo} để nhận video demo và báo giá nhé!`;
  }
  if (q.includes("giá") || q.includes("bao nhiêu") || q.includes("chi phí")) {
    return `Chi phí tham khảo bên mình:
• Website trọn gói: từ 7 triệu
• Landing page: từ 4,5 triệu
• Phần mềm theo nhu cầu, phần mềm Zalo: liên hệ
• Thêm Chatbot AI: +3 triệu (phí OpenAI hằng tháng do bạn trả)
• Báo khách mới về Zalo/Telegram: +2 triệu

Giá chưa gồm tên miền & hosting, bảo hành trọn đời. Bạn tự tính chi phí ở trang /bao-gia hoặc để lại SĐT/Zalo để tụi mình tư vấn nhé!`;
  }
  if (q.includes("bao lâu") || q.includes("thời gian")) {
    return "Website thường mất khoảng 5–14 ngày làm việc tùy số trang và tính năng. Phần mềm theo nhu cầu thì tụi mình báo tiến độ sau khi trao đổi yêu cầu. Bạn cần làm gấp không?";
  }
  if (q.includes("là ai") || q.includes("uy tín") || q.includes("sinh viên") || q.includes("giới thiệu")) {
    return SITE.about.join(" ");
  }
  if (q.includes("chatbot") || q.includes("ai")) {
    return "Tụi mình gắn Chatbot AI lên website để tư vấn khách theo đúng bảng giá, tài liệu của bạn, kèm báo khách mới về Zalo/Telegram ngay lập tức. Bạn đang kinh doanh ngành gì để mình tư vấn kỹ hơn?";
  }
  return "Chào bạn! Mình là trợ lý của Tiệm Code. Tụi mình làm website trọn gói, landing page, phần mềm theo nhu cầu và phần mềm Zalo marketing. Bạn đang cần làm gì nè?";
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
