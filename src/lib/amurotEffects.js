export function initAmurotEffects() {
  const cleanupFns = [];
  const onCleanup = (fn) => cleanupFns.push(fn);

  const prefersReducedMotion = !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const lerp = (a, b, t) => a + (b - a) * t;

  // --- Blur/fade-in reveals ---------------------------------------------------
  {
    const nodes = Array.from(document.querySelectorAll('.amurot-reveal'));

    if (nodes.length > 0) {
      if (prefersReducedMotion) {
        for (const el of nodes) el.classList.add('is-revealed');
      } else {
        const setDelay = (el) => {
          const delay = Number(el.getAttribute('data-reveal-delay'));
          if (Number.isFinite(delay) && delay > 0) {
            el.style.transitionDelay = `${Math.min(260, delay)}ms`;
          }
        };

        for (const el of nodes) setDelay(el);

        const io = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              entry.target.classList.add('is-revealed');
              io.unobserve(entry.target);
            }
          },
          { threshold: 0.14, rootMargin: '0px 0px -10% 0px' }
        );

        for (const el of nodes) io.observe(el);

        onCleanup(() => io.disconnect());
      }
    }
  }

  // --- Hero parallax ----------------------------------------------------------
  {
    if (!prefersReducedMotion) {
      const layers = Array.from(document.querySelectorAll('[data-parallax-layer]'));

      if (layers.length > 0) {
        const state = {
          targetX: 0,
          targetY: 0,
          currentX: 0,
          currentY: 0,
          raf: 0,
        };

        const tick = () => {
          state.raf = 0;

          const ease = 0.08;
          state.currentX += (state.targetX - state.currentX) * ease;
          state.currentY += (state.targetY - state.currentY) * ease;

          for (const el of layers) {
            const strength = Number(el.getAttribute('data-parallax-layer')) || 0;
            const tx = state.currentX * strength;
            const ty = state.currentY * strength;
            el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
          }

          const dx = Math.abs(state.targetX - state.currentX);
          const dy = Math.abs(state.targetY - state.currentY);
          if (dx > 0.001 || dy > 0.001) {
            state.raf = requestAnimationFrame(tick);
          }
        };

        const setTarget = (clientX, clientY) => {
          const x = (clientX / window.innerWidth) * 2 - 1;
          const y = (clientY / window.innerHeight) * 2 - 1;
          state.targetX = x;
          state.targetY = y;

          if (!state.raf) state.raf = requestAnimationFrame(tick);
        };

        const onMove = (event) => {
          setTarget(event.clientX, event.clientY);
        };

        const onLeave = () => {
          state.targetX = 0;
          state.targetY = 0;
          if (!state.raf) state.raf = requestAnimationFrame(tick);
        };

        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerleave', onLeave, { passive: true });

        onCleanup(() => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerleave', onLeave);
          if (state.raf) cancelAnimationFrame(state.raf);
        });

        setTarget(window.innerWidth / 2, window.innerHeight / 2);
      }
    }
  }

  // --- Dot field that forms the logo -----------------------------------------
  {
    const dotRoot = document.querySelector('[data-dotfield]');
    const dotCanvas = dotRoot?.querySelector('[data-dotfield-canvas]');
    if (!dotRoot || !(dotCanvas instanceof HTMLCanvasElement)) {
      return () => {
        for (const fn of cleanupFns.reverse()) fn();
      };
    }

    const dotHost = document.querySelector('[data-dotfield-host]') ?? dotRoot;

    const mdUp = window.matchMedia?.('(min-width: 768px)');
    if (!mdUp?.matches) {
      return () => {
        for (const fn of cleanupFns.reverse()) fn();
      };
    }

    const ctx = dotCanvas.getContext('2d', { alpha: true });
    if (!ctx) {
      return () => {
        for (const fn of cleanupFns.reverse()) fn();
      };
    }

    let dpr = 1;
    let width = 0;
    let height = 0;
    let running = false;
    let raf = 0;

    const pointer = { active: false, x: 0, y: 0 };
    let scrollActive = false;
    let focusActive = false;
    let scrollRaf = 0;
    let morph = 0;
    let morphTarget = 0;

    let scatterPoints = [];
    let logoPoints = [];
    let logoOutlinePoints = [];
    let particles = [];
    let logoSample = null;
    let logoSamplePromise = null;
    let textAvoidRects = [];

    const getPalette = () => {
      const styles = getComputedStyle(document.documentElement);
      const isDark = document.documentElement.classList.contains('dark');

      const zinc =
        (isDark ? styles.getPropertyValue('--color-zinc-300').trim() : styles.getPropertyValue('--color-zinc-500').trim()) ||
        (isDark ? '#d4d4d8' : '#71717a');
      const zincStrong =
        (isDark ? styles.getPropertyValue('--color-zinc-100').trim() : styles.getPropertyValue('--color-zinc-800').trim()) ||
        (isDark ? '#f4f4f5' : '#27272a');
      const sky = styles.getPropertyValue('--color-sky-400').trim() || '#38bdf8';
      const violet = styles.getPropertyValue('--color-violet-400').trim() || '#a78bfa';
      const cyan = styles.getPropertyValue('--color-cyan-400').trim() || '#22d3ee';
      return { zinc, zincStrong, sky, violet, cyan };
    };

    let palette = getPalette();
    let themeObserver = null;

    const rectDistance = (x, y, r) => {
      const dx = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
      const dy = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
      return Math.hypot(dx, dy);
    };

    const dotAlphaMask = (x, y) => {
      if (!textAvoidRects.length) return 1;

      const minOpacity = 0.16;
      const fadeRadius = 32;

      let mask = 1;
      for (const r of textAvoidRects) {
        const d = rectDistance(x, y, r);
        const t = clamp(d / fadeRadius, 0, 1);
        const m = minOpacity + (1 - minOpacity) * t;
        if (m < mask) mask = m;
        if (mask <= minOpacity) return minOpacity;
      }
      return mask;
    };

    const computeTextAvoidRects = () => {
      const hostRect = dotHost.getBoundingClientRect();
      const nodes = Array.from(dotHost.querySelectorAll('h2, p'));
      const pad = 14;
      const rects = [];

      for (const el of nodes) {
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;

        const left = r.left - hostRect.left - pad;
        const top = r.top - hostRect.top - pad;
        const right = r.right - hostRect.left + pad;
        const bottom = r.bottom - hostRect.top + pad;

        rects.push({
          left: clamp(left, 0, width),
          top: clamp(top, 0, height),
          right: clamp(right, 0, width),
          bottom: clamp(bottom, 0, height),
        });
      }

      textAvoidRects = rects;
    };

    const createParticle = (i, scatter, logo) => {
      const accentRoll = Math.random();
      const accent = accentRoll < 0.08 ? 'sky' : accentRoll < 0.14 ? 'violet' : accentRoll < 0.18 ? 'cyan' : 'zinc';
      return {
        i,
        x: scatter.x,
        y: scatter.y,
        vx: 0,
        vy: 0,
        scatter,
        logo,
        r: accent === 'zinc' ? 1.2 : 1.35,
        accent,
      };
    };

    const rebuildParticles = () => {
      const n = Math.min(scatterPoints.length, logoPoints.length);
      particles = new Array(n);
      for (let i = 0; i < n; i++) {
        particles[i] = createParticle(i, scatterPoints[i], logoPoints[i]);
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = palette.zinc;
      const isDark = document.documentElement.classList.contains('dark');
      const baseAlpha = isDark ? 0.36 : 0.42;
      const r = isDark ? 1.2 : 1.05;
      for (const p of scatterPoints) {
        ctx.globalAlpha = baseAlpha * dotAlphaMask(p.x, p.y);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loadLogoSample = async () => {
      const url = new URL('/logo.svg', window.location.origin);
      const response = await fetch(url, { cache: 'force-cache' });
      if (!response.ok) throw new Error('Logo SVG fetch failed');
      const svgText = await response.text();

      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      const objectUrl = URL.createObjectURL(blob);
      const imgEl = new Image();
      imgEl.decoding = 'async';
      imgEl.src = objectUrl;
      await new Promise((resolve, reject) => {
        imgEl.onload = () => resolve();
        imgEl.onerror = () => reject(new Error('Logo SVG image decode failed'));
      });
      URL.revokeObjectURL(objectUrl);

      const size = 240;
      const off = document.createElement('canvas');
      off.width = size;
      off.height = size;
      const offCtx = off.getContext('2d');
      if (!offCtx) throw new Error('Offscreen context failed');

      offCtx.clearRect(0, 0, size, size);
      offCtx.drawImage(imgEl, 0, 0, size, size);

      const img = offCtx.getImageData(0, 0, size, size);
      const pts = [];
      const outline = [];
      const step = 4;
      const threshold = 18;
      const alphaAt = (x, y) => {
        if (x < 0 || y < 0 || x >= size || y >= size) return 0;
        return img.data[(y * size + x) * 4 + 3];
      };

      for (let y = 0; y < size; y += step) {
        for (let x = 0; x < size; x += step) {
          const a = alphaAt(x, y);
          if (a <= threshold) continue;
          pts.push({ x, y });

          const n1 = alphaAt(x + step, y);
          const n2 = alphaAt(x - step, y);
          const n3 = alphaAt(x, y + step);
          const n4 = alphaAt(x, y - step);
          if (n1 <= threshold || n2 <= threshold || n3 <= threshold || n4 <= threshold) {
            outline.push({ x, y });
          }
        }
      }

      if (pts.length < 60) throw new Error('Logo sampling too sparse');

      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      for (const p of pts) {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      }

      const boxW = Math.max(1, maxX - minX);
      const boxH = Math.max(1, maxY - minY);
      const ox = (minX + maxX) / 2;
      const oy = (minY + maxY) / 2;

      for (let i = pts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = pts[i];
        pts[i] = pts[j];
        pts[j] = t;
      }

      return { pts, outline, bounds: { boxW, boxH, ox, oy } };
    };

    const getLogoAnchor = (pad) => {
      const titleEl = dotHost.querySelector('#about-title');
      if (!titleEl) return { hasTitle: false, desiredCx: width / 2, desiredTop: pad };

      const hostRect = dotHost.getBoundingClientRect();
      const titleRect = titleEl.getBoundingClientRect();

      const desiredLeft = titleRect.left - hostRect.left;
      const desiredCx = desiredLeft + titleRect.width / 2;
      const titleBottom = titleRect.bottom - hostRect.top;
      const gap = 12;
      const desiredTop = titleBottom + gap;

      return { hasTitle: true, desiredCx, desiredLeft, desiredTop };
    };

    const computeLogoPoints = (sample) => {
      const { pts, outline, bounds } = sample;
      const { boxW, boxH, ox, oy } = bounds;

      const pad = 18;
      const { hasTitle, desiredCx, desiredLeft, desiredTop } = getLogoAnchor(pad);

      const availableW = Math.max(1, width - pad * 2);
      const availableH = hasTitle ? Math.max(1, height - desiredTop - pad) : Math.max(1, height - pad * 2);
      const scale = Math.min(availableW / boxW, availableH / boxH) * 0.92;

      const logoW = boxW * scale;
      const logoH = boxH * scale;

      let cx = desiredCx;
      let cy = hasTitle ? desiredTop + logoH / 2 : height / 2;

      if (hasTitle && Number.isFinite(desiredLeft)) {
        cx = desiredLeft + logoW / 2;
      }

      const minCx = pad + logoW / 2;
      const maxCx = width - pad - logoW / 2;
      const minCy = pad + logoH / 2;
      const maxCy = height - pad - logoH / 2;

      cx = minCx > maxCx ? width / 2 : clamp(cx, minCx, maxCx);
      cy = minCy > maxCy ? height / 2 : clamp(cy, minCy, maxCy);

      const mapPoint = (p) => ({
        x: cx + (p.x - ox) * scale,
        y: cy + (p.y - oy) * scale,
      });

      const mapped = pts.map(mapPoint);
      const mappedOutline = outline.map(mapPoint);

      const targetCount = scatterPoints.length;
      const stride = Math.max(1, Math.floor(mapped.length / targetCount));
      const picked = [];
      for (let i = 0; i < mapped.length && picked.length < targetCount; i += stride) {
        picked.push(mapped[i]);
      }

      const outlineTarget = clamp(Math.floor(targetCount * 0.45), 260, 720);
      const outlineStride = Math.max(1, Math.floor(mappedOutline.length / outlineTarget));
      const pickedOutline = [];
      for (let i = 0; i < mappedOutline.length && pickedOutline.length < outlineTarget; i += outlineStride) {
        pickedOutline.push(mappedOutline[i]);
      }

      return { fillPoints: picked, outlinePoints: pickedOutline };
    };

    const step = () => {
      raf = 0;
      if (!running) return;

      const isDark = document.documentElement.classList.contains('dark');

      morph += (morphTarget - morph) * 0.06;
      morph = clamp(morph, 0, 1);

      ctx.clearRect(0, 0, width, height);

      const radius = Math.min(width, height) * 0.28;
      const invR = 1 / Math.max(1, radius);

      for (const p of particles) {
        const tx = lerp(p.scatter.x, p.logo.x, morph);
        const ty = lerp(p.scatter.y, p.logo.y, morph);

        let px = tx;
        let py = ty;

        if (pointer.active) {
          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < radius) {
            const k = (1 - dist * invR) ** 2;
            const strength = (9 + (1 - morph) * 8) * k;
            px += (dx / (dist + 0.001)) * strength;
            py += (dy / (dist + 0.001)) * strength;
          }
        }

        const accel = 0.09;
        p.vx += (px - p.x) * accel;
        p.vy += (py - p.y) * accel;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;

        const color =
          p.accent === 'sky'
            ? palette.sky
            : p.accent === 'violet'
              ? palette.violet
              : p.accent === 'cyan'
                ? palette.cyan
                : palette.zincStrong;

        const base = isDark ? 0.56 : 0.72;
        const accentAlpha = isDark ? 0.32 : 0.26;
        const mask = dotAlphaMask(p.x, p.y);
        ctx.globalAlpha = (p.accent === 'zinc' ? base : accentAlpha) * mask;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if ((pointer.active || morphTarget === 1) && logoOutlinePoints.length) {
        const outlineAlpha = (isDark ? 0.18 : 0.14) * morph;
        if (outlineAlpha > 0.01) {
          ctx.fillStyle = palette.zincStrong;
          for (const o of logoOutlinePoints) {
            ctx.globalAlpha = outlineAlpha * dotAlphaMask(o.x, o.y);
            ctx.beginPath();
            ctx.arc(o.x, o.y, 1.05, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;

      if (!pointer.active && morphTarget === 0 && morph < 0.02) {
        stop();
        return;
      }

      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (prefersReducedMotion) {
        drawStatic();
        return;
      }
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(step);
    };

    const stop = () => {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const setPointer = (event) => {
      const rect = dotHost.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const updateMorphTarget = () => {
      const next = pointer.active || scrollActive || focusActive ? 1 : 0;
      if (next === morphTarget) return;
      morphTarget = next;
      if (morphTarget === 1) start();
    };

    const updateScrollActive = () => {
      const rect = dotHost.getBoundingClientRect();
      const mid = window.innerHeight * 0.5;

      const active = rect.top < mid - 100 && rect.bottom > 0;
      if (active === scrollActive) return;
      scrollActive = active;
      updateMorphTarget();
    };

    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        updateScrollActive();
      });
    };

    const resize = () => {
      const rect = dotHost.getBoundingClientRect();
      dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      dotCanvas.width = Math.floor(width * dpr);
      dotCanvas.height = Math.floor(height * dpr);
      dotCanvas.style.width = `${width}px`;
      dotCanvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      palette = getPalette();
      computeTextAvoidRects();

      const count = clamp(Math.floor((width * height) / 420), 620, 1400);
      scatterPoints = new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
      }));

      if (logoSample) {
        const { fillPoints, outlinePoints } = computeLogoPoints(logoSample);
        logoPoints = fillPoints;
        logoOutlinePoints = outlinePoints;
        rebuildParticles();
      } else {
        particles = scatterPoints.map((p, i) => createParticle(i, p, p));
      }

      drawStatic();
    };

    const onThemeChange = () => {
      palette = getPalette();
      if (!running) drawStatic();
    };

    const onPointerEnter = (e) => {
      pointer.active = true;
      setPointer(e);
      updateMorphTarget();
    };

    const onPointerLeave = () => {
      pointer.active = false;
      updateMorphTarget();
    };

    const onPointerMove = (e) => {
      if (!pointer.active) return;
      setPointer(e);
    };

    const onFocus = () => {
      focusActive = true;
      updateMorphTarget();
    };

    const onBlur = () => {
      focusActive = false;
      updateMorphTarget();
    };

    dotHost.addEventListener('pointerenter', onPointerEnter);
    dotHost.addEventListener('pointerleave', onPointerLeave);
    dotHost.addEventListener('pointermove', onPointerMove, { passive: true });
    dotHost.addEventListener('focus', onFocus);
    dotHost.addEventListener('blur', onBlur);

    onCleanup(() => {
      dotHost.removeEventListener('pointerenter', onPointerEnter);
      dotHost.removeEventListener('pointerleave', onPointerLeave);
      dotHost.removeEventListener('pointermove', onPointerMove);
      dotHost.removeEventListener('focus', onFocus);
      dotHost.removeEventListener('blur', onBlur);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) return;
        stop();
      },
      { threshold: 0.05 }
    );
    observer.observe(dotHost);

    onCleanup(() => observer.disconnect());

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    onCleanup(() => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      stop();
    });

    if (window.MutationObserver) {
      themeObserver = new MutationObserver(() => onThemeChange());
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
      onCleanup(() => themeObserver?.disconnect());
    }

    resize();
    updateScrollActive();

    logoSamplePromise = loadLogoSample();
    logoSamplePromise
      .then((sample) => {
        logoSample = sample;
        const { fillPoints, outlinePoints } = computeLogoPoints(sample);
        logoPoints = fillPoints;
        logoOutlinePoints = outlinePoints;
        rebuildParticles();
      })
      .catch(() => {
        logoSample = null;
        logoPoints = scatterPoints;
        logoOutlinePoints = [];
        rebuildParticles();
      });
  }

  return () => {
    for (const fn of cleanupFns.reverse()) fn();
  };
}
