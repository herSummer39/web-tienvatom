(() => {
    const MATRIX_MAP = {
        '2x2': {
            size: 2,
            values: [0, 2, 3, 1],
        },
        '4x4': {
            size: 4,
            values: [
                0, 8, 2, 10,
                12, 4, 14, 6,
                3, 11, 1, 9,
                15, 7, 13, 5,
            ],
        },
        '8x8': {
            size: 8,
            values: [
                0, 32, 8, 40, 2, 34, 10, 42,
                48, 16, 56, 24, 50, 18, 58, 26,
                12, 44, 4, 36, 14, 46, 6, 38,
                60, 28, 52, 20, 62, 30, 54, 22,
                3, 35, 11, 43, 1, 33, 9, 41,
                51, 19, 59, 27, 49, 17, 57, 25,
                15, 47, 7, 39, 13, 45, 5, 37,
                63, 31, 55, 23, 61, 29, 53, 21,
            ],
        },
    };

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const clamp01 = (value) => clamp(value, 0, 1);
    const toNumber = (value, fallback) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    let colorParserContext = null;

    const getColorParserContext = () => {
        if (colorParserContext) {
            return colorParserContext;
        }

        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        colorParserContext = canvas.getContext('2d');
        return colorParserContext;
    };

    const parseCssColor = (value) => {
        if (!value) {
            return null;
        }

        if (value.charAt(0) === '#') {
            if (value.length === 4) {
                return {
                    r: parseInt(value.charAt(1) + value.charAt(1), 16),
                    g: parseInt(value.charAt(2) + value.charAt(2), 16),
                    b: parseInt(value.charAt(3) + value.charAt(3), 16),
                };
            }

            if (value.length === 7) {
                return {
                    r: parseInt(value.slice(1, 3), 16),
                    g: parseInt(value.slice(3, 5), 16),
                    b: parseInt(value.slice(5, 7), 16),
                };
            }
        }

        const matches = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);

        if (!matches) {
            return null;
        }

        return {
            r: Number(matches[1]),
            g: Number(matches[2]),
            b: Number(matches[3]),
        };
    };

    const parseColor = (value, fallback) => {
        const context = getColorParserContext();

        if (!context) {
            return fallback;
        }

        const fallbackValue = 'rgb(' + fallback.r + ', ' + fallback.g + ', ' + fallback.b + ')';

        try {
            context.fillStyle = fallbackValue;
            context.fillStyle = value || fallbackValue;
            return parseCssColor(context.fillStyle) || fallback;
        } catch (error) {
            return fallback;
        }
    };

    const mixChannel = (start, end, amount) => Math.round(start + ((end - start) * amount));

    const mixColors = (start, end, amount) => ({
        r: mixChannel(start.r, end.r, amount),
        g: mixChannel(start.g, end.g, amount),
        b: mixChannel(start.b, end.b, amount),
    });

    const getGradientColor = (back, front, highlight, amount) => {
        const safeAmount = clamp01(amount);

        if (safeAmount <= 0.5) {
            return mixColors(back, front, safeAmount / 0.5);
        }

        return mixColors(front, highlight, (safeAmount - 0.5) / 0.5);
    };

    const orderedQuantize = (value, steps, threshold) => {
        const safeValue = clamp01(value);

        if (steps <= 1) {
            return safeValue > threshold ? 1 : 0;
        }

        const scaled = safeValue * (steps - 1);
        const base = Math.floor(scaled);
        const fraction = scaled - base;
        const index = Math.min(steps - 1, base + (fraction > threshold ? 1 : 0));
        return index / (steps - 1);
    };

    const getThreshold = (type, x, y) => {
        if (type === 'random') {
            const seed = Math.sin(((x + 1) * 12.9898) + ((y + 1) * 78.233)) * 43758.5453;
            return seed - Math.floor(seed);
        }

        const matrix = MATRIX_MAP[type] || MATRIX_MAP['4x4'];
        const size = matrix.size;
        const value = matrix.values[((y % size) * size) + (x % size)];
        return (value + 0.5) / (size * size);
    };

    const getDrawRect = (config, sourceWidth, sourceHeight, targetWidth, targetHeight) => {
        const sourceRatio = sourceWidth / sourceHeight;
        const targetRatio = targetWidth / targetHeight;

        let baseWidth = 0;
        let baseHeight = 0;

        if (config.fit === 'contain') {
            if (sourceRatio > targetRatio) {
                baseWidth = targetWidth;
                baseHeight = baseWidth / sourceRatio;
            } else {
                baseHeight = targetHeight;
                baseWidth = baseHeight * sourceRatio;
            }
        } else if (sourceRatio > targetRatio) {
            baseHeight = targetHeight;
            baseWidth = baseHeight * sourceRatio;
        } else {
            baseWidth = targetWidth;
            baseHeight = baseWidth / sourceRatio;
        }

        const scaledWidth = baseWidth * config.scale;
        const scaledHeight = baseHeight * config.scale;

        return {
            x: (targetWidth - scaledWidth) / 2,
            y: (targetHeight - scaledHeight) / 2,
            width: scaledWidth,
            height: scaledHeight,
        };
    };

    const normalizeConfig = (inputConfig) => ({
        imageUrl: inputConfig.imageUrl || '',
        width: Math.max(1, Math.round(toNumber(inputConfig.width, 1280))),
        height: Math.max(1, Math.round(toNumber(inputConfig.height, 720))),
        colorBack: inputConfig.colorBack || '#000c38',
        colorFront: inputConfig.colorFront || '#94ffaf',
        colorHighlight: inputConfig.colorHighlight || '#eaff94',
        originalColors: inputConfig.originalColors !== false,
        inverted: Boolean(inputConfig.inverted),
        type: ['random', '2x2', '4x4', '8x8'].includes(inputConfig.type) ? inputConfig.type : '4x4',
        size: clamp(toNumber(inputConfig.size, 1), 0.5, 20),
        colorSteps: clamp(Math.round(toNumber(inputConfig.colorSteps, 4)), 1, 7),
        scale: clamp(toNumber(inputConfig.scale, 0.8), 0.1, 4),
        fit: inputConfig.fit === 'contain' ? 'contain' : 'cover',
    });

    const createSource = (image) => {
        const sourceWidth = image.naturalWidth || image.width;
        const sourceHeight = image.naturalHeight || image.height;
        const limit = 1800;
        const factor = Math.min(1, limit / Math.max(sourceWidth, sourceHeight));
        const width = Math.max(1, Math.round(sourceWidth * factor));
        const height = Math.max(1, Math.round(sourceHeight * factor));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
            return null;
        }

        context.drawImage(image, 0, 0, width, height);

        return {
            width,
            height,
            data: context.getImageData(0, 0, width, height).data,
        };
    };

    const renderShaderFrame = (stage, canvas, source, config) => {
        const cssWidth = Math.max(1, Math.round(stage.clientWidth || config.width));
        const cssHeight = Math.max(1, Math.round(stage.clientHeight || config.height));
        let logicalWidth = Math.max(1, Math.round(cssWidth / config.size));
        let logicalHeight = Math.max(1, Math.round(cssHeight / config.size));
        const maxPixels = 1000000;
        const totalPixels = logicalWidth * logicalHeight;

        if (totalPixels > maxPixels) {
            const ratio = Math.sqrt(maxPixels / totalPixels);
            logicalWidth = Math.max(1, Math.round(logicalWidth * ratio));
            logicalHeight = Math.max(1, Math.round(logicalHeight * ratio));
        }

        canvas.width = logicalWidth;
        canvas.height = logicalHeight;

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        context.imageSmoothingEnabled = false;

        const imageData = context.createImageData(logicalWidth, logicalHeight);
        const buffer = imageData.data;
        const sourceData = source.data;
        const sourceWidth = source.width;
        const sourceHeight = source.height;
        const drawRect = getDrawRect(config, sourceWidth, sourceHeight, logicalWidth, logicalHeight);
        const steps = config.colorSteps;

        const back = parseColor(config.colorBack, { r: 0, g: 12, b: 56 });
        const front = parseColor(config.colorFront, { r: 148, g: 255, b: 175 });
        const highlight = parseColor(config.colorHighlight, { r: 234, g: 255, b: 148 });

        for (let y = 0; y < logicalHeight; y += 1) {
            for (let x = 0; x < logicalWidth; x += 1) {
                const index = ((y * logicalWidth) + x) * 4;
                let red = back.r;
                let green = back.g;
                let blue = back.b;

                if (
                    x >= drawRect.x &&
                    x <= drawRect.x + drawRect.width &&
                    y >= drawRect.y &&
                    y <= drawRect.y + drawRect.height
                ) {
                    const sampleX = clamp(Math.round(((x - drawRect.x) / drawRect.width) * (sourceWidth - 1)), 0, sourceWidth - 1);
                    const sampleY = clamp(Math.round(((y - drawRect.y) / drawRect.height) * (sourceHeight - 1)), 0, sourceHeight - 1);
                    const sourceIndex = ((sampleY * sourceWidth) + sampleX) * 4;
                    const alpha = sourceData[sourceIndex + 3] / 255;
                    const baseRed = Math.round((sourceData[sourceIndex] * alpha) + (back.r * (1 - alpha)));
                    const baseGreen = Math.round((sourceData[sourceIndex + 1] * alpha) + (back.g * (1 - alpha)));
                    const baseBlue = Math.round((sourceData[sourceIndex + 2] * alpha) + (back.b * (1 - alpha)));
                    const threshold = getThreshold(config.type, x, y);

                    if (config.originalColors) {
                        let qRed = orderedQuantize(baseRed / 255, steps, threshold);
                        let qGreen = orderedQuantize(baseGreen / 255, steps, threshold);
                        let qBlue = orderedQuantize(baseBlue / 255, steps, threshold);

                        if (config.inverted) {
                            qRed = 1 - qRed;
                            qGreen = 1 - qGreen;
                            qBlue = 1 - qBlue;
                        }

                        red = Math.round(qRed * 255);
                        green = Math.round(qGreen * 255);
                        blue = Math.round(qBlue * 255);
                    } else {
                        const luminance = ((0.2126 * baseRed) + (0.7152 * baseGreen) + (0.0722 * baseBlue)) / 255;
                        const tone = orderedQuantize(config.inverted ? 1 - luminance : luminance, steps, threshold);
                        const color = getGradientColor(back, front, highlight, tone);
                        red = color.r;
                        green = color.g;
                        blue = color.b;
                    }
                }

                buffer[index] = red;
                buffer[index + 1] = green;
                buffer[index + 2] = blue;
                buffer[index + 3] = 255;
            }
        }

        context.putImageData(imageData, 0, 0);
    };

    const loadImage = (src) => new Promise((resolve, reject) => {
        if (!src) {
            reject(new Error('missing-image'));
            return;
        }

        const image = new Image();
        image.decoding = 'async';

        if (/^https?:\/\//i.test(src)) {
            image.crossOrigin = 'anonymous';
        }

        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('image-load-failed'));
        image.src = src;

        if (image.complete && image.naturalWidth > 0) {
            resolve(image);
        }
    });

    const mountShader = (stage, canvas, rawConfig) => {
        const config = normalizeConfig(rawConfig || {});
        let destroyed = false;
        let animationFrame = 0;
        let resizeObserver = null;
        let source = null;

        const scheduleRender = () => {
            if (destroyed || !source) {
                return;
            }

            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
            }

            animationFrame = window.requestAnimationFrame(() => {
                if (!destroyed) {
                    stage.classList.remove('is-loading', 'is-error');
                    renderShaderFrame(stage, canvas, source, config);
                }
            });
        };

        const onResize = () => {
            scheduleRender();
        };

        stage.classList.add('is-loading');

        loadImage(config.imageUrl)
            .then((image) => {
                if (destroyed) {
                    return;
                }

                source = createSource(image);

                if (!source) {
                    throw new Error('image-source-failed');
                }

                scheduleRender();

                if ('ResizeObserver' in window) {
                    resizeObserver = new ResizeObserver(onResize);
                    resizeObserver.observe(stage);
                }

                window.addEventListener('resize', onResize);
                window.addEventListener('orientationchange', onResize);
            })
            .catch(() => {
                if (destroyed) {
                    return;
                }

                stage.classList.remove('is-loading');
                stage.classList.add('is-error');
            });

        return () => {
            destroyed = true;

            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
            }

            if (resizeObserver) {
                resizeObserver.disconnect();
            }

            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
        };
    };

    const instances = new WeakMap();

    const initStage = (stage) => {
        if (!stage || instances.has(stage)) {
            return;
        }

        const canvas = stage.querySelector('.js-shader-canvas');
        if (!canvas) {
            return;
        }

        let config = {};

        try {
            config = JSON.parse(stage.getAttribute('data-shader-config') || '{}');
        } catch (error) {
            stage.classList.add('is-error');
            return;
        }

        instances.set(stage, mountShader(stage, canvas, config));
    };

    const initAllShaders = (root = document) => {
        root.querySelectorAll('.js-shader').forEach((stage) => {
            initStage(stage);
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
        initAllShaders();

        if ('MutationObserver' in window) {
            const observer = new MutationObserver((entries) => {
                entries.forEach((entry) => {
                    entry.addedNodes.forEach((node) => {
                        if (!(node instanceof HTMLElement)) {
                            return;
                        }

                        if (node.matches('.js-shader')) {
                            initStage(node);
                            return;
                        }

                        initAllShaders(node);
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    });
})();