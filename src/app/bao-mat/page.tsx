import type { Metadata } from 'next';
import StudioShell from '@/components/StudioShell';
import { makeHeroHtml } from '@/components/siteChrome';
import { SITE } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Cách Tiệm Code thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.',
};

export default function BaoMatPage() {
  return (
    <StudioShell heroHtml={makeHeroHtml('Bảo mật', 'Tụi mình tôn trọng thông tin cá nhân của bạn.')}>
      <div className="studio-prose">
        <p>
          Chính sách này giải thích {SITE.name} (&quot;tụi mình&quot;) thu thập những thông tin gì khi bạn dùng
          website, sử dụng chúng vào việc gì và bạn có những quyền gì đối với dữ liệu của mình, theo Nghị định
          13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
        </p>

        <h2>1. Thông tin tụi mình thu thập</h2>
        <ul>
          <li>Thông tin bạn tự điền vào form liên hệ, form báo giá hoặc khung chat: họ tên, số điện thoại / Zalo, nội dung yêu cầu.</li>
          <li>Thông tin kỹ thuật khi bạn truy cập: loại trình duyệt, thiết bị, trang đã xem, nhằm thống kê và cải thiện website.</li>
        </ul>

        <h2>2. Mục đích sử dụng</h2>
        <ul>
          <li>Liên hệ tư vấn, gửi báo giá và thực hiện dịch vụ bạn yêu cầu.</li>
          <li>Chăm sóc khách hàng và hỗ trợ trong thời gian bảo hành.</li>
          <li>Cải thiện nội dung và trải nghiệm của website.</li>
        </ul>
        <p>Tụi mình không bán hay cho thuê thông tin cá nhân của bạn.</p>

        <h2>3. Chia sẻ thông tin</h2>
        <p>
          Thông tin chỉ được chia sẻ với các dịch vụ giúp vận hành website (lưu trữ dữ liệu, gửi thông báo) ở mức
          cần thiết, hoặc khi cơ quan nhà nước có thẩm quyền yêu cầu theo quy định pháp luật.
        </p>

        <h2>4. Chatbot AI</h2>
        <p>
          Nội dung bạn nhắn trong khung chat có thể được xử lý bởi dịch vụ trí tuệ nhân tạo bên thứ ba để tạo câu trả
          lời. Bạn không nên gửi thông tin nhạy cảm như mật khẩu hay số tài khoản ngân hàng qua khung chat.
        </p>

        <h2>5. Lưu trữ và bảo vệ</h2>
        <p>
          Thông tin được lưu trong thời gian cần thiết để phục vụ bạn và được bảo vệ bằng các biện pháp kỹ thuật hợp
          lý. Không có hệ thống nào an toàn tuyệt đối, nhưng tụi mình luôn cố gắng hạn chế rủi ro.
        </p>

        <h2>6. Quyền của bạn</h2>
        <p>
          Bạn có quyền yêu cầu xem, sửa hoặc xoá thông tin cá nhân của mình, hoặc rút lại sự đồng ý. Chỉ cần nhắn
          Zalo{' '}
          <a href={SITE.zaloUrl} target="_blank" rel="noopener">
            {SITE.zalo}
          </a>
          , tụi mình sẽ xử lý sớm nhất.
        </p>

        <h2>7. Thay đổi chính sách</h2>
        <p>Chính sách có thể được cập nhật khi cần. Phiên bản mới nhất luôn được đăng tại trang này.</p>

        <p className="studio-updated">Cập nhật lần cuối: 23/11/2026.</p>
      </div>
    </StudioShell>
  );
}
