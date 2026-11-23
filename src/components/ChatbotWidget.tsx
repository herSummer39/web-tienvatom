'use client';

import { useState } from 'react';

interface Msg {
  role: 'bot' | 'user';
  text: string;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'bot',
      text: 'Chào bạn! Mình là trợ lý của Tiệm Code. Bạn cần làm website, phần mềm hay phần mềm Zalo marketing?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadContact, setLeadContact] = useState('');

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
        { role: 'bot', text: 'Kết nối tạm gián đoạn, bạn để lại SĐT/Zalo hoặc nhắn Zalo 0565567789 giúp mình nhé!' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (!leadName.trim() || !leadContact.trim()) return;
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: leadName,
        contact: leadContact,
        source: 'chatbot',
        notes: messages.map((m) => `${m.role}: ${m.text}`).join(' | ').slice(0, 400),
      }),
    });
    setShowLeadForm(false);
    setLeadName('');
    setLeadContact('');
    setMessages((prev) => [
      ...prev,
      {
        role: 'bot',
        text: 'Đã ghi nhận thông tin! Tụi mình sẽ nhắn lại bạn sớm nhất.',
      },
    ]);
  }

  return (
    <>
      <button
        type="button"
        className="cb-launcher"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Đóng Trợ lý AI' : 'Mở Trợ lý AI'}
        title={open ? 'Đóng Trợ lý AI' : 'Trợ lý AI 24/7'}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          /* Thay bằng <img src="/logo-chatbot.png" alt="AI" /> khi bạn có logo riêng */
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9a9 9 0 0 1-4.5-1.2L3 21l1.2-4.5A9 9 0 0 1 12 3Z" />
            <path d="M9 12h.01M12 12h.01M15 12h.01" />
          </svg>
        )}
      </button>

      {open && (
        <div className="cb-window" role="dialog" aria-label="Chatbot AI Tư vấn">
          <span className="cb-pin" aria-hidden="true" />
          <div className="cb-inner">
            <div className="cb-head">
              <div>
                <div className="studio-mono" style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>
                  TƯ VẤN MIỄN PHÍ
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#111111' }}>
                  Trợ lý · Tiệm Code
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLeadForm((v) => !v)}
                style={{
                  background: '#111111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 999,
                  padding: '7px 13px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Để lại SĐT
              </button>
            </div>

          <div className="cb-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`cb-msg ${m.role === 'user' ? 'cb-msg--user' : 'cb-msg--bot'}`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="cb-msg cb-msg--bot">Đang trả lời...</div>}

            {showLeadForm && (
              <form
                onSubmit={submitLead}
                style={{
                  background: '#fff',
                  border: '1px solid #0057ff',
                  borderRadius: 12,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600 }}>Nhận báo giá & Demo qua Zalo</div>
                <input
                  className="studio-input"
                  style={{ padding: '8px 10px', fontSize: 13 }}
                  placeholder="Tên của bạn *"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                />
                <input
                  className="studio-input"
                  style={{ padding: '8px 10px', fontSize: 13 }}
                  placeholder="Số Zalo / SĐT *"
                  required
                  value={leadContact}
                  onChange={(e) => setLeadContact(e.target.value)}
                />
                <button
                  type="submit"
                  className="studio-btn studio-btn--primary"
                  style={{ padding: '8px 12px', fontSize: 13 }}
                >
                  Gửi ngay
                </button>
              </form>
            )}
          </div>

          <div className="cb-quick">
            <button type="button" onClick={() => sendMessage('Làm website giá bao nhiêu?')}>
              Báo giá Web?
            </button>
            <button type="button" onClick={() => sendMessage('Phần mềm Zalo marketing làm được gì?')}>
              Phần mềm Zalo?
            </button>
            <button type="button" onClick={() => sendMessage('Thời gian hoàn thành bao lâu?')}>
              Bao lâu xong?
            </button>
          </div>

          <form
            className="cb-form"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              className="studio-input"
              style={{ padding: '8px 12px', fontSize: 13 }}
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="studio-btn studio-btn--dark"
              style={{ padding: '8px 15px', fontSize: 13 }}
            >
              Gửi
            </button>
          </form>
          </div>
        </div>
      )}
    </>
  );
}
