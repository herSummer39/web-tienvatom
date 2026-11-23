import type { Metadata } from 'next';
import './inline-styles.css';
import './studio.css';
import ClickEffects from '@/components/ClickEffects';

export const metadata: Metadata = {
  title: 'Studio Thiết kế Website, Web App & Giải pháp AI Automation',
  description:
    'Team / Studio Freelance tại Việt Nam chuyên thiết kế Website chuẩn SEO, lập trình Web App theo yêu cầu, tích hợp Chatbot AI và Automation Zalo/Fanpage.',
  icons: {
    icon: '/wp-content/uploads/2026/03/cropped-favicon-32x32-1-32x32.png',
    apple: '/wp-content/uploads/2026/03/cropped-favicon-32x32-1-180x180.png',
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Studio Thiết kế Web & Giải pháp AI',
  description:
    'Team / Studio Freelance chuyên thiết kế Website chuẩn SEO, lập trình Web App theo yêu cầu, tích hợp Chatbot AI và Automation đa kênh.',
  areaServed: 'VN',
  priceRange: '7.000.000đ - 50.000.000đ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/header-logo/header-logo.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/home-hero/home-hero.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/grilla-celdas/grilla-celdas.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/home-quote-block/home-quote-block.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/patron-puntos/patron-puntos.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/card-servicio/card-servicio.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/shader-halftone/shader-halftone.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/home-servicios/home-servicios.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/home-bloque-dark-mode/home-bloque-dark-mode.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/home-equipo/home-equipo.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/slider-logos/slider-logos.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/vendor/css/swiper.min.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/home-portfolio/home-portfolio.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/card-noticia/card-noticia.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/ultimas-noticias/ultimas-noticias.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/home-contacto/home-contacto.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/texto-anio-actual/texto-anio-actual.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/archive-servicio-hero/archive-servicio-hero.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/archive-servicio-query/archive-servicio-query.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/lista-cards-servicio/lista-cards-servicio.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/archive-servicio/archive-servicio.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/faqs/faqs.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/blog-hero/blog-hero.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/archivo-noticias/archivo-noticias.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/shader/shader.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/fondo-shader/fondo-shader.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/blocks/single-autor-fecha/single-autor-fecha.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/vendor/css/lenis.css" />
        <link rel="stylesheet" href="/wp-content/themes/onlines-web-2026/css/styles.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body
        className="home wp-singular page-template-default page page-id-35 wp-embed-responsive wp-theme-onlines-web-2026"
        suppressHydrationWarning
      >
        <ClickEffects />
        {children}
      </body>
    </html>
  );
}
