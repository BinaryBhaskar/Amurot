(() => {
  const prefersReducedMotion = !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const lerp = (a, b, t) => a + (b - a) * t;

  // --- Blur/fade-in reveals ---------------------------------------------------
  (() => {
    const nodes = Array.from(document.querySelectorAll('.amurot-reveal'));
    if (nodes.length === 0) return;

    if (prefersReducedMotion) {
      for (const el of nodes) el.classList.add('is-revealed');
      return;
    }

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
  })();

  // --- Theme (auto/light/dark) ------------------------------------------------
  const THEME_KEY = 'amurot-theme';
  const themeButtons = Array.from(document.querySelectorAll('[data-theme-set]'));
  const media = window.matchMedia?.('(prefers-color-scheme: dark)');

  const normalizeMode = (value) => (value === 'light' || value === 'dark' || value === 'auto' ? value : 'auto');

  const resolveDark = (mode) => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return !!media?.matches;
  };

  const applyTheme = (mode) => {
    const normalized = normalizeMode(mode);
    const isDark = resolveDark(normalized);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

    for (const btn of themeButtons) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-theme-set') === normalized ? 'true' : 'false');
    }

    window.dispatchEvent(new CustomEvent('amurot:theme', { detail: { mode: normalized, isDark } }));
  };

  const storedTheme = (() => {
    try {
      return normalizeMode(localStorage.getItem(THEME_KEY));
    } catch {
      return 'auto';
    }
  })();

  if (themeButtons.length) {
    for (const btn of themeButtons) {
      btn.addEventListener('click', () => {
        const mode = normalizeMode(btn.getAttribute('data-theme-set'));
        try {
          localStorage.setItem(THEME_KEY, mode);
        } catch {
          // no-op
        }
        applyTheme(mode);
      });
    }

    media?.addEventListener?.('change', () => {
      const current = (() => {
        try {
          return normalizeMode(localStorage.getItem(THEME_KEY));
        } catch {
          return 'auto';
        }
      })();
      if (current === 'auto') applyTheme('auto');
    });

    applyTheme(storedTheme);
  }

  // --- Hero parallax ----------------------------------------------------------
  (() => {
    if (prefersReducedMotion) return;

    const layers = Array.from(document.querySelectorAll('[data-parallax-layer]'));
    if (layers.length === 0) return;

    const state = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      raf: 0,
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

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });

    setTarget(window.innerWidth / 2, window.innerHeight / 2);
  })();

  // --- Dot field that forms the logo -----------------------------------------
  const dotRoot = document.querySelector('[data-dotfield]');
  const dotCanvas = dotRoot?.querySelector('[data-dotfield-canvas]');
  if (!dotRoot || !(dotCanvas instanceof HTMLCanvasElement)) return;

  // Desktop/tablet only (hide + skip work on phones).
  const mdUp = window.matchMedia?.('(min-width: 768px)');
  if (!mdUp?.matches) return;

  const ctx = dotCanvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let dpr = 1;
  let width = 0;
  let height = 0;
  let running = false;
  let raf = 0;

  const pointer = { active: false, x: 0, y: 0 };
  let morph = 0;
  let morphTarget = 0;

  let scatterPoints = [];
  let logoPoints = [];
  let particles = [];

  const getPalette = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const styles = getComputedStyle(document.documentElement);
    const zinc = (isDark ? styles.getPropertyValue('--color-zinc-300') : styles.getPropertyValue('--color-zinc-500')).trim() || '#71717a';
    const zincStrong = (isDark ? styles.getPropertyValue('--color-zinc-200') : styles.getPropertyValue('--color-zinc-700')).trim() || '#3f3f46';
    const sky = (isDark ? styles.getPropertyValue('--color-sky-300') : styles.getPropertyValue('--color-sky-400')).trim() || '#38bdf8';
    const violet = (isDark ? styles.getPropertyValue('--color-violet-300') : styles.getPropertyValue('--color-violet-400')).trim() || '#a78bfa';
    const cyan = (isDark ? styles.getPropertyValue('--color-cyan-300') : styles.getPropertyValue('--color-cyan-400')).trim() || '#22d3ee';
    return { isDark, zinc, zincStrong, sky, violet, cyan };
  };

  let palette = getPalette();
  window.addEventListener('amurot:theme', () => {
    palette = getPalette();
    if (!running) drawStatic();
  });

  const resize = () => {
    const rect = dotRoot.getBoundingClientRect();
    dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));

    dotCanvas.width = Math.floor(width * dpr);
    dotCanvas.height = Math.floor(height * dpr);
    dotCanvas.style.width = `${width}px`;
    dotCanvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = clamp(Math.floor((width * height) / 1500), 360, 980);
    scatterPoints = new Array(count).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    if (logoPoints.length) {
      rebuildParticles();
    } else {
      particles = scatterPoints.map((p, i) => createParticle(i, p, p));
    }

    drawStatic();
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
    ctx.globalAlpha = palette.isDark ? 0.38 : 0.62;
    ctx.fillStyle = palette.zinc;
    for (const p of scatterPoints) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const loadLogoPoints = async () => {
    const url = new URL('assets/logo.svg', window.location.href);
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
    const step = 5;
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const idx = (y * size + x) * 4;
        const a = img.data[idx + 3];
        if (a > 16) pts.push({ x, y });
      }
    }
    if (pts.length < 40) throw new Error('Logo sampling too sparse');

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
    const pad = 18;
    const scale = Math.min((width - pad * 2) / boxW, (height - pad * 2) / boxH) * 0.84;
    const cx = width / 2;
    const cy = height / 2;
    const ox = (minX + maxX) / 2;
    const oy = (minY + maxY) / 2;

    // Shuffle for a more organic formation.
    for (let i = pts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = pts[i];
      pts[i] = pts[j];
      pts[j] = t;
    }

    // Map to canvas space.
    const mapped = pts.map((p) => ({
      x: cx + (p.x - ox) * scale,
      y: cy + (p.y - oy) * scale,
    }));

    // Downsample to match current density.
    const targetCount = scatterPoints.length;
    const stride = Math.max(1, Math.floor(mapped.length / targetCount));
    const picked = [];
    for (let i = 0; i < mapped.length && picked.length < targetCount; i += stride) {
      picked.push(mapped[i]);
    }
    return picked;
  };

  const step = () => {
    raf = 0;
    if (!running) return;

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

      const base = palette.isDark ? 0.42 : 0.55;
      const accentAlpha = palette.isDark ? 0.28 : 0.35;
      ctx.globalAlpha = p.accent === 'zinc' ? base : accentAlpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    // Stop once we've settled back into the idle scatter.
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
    const rect = dotRoot.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  };

  dotRoot.addEventListener('pointerenter', (e) => {
    pointer.active = true;
    setPointer(e);
    morphTarget = 1;
    start();
  });

  dotRoot.addEventListener('pointerleave', () => {
    pointer.active = false;
    morphTarget = 0;
  });

  dotRoot.addEventListener('pointermove', (e) => {
    if (!pointer.active) return;
    setPointer(e);
  }, { passive: true });

  dotRoot.addEventListener('focus', () => {
    morphTarget = 1;
    start();
  });

  dotRoot.addEventListener('blur', () => {
    morphTarget = 0;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) return;
      stop();
    },
    { threshold: 0.05 }
  );
  observer.observe(dotRoot);

  window.addEventListener('resize', resize, { passive: true });

  resize();
  loadLogoPoints()
    .then((points) => {
      logoPoints = points;
      rebuildParticles();
    })
    .catch(() => {
      // If the logo can't be sampled, keep the field as a calm scatter.
      logoPoints = scatterPoints;
      rebuildParticles();
    });
})();
