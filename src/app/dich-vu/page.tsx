import { DICHVU_HTML } from '@/components/subpagesHtml';
import OnlinesRuntime from '@/components/OnlinesRuntime';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function DichVuPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: DICHVU_HTML }} />
      <OnlinesRuntime />
      <ChatbotWidget />
    </>
  );
}
