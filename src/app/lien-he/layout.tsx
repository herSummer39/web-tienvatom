import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Liên hệ Tiệm Code qua Zalo 0565567789 để được tư vấn làm website và phần mềm.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
