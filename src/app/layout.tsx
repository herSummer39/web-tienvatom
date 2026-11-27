import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://web-tienvatom.vercel.app'),
  icons: {
    icon: '/framer/framerusercontent.com/images/w512/zHs0hmXDznZHr0kTGvipTPB9heQ.png',
    apple: '/framer/framerusercontent.com/images/w512/dIPtDSigmNQGJ9A7xAu2MvLTw.png',
  },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
};
export const viewport: Viewport = { width: 'device-width' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
