'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClickEffects() {
  const pathname = usePathname();

  useEffect(() => {
    // Highlight active link in .studio-top-nav
    document.querySelectorAll('.studio-top-nav a').forEach((a) => {
      const href = a.getAttribute('href');
      a.classList.toggle('is-active', href === pathname);
    });

    function handlePointerDown(e: PointerEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest(
        'a, button, .calc-pill, .addon-row, .studio-btn, .header__cta, .cb-launcher'
      ) as HTMLElement | null;
      if (!clickable) return;

      // Tactile ripple burst at click coordinates
      const ripple = document.createElement('span');
      ripple.className = 'studio-click-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    }

    document.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [pathname]);

  return null;
}
