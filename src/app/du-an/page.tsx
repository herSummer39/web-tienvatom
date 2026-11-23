import type { Metadata } from 'next';
import StudioShell from '@/components/StudioShell';
import ContactCta from '@/components/ContactCta';
import { makeHeroHtml } from '@/components/siteChrome';

export const metadata: Metadata = {
  title: 'Dự án',
  description: 'Các website và phần mềm Tiệm Code đã thực hiện.',
};

export default function DuAnPage() {
  return (
    <StudioShell heroHtml={makeHeroHtml('Dự án', 'Các dự án sẽ sớm được cập nhật tại đây.')}>
      <div className="studio-empty">
        <h2>Dự án đang được cập nhật</h2>
        <p>
          Tụi mình đang chuẩn bị hình ảnh các website và phần mềm đã làm. Trong lúc chờ, bạn cứ nhắn Zalo, tụi mình
          gửi mẫu tham khảo phù hợp với ngành của bạn.
        </p>
        <a className="studio-btn studio-btn--primary" href="/bao-gia">
          Tính báo giá →
        </a>
      </div>
      <ContactCta />
    </StudioShell>
  );
}
