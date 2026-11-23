'use client';

import { useEffect } from 'react';

const SCRIPTS = [
  '/wp-content/themes/onlines-web-2026/vendor/js/lenis.min.js',
  '/wp-content/themes/onlines-web-2026/vendor/js/swiper.min.js',
  '/wp-content/themes/onlines-web-2026/js/scripts.js',
  '/wp-content/themes/onlines-web-2026/blocks/header-logo/header-logo-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/grilla-celdas/grilla-celdas-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/home-hero/home-hero-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/patron-puntos/patron-puntos-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/home-quote-block/home-quote-block-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/card-servicio/card-servicio-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/shader-halftone/shader-halftone-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/home-servicios/home-servicios-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/home-bloque-dark-mode/home-bloque-dark-mode-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/home-equipo/home-equipo-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/slider-logos/slider-logos-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/home-portfolio/home-portfolio-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/card-noticia/card-noticia-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/ultimas-noticias/ultimas-noticias-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/home-contacto/home-contacto-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/archive-servicio-hero/archive-servicio-hero-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/lista-cards-servicio/lista-cards-servicio-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/faqs/faqs-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/blog-hero/blog-hero-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/shader/shader-view.js',
  '/wp-content/themes/onlines-web-2026/blocks/fondo-shader/fondo-shader-view.js',
];

export default function OnlinesRuntime() {
  useEffect(() => {
    const added: HTMLScriptElement[] = [];
    let cancelled = false;

    async function loadAll() {
      for (const src of SCRIPTS) {
        if (cancelled) break;
        await new Promise<void>((resolve) => {
          const s = document.createElement('script');
          s.src = src;
          s.async = false;
          s.onload = () => resolve();
          s.onerror = () => resolve();
          document.body.appendChild(s);
          added.push(s);
        });
      }
      // Fire DOMContentLoaded-like fallback if scripts listen on it after hydration
      document.dispatchEvent(new Event('DOMContentLoaded'));
      window.dispatchEvent(new Event('load'));
    }

    loadAll();

    return () => {
      cancelled = true;
      added.forEach((s) => s.remove());
    };
  }, []);

  return null;
}
