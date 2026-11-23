import type { Metadata } from 'next';
import StudioShell from '@/components/StudioShell';
import ContactCta from '@/components/ContactCta';
import { makeHeroHtml } from '@/components/siteChrome';

export const metadata: Metadata = {
  title: 'Phần mềm Zalo Marketing',
  description:
    'Phần mềm Zalo marketing của Tiệm Code: quản lý nhiều tài khoản trên một màn hình, trả lời tự động, hẹn giờ gửi tin, đăng bài nhóm.',
};

const FEATURES = [
  {
    title: 'Nhiều tài khoản, một màn hình',
    text: 'Đăng nhập và quản lý nhiều tài khoản Zalo cùng lúc, không cần chuyển qua lại giữa các máy.',
  },
  {
    title: 'Trả lời tự động',
    text: 'Cài sẵn câu trả lời theo từ khóa để khách nhắn lúc nào cũng được phản hồi ngay.',
  },
  {
    title: 'Hẹn giờ gửi tin',
    text: 'Soạn tin trước, hẹn giờ gửi cho từng nhóm khách theo lịch bạn muốn.',
  },
  {
    title: 'Chăm sóc khách hàng hàng loạt',
    text: 'Gửi tin thông báo, ưu đãi tới danh sách khách hàng của bạn nhanh chóng.',
  },
  {
    title: 'Kết bạn tự động',
    text: 'Gửi lời mời kết bạn tới danh sách số điện thoại khách hàng bạn đã có.',
  },
  {
    title: 'Đăng bài nhóm',
    text: 'Đăng bài lên nhiều nhóm Zalo cùng lúc, tiết kiệm thời gian đăng thủ công.',
  },
  {
    title: 'Lọc khách hàng trong nhóm',
    text: 'Lấy danh sách thành viên các nhóm để tìm khách hàng tiềm năng phù hợp.',
  },
];

const FOR_WHO = [
  'Shop online bán hàng qua Zalo',
  'Doanh nghiệp có đội ngũ sale, chăm sóc khách hàng',
  'Người làm affiliate, cộng tác viên bán hàng',
  'Ai đang phải dùng nhiều tài khoản Zalo mỗi ngày',
];

export default function PhanMemZaloPage() {
  return (
    <StudioShell
      heroHtml={makeHeroHtml('Phần mềm Zalo', 'Quản lý nhiều tài khoản Zalo trên một màn hình.')}
    >
      <div className="studio-hero" style={{ marginBottom: 32 }}>
        <span className="studio-badge">Sản phẩm của Tiệm Code</span>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}>Bán hàng và chăm sóc khách trên Zalo nhanh hơn.</h1>
        <p>
          Phần mềm do chính tụi mình phát triển. Tụi mình hỗ trợ cài đặt, hướng dẫn sử dụng và cập nhật tính năng
          thường xuyên.
        </p>
      </div>

      <div className="studio-grid-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="studio-card">
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>

      <section className="studio-section studio-grid-2">
        <div>
          <h2 style={{ fontSize: 'clamp(26px, 3.4vw, 40px)', margin: '0 0 16px', letterSpacing: '-0.03em' }}>
            Phù hợp với ai?
          </h2>
          <ul className="studio-list">
            {FOR_WHO.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="studio-card">
          <span className="studio-price">Giá: Liên hệ</span>
          <h3>Nhận tư vấn và demo</h3>
          <p>Nhắn Zalo để tụi mình gửi video demo, báo giá và hướng dẫn cài đặt.</p>
        </div>
      </section>

      <p className="studio-note" style={{ marginTop: 32 }}>
        Lưu ý: Người dùng tự chịu trách nhiệm sử dụng phần mềm đúng chính sách của Zalo và quy định pháp luật về tin
        nhắn quảng cáo, dữ liệu cá nhân. Gửi tin hoặc kết bạn với tần suất quá cao có thể khiến tài khoản bị Zalo
        hạn chế.
      </p>

      <ContactCta title="Muốn dùng thử phần mềm Zalo?" text="Nhắn tụi mình để nhận demo và báo giá." />
    </StudioShell>
  );
}
