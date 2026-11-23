import { HOME_HTML } from '@/components/homeHtml';
import OnlinesRuntime from '@/components/OnlinesRuntime';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function HomePage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: HOME_HTML }} />
      <OnlinesRuntime />
      <ChatbotWidget />
    </>
  );
}
