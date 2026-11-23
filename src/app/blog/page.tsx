import { BLOG_ARCHIVE_HTML } from '@/components/subpagesHtml';
import OnlinesRuntime from '@/components/OnlinesRuntime';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function BlogPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: BLOG_ARCHIVE_HTML }} />
      <OnlinesRuntime />
      <ChatbotWidget />
    </>
  );
}
