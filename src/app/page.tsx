import { HOME_HTML } from '@/components/homeHtml';
import { SITE_FOOTER_HTML, SITE_HEADER_HTML } from '@/components/siteChrome';
import OnlinesRuntime from '@/components/OnlinesRuntime';
import ChatbotWidget from '@/components/ChatbotWidget';

const html = HOME_HTML.replace('<!--SITE_HEADER-->', SITE_HEADER_HTML).replace(
  '<!--SITE_FOOTER-->',
  SITE_FOOTER_HTML
);

export default function HomePage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <OnlinesRuntime />
      <ChatbotWidget />
    </>
  );
}
