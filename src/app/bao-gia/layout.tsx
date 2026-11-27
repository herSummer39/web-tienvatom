import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Báo giá',
  description: 'Tính chi phí làm website, thiết kế giao diện, phần mềm theo nhu cầu và phần mềm Zalo marketing của Tiệm Code.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
