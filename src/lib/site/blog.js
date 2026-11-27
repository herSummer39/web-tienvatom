// Blog: đọc bài viết từ content/blog/*.md và tạo trang /blog + /blog/<ten-bai>.
//
// Đăng bài mới:
//   1. Tạo file content/blog/ten-bai-viet.md (tên file = đường dẫn bài: /blog/ten-bai-viet)
//   2. Đầu file ghi thông tin bài giữa 2 dòng ---  (xem bài mẫu trong thư mục)
//        title:       Tiêu đề bài (hiện trên trang và Google)
//        description: Mô tả ngắn 120–160 ký tự (hiện dưới tiêu đề trên Google)
//        category:    Chuyên mục, ví dụ: Chi phí, Kiến thức, SEO, Marketing
//        date:        Ngày đăng, dạng 2026-11-26
//        color:       Màu bìa: yellow | orange | blue | pink | green
//        cover:       (không bắt buộc) ảnh bìa, ví dụ /images/blog/ten-anh.webp
//        draft:       true nếu chưa muốn đăng
//   3. Viết nội dung bằng Markdown: ## tiêu đề mục, ### mục nhỏ, - danh sách, **đậm**, [chữ](link), > ghi chú, bảng | a | b |
//   4. Chạy: npm run build (hoặc npm run dev để xem ngay)
import fs from 'fs';
import path from 'path';
import { helpers } from './pages.js';
const { lead, btn, arrow } = helpers;

const DIR = path.join(process.cwd(), 'content', 'blog');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- Markdown -> HTML (đủ dùng cho bài blog) ----------
function inline(s) {
  return esc(s)
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `<a href="${u}"${/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}
function markdown(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const out = [];
  const toc = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = line.match(/^(#{2,3})\s+(.*)$/))) {
      const level = m[1].length;
      const text = m[2].trim();
      const id = slugify(text);
      if (level === 2) toc.push([id, text]);
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      i++;
    } else if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*]\s+/, ''));
      out.push(`<ul>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>`);
    } else if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+[.)]\s+/, ''));
      out.push(`<ol>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ol>`);
    } else if (/^>\s?/.test(line)) {
      const parts = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) parts.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote><p>${inline(parts.join(' '))}</p></blockquote>`);
    } else if (/^\|.*\|\s*$/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(1).filter((r) => !/^\|\s*:?-{2,}/.test(r)).map(cells);
      out.push(`<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
    } else {
      const parts = [];
      while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|\s*[-*]\s|\s*\d+[.)]\s|>|\|)/.test(lines[i])) parts.push(lines[i++].trim());
      out.push(`<p>${inline(parts.join(' '))}</p>`);
    }
  }
  return { html: out.join('\n'), toc };
}

function readPosts() {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(DIR, f), 'utf8').replace(/^\uFEFF/, '');
      const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
      if (!fm) throw new Error(`${f}: thiếu phần thông tin bài giữa 2 dòng ---`);
      const meta = {};
      fm[1].split(/\r?\n/).forEach((l) => { const m = l.match(/^(\w+):\s*(.*)$/); if (m) meta[m[1]] = m[2].trim().replace(/^["']|["']$/g, ''); });
      if (!meta.title) throw new Error(`${f}: thiếu title`);
      const body = fm[2];
      const words = body.split(/\s+/).filter(Boolean).length;
      return {
        slug: f.replace(/\.md$/, ''),
        title: meta.title,
        description: meta.description || '',
        category: meta.category || 'Chia sẻ',
        date: meta.date || new Date().toISOString().slice(0, 10),
        color: meta.color || 'yellow',
        cover: meta.cover || '',
        draft: meta.draft === 'true',
        minutes: Math.max(2, Math.round(words / 220)),
        body,
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

const viDate = (d) => { const [y, m, day] = d.split('-'); return `${day}/${m}/${y}`; };
const cover = (p, tag = 'div', cls = 'tcp-post-cover') =>
  `<${tag} class="${cls} tcp-bg-${p.color}">${p.cover ? `<img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy">` : `<b>${esc(p.category)}</b>`}</${tag}>`;
const card = (p, featured = false) => `
  <a class="tcp-post-card${featured ? ' tcp-featured' : ''}" href="/blog/${p.slug}" data-cat="${esc(p.category)}">
    ${cover(p)}
    <div class="tcp-post-body">
      <div class="tcp-post-meta"><span>${esc(p.category)}</span><span>·</span><span>${viDate(p.date)}</span><span>·</span><span>${p.minutes} phút đọc</span></div>
      ${featured ? `<h2>${esc(p.title)}</h2>` : `<h3>${esc(p.title)}</h3>`}
      <p>${esc(p.description)}</p>
      <span class="tcp-more">Đọc bài ${arrow}</span>
    </div>
  </a>`;

// lọc theo chuyên mục trên trang /blog (script nhỏ, không cần tải lại trang)
const FILTER_JS = ""; // bộ lọc chạy trong public/site.js

// extra: bài đăng từ trang /admin (Supabase), cùng dạng với bài trong content/blog
function blogPages(SITE_URL, extra = []) {
  const files = readPosts();
  const have = new Set(files.map((p) => p.slug));
  const posts = [...files, ...extra.filter((p) => p && p.slug && !have.has(p.slug))]
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const cats = [...new Set(posts.map((p) => p.category))];

  const listing = {
    slug: 'blog',
    title: 'Blog | Tiệm Code - Kiến thức website, SEO & bán hàng online',
    description: 'Chia sẻ dễ hiểu về chi phí làm website, tên miền, hosting, SEO và marketing trên Zalo cho shop và doanh nghiệp nhỏ.',
    show: [],
    content: `
  <section class="tcp-wrap">
    <header class="tcp-hero">
      <span class="tcp-sticker tcp-bg-pink">Blog</span>
      <h1 class="tcp-title">Góc chia sẻ<br>của Tiệm Code</h1>
      <p class="tcp-lead">Website, SEO và bán hàng online, viết dễ hiểu cho người không rành kỹ thuật.</p>
    </header>
    ${cats.length > 1 ? `<div class="tcp-cats" role="group" aria-label="Lọc theo chuyên mục"><button type="button" aria-pressed="true" data-cat="">Tất cả</button>${cats.map((c) => `<button type="button" aria-pressed="false" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}
    <div class="tcp-posts">
      ${posts.length ? posts.map((p, i) => card(p, i === 0)).join('') : '<p class="tcp-lead">Bài viết đầu tiên sắp ra mắt.</p>'}
    </div>
  </section>${FILTER_JS}`,
    head: `<link rel="alternate" type="application/rss+xml" title="Blog Tiệm Code" href="/blog/rss.xml">`,
  };

  const postPages = posts.map((p) => {
    const { html, toc } = markdown(p.body);
    const related = posts.filter((x) => x.slug !== p.slug).slice(0, 3);
    const url = `${SITE_URL}/blog/${p.slug}`;
    const jsonld = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.date,
      mainEntityOfPage: url,
      author: { '@type': 'Organization', name: 'Tiệm Code' },
      publisher: { '@type': 'Organization', name: 'Tiệm Code' },
      ...(p.cover ? { image: SITE_URL + p.cover } : {}),
    };
    return {
      slug: `blog/${p.slug}`,
      title: `${p.title} | Tiệm Code`,
      description: p.description,
      ogType: 'article',
      ogImage: p.cover || '',
      show: [],
      head: `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>`,
      content: `
  <section class="tcp-wrap">
    <header class="tcp-article-head">
      <div class="tcp-crumbs"><a href="/blog">Blog</a> / ${esc(p.category)}</div>
      <span class="tcp-sticker tcp-bg-${p.color}">${esc(p.category)}</span>
      <h1 class="tcp-title">${esc(p.title)}</h1>
      <div class="tcp-post-meta"><span>${viDate(p.date)}</span><span>·</span><span>${p.minutes} phút đọc</span><span>·</span><span>Tiệm Code</span></div>
    </header>
    ${cover(p, 'div', 'tcp-article-cover')}
    <article class="tcp-article">
      ${toc.length > 2 ? `<nav class="tcp-toc" aria-label="Mục lục"><b>Trong bài này</b><ol>${toc.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join('')}</ol></nav>` : ''}
      ${html}
    </article>
    <aside class="tcp-article-cta tcp-bg-yellow">
      <div><h2>Cần làm website?</h2><p>Tư vấn miễn phí, báo giá rõ ràng trước khi làm.</p></div>
      <div class="tcp-actions">${lead('Đăng ký tư vấn', 'website', 'dark')}</div>
    </aside>
    ${related.length ? `<div class="tcp-related"><div class="tcp-sec-head"><h2 class="tcp-h2">Đọc thêm</h2>${btn('Tất cả bài viết', '/blog', 'ghost')}</div><div class="tcp-posts">${related.map((r) => card(r)).join('')}</div></div>` : ''}
  </section>`,
    };
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Blog Tiệm Code</title><link>${SITE_URL}/blog</link><description>Kiến thức website, SEO và bán hàng online</description><language>vi</language>
${posts.map((p) => `<item><title>${esc(p.title)}</title><link>${SITE_URL}/blog/${p.slug}</link><guid>${SITE_URL}/blog/${p.slug}</guid><pubDate>${new Date(p.date + 'T08:00:00+07:00').toUTCString()}</pubDate><description>${esc(p.description)}</description></item>`).join('\n')}
</channel></rss>
`;
  return { listing, postPages, posts, rss };
}

// bài từ Supabase (bảng posts) -> dạng bài blog
function fromAdminPost(r) {
  const body = String(r.content || '');
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug: String(r.slug),
    title: String(r.title || ''),
    description: String(r.meta_description || r.excerpt || ''),
    category: String(r.category || 'Chia sẻ'),
    date: String(r.created_at || new Date().toISOString()).slice(0, 10),
    color: 'yellow',
    cover: r.cover_image && !/^\/wp-content\//.test(r.cover_image) ? String(r.cover_image) : '',
    draft: false,
    minutes: Math.max(2, Math.round(words / 220)),
    body,
  };
}

export { blogPages, markdown, esc, viDate, fromAdminPost };
