'use client';

import { useState } from 'react';
import { SITE } from '@/lib/siteConfig';

type Props = {
  source: string;
  extra?: Record<string, unknown>;
  submitLabel?: string;
  notesPlaceholder?: string;
  successText?: string;
};

/** Form để lại thông tin: họ tên, số điện thoại, email, nội dung. */
export default function LeadForm({
  source,
  extra,
  submitLabel = 'Gửi thông tin →',
  notesPlaceholder = 'Bạn cần làm gì? (không bắt buộc)',
  successText = 'Cảm ơn bạn! Tụi mình đã nhận được thông tin và sẽ liên hệ lại trong thời gian sớm nhất nhé.',
}: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || sending) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...extra, name, contact: phone, email, notes, source }),
      });
      if (!res.ok) throw new Error('send failed');
      setSent(true);
    } catch {
      setError(`Gửi chưa được, bạn nhắn Zalo ${SITE.zalo} giúp tụi mình nhé.`);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return <div className="lead-success">{successText}</div>;
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <input
        className="studio-input"
        placeholder="Họ tên *"
        autoComplete="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="studio-input"
        type="tel"
        placeholder="Số điện thoại *"
        autoComplete="tel"
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        className="studio-input"
        type="email"
        placeholder="Email (không bắt buộc)"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        className="studio-textarea"
        rows={3}
        placeholder={notesPlaceholder}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      {error && <div className="lead-error">{error}</div>}
      <button
        type="submit"
        disabled={sending}
        className="studio-btn studio-btn--primary"
        style={{ width: '100%', padding: '14px 20px', fontSize: 15 }}
      >
        {sending ? 'Đang gửi...' : submitLabel}
      </button>
    </form>
  );
}
