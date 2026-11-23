'use client';

import { ONLINES_FOOTER_HTML, ONLINES_HEADER_HTML } from './onlinesChrome';
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
      <div dangerouslySetInnerHTML={{ __html: ONLINES_HEADER_HTML }} />

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

      <div dangerouslySetInnerHTML={{ __html: ONLINES_FOOTER_HTML }} />
      <OnlinesRuntime />
      <ChatbotWidget />
    </div>
  );
}
