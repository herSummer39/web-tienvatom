// Dự án: đọc từ content/du-an/*.md và tạo trang /du-an + /du-an/<ten-du-an>.
//
// Thêm dự án / mẫu giao diện mới:
//   1. Tạo file content/du-an/ten-du-an.md (tên file = đường dẫn: /du-an/ten-du-an)
//   2. Đầu file ghi thông tin giữa 2 dòng ---  (xem các file có sẵn)
//        title:    Tên dự án
//        short:    Tên ngắn (hiện ở chân trang)
//        type:     thuc-te (dự án đã làm cho khách)  |  mau (mẫu giao diện có sẵn)
//        industry: Ngành, ví dụ: Sự kiện, Bán hàng, Nội dung & Giáo dục
//        client:   (dự án thực tế) tên khách hàng
//        summary:  Mô tả ngắn 1–2 câu (hiện trên thẻ và Google)
//        tags:     Các tính năng, cách nhau bằng dấu phẩy
//        color:    yellow | orange | blue | pink | green
//        cover:    ảnh bìa, ví dụ /images/du-an/ten-anh.jpg  (tỉ lệ 16:10, rộng ~1200px)
//        url:      (không bắt buộc) link website thật
//        demo:     (không bắt buộc, cho mẫu) link bản demo
//        order:    số thứ tự hiển thị (nhỏ đứng trước)
//        draft:    true nếu chưa muốn hiện
//   3. Viết nội dung chi tiết bằng Markdown (## Khách cần gì, ## Tiệm Code đã làm, ## Kết quả ...)
//   4. Chạy: npm run build (hoặc npm run dev để xem ngay)
import fs from 'fs';
import path from 'path';
import { helpers } from './pages.js';
import { markdown, esc } from './blog.js';
const { lead, btn, arrow, industriesHtml } = helpers;

const DIR = path.join(process.cwd(), 'content', 'du-an');
const TYPES = {
  'thuc-te': { label: 'Đã triển khai', badge: 'green', filter: 'Dự án thực tế' },
  mau: { label: 'Mẫu có sẵn', badge: 'yellow', filter: 'Mẫu giao diện' },
};

// ảnh bìa vẽ sẵn (không cần ảnh chụp): cover: art:ticket
const ART = {
  ticket: `<svg viewBox="0 0 640 400" role="img" aria-label="Vé sự kiện có mã QR" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="400" fill="#25D572"/>
    <g transform="rotate(-6 320 200)">
      <path d="M110 110h300a22 22 0 0 0 44 0h76v180h-76a22 22 0 0 0-44 0H110z" fill="#F4F0EC" stroke="#252122" stroke-width="5"/>
      <path d="M432 130v140" stroke="#252122" stroke-width="4" stroke-dasharray="10 9"/>
      <text x="140" y="160" font-family="Anton, Impact, sans-serif" font-size="40" fill="#252122">VÉ SỰ KIỆN</text>
      <text x="140" y="196" font-family="Montserrat, sans-serif" font-size="18" font-weight="700" fill="#252122">THE TOWER · READING CIRCLE</text>
      <rect x="140" y="214" width="150" height="40" rx="20" fill="#F1E044" stroke="#252122" stroke-width="3"/>
      <text x="215" y="241" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="17" font-weight="800" fill="#252122">ĐÃ ĐẶT</text>
      <g fill="#252122" transform="translate(452 152)">
        <rect width="22" height="22"/><rect x="40" width="22" height="22"/><rect y="40" width="22" height="22"/>
        <rect x="4" y="4" width="14" height="14" fill="#F4F0EC"/><rect x="44" y="4" width="14" height="14" fill="#F4F0EC"/><rect x="4" y="44" width="14" height="14" fill="#F4F0EC"/>
        <rect x="8" y="8" width="6" height="6"/><rect x="48" y="8" width="6" height="6"/><rect x="8" y="48" width="6" height="6"/>
        <rect x="28" y="4" width="6" height="10"/><rect x="28" y="28" width="10" height="6"/><rect x="44" y="30" width="6" height="12"/>
        <rect x="30" y="46" width="12" height="6"/><rect x="50" y="50" width="12" height="12"/><rect x="26" y="56" width="6" height="6"/>
      </g>
    </g>
    <g transform="rotate(12 500 300)">
      <circle cx="500" cy="300" r="62" fill="#FC5702" stroke="#252122" stroke-width="5"/>
      <path d="m470 300 20 20 40-42" fill="none" stroke="#252122" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="500" y="392" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="26" fill="#252122" transform="rotate(12 500 300)">CHECK-IN</text>
  </svg>`,
};

function readProjects() {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(DIR, f), 'utf8').replace(/^﻿/, '');
      const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
      if (!fm) throw new Error(`${f}: thiếu phần thông tin giữa 2 dòng ---`);
      const m = {};
      fm[1].split(/\r?\n/).forEach((l) => { const x = l.match(/^(\w+):\s*(.*)$/); if (x) m[x[1]] = x[2].trim().replace(/^["']|["']$/g, ''); });
      if (!m.title) throw new Error(`${f}: thiếu title`);
      if (!TYPES[m.type]) throw new Error(`${f}: type phải là "thuc-te" hoặc "mau"`);
      return {
        slug: f.replace(/\.md$/, ''),
        title: m.title,
        short: m.short || m.title,
        type: m.type,
        industry: m.industry || 'Khác',
        client: m.client || '',
        summary: m.summary || '',
        tags: (m.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
        color: m.color || 'yellow',
        cover: m.cover || '',
        url: m.url || '',
        demo: m.demo || '',
        order: Number(m.order || 99),
        draft: m.draft === 'true',
        body: fm[2],
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => a.order - b.order);
}

const coverHtml = (p, cls) => {
  if (p.cover.startsWith('art:') && ART[p.cover.slice(4)]) return `<div class="${cls} tcp-bg-${p.color}">${ART[p.cover.slice(4)]}</div>`;
  if (p.cover) return `<div class="${cls} tcp-bg-${p.color}"><img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy"></div>`;
  return `<div class="${cls} tcp-bg-${p.color}"><b>${esc(p.industry)}</b></div>`;
};
const badge = (p) => `<span class="tcp-badge tcp-bg-${TYPES[p.type].badge}">${TYPES[p.type].label}</span>`;

function projectCard(p) {
  return `
  <a class="tcp-post-card tcp-project-card" href="/du-an/${p.slug}" data-type="${p.type}" data-ind="${esc(p.industry)}">
    ${coverHtml(p, 'tcp-post-cover')}
    <div class="tcp-post-body">
      <div class="tcp-post-meta">${badge(p)}<span>${esc(p.industry)}</span></div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.summary)}</p>
      <div class="tcp-tags">${p.tags.slice(0, 3).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
      <span class="tcp-more">${p.type === 'mau' ? 'Xem mẫu' : 'Xem dự án'} ${arrow}</span>
    </div>
  </a>`;
}

const FILTER_JS = ""; // bộ lọc chạy trong public/site.js

function projectPages() {
  const projects = readProjects();
  const types = Object.keys(TYPES).filter((t) => projects.some((p) => p.type === t));
  const inds = [...new Set(projects.map((p) => p.industry))];

  const listing = {
    slug: 'du-an',
    title: 'Dự án & mẫu giao diện | Tiệm Code',
    description: 'Các dự án website, phần mềm Tiệm Code đã triển khai cho khách hàng và kho mẫu giao diện có sẵn để bạn chọn phong cách cho website của mình.',
    show: [],
    content: `
  <section class="tcp-wrap">
    <header class="tcp-hero">
      <span class="tcp-sticker tcp-bg-pink">Dự án</span>
      <h1 class="tcp-title">Xem tận mắt<br>rồi hẵng tin</h1>
      <p class="tcp-lead">Dự án Tiệm Code đã làm cho khách hàng và kho mẫu giao diện có sẵn. Thích mẫu nào, chúng mình làm theo phong cách đó cho bạn.</p>
      <div class="tcp-actions">${lead('Đăng ký tư vấn')}${btn('Xem báo giá', '/bao-gia', 'ghost')}</div>
    </header>
    <div class="tcp-cats" role="group" aria-label="Lọc dự án">
      <button type="button" aria-pressed="true" data-k="type" data-v="">Tất cả (${projects.length})</button>
      ${types.map((t) => `<button type="button" aria-pressed="false" data-k="type" data-v="${t}">${TYPES[t].filter}</button>`).join('')}
      ${inds.length > 1 ? inds.map((i) => `<button type="button" aria-pressed="false" data-k="ind" data-v="${esc(i)}">${esc(i)}</button>`).join('') : ''}
    </div>
    <div class="tcp-posts">${projects.map(projectCard).join('')}</div>
  </section>${FILTER_JS}`,
    after: `<section class="tcp-wrap">${industriesHtml}</section>`,
  };

  const detail = projects.map((p) => {
    const { html } = markdown(p.body);
    const others = projects.filter((x) => x.slug !== p.slug).slice(0, 3);
    const isMau = p.type === 'mau';
    const actions = isMau
      ? (p.demo ? btn('Xem demo', p.demo) : '') + `<a class="tcp-btn" href="/lien-he#dang-ky" data-tc-lead="website" data-tc-note="${esc('Mình muốn làm website theo mẫu: ' + p.title)}" data-variant="ghost"><span>Làm theo mẫu này</span>${arrow}</a>`
      : (p.url ? btn('Xem website', p.url) : '') + `<a class="tcp-btn" href="/lien-he#dang-ky" data-tc-lead="tuvan" data-tc-note="${esc('Mình muốn làm dự án tương tự: ' + p.title)}" data-variant="ghost"><span>Làm dự án tương tự</span>${arrow}</a>`;
    return {
      slug: `du-an/${p.slug}`,
      title: `${p.title} | Dự án Tiệm Code`,
      description: p.summary,
      ogImage: p.cover.startsWith('/') ? p.cover : '',
      show: [],
      content: `
  <section class="tcp-wrap">
    <header class="tcp-article-head">
      <div class="tcp-crumbs"><a href="/du-an">Dự án</a> / ${esc(p.industry)}</div>
      ${badge(p)}
      <h1 class="tcp-title">${esc(p.title)}</h1>
      <p class="tcp-lead">${esc(p.summary)}</p>
      <div class="tcp-actions">${actions}</div>
    </header>
    ${coverHtml(p, 'tcp-article-cover')}
    <dl class="tcp-facts">
      ${p.client ? `<div><dt>Khách hàng</dt><dd>${esc(p.client)}</dd></div>` : ''}
      <div><dt>Ngành</dt><dd>${esc(p.industry)}</dd></div>
      <div><dt>Loại</dt><dd>${TYPES[p.type].filter}</dd></div>
      <div><dt>Tính năng</dt><dd class="tcp-tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</dd></div>
    </dl>
    <article class="tcp-article">${html}</article>
    <aside class="tcp-article-cta tcp-bg-${isMau ? 'yellow' : 'green'}">
      <div><h2>${isMau ? 'Thích mẫu này?' : 'Cần làm tương tự?'}</h2><p>${isMau ? 'Chúng mình làm theo phong cách này với nội dung của bạn.' : 'Kể chúng mình nghe về dự án của bạn, tư vấn miễn phí.'}</p></div>
      <div class="tcp-actions">${lead('Đăng ký tư vấn', isMau ? 'website' : 'tuvan', 'dark')}</div>
    </aside>
    ${others.length ? `<div class="tcp-related"><div class="tcp-sec-head"><h2 class="tcp-h2">Xem thêm</h2>${btn('Tất cả dự án', '/du-an', 'ghost')}</div><div class="tcp-posts">${others.map(projectCard).join('')}</div></div>` : ''}
  </section>`,
    };
  });

  // dải "Dự án mới nhất" ở trang chủ
  const homeStrip = projects.length ? `
  <section class="tcp-wrap">
    <div class="tcp-sec" style="margin-bottom:10px">
      <div class="tcp-sec-head"><h2 class="tcp-h2">Dự án &amp;<br>mẫu mới nhất</h2>${btn('Xem tất cả', '/du-an', 'ghost')}</div>
      <div class="tcp-posts tcp-posts-4">${projects.slice(0, 4).map(projectCard).join('')}</div>
    </div>
  </section>` : '';

  return { listing, detail, projects, homeStrip };
}

export { projectPages };
