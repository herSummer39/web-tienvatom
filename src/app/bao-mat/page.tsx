import { BAOMAT_HTML } from '@/components/subpagesHtml';
import OnlinesRuntime from '@/components/OnlinesRuntime';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function BaoMatPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: BAOMAT_HTML }} />
      <OnlinesRuntime />
      <ChatbotWidget />
    </>
  );
}
