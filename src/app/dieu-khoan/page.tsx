import { DIEUKHOAN_HTML } from '@/components/subpagesHtml';
import OnlinesRuntime from '@/components/OnlinesRuntime';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function DieuKhoanPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: DIEUKHOAN_HTML }} />
      <OnlinesRuntime />
      <ChatbotWidget />
    </>
  );
}
