'use client';

import { SITE_FOOTER_HTML, SITE_HEADER_HTML } from './siteChrome';
import OnlinesRuntime from './OnlinesRuntime';
import ChatbotWidget from './ChatbotWidget';

export default function StudioShell({
  children,
  heroHtml,
}: {
  children: React.ReactNode;
  heroHtml?: string;
}) {
  return (
    <div className="wp-site-blocks studio-page">
      <div dangerouslySetInnerHTML={{ __html: SITE_HEADER_HTML }} />

      {heroHtml && (
        <div
          className="archive-servicio alignfull wp-block-onlines-archive-servicio"
          dangerouslySetInnerHTML={{ __html: heroHtml }}
        />
      )}

      <main
        className="studio-container"
        style={{
          paddingTop: heroHtml ? '32px' : 'clamp(108px, 12vw, 150px)',
          paddingBottom: 'clamp(64px, 8vw, 110px)',
        }}
      >
        {children}
      </main>

      <div dangerouslySetInnerHTML={{ __html: SITE_FOOTER_HTML }} />
      <OnlinesRuntime />
      <ChatbotWidget />
    </div>
  );
}
