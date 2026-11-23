/**
 * Fondo con shader — View Script (Frontend)
 *
 * Solo actúa cuando el bloque quedó sin imagen destacada y, por lo tanto, sin
 * media ni shader: en ese caso el render PHP imprime el contenedor de la
 * grilla y agrega el modificador --grilla al bloque.
 *
 * El dibujo y el resaltado los resuelve el componente compartido
 * blocks/grilla-celdas/, declarado como dependencia en fondo-shader-view.asset.php.
 * Ese componente ya maneja su propio resize y su listener de mousemove, así que
 * acá no hace falta scheduler ni IntersectionObserver.
 */
(function () {
    'use strict';

    var BLOQUE_SELECTOR = '.fondo-shader--grilla';
    var GRID_SELECTOR = '.js-fondo-shader-grilla';

    function initBloque(bloque) {
        var contenedor = bloque.querySelector(GRID_SELECTOR);

        if (!contenedor || !window.onlinesGrillaCeldas) return;

        window.onlinesGrillaCeldas.init({ contenedor: contenedor });

        /* Dispara el fade de entrada definido en fondo-shader.css */
        bloque.classList.add('is-started');
    }

    function init() {
        var bloques = document.querySelectorAll(BLOQUE_SELECTOR);

        bloques.forEach(function (bloque) {
            initBloque(bloque);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
