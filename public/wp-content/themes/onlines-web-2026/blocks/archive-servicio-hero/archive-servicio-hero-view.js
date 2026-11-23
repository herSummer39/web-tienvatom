/**
 * Archivo de servicios - Hero — View Script (Animaciones de frontend)
 *
 * 1. Grilla interactiva de fondo (componente compartido grilla-celdas).
 * 2. Cursores que entran escalonados (data-cursor-delay) y luego recorren su
 *    trayecto en loop, con un burst de click en algunos waypoints.
 *
 * Todas las animaciones continuas corren en un único RAF maestro (scheduler)
 * que se pausa con IntersectionObserver cuando el hero sale del viewport.
 * La intro arranca automáticamente al cargar la página, sin secuestrar el
 * scroll ni depender de ninguna interacción del usuario.
 *
 * 3. Fade in de la burbuja de comentario, con el retardo que declara cada
 *    elemento en data-fadein-delay.
 *
 * Es una versión reducida de blog-hero-view.js: este bloque no tiene la
 * selección tipo Figma sobre el título, así que no incluye esa lógica.
 */
(function () {
    'use strict';

    var HERO_SELECTOR = '.archive-servicio-hero';
    var GRID_SELECTOR = '.js-archive-servicio-hero-grilla';
    var CURSOR_SELECTOR = '.js-archive-servicio-hero-cursor';
    var FADEIN_SELECTOR = '.js-archive-servicio-hero-fadein';
    var MOBILE_QUERY = '(max-width: 1023px)';
    var MOBILE_PATH_SCALE = 0.5;
    var RESIZE_TIMEOUT = 180;

    /* Trayectos acotados a la caja de 550px del hero: a diferencia de blog-hero,
       los cursores no se escapan por arriba ni por abajo de la sección. */
    var CURSOR_PATHS = {
        ux: [[0, 0], [120, 90], [240, 20], [180, 160], [40, 220], [-60, 120], [0, 0]],
        desarrollador: [[0, 0], [-140, -120], [-260, 40], [-120, 160], [60, 120], [140, -40], [0, 0]],
        ui: [[0, 0], [160, -140], [300, -60], [220, 80], [60, 140], [-80, 60], [0, 0]]
    };

    /* En mobile el hero mantiene el alto pero es mucho más angosto: sin reducir
       el trayecto los cursores quedarían recortados contra los bordes. */
    var pathScale = window.matchMedia(MOBILE_QUERY).matches ? MOBILE_PATH_SCALE : 1;

    /* ---- Utilidades ---- */
    function easeInOutSine(t) {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function getCursorName(cursor) {
        var classes = cursor.className;
        var names = ['desarrollador', 'ux', 'ui'];
        for (var i = 0; i < names.length; i++) {
            if (classes.indexOf('--' + names[i]) !== -1) return names[i];
        }
        return 'ux';
    }

    /* =========================================================
       RAF MAESTRO (scheduler)
       Todas las tareas continuas se registran acá.
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

    /* ---- Fade in de la burbuja de comentario ---- */
    /* Mismo patrón que blog-hero: cada elemento declara su retardo y entra una
       sola vez. No entra al scheduler porque no tiene movimiento propio. */
    function animateFadeIn(hero) {
        var elements = hero.querySelectorAll(FADEIN_SELECTOR);

        elements.forEach(function (element) {
            var delay = parseInt(element.getAttribute('data-fadein-delay'), 10) || 0;

            window.setTimeout(function () {
                element.classList.add('is-visible');
            }, delay);
        });
    }

    /* ---- Cursores: aparecen escalonados y ya en movimiento ---- */
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
        var path = CURSOR_PATHS[name] || CURSOR_PATHS.ux;
        var currentIndex = 0;
        var phase = 'pause';
        var phaseStart = null;
        var clickTriggered = false;
        var fromPoint = null;
        var toPoint = null;
        /* Valor calculado que el flush escribe al DOM */
        var nextX = 0;
        var nextY = 0;

        /* pathScale se relee en cada waypoint, así el cambio de breakpoint
           entra en vigor sin reiniciar el loop. */
        function waypoint(wi) {
            return [path[wi][0] * pathScale, path[wi][1] * pathScale];
        }

        /* La entrada ES el primer tramo del recorrido: el cursor aparece ya
           desplazándose hacia el waypoint 1, sin detenerse en el punto base. */
        if (entryPoint) {
            phase = 'move';
            fromPoint = entryPoint;
            toPoint = waypoint(path.length > 1 ? 1 : 0);
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
                nextX = waypoint(currentIndex)[0];
                nextY = waypoint(currentIndex)[1];
            }

            if (phase === 'pause') {
                var pauseElapsed = timestamp - phaseStart;

                if (shouldClickOnWaypoint(currentIndex) && !clickTriggered && pauseElapsed >= 90) {
                    clickTriggered = true;
                    triggerClickBurst();
                }

                if (pauseElapsed >= getPauseDuration()) {
                    var nextIndex = (currentIndex + 1) % path.length;
                    fromPoint = waypoint(currentIndex);
                    toPoint = waypoint(nextIndex);
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

    /* ---- Orquestar animaciones ---- */
    function startHero(hero) {
        if (hero.getAttribute('data-archive-servicio-hero-started') === 'true') {
            return;
        }

        hero.setAttribute('data-archive-servicio-hero-started', 'true');
        hero.classList.add('is-started');

        animateCursorsIn(hero);
        animateFadeIn(hero);
    }

    /* ---- Init ---- */
    function initHero(hero) {
        initInteractiveGrid(hero);

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

        /* La intro arranca al cargar la página, sin esperar interacción */
        startHero(hero);
    }

    function init() {
        var heroes = document.querySelectorAll(HERO_SELECTOR);
        var resizeTimer = null;

        if (!heroes.length) return;

        heroes.forEach(function (hero) {
            initHero(hero);
        });

        /* La grilla registra sus propios listeners de resize. Acá solo se
           recalcula la escala del trayecto al cruzar el breakpoint. */
        window.addEventListener('resize', function () {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(function () {
                pathScale = window.matchMedia(MOBILE_QUERY).matches ? MOBILE_PATH_SCALE : 1;
            }, RESIZE_TIMEOUT);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
