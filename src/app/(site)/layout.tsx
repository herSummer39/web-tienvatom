import Script from 'next/script';
import '@/styles/framer.css';
import '@/styles/page.css';
import '@/styles/site.css';
import { block, leadTemplate } from '@/lib/render';

// Microsoft Clarity (xem khách cuộn / bấm ở đâu): đặt NEXT_PUBLIC_CLARITY_ID trên Vercel. Để trống = không gắn.
const CLARITY_ID = /^[a-z0-9]+$/i.test(process.env.NEXT_PUBLIC_CLARITY_ID || '') ? process.env.NEXT_PUBLIC_CLARITY_ID! : '';

// Phần dùng chung mọi trang: mẫu form đăng ký, khung chat, menu điện thoại khi mở, hình SVG dùng chung.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const chrome =
    `<template id="tc-lead-tpl">${leadTemplate()}</template>` +
    `<template id="tc-menu-open">${block('menuOpen')}</template>` +
    `<div class="tc-chat-host tc-chat-host-fixed">${block('chatSticker')}${block('chat')}</div>` +
    `<button type="button" class="tc-chat-launcher" aria-label="Mở khung chat hỏi Tiệm Code">` +
    `<svg class="tc-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9a9 9 0 0 1-4.5-1.2L3 21l1.2-4.5A9 9 0 0 1 12 3Z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/></svg>` +
    `<svg class="tc-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>` +
    block('svgTemplates');
  return (
    <>
      {children}
      <div id="tc-chrome" dangerouslySetInnerHTML={{ __html: chrome }} />
      <Script src="/site.js" strategy="afterInteractive" />
      {CLARITY_ID && (
        <Script id="clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(CLARITY_ID)});`}
        </Script>
      )}
    </>
  );
}
