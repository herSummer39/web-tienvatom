'use client';

import { useEffect, useState } from 'react';
import StudioShell from '@/components/StudioShell';
import type { BlogPost, LeadRecord } from '@/lib/studioData';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<'posts' | 'leads'>('posts');

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [dataSource, setDataSource] = useState('local');

  // New SEO Post form
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('SEO & Web');
  const [excerpt, setExcerpt] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [content, setContent] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  async function loadData() {
    const [pRes, lRes] = await Promise.all([fetch('/api/posts'), fetch('/api/leads')]);
    const pJson = await pRes.json();
    const lJson = await lRes.json();
    setPosts(pJson.posts || []);
    setLeads(lJson.leads || []);
    setDataSource(pJson.source || 'local');
  }

  useEffect(() => {
    if (authed) loadData();
  }, [authed]);

  function autoSlug(val: string) {
    setTitle(val);
    const s = val
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(s);
    if (!metaTitle) setMetaTitle(val);
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg('');
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify({
        title,
        slug,
        category,
        excerpt,
        meta_title: metaTitle || title,
        meta_description: metaDesc || excerpt,
        content,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatusMsg(data.error || 'Lỗi khi đăng bài');
      return;
    }
    setTitle('');
    setSlug('');
    setExcerpt('');
    setMetaTitle('');
    setMetaDesc('');
    setContent('');
    setStatusMsg('Đã đăng bài viết chuẩn SEO thành công!');
    loadData();
  }

  async function handleDeletePost(id: string) {
    await fetch(`/api/posts?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password },
    });
    loadData();
  }

  if (!authed) {
    return (
      <StudioShell>
        <div style={{ maxWidth: 420, margin: '40px auto' }} className="studio-card">
          <span className="studio-badge">Khu vực quản trị</span>
          <h1>Đăng nhập Admin</h1>
          <p>Mật khẩu mặc định khi chạy local: <code className="studio-mono">studio2026</code></p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password.trim()) setAuthed(true);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <input
              type="password"
              className="studio-input"
              placeholder="Nhập mật khẩu quản trị..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="studio-btn studio-btn--primary">
              Vào trang quản trị
            </button>
          </form>
        </div>
      </StudioShell>
    );
  }

  return (
    <StudioShell>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div>
          <span className="studio-badge">CMS &amp; CRM · Nguồn dữ liệu: {dataSource === 'supabase' ? 'Supabase Cloud' : 'Local Demo'}</span>
          <h1 style={{ margin: 0, fontSize: 34 }}>Quản trị Bài viết SEO &amp; Leads</h1>
        </div>
        <div className="calc-pills">
          <button
            type="button"
            className={`calc-pill${tab === 'posts' ? ' active' : ''}`}
            onClick={() => setTab('posts')}
          >
            Bài viết SEO ({posts.length})
          </button>
          <button
            type="button"
            className={`calc-pill${tab === 'leads' ? ' active' : ''}`}
            onClick={() => setTab('leads')}
          >
            Khách hàng / Leads ({leads.length})
          </button>
        </div>
      </div>

      {tab === 'posts' ? (
        <div className="calc-layout">
          <form onSubmit={handlePublish} className="studio-card" style={{ gap: 14 }}>
            <h2>Đăng bài viết mới (Chuẩn SEO Google)</h2>
            {statusMsg && (
              <div style={{ padding: 12, borderRadius: 10, background: '#c02f33', color: '#f8fafc', fontSize: 14 }}>
                {statusMsg}
              </div>
            )}
            <input
              className="studio-input"
              placeholder="Tiêu đề bài viết *"
              required
              value={title}
              onChange={(e) => autoSlug(e.target.value)}
            />
            <div className="studio-grid-2">
              <input
                className="studio-input studio-mono"
                placeholder="slug-bai-viet *"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <input
                className="studio-input"
                placeholder="Chuyên mục (vd: SEO & Web)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <input
              className="studio-input"
              placeholder="Meta Title (hiển thị trên Google Search)"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
            <input
              className="studio-input"
              placeholder="Meta Description (140–155 ký tự)"
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
            />
            <textarea
              className="studio-textarea"
              rows={2}
              placeholder="Mô tả ngắn (Excerpt)..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
            <textarea
              className="studio-textarea"
              rows={6}
              required
              placeholder="Nội dung bài viết..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div style={{ padding: 14, borderRadius: 12, background: 'var(--studio-surface-deep)', border: '1px solid var(--studio-border)' }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--studio-muted)', marginBottom: 4 }}>
                Xem trước trên Google Search
              </div>
              <div style={{ color: '#f8fafc', fontSize: 17, fontWeight: 800 }}>
                {metaTitle || title || 'Tiêu đề bài viết SEO sẽ hiện ở đây'}
              </div>
              <div style={{ color: 'var(--studio-muted)', fontSize: 13 }}>
                https://tenmiencuaban.vn/blog/{slug || 'duong-dan-bai-viet'}
              </div>
              <div style={{ color: 'var(--studio-muted)', fontSize: 13, marginTop: 2 }}>
                {metaDesc || excerpt || 'Mô tả ngắn chuẩn SEO giúp tăng tỷ lệ click từ kết quả tìm kiếm Google.'}
              </div>
            </div>
            <button type="submit" className="studio-btn studio-btn--primary">
              Xuất bản bài viết →
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {posts.map((p) => (
              <div key={p.id} className="studio-card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="studio-tag">{p.category}</span>
                  <button
                    type="button"
                    onClick={() => handleDeletePost(p.id)}
                    style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 13, cursor: 'pointer' }}
                  >
                    Xóa
                  </button>
                </div>
                <h3 style={{ fontSize: 18 }}>{p.title}</h3>
                <div className="studio-mono" style={{ fontSize: 12, color: 'var(--studio-muted)' }}>
                  /blog/{p.slug}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {leads.map((lead) => (
            <div key={lead.id} className="studio-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <strong style={{ fontSize: 18 }}>{lead.name}</strong> ·{' '}
                  <span style={{ color: '#f8fafc', background: '#c02f33', padding: '2px 8px', borderRadius: 999 }}>{lead.contact}</span>
                  {lead.email && <> · <span>{lead.email}</span></>}
                </div>
                <span className="studio-tag">Nguồn: {lead.source}</span>
              </div>
              {lead.service_type && (
                <div style={{ fontSize: 14 }}>
                  Dịch vụ: <strong>{lead.service_type}</strong> ({lead.pages_count || 'Mặc định'}) — Dự kiến:{' '}
                  <strong>{(lead.estimated_total || 0).toLocaleString('vi-VN')}đ</strong>
                </div>
              )}
              {lead.addons && lead.addons.length > 0 && (
                <div className="studio-tags">
                  {lead.addons.map((a) => (
                    <span key={a} className="studio-tag">
                      {a}
                    </span>
                  ))}
                </div>
              )}
              {lead.notes && <p style={{ fontSize: 14 }}>Ghi chú: {lead.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </StudioShell>
  );
}
