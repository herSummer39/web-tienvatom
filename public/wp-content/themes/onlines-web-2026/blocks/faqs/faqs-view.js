(function () {
    'use strict';

    /* El JS sólo togglea la clase del ítem y sincroniza aria-expanded. No mide
       alturas: la animación del desplegable es del CSS, con
       grid-template-rows de 0fr a 1fr. */

    const cerrar = (item) => {
        item.classList.remove('faqs__item--activo');

        const boton = item.querySelector('.js-faqs-toggle');

        if (boton) {
            boton.setAttribute('aria-expanded', 'false');
        }
    };

    const iniciarBloque = (bloque) => {
        const lista = bloque.querySelector('.faqs__lista');

        if (!lista) {
            return;
        }

        const toggles = lista.querySelectorAll('.js-faqs-toggle');

        if (!toggles.length) {
            return;
        }

        toggles.forEach((toggle) => {
            toggle.addEventListener('click', () => {
                const item = toggle.closest('.faqs__item');

                if (!item) {
                    return;
                }

                const estabaAbierto = item.classList.contains('faqs__item--activo');

                /* Abrir una cierra las demás */
                lista.querySelectorAll('.faqs__item').forEach(cerrar);

                if (estabaAbierto) {
                    return;
                }

                item.classList.add('faqs__item--activo');
                toggle.setAttribute('aria-expanded', 'true');
            });
        });
    };

    /* El scope es por instancia: dos acordeones en la misma página no se pisan. */
    const iniciar = () => {
        const bloques = document.querySelectorAll('.faqs');

        if (!bloques.length) {
            return;
        }

        bloques.forEach(iniciarBloque);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
        return;
    }

    iniciar();
})();
