import { STUDIO_HTML } from '@/components/subpagesHtml';
import OnlinesRuntime from '@/components/OnlinesRuntime';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function DuAnStudioPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: STUDIO_HTML }} />
      <OnlinesRuntime />
      <ChatbotWidget />
    </>
  );
}
