import type { Metadata } from 'next';
import StudioShell from '@/components/StudioShell';
import ContactCta from '@/components/ContactCta';
import { makeHeroHtml } from '@/components/siteChrome';

export const metadata: Metadata = {
  title: 'Phần mềm Zalo Marketing',
  description:
    'Phần mềm Zalo marketing của Tiệm Code: quản lý nhiều tài khoản trên một màn hình, trả lời tự động, hẹn giờ gửi tin, đăng bài nhóm.',
};

const GROUPS = [
  {
    title: "Tiết kiệm thời gian",
    items: [
      ["Nhiều tài khoản, một màn hình", "Quản lý nhiều tài khoản Zalo cùng lúc, không cần chuyển qua lại giữa các điện thoại."],
      ["Hẹn giờ gửi tin", "Soạn tin trước, hẹn giờ gửi cho từng nhóm khách theo lịch bạn muốn."],
      ["Đăng bài nhóm", "Đăng bài lên nhiều nhóm Zalo cùng lúc thay vì đăng tay từng nhóm."],
    ],
  },
  {
    title: "Không bỏ sót khách",
    items: [
      ["Trả lời tự động", "Cài sẵn câu trả lời theo từ khóa, khách nhắn lúc nào cũng được phản hồi."],
      ["Chăm sóc khách hàng hàng loạt", "Gửi thông báo, ưu đãi tới danh sách khách hàng của bạn nhanh chóng."],
    ],
  },
  {
    title: "Tìm thêm khách mới",
    items: [
      ["Kết bạn tự động", "Gửi lời mời kết bạn tới danh sách số điện thoại khách hàng bạn đã có."],
      ["Lọc khách hàng trong nhóm", "Lấy danh sách thành viên các nhóm để tìm khách hàng tiềm năng phù hợp."],
    ],
  },
];

const ZALO_FAQS = [
  {
    q: "Giá phần mềm bao nhiêu?",
    a: "Tùy số tài khoản và tính năng bạn cần. Nhắn tụi mình để nhận báo giá và video demo.",
  },
  {
    q: "Mình không rành máy tính có dùng được không?",
    a: "Được. Tụi mình hỗ trợ cài đặt và hướng dẫn từng bước cho đến khi bạn dùng quen.",
  },
  {
    q: "Dùng phần mềm có bị khóa tài khoản Zalo không?",
    a: "Zalo có thể hạn chế tài khoản nếu gửi tin hoặc kết bạn với tần suất quá cao. Tụi mình sẽ hướng dẫn cách cài đặt tốc độ gửi hợp lý để dùng an toàn hơn.",
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
        <h1 style={{ fontSize: "clamp(28px, 4vw, 46px)" }}>Chăm sóc nhiều khách hơn trên Zalo, ít tốn thời gian hơn.</h1>
        <p>
          Phải dùng nhiều điện thoại cho nhiều tài khoản Zalo, khách nhắn tới mà trả lời không xuể? Phần mềm do chính
          tụi mình phát triển giúp bạn gom tất cả về một màn hình.
        </p>
      </div>

      {GROUPS.map((g) => (
        <section key={g.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, margin: "0 0 14px", letterSpacing: "-0.02em" }}>{g.title}</h2>
          <div className="studio-grid-3">
            {g.items.map(([title, text]) => (
              <div key={title} className="studio-card">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

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
      <section className="studio-section studio-faq">
        <h2>Câu hỏi thường gặp</h2>
        {ZALO_FAQS.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>


      <ContactCta title="Muốn dùng thử phần mềm Zalo?" text="Nhắn tụi mình để nhận demo và báo giá." />
    </StudioShell>
  );
}
