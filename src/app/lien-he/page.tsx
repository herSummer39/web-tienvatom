'use client';

import { useState } from 'react';
import StudioShell from '@/components/StudioShell';
import { makeHeroHtml } from '@/components/siteChrome';
import { SITE } from '@/lib/siteConfig';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || sending) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, source: 'lien-he', notes }),
      });
      if (!res.ok) throw new Error('send failed');
      setSent(true);
    } catch {
      setError(`Gửi chưa được, bạn nhắn Zalo ${SITE.zalo} giúp tụi mình nhé.`);
    } finally {
      setSending(false);
    }
  }

  return (
    <StudioShell heroHtml={makeHeroHtml('Liên hệ', 'Nhắn tụi mình nhu cầu của bạn nhé!')}>
      <div className="studio-grid-2">
        <div className="studio-card">
          <h2>Gửi yêu cầu</h2>
          <p>Để lại thông tin, tụi mình sẽ gọi hoặc nhắn Zalo tư vấn miễn phí cho bạn.</p>
          {sent ? (
            <div style={{ padding: 16, borderRadius: 12, background: '#eef3ff', color: '#0057ff', fontWeight: 500 }}>
              Đã nhận thông tin! Tụi mình sẽ liên hệ bạn sớm nhất.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                className="studio-input"
                placeholder="Tên của bạn *"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="studio-input"
                placeholder="Số Zalo / SĐT *"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <textarea
                className="studio-textarea"
                rows={4}
                placeholder="Bạn cần làm website, phần mềm hay phần mềm Zalo?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              {error && <div style={{ fontSize: 13, color: '#d93025' }}>{error}</div>}
              <button type="submit" disabled={sending} className="studio-btn studio-btn--primary">
                {sending ? 'Đang gửi...' : 'Gửi yêu cầu →'}
              </button>
            </form>
          )}
        </div>

        <div className="studio-card studio-card--dark">
          <h2 style={{ color: '#fff' }}>Nhắn trực tiếp</h2>
          <p>Cách nhanh nhất là nhắn Zalo, tụi mình trả lời trong giờ làm việc và cả buổi tối.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            <a href={SITE.zaloUrl} target="_blank" rel="noopener" className="studio-btn studio-btn--primary">
              Zalo {SITE.zalo}
            </a>
            <a href={`tel:${SITE.zalo}`} className="studio-btn studio-btn--outline">
              Gọi {SITE.zalo}
            </a>
            {SITE.fanpageUrl && (
              <a href={SITE.fanpageUrl} target="_blank" rel="noopener" className="studio-btn studio-btn--outline">
                Nhắn tin qua Fanpage
              </a>
            )}
          </div>
          <p style={{ fontSize: 13, marginTop: 'auto' }}>Làm việc online với khách hàng trên toàn quốc.</p>
        </div>
      </div>
    </StudioShell>
  );
}
