import type { Metadata } from 'next';
import StudioShell from '@/components/StudioShell';
import { makeHeroHtml } from '@/components/siteChrome';
import { SITE } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description: 'Điều khoản sử dụng website và dịch vụ của Tiệm Code.',
};

export default function DieuKhoanPage() {
  return (
    <StudioShell heroHtml={makeHeroHtml('Điều khoản', 'Một vài điều cần biết khi dùng website và dịch vụ.')}>
      <div className="studio-prose">
        <p>Khi truy cập website của {SITE.name}, bạn đồng ý với các điều khoản dưới đây.</p>

        <h2>1. Nội dung website</h2>
        <p>
          Website giới thiệu dịch vụ làm website, thiết kế giao diện, phần mềm theo nhu cầu và phần mềm Zalo
          marketing của {SITE.name}. Thông tin mang tính tham khảo và có thể được cập nhật mà không cần báo trước.
        </p>

        <h2>2. Báo giá</h2>
        <p>
          Giá trên trang Báo giá là giá tạm tính. Giá chính thức được thống nhất sau khi trao đổi chi tiết nhu cầu.
          Gửi form hoặc nhắn tin không tự động tạo thành hợp đồng giữa bạn và {SITE.name}.
        </p>
        <ul>
          <li>Giá chưa bao gồm tên miền và hosting.</li>
          <li>Với tính năng Chatbot AI, phí sử dụng API OpenAI hằng tháng do khách hàng chi trả.</li>
        </ul>

        <h2>3. Bảo hành</h2>
        <p>
          Website do {SITE.name} làm được bảo hành trọn đời: nếu website gặp sự cố hoặc ngừng hoạt động, tụi mình sửa
          miễn phí. Bảo hành không áp dụng khi tên miền hoặc hosting hết hạn, hoặc khi mã nguồn bị bên khác chỉnh sửa.
        </p>

        <h2>4. Phần mềm Zalo Marketing</h2>
        <p>
          Người dùng tự chịu trách nhiệm sử dụng phần mềm đúng chính sách của Zalo và quy định pháp luật về quảng
          cáo, tin nhắn và dữ liệu cá nhân. {SITE.name} không chịu trách nhiệm khi tài khoản bị Zalo hạn chế do cách
          sử dụng của người dùng.
        </p>

        <h2>5. Sử dụng website</h2>
        <p>
          Bạn không được dùng website vào mục đích vi phạm pháp luật, phát tán mã độc, hay truy cập trái phép vào hệ
          thống.
        </p>

        <h2>6. Bản quyền</h2>
        <p>
          Nội dung, hình ảnh và mã nguồn trên website thuộc về {SITE.name} hoặc được sử dụng có phép. Vui lòng không
          sao chép khi chưa được đồng ý.
        </p>

        <h2>7. Liên hệ</h2>
        <p>
          Mọi thắc mắc về điều khoản, bạn nhắn Zalo{' '}
          <a href={SITE.zaloUrl} target="_blank" rel="noopener">
            {SITE.zalo}
          </a>
          .
        </p>

        <p className="studio-updated">Cập nhật lần cuối: 23/11/2026.</p>
      </div>
    </StudioShell>
  );
}
