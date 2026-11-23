'use client';

import { useState } from 'react';
import StudioShell from '@/components/StudioShell';
import { BAO_GIA_HERO_HTML } from '@/components/onlinesChrome';

const SERVICE_MODES = [
  { id: 'full', label: 'Thiết kế + Lập trình Website', base: 7000000 },
  { id: 'webapp', label: 'Web App Quản lý / Đặt lịch', base: 15000000 },
  { id: 'design', label: 'Chỉ Thiết kế UI/UX (Figma)', base: 4500000 },
];

const PAGE_SCALES = [
  { id: '1-3', label: '1 – 3 trang (Landing)', extra: 0 },
  { id: '5', label: '5 trang (Doanh nghiệp)', extra: 2000000 },
  { id: '10+', label: 'Trên 10 trang / Hệ thống', extra: 5000000 },
];

const ADDONS = [
  { id: 'chatbot', label: 'Chatbot AI đọc đúng bảng giá / tài liệu riêng', price: 3000000 },
  { id: 'automation', label: 'Automation đẩy Lead về Zalo / Fanpage / Telegram', price: 2000000 },
  { id: 'seo-cms', label: 'Trang quản trị /admin đăng bài chuẩn SEO + llms.txt', price: 2000000 },
  { id: 'payment', label: 'Thanh toán trực tuyến (VietQR / MoMo / VNPay)', price: 2500000 },
  { id: 'excel', label: 'Xuất dữ liệu báo cáo Excel / Đồng bộ Google Sheet', price: 1500000 },
];

export default function QuotePage() {
  const [modeId, setModeId] = useState('full');
  const [scaleId, setScaleId] = useState('5');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['chatbot', 'automation', 'seo-cms']);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const mode = SERVICE_MODES.find((m) => m.id === modeId)!;
  const scale = PAGE_SCALES.find((s) => s.id === scaleId)!;
  const addonItems = ADDONS.filter((a) => selectedAddons.includes(a.id));
  const total = mode.base + scale.extra + addonItems.reduce((sum, a) => sum + a.price, 0);

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || sending) return;
    setSending(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact,
          source: 'bao-gia',
          service_type: mode.label,
          pages_count: scale.label,
          addons: addonItems.map((a) => a.label),
          estimated_total: total,
          notes,
        }),
      });
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <StudioShell heroHtml={BAO_GIA_HERO_HTML}>
      <div className="calc-layout">
        <div className="studio-card">
          <div className="calc-group">
            <span className="calc-label">1. Chọn hình thức triển khai</span>
            <div className="calc-pills">
              {SERVICE_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`calc-pill${modeId === m.id ? ' active' : ''}`}
                  onClick={() => setModeId(m.id)}
                >
                  {m.label} ({(m.base / 1000000).toFixed(1).replace('.0', '')}tr)
                </button>
              ))}
            </div>
          </div>

          <div className="calc-group">
            <span className="calc-label">2. Quy mô số trang</span>
            <div className="calc-pills">
              {PAGE_SCALES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`calc-pill${scaleId === s.id ? ' active' : ''}`}
                  onClick={() => setScaleId(s.id)}
                >
                  {s.label} {s.extra > 0 ? `(+${(s.extra / 1000000).toFixed(0)}tr)` : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="calc-group" style={{ marginBottom: 0 }}>
            <span className="calc-label">3. Tính năng nâng cao &amp; Automation (Bật/tắt)</span>
            {ADDONS.map((a) => {
              const active = selectedAddons.includes(a.id);
              return (
                <div
                  key={a.id}
                  role="button"
                  tabIndex={0}
                  className={`addon-row${active ? ' active' : ''}`}
                  onClick={() => toggleAddon(a.id)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleAddon(a.id)}
                >
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{a.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <span className="studio-mono" style={{ fontSize: 14, fontWeight: 600 }}>
                      +{a.price.toLocaleString('vi-VN')}đ
                    </span>
                    <input type="checkbox" checked={active} readOnly style={{ width: 18, height: 18 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="studio-card" style={{ position: 'sticky', top: 88, background: '#fff' }}>
          <span className="studio-badge" style={{ marginBottom: 4 }}>
            Tổng kết tạm tính
          </span>
          <div style={{ fontSize: 14, color: 'var(--studio-muted)' }}>
            {mode.label} · {scale.label}
          </div>

          <div style={{ fontSize: 40, fontWeight: 700, color: '#0057ff', letterSpacing: '-0.03em' }}>
            {total.toLocaleString('vi-VN')}đ
          </div>

          <div style={{ fontSize: 13, color: 'var(--studio-muted)', borderBottom: '1px solid var(--studio-border)', paddingBottom: 14 }}>
            Đã bao gồm: tối ưu tốc độ Core Web Vitals, chuẩn SEO Google, deploy Vercel + Supabase và hướng dẫn sử dụng.
          </div>

          {sent ? (
            <div style={{ padding: 16, borderRadius: 14, background: '#eef3ff', color: '#0057ff', fontWeight: 500 }}>
              Đã gửi yêu cầu thành công! Dữ liệu đã lưu vào hệ thống và bắn thông báo tự động tới Zalo/Telegram của team. Chúng mình sẽ liên hệ bạn trong ít phút.
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
                rows={3}
                placeholder="Ngành nghề kinh doanh hoặc yêu cầu thêm..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button
                type="submit"
                disabled={sending}
                className="studio-btn studio-btn--primary"
                style={{ width: '100%', padding: '14px 20px', fontSize: 15 }}
              >
                {sending ? 'Đang gửi...' : 'Nhận tư vấn & Demo miễn phí →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </StudioShell>
  );
}
