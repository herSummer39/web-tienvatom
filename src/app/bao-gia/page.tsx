'use client';

import { useMemo, useState } from 'react';
import StudioShell from '@/components/StudioShell';
import LeadForm from '@/components/LeadForm';
import { makeHeroHtml } from '@/components/siteChrome';
import { SITE } from '@/lib/siteConfig';

type Mode = {
  id: string;
  label: string;
  base: number | null; // null = báo giá riêng (liên hệ)
  pages: boolean; // có chọn quy mô số trang không
  addons: boolean; // có chọn tính năng thêm không
  hint: string;
};

const SERVICE_MODES: Mode[] = [
  {
    id: 'website',
    label: 'Website trọn gói',
    base: 7000000,
    pages: true,
    addons: true,
    hint: 'Thiết kế giao diện, lập trình và trang quản trị để bạn tự đăng bài.',
  },
  {
    id: 'design',
    label: 'Chỉ thiết kế giao diện (Figma)',
    base: 4500000,
    pages: true,
    addons: false,
    hint: 'Bàn giao file Figma cho đội lập trình của bạn.',
  },
  {
    id: 'software',
    label: 'Phần mềm theo nhu cầu',
    base: null,
    pages: false,
    addons: false,
    hint: 'Quản lý bán hàng, kho, đặt lịch… làm riêng theo cách doanh nghiệp bạn vận hành.',
  },
  {
    id: 'zalo',
    label: 'Phần mềm Zalo Marketing',
    base: null,
    pages: false,
    addons: false,
    hint: 'Nhiều tài khoản trên một màn hình, trả lời tự động, hẹn giờ gửi tin, đăng bài nhóm.',
  },
];

// extra = null: quy mô lớn, báo giá riêng sau khi trao đổi
const PAGE_SCALES: { id: string; label: string; extra: number | null }[] = [
  { id: 'upto10', label: 'Đến 10 trang', extra: 0 },
  { id: '10+', label: 'Trên 10 trang / Hệ thống', extra: null },
];

const ADDONS: { id: string; label: string; price: number; note?: string }[] = [
  {
    id: 'chatbot',
    label: 'Chatbot AI tư vấn khách theo bảng giá / tài liệu của bạn',
    price: 3000000,
    note: 'Phí API OpenAI hằng tháng do khách hàng chi trả theo mức sử dụng thực tế.',
  },
  {
    id: 'automation',
    label: 'Báo khách mới tự động về Zalo / Telegram / Google Sheet',
    price: 2000000,
    note: 'Khách điền form trên web là thông tin báo ngay về điện thoại của bạn.',
  },
  { id: 'payment', label: 'Thanh toán trực tuyến (VietQR / MoMo / VNPay)', price: 2500000 },
  { id: 'excel', label: 'Xuất báo cáo Excel / Đồng bộ Google Sheet', price: 1000000 },
];

const fmtTr = (v: number) => `${(v / 1000000).toFixed(1).replace('.0', '')}tr`;

export default function QuotePage() {
  const [modeId, setModeId] = useState('website');
  const [scaleId, setScaleId] = useState('upto10');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const mode = SERVICE_MODES.find((m) => m.id === modeId)!;
  const scale = PAGE_SCALES.find((s) => s.id === scaleId)!;
  const addonItems = mode.addons ? ADDONS.filter((a) => selectedAddons.includes(a.id)) : [];
  const contactOnly = mode.base === null;
  const fromPrice = !contactOnly && mode.pages && scale.extra === null;

  const total = useMemo(() => {
    if (mode.base === null) return null;
    const pageExtra = mode.pages ? scale.extra ?? 0 : 0;
    return mode.base + pageExtra + addonItems.reduce((sum, a) => sum + a.price, 0);
  }, [mode, scale, addonItems]);

  function toggleAddon(id: string) {
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }


  return (
    <StudioShell heroHtml={makeHeroHtml('Báo giá', 'Chọn nhu cầu, xem chi phí tạm tính ngay.')}>
      <div className="calc-layout">
        <div className="studio-card">
          <div className="calc-group">
            <span className="calc-label">1. Bạn cần làm gì?</span>
            <div className="calc-pills">
              {SERVICE_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`calc-pill${modeId === m.id ? ' active' : ''}`}
                  onClick={() => setModeId(m.id)}
                >
                  {m.label} ({m.base === null ? 'Liên hệ' : `từ ${fmtTr(m.base)}`})
                </button>
              ))}
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--studio-muted)' }}>{mode.hint}</p>
          </div>

          {mode.pages && (
            <div className="calc-group">
              <span className="calc-label">2. Số trang</span>
              <div className="calc-pills">
                {PAGE_SCALES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`calc-pill${scaleId === s.id ? ' active' : ''}`}
                    onClick={() => setScaleId(s.id)}
                  >
                    {s.label} {s.extra === null ? '(Liên hệ)' : s.extra > 0 ? `(+${fmtTr(s.extra)})` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode.addons && (
            <div className="calc-group" style={{ marginBottom: 0 }}>
              <span className="calc-label">3. Tính năng thêm (tick nếu cần)</span>
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
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{a.label}</div>
                      {a.note && (
                        <div style={{ fontSize: 12.5, color: 'var(--studio-muted)', marginTop: 4 }}>{a.note}</div>
                      )}
                    </div>
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
          )}

          {contactOnly && (
            <p className="studio-note" style={{ margin: 0 }}>
              Mỗi phần mềm có yêu cầu khác nhau nên tụi mình báo giá sau khi trao đổi. Để lại thông tin bên cạnh hoặc
              nhắn Zalo cho tụi mình.
            </p>
          )}
        </div>

        <div className="studio-card" style={{ position: 'sticky', top: 88, background: 'var(--studio-surface-deep)' }}>
          <span className="studio-badge" style={{ marginBottom: 4 }}>
            Chi phí tạm tính
          </span>
          <div style={{ fontSize: 14, color: 'var(--studio-muted)' }}>
            {mode.label}
            {mode.pages ? ` · ${scale.label}` : ''}
          </div>

          <div style={{ fontSize: 40, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em' }}>
            {total === null ? 'Liên hệ' : `${fromPrice ? 'Từ ' : ''}${total.toLocaleString('vi-VN')}đ`}
          </div>

          {fromPrice && (
            <div style={{ fontSize: 13, color: '#f8fafc', fontWeight: 700 }}>
              Website trên 10 trang / hệ thống: liên hệ để nhận báo giá chi tiết.
            </div>
          )}

          <div
            style={{
              fontSize: 13,
              color: 'var(--studio-muted)',
              borderBottom: '1px solid var(--studio-border)',
              paddingBottom: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {mode.id === 'website' && (
              <span>
                <strong>Đã bao gồm:</strong> trang quản trị tự đăng bài, chuẩn SEO, tải nhanh, hướng dẫn sử dụng và{' '}
                <strong>bảo hành trọn đời</strong>.
              </span>
            )}
            {(mode.id === 'website' || mode.id === 'software') && (
              <span>
                <strong>Chưa bao gồm:</strong> tên miền và hosting (bạn tự đăng ký, tụi mình hỗ trợ cài đặt).
              </span>
            )}
            {addonItems.some((a) => a.id === 'chatbot') && (
              <span>Chatbot AI: phí API OpenAI hằng tháng do khách hàng chi trả theo mức sử dụng.</span>
            )}
            <span>Chỉ làm đúng tính năng bạn cần, dễ mở rộng về sau. Giá chính thức được chốt trước khi bắt đầu.</span>
          </div>

          <LeadForm
            source="bao-gia"
            submitLabel="Nhận tư vấn miễn phí →"
            notesPlaceholder="Bạn kinh doanh gì, cần thêm gì? (không bắt buộc)"
            extra={{
              service_type: mode.label,
              pages_count: mode.pages ? scale.label : undefined,
              addons: addonItems.map((a) => a.label),
              estimated_total: total ?? 0,
            }}
          />
          <a
            href={SITE.zaloUrl}
            target="_blank"
            rel="noopener"
            className="studio-btn studio-btn--outline"
            style={{ width: "100%", padding: "12px 20px" }}
          >
            Hoặc nhắn Zalo
          </a>
        </div>
      </div>
    </StudioShell>
  );
}
