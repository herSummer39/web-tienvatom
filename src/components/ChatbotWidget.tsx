'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE } from '@/lib/siteConfig';

interface Msg {
  role: 'bot' | 'user';
  text: string;
}

const QUICK_QUESTIONS = [
  { label: 'Báo giá website', text: 'Làm website giá bao nhiêu?' },
  { label: 'Phần mềm Zalo', text: 'Phần mềm Zalo marketing làm được gì?' },
  { label: 'Bao lâu xong?', text: 'Thời gian hoàn thành bao lâu?' },
];

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'bot',
      text: `Chào bạn! Mình là trợ lý của ${SITE.name}. Bạn cần làm website, phần mềm hay phần mềm Zalo marketing?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, showLeadForm]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: `Kết nối tạm gián đoạn, bạn nhắn Zalo ${SITE.zalo} giúp mình nhé!` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (!leadName.trim() || !leadContact.trim()) return;
    let ok = false;
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          contact: leadContact,
          source: 'chatbot',
          notes: messages.map((m) => `${m.role}: ${m.text}`).join(' | ').slice(0, 400),
        }),
      });
      ok = res.ok;
    } catch {
      ok = false;
    }
    setShowLeadForm(false);
    setLeadName('');
    setLeadContact('');
    setMessages((prev) => [
      ...prev,
      {
        role: 'bot',
        text: ok
          ? 'Đã ghi nhận thông tin! Tụi mình sẽ nhắn lại bạn sớm nhất.'
          : `Gửi chưa được, bạn nhắn Zalo ${SITE.zalo} giúp mình nhé!`,
      },
    ]);
  }

  return (
    <>
      <button
        type="button"
        className="cb-launcher"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Đóng khung chat' : 'Mở khung chat tư vấn'}
        title={open ? 'Đóng' : 'Chat tư vấn'}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9a9 9 0 0 1-4.5-1.2L3 21l1.2-4.5A9 9 0 0 1 12 3Z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="cb-window" role="dialog" aria-label={`Chat tư vấn ${SITE.name}`}>
          <div className="cb-head">
            <img src="/images/tiemcode-avatar.svg" alt="" />
            <div>
              <div className="cb-title">{SITE.name}</div>
              <div className="cb-sub">Tư vấn miễn phí</div>
            </div>
            <button type="button" className="cb-link" onClick={() => setShowLeadForm((v) => !v)}>
              Để lại SĐT
            </button>
          </div>

          <div className="cb-messages" ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className={`cb-msg ${m.role === 'user' ? 'cb-msg--user' : 'cb-msg--bot'}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="cb-msg cb-msg--bot cb-msg--typing">Đang trả lời…</div>}

            {showLeadForm && (
              <form className="cb-lead" onSubmit={submitLead}>
                <p>Để lại thông tin, tụi mình liên hệ bạn ngay</p>
                <input
                  className="studio-input"
                  style={{ padding: '8px 12px', fontSize: 13 }}
                  placeholder="Họ tên *"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                />
                <input
                  className="studio-input"
                  style={{ padding: '8px 12px', fontSize: 13 }}
                  type="tel"
                  placeholder="Số điện thoại *"
                  required
                  value={leadContact}
                  onChange={(e) => setLeadContact(e.target.value)}
                />
                <button type="submit" className="studio-btn studio-btn--dark" style={{ padding: '8px 12px', fontSize: 13 }}>
                  Gửi
                </button>
              </form>
            )}
          </div>

          {messages.length === 1 && (
            <div className="cb-quick">
              {QUICK_QUESTIONS.map((q) => (
                <button key={q.label} type="button" onClick={() => sendMessage(q.text)}>
                  {q.label}
                </button>
              ))}
            </div>
          )}

          <form
            className="cb-form"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              placeholder="Nhập câu hỏi…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Nhập câu hỏi"
            />
            <button type="submit" className="cb-send" disabled={!input.trim() || loading} aria-label="Gửi">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
