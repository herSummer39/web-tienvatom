'use client';

import { useEffect, useState } from 'react';
import LeadForm from '@/components/LeadForm';
import { SITE } from '@/lib/siteConfig';

export default function ContactCta({
  title = 'Bạn đang cần làm website hay phần mềm?',
  text = 'Kể tụi mình nghe nhu cầu của bạn, tụi mình tư vấn miễn phí và gửi báo giá rõ ràng.',
}: {
  title?: string;
  text?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <section className="studio-section studio-cta">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="studio-actions">
          <a className="studio-btn studio-btn--primary" href={SITE.zaloUrl} target="_blank" rel="noopener">
            Nhắn Zalo
          </a>
          <button type="button" className="studio-btn studio-btn--outline" onClick={() => setOpen(true)}>
            Để lại thông tin
          </button>
        </div>
      </section>

      {open && (
        <div className="lead-modal" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title" onClick={() => setOpen(false)}>
          <div className="lead-modal__box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lead-modal__close" aria-label="Đóng" onClick={() => setOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <h2 id="lead-modal-title">Để lại thông tin nhé!</h2>
            <p>
              Bạn chỉ cần để lại tên và số điện thoại, tụi mình sẽ gọi lại tư vấn miễn phí. Chưa rõ cần gì cũng không
              sao, cứ để tụi mình hỏi giúp bạn.
            </p>
            <LeadForm source="popup" />
          </div>
        </div>
      )}
    </>
  );
}
