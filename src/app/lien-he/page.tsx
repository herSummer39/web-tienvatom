'use client';

import { useState } from 'react';
import StudioShell from '@/components/StudioShell';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, contact, source: 'lien-he', notes }),
    });
    setSent(true);
  }

  return (
    <StudioShell>
      <div className="studio-hero">
        <span className="studio-badge">Kết nối trực tiếp</span>
        <h1>Trao đổi trực tiếp với đội ngũ kỹ thuật.</h1>
        <p>
          Không qua nhân viên sale vòng vo — bạn nói bài toán kinh doanh, tụi mình tư vấn thẳng giải pháp kỹ thuật và chi phí tối ưu nhất.
        </p>
      </div>

      <div className="studio-grid-2">
        <div className="studio-card">
          <h2>Gửi yêu cầu nhanh</h2>
          {sent ? (
            <div style={{ padding: 16, borderRadius: 12, background: '#eef3ff', color: '#0057ff', fontWeight: 500 }}>
              Đã nhận thông tin! Hệ thống Automation đã thông báo cho team qua Zalo/Telegram.
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
                placeholder="Số Zalo / SĐT / Email *"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <textarea
                className="studio-textarea"
                rows={4}
                placeholder="Bạn đang muốn làm Website, Web App hay tích hợp Chatbot AI?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button type="submit" className="studio-btn studio-btn--primary">
                Gửi yêu cầu ngay →
              </button>
            </form>
          )}
        </div>

        <div className="studio-card studio-card--dark">
          <h2 style={{ color: '#fff' }}>Kênh phản hồi nhanh 24/7</h2>
          <p>
            Mọi tin nhắn từ Website, Zalo OA và Fanpage đều được đồng bộ về một luồng xử lý chung để không bỏ lỡ khách hàng.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            <a href="https://zalo.me" target="_blank" rel="noreferrer" className="studio-btn studio-btn--primary">
              Nhắn tin qua Zalo OA
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="studio-btn studio-btn--outline">
              Nhắn tin qua Fanpage Messenger
            </a>
          </div>
          <p style={{ fontSize: 13, marginTop: 'auto' }}>
            Khu vực phục vụ: TP. Hồ Chí Minh, Hà Nội &amp; làm việc từ xa toàn quốc.
          </p>
        </div>
      </div>
    </StudioShell>
  );
}
