# Tiệm Code – website (Next.js)

Giao diện giữ nguyên 100% bản thiết kế cũ (Framer), nhưng không còn tải bộ JS nặng của Framer:
HTML/CSS của thiết kế được lưu tĩnh, các hiệu ứng viết lại bằng CSS + một file JS nhỏ (`public/site.js`).

## Chạy trên máy

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # kiểm tra trước khi đẩy lên
```

## Sửa nội dung

| Muốn sửa | Sửa ở đâu |
|---|---|
| Chữ các trang (Dịch vụ, Báo giá, Về chúng mình, Liên hệ, Hỏi đáp…) | `src/lib/site/pages.js` |
| Thêm / sửa dự án, mẫu web | `content/du-an/*.md` (hướng dẫn ở đầu `src/lib/site/projects.js`) |
| Thêm bài blog | `content/blog/*.md` hoặc đăng ở trang `/admin` |
| Giá & thời gian trong công cụ ước tính | `EST_KINDS` trong `src/lib/site/pages.js` |
| Hiệu ứng, menu, form, chat | `public/site.js`, `src/styles/site.css` |
| Kiểu chữ của các khối nội dung | `src/styles/page.css` |

Các khối giao diện của thiết kế (đầu trang, chân trang, menu, báo giá, hỏi đáp…) nằm ở `src/framer/*.html`
(HTML tĩnh đã dịch sẵn) – chỉ sửa khi cần đổi chữ trong các khối đó.

## Biến môi trường (Vercel → Settings → Environment Variables)

Xem `.env.example`. Quan trọng:

- `ADMIN_PASSWORD` – **bắt buộc** để vào `/admin` và xem danh sách khách (không đặt = khóa).
- `NEXT_PUBLIC_SITE_URL` – tên miền chính thức (dùng cho sitemap, link chia sẻ).
- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` – lưu khách đăng ký và bài blog.
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` hoặc `LEAD_WEBHOOK_URL` – báo khách mới.
- `OPENAI_API_KEY` – chatbot trả lời bằng AI (không có thì dùng câu trả lời soạn sẵn).
- `NEXT_PUBLIC_CLARITY_ID` – Microsoft Clarity.
