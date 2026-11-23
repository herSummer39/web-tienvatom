import type { Metadata } from 'next';
import StudioShell from '@/components/StudioShell';
import ContactCta from '@/components/ContactCta';
import { makeHeroHtml } from '@/components/siteChrome';
import { SITE } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Dịch vụ',
  description:
    'Làm website trọn gói có trang quản trị tự đăng bài, thiết kế giao diện, phần mềm theo nhu cầu doanh nghiệp và phần mềm Zalo marketing.',
};

const SERVICES = [
  {
    name: 'Website trọn gói',
    price: 'Từ 7.000.000đ',
    href: '/bao-gia',
    cta: 'Tính báo giá',
    intro:
      'Một website hoàn chỉnh: tụi mình thiết kế giao diện, lập trình và bàn giao trang quản trị để bạn tự đăng bài, tự làm marketing.',
    points: [
      'Giao diện thiết kế riêng theo thương hiệu của bạn',
      'Trang quản trị đăng bài, đăng sản phẩm dễ dùng',
      'Chuẩn SEO, tải nhanh, hiển thị đẹp trên điện thoại',
      'Hướng dẫn sử dụng sau khi bàn giao',
      'Bảo hành trọn đời',
    ],
  },
  {
    name: 'Thiết kế giao diện',
    price: 'Từ 4.500.000đ',
    href: '/bao-gia',
    cta: 'Tính báo giá',
    intro:
      'Chỉ thiết kế giao diện trên Figma, dành cho bạn đã có đội lập trình riêng hoặc muốn xem trước giao diện.',
    points: [
      'Thiết kế cho cả máy tính và điện thoại',
      'Bàn giao file Figma đầy đủ',
      'Chỉnh sửa theo góp ý trước khi bàn giao',
    ],
  },
  {
    name: 'Phần mềm theo nhu cầu',
    price: 'Liên hệ',
    href: '/lien-he',
    cta: 'Gửi yêu cầu',
    intro:
      'Phần mềm làm riêng theo đúng cách doanh nghiệp bạn vận hành, dùng được trên cả máy tính và điện thoại.',
    points: [
      'Quản lý bán hàng, đơn hàng, kho',
      'Đặt lịch, quản lý khách hàng',
      'Báo cáo, xuất Excel / Google Sheet',
      'Phân quyền cho nhân viên',
    ],
  },
  {
    name: 'Phần mềm Zalo Marketing',
    price: 'Liên hệ',
    href: '/phan-mem-zalo',
    cta: 'Xem chi tiết',
    intro:
      'Phần mềm do tụi mình phát triển, giúp bạn quản lý và chăm sóc khách hàng trên Zalo nhanh hơn.',
    points: [
      'Quản lý nhiều tài khoản Zalo trên một màn hình',
      'Trả lời tự động, hẹn giờ gửi tin',
      'Đăng bài lên nhóm, lọc khách hàng tiềm năng trong nhóm',
    ],
  },
];

const STEPS = [
  { title: 'Trao đổi nhu cầu', text: 'Bạn nhắn Zalo hoặc gửi yêu cầu, tụi mình hỏi rõ mục tiêu và gửi báo giá.' },
  { title: 'Thiết kế giao diện', text: 'Tụi mình gửi bản thiết kế để bạn xem và góp ý trước khi lập trình.' },
  { title: 'Lập trình & kiểm tra', text: 'Hoàn thiện website, kiểm tra trên máy tính và điện thoại.' },
  { title: 'Bàn giao & bảo hành', text: 'Hướng dẫn bạn tự đăng bài, quản lý nội dung. Có sự cố là tụi mình sửa.' },
];

const FAQS = [
  {
    q: 'Làm website mất bao lâu?',
    a: 'Website giới thiệu, bán hàng thông thường mất khoảng 5–14 ngày làm việc, tùy số trang và tính năng.',
  },
  {
    q: 'Giá đã gồm tên miền và hosting chưa?',
    a: 'Chưa. Bạn tự đăng ký tên miền và hosting đứng tên mình để chủ động quản lý, tụi mình hỗ trợ cài đặt website lên đó.',
  },
  {
    q: 'Bảo hành trọn đời là bảo hành những gì?',
    a: 'Website tụi mình làm mà gặp sự cố hay ngừng chạy, tụi mình sửa miễn phí. Không áp dụng khi tên miền, hosting hết hạn hoặc website bị bên khác chỉnh sửa mã nguồn.',
  },
  {
    q: 'Mình có tự đăng bài được không?',
    a: 'Có. Website có trang quản trị để bạn tự đăng bài, sản phẩm, hình ảnh. Tụi mình hướng dẫn cách dùng khi bàn giao.',
  },
];

export default function DichVuPage() {
  return (
    <StudioShell heroHtml={makeHeroHtml('Dịch vụ', 'Website, phần mềm và công cụ Zalo cho doanh nghiệp của bạn.')}>
      <div className="studio-grid-2">
        {SERVICES.map((s) => (
          <div key={s.name} className="studio-card">
            <span className="studio-price">{s.price}</span>
            <h2>{s.name}</h2>
            <p>{s.intro}</p>
            <ul className="studio-list">
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div style={{ marginTop: 'auto', paddingTop: 8 }}>
              <a className="studio-btn studio-btn--dark" href={s.href}>
                {s.cta} →
              </a>
            </div>
          </div>
        ))}
      </div>

      <section className="studio-section studio-grid-2" style={{ alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(26px, 3.4vw, 40px)', margin: '0 0 16px', letterSpacing: '-0.03em' }}>
            Về tụi mình
          </h2>
          {SITE.about.map((p) => (
            <p key={p} style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--studio-muted)', margin: '0 0 12px' }}>
              {p}
            </p>
          ))}
        </div>
        <div className="studio-card">
          <h3>Tụi mình cam kết</h3>
          <ul className="studio-list">
            <li>Làm trực tiếp, không qua trung gian</li>
            <li>Bàn giao đầy đủ mã nguồn và tài khoản quản trị</li>
            <li>Tên miền, hosting, website đứng tên bạn</li>
            <li>Hỗ trợ nhanh qua Zalo {SITE.zalo}</li>
            <li>Bảo hành trọn đời</li>
          </ul>
        </div>
      </section>

      <section className="studio-section">
        <h2>Tụi mình làm việc thế nào</h2>
        <p className="studio-lead">Quy trình đơn giản, bạn nắm được tiến độ ở từng bước.</p>
        <div className="studio-grid-2">
          {STEPS.map((s, i) => (
            <div key={s.title} className="studio-card">
              <span className="studio-step-num">Bước {i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="studio-section studio-faq">
        <h2>Câu hỏi thường gặp</h2>
        {FAQS.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      <ContactCta />
    </StudioShell>
  );
}
