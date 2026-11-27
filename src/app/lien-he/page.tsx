import StudioShell from '@/components/StudioShell';
import LeadForm from '@/components/LeadForm';
import { makeHeroHtml } from '@/components/siteChrome';
import { SITE } from '@/lib/siteConfig';

export default function ContactPage() {
  return (
    <StudioShell heroHtml={makeHeroHtml('Liên hệ', 'Kể tụi mình nghe nhu cầu của bạn nhé!')}>
      <div className="studio-grid-2">
        <div className="studio-card">
          <h2>Để lại thông tin</h2>
          <p>Để lại tên và số điện thoại, tụi mình sẽ gọi lại tư vấn miễn phí cho bạn.</p>
          <LeadForm source="lien-he" submitLabel="Gửi yêu cầu →" />
        </div>

        <div className="studio-card studio-card--dark">
          <h2 style={{ color: '#fff' }}>Nhắn trực tiếp</h2>
          <p>Cách nhanh nhất là nhắn Zalo, tụi mình trả lời trong ngày.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            <a href={SITE.zaloUrl} target="_blank" rel="noopener" className="studio-btn studio-btn--primary">
              Nhắn Zalo
            </a>
            <a href={`tel:${SITE.zalo}`} className="studio-btn studio-btn--outline">
              Gọi điện
            </a>
            {SITE.fanpageUrl && (
              <a href={SITE.fanpageUrl} target="_blank" rel="noopener" className="studio-btn studio-btn--outline">
                Nhắn tin qua Fanpage
              </a>
            )}
          </div>
          <p style={{ fontSize: 14, marginTop: 'auto' }}>
            Số điện thoại / Zalo: <strong style={{ color: '#fff' }}>{SITE.zalo}</strong>
            <br />
            Làm việc online với khách hàng trên toàn quốc.
          </p>
        </div>
      </div>
    </StudioShell>
  );
}
