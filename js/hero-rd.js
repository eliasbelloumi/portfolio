/**
 * hero-voronoi.js — Animated Voronoi diagram
 *
 * ~32 sites oscillate in slow sinusoidal motion (no random drift,
 * so the pattern breathes organically without chaotic jumps).
 * Each Voronoi cell is recomputed every frame via Sutherland-Hodgman
 * half-plane clipping — exact geometry, O(n²) but fast for n=32.
 *
 * Aesthetic: biological tissue / cells under a fluorescence microscope.
 * Capped at ~24 fps since motion is imperceptibly slow at 60 fps.
 */
(function () {
  'use strict';

  const canvas = document.getElementById('hero-rd-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Config ────────────────────────────────────────────────────
  const N_SITES = 32;
  const AMP     = 30;      // oscillation amplitude (px)
  const FREQ    = 0.00032; // base oscillation frequency
  const FRAME   = 42;      // ms per frame cap (~24 fps)

  // Palette
  const COL_BORDER = [14, 165, 201];   // #0EA5C9
  const COL_NUC    = [124, 92, 191];   // #7C5CBF

  let W, H, sites;

  // ── Half-plane clipping (Sutherland-Hodgman) ─────────────────
  function clipCell(poly, si, sj) {
    if (poly.length === 0) return poly;
    const mx = (si.x + sj.x) * 0.5;
    const my = (si.y + sj.y) * 0.5;
    const nx = sj.x - si.x;
    const ny = sj.y - si.y;

    const inside  = p => nx * (p.x - mx) + ny * (p.y - my) <= 0;
    const isect   = (a, b) => {
      const dx = b.x - a.x, dy = b.y - a.y;
      const d  = nx * dx + ny * dy;
      if (Math.abs(d) < 1e-9) return null;
      const t = (nx * (mx - a.x) + ny * (my - a.y)) / d;
      return { x: a.x + t * dx, y: a.y + t * dy };
    };

    const out = [];
    for (let k = 0; k < poly.length; k++) {
      const a = poly[k];
      const b = poly[(k + 1) % poly.length];
      const aIn = inside(a), bIn = inside(b);
      if (aIn) out.push(a);
      if (aIn !== bIn) { const p = isect(a, b); if (p) out.push(p); }
    }
    return out;
  }

  const BBOX = () => [
    { x: -10, y: -10 }, { x: W + 10, y: -10 },
    { x: W + 10, y: H + 10 }, { x: -10, y: H + 10 }
  ];

  function voronoiCell(idx) {
    let poly = BBOX();
    const si = sites[idx];
    for (let j = 0; j < sites.length; j++) {
      if (j === idx) continue;
      poly = clipCell(poly, si, sites[j]);
      if (poly.length === 0) return poly;
    }
    return poly;
  }

  // ── Site placement (Poisson-like grid + jitter) ───────────────
  function buildSites() {
    sites = [];
    const cols = Math.round(Math.sqrt(N_SITES * W / H));
    const rows = Math.ceil(N_SITES / cols);
    const cw   = W / cols;
    const ch   = H / rows;

    outer: for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (sites.length >= N_SITES) break outer;
        const cx = (c + 0.25 + Math.random() * 0.5) * cw;
        const cy = (r + 0.25 + Math.random() * 0.5) * ch;
        sites.push({
          cx, cy,
          x: cx, y: cy,
          phX: Math.random() * Math.PI * 2,
          phY: Math.random() * Math.PI * 2,
          fm:  0.65 + Math.random() * 0.7,   // individual freq multiplier
          fo:  0.018 + Math.random() * 0.025, // cell fill opacity
          nr:  1.6 + Math.random() * 1.4,     // nucleus radius
        });
      }
    }
  }

  function resize() {
    W = canvas.offsetWidth  || 800;
    H = canvas.offsetHeight || 600;
    canvas.width  = W;
    canvas.height = H;
    buildSites();
  }

  // ── Render ────────────────────────────────────────────────────
  function render(ts) {
    const t = ts * FREQ;
    ctx.clearRect(0, 0, W, H);

    // Advance sites
    for (const s of sites) {
      s.x = s.cx + AMP * Math.sin(t * s.fm + s.phX);
      s.y = s.cy + AMP * Math.cos(t * s.fm * 0.71 + s.phY);
    }

    // Cells
    ctx.lineWidth = 0.65;
    for (let i = 0; i < sites.length; i++) {
      const s    = sites[i];
      const poly = voronoiCell(i);
      if (poly.length < 3) continue;

      ctx.beginPath();
      ctx.moveTo(poly[0].x, poly[0].y);
      for (let k = 1; k < poly.length; k++) ctx.lineTo(poly[k].x, poly[k].y);
      ctx.closePath();

      ctx.fillStyle   = `rgba(${COL_BORDER[0]},${COL_BORDER[1]},${COL_BORDER[2]},${s.fo.toFixed(3)})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${COL_BORDER[0]},${COL_BORDER[1]},${COL_BORDER[2]},0.22)`;
      ctx.stroke();
    }

    // Nuclei (cell centres)
    for (const s of sites) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.nr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COL_NUC[0]},${COL_NUC[1]},${COL_NUC[2]},0.55)`;
      ctx.fill();
    }
  }

  // ── Reduced-motion ────────────────────────────────────────────
  if (reduced) {
    resize();
    render(0);
    return;
  }

  // ── Loop (24 fps cap, pauses off-screen) ─────────────────────
  let running = true, last = 0;
  function loop(ts) {
    if (!running) return;
    requestAnimationFrame(loop);
    if (ts - last < FRAME) return;
    last = ts;
    render(ts);
  }

  const heroEl = document.getElementById('hero');
  if (heroEl) {
    new IntersectionObserver(entries => {
      running = entries[0].isIntersecting;
      if (running) requestAnimationFrame(loop);
    }, { threshold: 0.01 }).observe(heroEl);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 250);
  }, { passive: true });

  resize();
  requestAnimationFrame(loop);
})();
