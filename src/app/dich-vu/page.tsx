import type { Metadata } from 'next';
import StudioShell from '@/components/StudioShell';
import ContactCta from '@/components/ContactCta';
import { makeHeroHtml } from '@/components/siteChrome';
import { SITE } from '@/lib/siteConfig';
import { FAQS, PROCESS, SERVICES } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Dịch vụ',
  description:
    'Website chuẩn SEO tự đăng bài, thiết kế giao diện, phần mềm quản lý làm riêng thay thế Excel và phần mềm Zalo marketing.',
};

export default function DichVuPage() {
  return (
    <StudioShell heroHtml={makeHeroHtml('Dịch vụ', 'Chỉ làm đúng thứ bạn cần, dễ mở rộng về sau.')}>
      <div className="studio-grid-2">
        {SERVICES.map((s) => (
          <div key={s.id} id={s.id} className="studio-card">
            <span className="studio-price">{s.price}</span>
            <h2>{s.name}</h2>
            <p className="studio-pain">{s.pain}</p>
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

      <section className="studio-section">
        <h2>Quy trình 5 bước</h2>
        <p className="studio-lead">Mọi thứ có lộ trình rõ ràng, bạn biết dự án đang ở bước nào.</p>
        <div className="studio-steps">
          {PROCESS.map((s, i) => (
            <div key={s.title} className="studio-card">
              <span className="studio-step-num">Bước {i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="studio-section">
        <h2>Về tụi mình</h2>
        {SITE.about.map((p) => (
          <p key={p} className="studio-lead" style={{ margin: '0 0 8px' }}>
            {p}
          </p>
        ))}
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
