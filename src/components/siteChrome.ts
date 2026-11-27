// Header, footer và khối hero dùng chung cho toàn site (HTML tĩnh giữ hiệu ứng của theme).
import { NAV_LINKS, SITE } from '@/lib/siteConfig';
import { SERVICES } from '@/lib/services';

export const SITE_HEADER_HTML = `<header class="header wp-block-template-part">
            <div class="wp-block-group alignfull header__wrapper px-1rem-mob is-layout-constrained wp-container-core-group-is-layout-48e5bebc wp-block-group-is-layout-constrained"
                style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--110);padding-right:0;padding-bottom:var(--wp--preset--spacing--110);padding-left:0">
                <div
                    class="wp-block-group alignwide container is-content-justification-space-between is-nowrap is-layout-flex wp-container-core-group-is-layout-4cdc23c7 wp-block-group-is-layout-flex">
                    <div style="--header-logo-height:18px;--header-logo-height-mobile:18px"
                        class="header-logo wp-block-onlines-header-logo">
                        <div class="header-logo__heading">
                            <a class="header-logo__link js-header-logo" href="/" rel="follow"
                                title="${SITE.name} - ${SITE.tagline}" aria-label="${SITE.name} - Trang chủ">

                                <span class="header-logo__small header-logo__small--hidden"><svg xmlns="http://www.w3.org/2000/svg" width="29" height="12" viewBox="0 0 29 12" aria-hidden="true"><text x="0" y="10.5" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="800" fill="#f8fafc">tc</text></svg></span>
                                <span class="header-logo__full header-logo__full--visible"><svg width="620" height="140" viewBox="0 0 620 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><text x="0" y="104" font-family="Inter, Arial, sans-serif" font-size="128" font-weight="800" letter-spacing="-4" fill="#f8fafc">tiệm code</text></svg></span>
                            </a>
                        </div>
                    </div>



                    <nav class="studio-top-nav" aria-label="Menu chính">${NAV_LINKS.map((l) => `<a href="${l.href}">${l.label}</a>`).join('')}</nav><details class="studio-mobile-menu"><summary aria-label="Mở menu"><span></span><span></span><span></span></summary><nav aria-label="Menu">${NAV_LINKS.map((l) => `<a href="${l.href}">${l.label}</a>`).join("")}<a href="/lien-he">Liên hệ</a></nav></details><div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
                        <div class="wp-block-button header__btn-call"><a class="wp-block-button__link wp-element-button"
                                href="/lien-he" rel="noreferrer noopener nofollow">Liên hệ <span class="btn-arrow" aria-hidden="true">↗</span></a></div>
                    </div>
                </div>
            </div>
        </header>`;

const link = (href: string, label: string, external = false) =>
  `<li><a href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}>${label}</a></li>`;

const contactLinks = [
  link(SITE.zaloUrl, 'Nhắn Zalo', true),
  link(`tel:${SITE.zalo}`, `Gọi ${SITE.zalo}`),
  SITE.fanpageUrl ? link(SITE.fanpageUrl, 'Fanpage', true) : '',
  link('/lien-he', 'Để lại thông tin'),
].join('');

export const SITE_FOOTER_HTML = `<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__brand">
      <a class="site-footer__logo" href="/">${SITE.name}</a>
      <p>${SITE.about[0]}</p>
      <a class="site-footer__cta" href="${SITE.zaloUrl}" target="_blank" rel="noopener">Nhắn Zalo tư vấn <span class="btn-arrow" aria-hidden="true">↗</span></a>
    </div>
    <nav class="site-footer__col" aria-label="Trang">
      <h3>Trang</h3>
      <ul>${NAV_LINKS.map((l) => link(l.href, l.label)).join('')}${link('/lien-he', 'Liên hệ')}</ul>
    </nav>
    <nav class="site-footer__col" aria-label="Dịch vụ">
      <h3>Dịch vụ</h3>
      <ul>${SERVICES.map((s) => link(s.id === 'zalo' ? '/phan-mem-zalo' : `/dich-vu#${s.id}`, s.short)).join('')}</ul>
    </nav>
    <div class="site-footer__col">
      <h3>Liên hệ</h3>
      <ul>${contactLinks}</ul>
      <p class="site-footer__note">Làm việc online với khách hàng trên toàn quốc.</p>
    </div>
  </div>
  <div class="site-footer__bottom">
    <span>© ${SITE.since} ${SITE.name}</span>
    <span><a href="/dieu-khoan">Điều khoản sử dụng</a> · <a href="/bao-mat">Chính sách bảo mật</a></span>
  </div>
</footer>`;

/** Khối hero có lưới ô, con trỏ chuyển động và bong bóng bình luận của theme. */
export function makeHeroHtml(title: string, comment: string): string {
  return `<section class="archive-servicio-hero wp-block-onlines-archive-servicio-hero">
                    <div class="archive-servicio-hero__inner">

                        <div class="archive-servicio-hero__grilla grilla-celdas js-archive-servicio-hero-grilla"
                            aria-hidden="true"></div>

                        <div class="comentario-figma archive-servicio-hero__elemento archive-servicio-hero__comentario js-archive-servicio-hero-fadein"
                            data-fadein-delay="1200" aria-hidden="true">
                            <div class="comentario-figma__burbuja">
                                <img class="comentario-figma__avatar"
                                    src="/images/tiemcode-avatar.svg"
                                    alt="" width="30" height="30" loading="eager" decoding="async">
                                <div class="comentario-figma__contenido">
                                    <p class="comentario-figma__header"><strong>${SITE.name}</strong> <span>vừa xong</span></p>
                                    <p class="comentario-figma__texto">${comment}</p>
                                </div>
                            </div>
                        </div>

                        <div class="archive-servicio-hero__cursores" aria-hidden="true">
                            <div class="archive-servicio-hero__cursor archive-servicio-hero__cursor--ux js-archive-servicio-hero-cursor"
                                data-offset-x="-350" data-offset-y="-120" data-cursor-delay="150">
                                <svg preserveAspectRatio="none" width="15" height="17" viewBox="0 0 21.7849 23.5392"
                                    fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <g filter="url(#filter0_d_archive_servicio_ux)">
                                        <path
                                            d="M6.47489 17.1216L4.00903 2.58942C3.93912 2.17746 4.3754 1.86658 4.74197 2.06714L17.5232 9.06009C17.9445 9.29057 17.8302 9.92457 17.355 9.99355L11.0105 10.9145C10.8527 10.9374 10.7153 11.0342 10.6406 11.1752L7.40964 17.272C7.18605 17.694 6.55477 17.5923 6.47489 17.1216Z"
                                            fill="var(--archive-servicio-hero-cursor-color)" />
                                        <path
                                            d="M3.02285 2.75718C2.81967 1.55981 4.04211 0.646628 5.11855 1.13804L5.22207 1.1898L18.0033 8.18296C19.2669 8.87447 18.924 10.7758 17.4984 10.9828L11.4047 11.8666L8.29335 17.7406C7.6225 19.0061 5.7283 18.7007 5.48867 17.2884L3.02285 2.75718Z"
                                            stroke="white" stroke-width="2" />
                                    </g>
                                    <defs>
                                        <filter id="filter0_d_archive_servicio_ux" x="0" y="0" width="21.7849"
                                            height="23.5392" filterUnits="userSpaceOnUse"
                                            color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feColorMatrix in="SourceAlpha" type="matrix"
                                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                            <feOffset dy="2" />
                                            <feGaussianBlur stdDeviation="1" />
                                            <feComposite in2="hardAlpha" operator="out" />
                                            <feColorMatrix type="matrix"
                                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                                            <feBlend mode="normal" in2="BackgroundImageFix"
                                                result="effect1_dropShadow_archive_servicio_ux" />
                                            <feBlend mode="normal" in="SourceGraphic"
                                                in2="effect1_dropShadow_archive_servicio_ux" result="shape" />
                                        </filter>
                                    </defs>
                                </svg>
                                <span class="archive-servicio-hero__cursor-label">Thiết kế UX</span>
                            </div>
                            <div class="archive-servicio-hero__cursor archive-servicio-hero__cursor--desarrollador js-archive-servicio-hero-cursor"
                                data-offset-x="400" data-offset-y="200" data-cursor-delay="750">
                                <svg preserveAspectRatio="none" width="15" height="17" viewBox="0 0 21.7849 23.5392"
                                    fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <g filter="url(#filter0_d_archive_servicio_desarrollador)">
                                        <path
                                            d="M6.47489 17.1216L4.00903 2.58942C3.93912 2.17746 4.3754 1.86658 4.74197 2.06714L17.5232 9.06009C17.9445 9.29057 17.8302 9.92457 17.355 9.99355L11.0105 10.9145C10.8527 10.9374 10.7153 11.0342 10.6406 11.1752L7.40964 17.272C7.18605 17.694 6.55477 17.5923 6.47489 17.1216Z"
                                            fill="var(--archive-servicio-hero-cursor-color)" />
                                        <path
                                            d="M3.02285 2.75718C2.81967 1.55981 4.04211 0.646628 5.11855 1.13804L5.22207 1.1898L18.0033 8.18296C19.2669 8.87447 18.924 10.7758 17.4984 10.9828L11.4047 11.8666L8.29335 17.7406C7.6225 19.0061 5.7283 18.7007 5.48867 17.2884L3.02285 2.75718Z"
                                            stroke="white" stroke-width="2" />
                                    </g>
                                    <defs>
                                        <filter id="filter0_d_archive_servicio_desarrollador" x="0" y="0"
                                            width="21.7849" height="23.5392" filterUnits="userSpaceOnUse"
                                            color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feColorMatrix in="SourceAlpha" type="matrix"
                                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                            <feOffset dy="2" />
                                            <feGaussianBlur stdDeviation="1" />
                                            <feComposite in2="hardAlpha" operator="out" />
                                            <feColorMatrix type="matrix"
                                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                                            <feBlend mode="normal" in2="BackgroundImageFix"
                                                result="effect1_dropShadow_archive_servicio_desarrollador" />
                                            <feBlend mode="normal" in="SourceGraphic"
                                                in2="effect1_dropShadow_archive_servicio_desarrollador"
                                                result="shape" />
                                        </filter>
                                    </defs>
                                </svg>
                                <span class="archive-servicio-hero__cursor-label">Lập trình viên</span>
                            </div>
                            <div class="archive-servicio-hero__cursor archive-servicio-hero__cursor--ui js-archive-servicio-hero-cursor"
                                data-offset-x="-450" data-offset-y="150" data-cursor-delay="1300">
                                <svg preserveAspectRatio="none" width="15" height="17" viewBox="0 0 21.7849 23.5392"
                                    fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <g filter="url(#filter0_d_archive_servicio_ui)">
                                        <path
                                            d="M6.47489 17.1216L4.00903 2.58942C3.93912 2.17746 4.3754 1.86658 4.74197 2.06714L17.5232 9.06009C17.9445 9.29057 17.8302 9.92457 17.355 9.99355L11.0105 10.9145C10.8527 10.9374 10.7153 11.0342 10.6406 11.1752L7.40964 17.272C7.18605 17.694 6.55477 17.5923 6.47489 17.1216Z"
                                            fill="var(--archive-servicio-hero-cursor-color)" />
                                        <path
                                            d="M3.02285 2.75718C2.81967 1.55981 4.04211 0.646628 5.11855 1.13804L5.22207 1.1898L18.0033 8.18296C19.2669 8.87447 18.924 10.7758 17.4984 10.9828L11.4047 11.8666L8.29335 17.7406C7.6225 19.0061 5.7283 18.7007 5.48867 17.2884L3.02285 2.75718Z"
                                            stroke="white" stroke-width="2" />
                                    </g>
                                    <defs>
                                        <filter id="filter0_d_archive_servicio_ui" x="0" y="0" width="21.7849"
                                            height="23.5392" filterUnits="userSpaceOnUse"
                                            color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feColorMatrix in="SourceAlpha" type="matrix"
                                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                            <feOffset dy="2" />
                                            <feGaussianBlur stdDeviation="1" />
                                            <feComposite in2="hardAlpha" operator="out" />
                                            <feColorMatrix type="matrix"
                                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                                            <feBlend mode="normal" in2="BackgroundImageFix"
                                                result="effect1_dropShadow_archive_servicio_ui" />
                                            <feBlend mode="normal" in="SourceGraphic"
                                                in2="effect1_dropShadow_archive_servicio_ui" result="shape" />
                                        </filter>
                                    </defs>
                                </svg>
                                <span class="archive-servicio-hero__cursor-label">Thiết kế UI</span>
                            </div>
                        </div>

                        <div class="archive-servicio-hero__contenido">
                            <h1 class="archive-servicio-hero__titulo">${title}</h1>
                        </div>
                    </div>
                </section>`;
}
