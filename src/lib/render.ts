// Ghép từng trang: phần đầu trang (nội dung riêng) + các khối giao diện tĩnh (src/framer/*.html)
// + khối thêm cuối trang + "Liên hệ ngay" + chân trang + menu.
// Nội dung các trang: src/lib/site/pages.js, dự án: content/du-an/*.md, blog: content/blog/*.md (+ bài đăng từ /admin).
import fs from 'fs';
import path from 'path';
import { pages, LEAD_FORM } from './site/pages.js';
import { blogPages, fromAdminPost } from './site/blog.js';
import { projectPages } from './site/projects.js';
import { getAllPosts } from './posts';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://web-tienvatom.vercel.app').replace(/\/$/, '');

const FRAMER_DIR = path.join(process.cwd(), 'src', 'framer');
const cache: Record<string, string> = {};
export function block(name: string): string {
  if (!(name in cache)) cache[name] = fs.readFileSync(path.join(FRAMER_DIR, name + '.html'), 'utf8');
  return cache[name];
}
const shell = JSON.parse(fs.readFileSync(path.join(FRAMER_DIR, 'shell.json'), 'utf8')) as {
  mainStyle: string;
  rootClass: string;
  rootStyle: string;
};

export type SitePage = {
  slug: string;
  title: string;
  description: string;
  show?: string[];
  content?: string;
  after?: string;
  head?: string;
  ogType?: string;
  ogImage?: string;
};

// thứ tự các khối giao diện trong trang
const ORDER = ['hero', 'expert', 'ideas', 'methods', 'why', 'pricing', 'faq'];

export async function loadSite(): Promise<{ all: SitePage[]; bySlug: Map<string, SitePage>; blog: ReturnType<typeof blogPages> }> {
  let extra: ReturnType<typeof fromAdminPost>[] = [];
  try {
    const rows = await getAllPosts();
    extra = (rows || []).map(fromAdminPost);
  } catch {
    extra = [];
  }
  const blog = blogPages(SITE_URL, extra);
  const proj = projectPages();
  const list: SitePage[] = (pages as SitePage[]).map((p) => (p.slug === 'home' && proj.homeStrip ? { ...p, after: proj.homeStrip } : p));
  const all: SitePage[] = [...list, proj.listing, ...proj.detail, blog.listing, ...blog.postPages];
  return { all, bySlug: new Map(all.map((p) => [p.slug, p])), blog };
}

let projCache: { short: string; slug: string }[] | null = null;
function projectLinks() {
  if (!projCache) projCache = projectPages().projects.map((p: { short: string; slug: string }) => ({ short: p.short, slug: p.slug }));
  return projCache;
}

// đánh dấu mục menu đang xem
function navFor(slug: string): string {
  const top = '/' + slug.split('/')[0];
  const html = block('nav');
  if (slug === 'home') return html;
  const re = new RegExp(`<a class="([^"]*)"([^>]*?)href="${top.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
  return html.replace(re, '<a class="$1 tc-nav-active"$2href="' + top + '"');
}

export function renderPage(page: SitePage): { top: string; main: string } {
  const show = new Set(page.show || []);
  const parts: string[] = [];
  for (const k of ORDER) if (show.has(k)) parts.push(block(k));
  if (page.after) parts.push(`<div class="tcp-page tcp-after" data-page="${page.slug}">${page.after}</div>`);
  parts.push(block('closing'), block('footer'), navFor(page.slug));
  const main =
    `<style>${shell.mainStyle}</style>` +
    `<div class="${shell.rootClass}" style="${shell.rootStyle}">${parts.join('\n')}</div>`;
  const top = page.content ? `<div class="tcp-page" data-page="${page.slug}">${page.content}</div>` : '';
  return { top, main };
}

export function leadTemplate(): string {
  return LEAD_FORM as string;
}

export function projectsForFooter() {
  return projectLinks();
}
