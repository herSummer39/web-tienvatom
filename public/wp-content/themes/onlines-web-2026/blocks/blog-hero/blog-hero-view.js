/**
 * Blog Hero — View Script (Animaciones de frontend)
 *
 * 1. Cursores entran escalonados (data-cursor-delay), luego se mueven en loop.
 * 2. Comentarios aparecen con fade-in escalonado (data-fadein-delay).
 * 3. Grilla interactiva de fondo (componente compartido grilla-celdas).
 * 4. Secuencia de selección tipo Figma sobre la frase destacada del título.
 *
 * Todas las animaciones continuas corren en un único RAF maestro (scheduler)
 * que se pausa con IntersectionObserver cuando el hero sale del viewport.
 * La intro arranca automáticamente al cargar la página, sin secuestrar el scroll
 * ni depender de ninguna interacción del usuario.
 */
(function () {
    'use strict';

    var HERO_SELECTOR = '.blog-hero';
    var GRID_SELECTOR = '.js-blog-hero-grilla';
    var CURSOR_SELECTOR = '.js-blog-hero-cursor';
    var FADEIN_SELECTOR = '.js-blog-hero-fadein';
    var SELECCION_SELECTOR = '.js-blog-hero-seleccion';
    var TITULO_WRAP_SELECTOR = '.blog-hero__titulo-wrap';
    var TITULO_HIGHLIGHT_SELECTOR = '.blog-hero__titulo .js-blog-hero-highlight, .blog-hero__titulo strong';
    var RESIZE_TIMEOUT = 180;

    var CURSOR_PATHS = {
        desarrollador: [[0, 0], [180, -280], [-150, -400], [250, -150], [-200, 60], [80, 120], [0, 0]],
        cliente: [[0, 0], [-220, -180], [-350, 50], [-120, 200], [100, 280], [200, 60], [0, 0]],
        director: [[0, 0], [200, 150], [350, -80], [150, -250], [-100, -300], [-250, -100], [0, 0]],
        ui: [[0, 0], [300, -120], [400, 100], [200, 280], [-50, 200], [-150, 50], [0, 0]],
        ux: [[0, 0], [-180, -220], [80, -350], [280, -180], [320, 60], [120, 180], [0, 0]],
        pm: [[0, 0], [-250, 150], [-350, -60], [-180, -250], [60, -300], [200, -80], [0, 0]],
        desarrollador2: [[0, 0], [150, -320], [-120, -280], [-300, -60], [-180, 150], [60, 200], [0, 0]]
    };

    /* ---- Utilidades ---- */
    function easeInOutSine(t) {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function getCursorName(cursor) {
        var classes = cursor.className;
        var names = ['desarrollador2', 'desarrollador', 'cliente', 'director', 'ui', 'ux', 'pm'];
        for (var i = 0; i < names.length; i++) {
            if (classes.indexOf('--' + names[i]) !== -1) return names[i];
        }
        return 'desarrollador';
    }

    /* =========================================================
       RAF MAESTRO (scheduler)
       Todas las tareas continuas se registran aquí.
       Un único requestAnimationFrame activo mientras haya tareas.
       pause() / resume() controla el ciclo completo (IntersectionObserver).
       Una tarea se auto-elimina retornando false desde su función.
       ========================================================= */
    var scheduler = (function () {
        var tasks = [];
        var rafId = null;
        var paused = false;

        function loop(now) {
            for (var i = tasks.length - 1; i >= 0; i--) {
                if (tasks[i](now) === false) {
                    tasks.splice(i, 1);
                }
            }
            if (tasks.length > 0 && !paused) {
                rafId = window.requestAnimationFrame(loop);
            } else {
                rafId = null;
            }
        }

        function kick() {
            if (!paused && tasks.length > 0 && rafId === null) {
                rafId = window.requestAnimationFrame(loop);
            }
        }

        return {
            add: function (fn) {
                if (tasks.indexOf(fn) === -1) tasks.push(fn);
                kick();
            },
            remove: function (fn) {
                var idx = tasks.indexOf(fn);
                if (idx !== -1) tasks.splice(idx, 1);
            },
            pause: function () {
                paused = true;
                if (rafId) {
                    window.cancelAnimationFrame(rafId);
                    rafId = null;
                }
            },
            resume: function () {
                paused = false;
                kick();
            }
        };
    })();

    /* ---- Grilla interactiva ---- */
    /* La resuelve el componente compartido blocks/grilla-celdas/: las líneas son
       fondo CSS y el resaltado usa un pool de divs reciclados, en vez de crear
       un div por celda. */
    function initInteractiveGrid(hero) {
        var gridContainer = hero.querySelector(GRID_SELECTOR);
        if (!gridContainer || !window.onlinesGrillaCeldas) return;

        window.onlinesGrillaCeldas.init({ contenedor: gridContainer });
    }

    /* ---- 1. Cursores: aparecen escalonados y ya en movimiento ---- */
    function animateCursorsIn(hero) {
        var cursors = hero.querySelectorAll(CURSOR_SELECTOR);
        if (!cursors.length) return;

        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        cursors.forEach(function (cursor, index) {
            var offsetX = parseInt(cursor.getAttribute('data-offset-x'), 10) || 0;
            var offsetY = parseInt(cursor.getAttribute('data-offset-y'), 10) || 0;
            var cursorDelay = parseInt(cursor.getAttribute('data-cursor-delay'), 10) || 0;
            var startX = offsetX * 3;
            var startY = offsetY * 3;

            if (reduceMotion) {
                cursor.style.transform = 'translate(0, 0)';
                cursor.classList.add('is-visible');
                return;
            }

            cursor.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)';

            /* Cada cursor arranca por su cuenta: ninguno espera a los demás */
            window.setTimeout(function () {
                cursor.classList.add('is-visible');
                startCursorLoop(cursor, index, [startX, startY]);
            }, cursorDelay);
        });
    }

    function startCursorLoop(cursor, index, entryPoint) {
        var name = getCursorName(cursor);
        var path = CURSOR_PATHS[name] || CURSOR_PATHS.desarrollador;
        var currentIndex = 0;
        var phase = 'pause';
        var phaseStart = null;
        var clickTriggered = false;
        var fromPoint = null;
        var toPoint = null;
        /* Valor calculado que el flush escribe al DOM */
        var nextX = 0;
        var nextY = 0;

        /* La entrada ES el primer tramo del recorrido: el cursor aparece ya
           desplazándose hacia el waypoint 1, sin detenerse en el punto base. */
        if (entryPoint) {
            phase = 'move';
            fromPoint = entryPoint;
            toPoint = path[1] || path[0];
        }

        function triggerClickBurst() {
            cursor.classList.add('is-clicking');
            window.setTimeout(function () {
                if (cursor.isConnected) cursor.classList.remove('is-clicking');
            }, 220);
        }

        function shouldClickOnWaypoint(wi) {
            return wi !== 0 && wi % 2 === index % 2;
        }

        function getPauseDuration() {
            return 420 + ((index + currentIndex) % 3) * 140;
        }

        function getMoveDuration() {
            return 1500 + (index * 130) + ((currentIndex % 2) * 180);
        }

        function tick(timestamp) {
            /* Retorna false para auto-eliminarse del scheduler si el elemento desapareció */
            if (!cursor.isConnected) return false;

            if (phaseStart === null) {
                phaseStart = timestamp;
                nextX = path[currentIndex][0];
                nextY = path[currentIndex][1];
            }

            if (phase === 'pause') {
                var pauseElapsed = timestamp - phaseStart;

                if (shouldClickOnWaypoint(currentIndex) && !clickTriggered && pauseElapsed >= 90) {
                    clickTriggered = true;
                    triggerClickBurst();
                }

                if (pauseElapsed >= getPauseDuration()) {
                    var nextIndex = (currentIndex + 1) % path.length;
                    fromPoint = path[currentIndex];
                    toPoint = path[nextIndex];
                    phase = 'move';
                    phaseStart = timestamp;
                    clickTriggered = false;
                }
            } else {
                var moveElapsed = timestamp - phaseStart;
                var moveProgress = Math.min(moveElapsed / getMoveDuration(), 1);
                var easedProgress = easeInOutSine(moveProgress);

                nextX = lerp(fromPoint[0], toPoint[0], easedProgress);
                nextY = lerp(fromPoint[1], toPoint[1], easedProgress);

                if (moveProgress >= 1) {
                    currentIndex = (currentIndex + 1) % path.length;
                    phase = 'pause';
                    phaseStart = timestamp;
                    clickTriggered = false;
                }
            }

            /* Escritura DOM: única operación por frame para este cursor */
            cursor.style.transform = 'translate(' + nextX.toFixed(1) + 'px, ' + nextY.toFixed(1) + 'px)';
        }

        scheduler.add(tick);
    }

    /* ---- 2. Fade in de comentarios según data-fadein-delay ---- */
    function animateFadeIn(hero) {
        var elements = hero.querySelectorAll(FADEIN_SELECTOR);

        elements.forEach(function (element) {
            var delay = parseInt(element.getAttribute('data-fadein-delay'), 10) || 0;

            window.setTimeout(function () {
                element.classList.add('is-visible');
            }, delay);
        });
    }

    /* ---- 3. Secuencia de selección tipo Figma ---- */
    function positionSelection(hero) {
        var seleccion = hero.querySelector(SELECCION_SELECTOR);
        var tituloWrap = hero.querySelector(TITULO_WRAP_SELECTOR);
        var highlight = hero.querySelector(TITULO_HIGHLIGHT_SELECTOR);
        var wrapRect;
        var strongRect;
        var isMobile = window.matchMedia('(max-width: 1023px)').matches;
        var paddingX = isMobile ? 6 : 12;
        var paddingY = 6;

        if (!seleccion || !tituloWrap || !highlight) return;

        wrapRect = tituloWrap.getBoundingClientRect();
        strongRect = highlight.getBoundingClientRect();

        if (!wrapRect.width || !strongRect.width) return;

        seleccion.style.left = (strongRect.left - wrapRect.left - paddingX) + 'px';
        seleccion.style.top = (strongRect.top - wrapRect.top - paddingY) + 'px';
        seleccion.style.width = (strongRect.width + (paddingX * 2)) + 'px';
        seleccion.style.height = (strongRect.height + (paddingY * 2)) + 'px';
    }

    function startSelection(hero) {
        var seleccion = hero.querySelector(SELECCION_SELECTOR);
        var fondo;

        if (!seleccion) return;

        fondo = seleccion.querySelector('.blog-hero__seleccion-fondo');
        seleccion.classList.add('is-selecting');

        if (!fondo) return;

        fondo.addEventListener('animationend', function onAnimationEnd() {
            fondo.removeEventListener('animationend', onAnimationEnd);
            seleccion.classList.remove('is-selecting');
            seleccion.classList.add('is-selected');
        });
    }

    /* ---- Orquestar animaciones ---- */
    function startHero(hero) {
        if (hero.getAttribute('data-blog-hero-started') === 'true') {
            return;
        }

        hero.setAttribute('data-blog-hero-started', 'true');
        hero.classList.add('is-started');

        animateCursorsIn(hero);
        animateFadeIn(hero);

        /* Como la intro arranca al cargar, los 1400ms pueden vencer con la
           tipografía todavía intercambiándose. Esperar a document.fonts.ready
           evita medir el tramo destacado con la fuente de fallback. */
        window.setTimeout(function () {
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(function () {
                    positionSelection(hero);
                    startSelection(hero);
                });
                return;
            }

            positionSelection(hero);
            startSelection(hero);
        }, 1400);
    }

    /* ---- Init ---- */
    function initHero(hero) {
        var resizeTimer = null;

        initInteractiveGrid(hero);
        positionSelection(hero);

        /* Pausar el scheduler cuando el hero sale del viewport */
        if ('IntersectionObserver' in window) {
            var heroObserver = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    scheduler.resume();
                } else {
                    scheduler.pause();
                }
            }, { threshold: 0 });
            heroObserver.observe(hero);
        }

        /* La grilla se reconstruye sola: initInteractiveGrid registra sus propios
           listeners de resize/orientationchange. Acá solo reubicamos la selección. */
        window.addEventListener('resize', function () {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(function () {
                positionSelection(hero);
            }, RESIZE_TIMEOUT);
        });

        /* La intro arranca al cargar la página, sin esperar interacción */
        startHero(hero);
    }

    function init() {
        var heroes = document.querySelectorAll(HERO_SELECTOR);

        heroes.forEach(function (hero) {
            initHero(hero);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
