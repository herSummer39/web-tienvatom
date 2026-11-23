import { SITE } from '@/lib/siteConfig';

export default function ContactCta({
  title = 'Bạn đang cần làm website hay phần mềm?',
  text = 'Nhắn tụi mình nhu cầu, tụi mình tư vấn miễn phí và gửi báo giá rõ ràng.',
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="studio-section studio-cta">
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="studio-actions">
        <a className="studio-btn studio-btn--primary" href={SITE.zaloUrl} target="_blank" rel="noopener">
          Nhắn Zalo {SITE.zalo}
        </a>
        <a className="studio-btn studio-btn--outline" href="/lien-he">
          Gửi yêu cầu
        </a>
      </div>
    </section>
  );
}
