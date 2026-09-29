/* DivierteTEC — animaciones de la interfaz.
   - Inclinación 3D con brillo al pasar el cursor por tarjetas.
   - Entrada escalonada de rejillas al navegar y contadores que suben.
   - Onda al presionar botones.
   - Ráfaga de confeti angular (logros, compras, reseñas, aprobaciones).
   - Apertura del reproductor en círculo desde el punto del clic.
   Todo se desactiva con "reducir movimiento" del sistema. */
(function (DT) {
  'use strict';

  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fx = DT.fx = {};

  /* ---------- Inclinación 3D ---------- */
  const TILT = '.game-card, .play-card, .reward-card, .lib-tile, .l-feat, .dev-game, .kpi, .plan, .l-node';
  let tilted = null;
  document.addEventListener('pointermove', (e) => {
    if (reduced() || e.pointerType === 'touch') return;
    const el = e.target.closest && e.target.closest(TILT);
    if (tilted && tilted !== el) { tilted.style.removeProperty('--rx'); tilted.style.removeProperty('--ry'); tilted.classList.remove('tilting'); }
    tilted = el;
    if (!el) return;
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.classList.add('tilting');
    el.style.setProperty('--rx', ((0.5 - y) * 10).toFixed(2) + 'deg');
    el.style.setProperty('--ry', ((x - 0.5) * 12).toFixed(2) + 'deg');
    el.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
    el.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
  }, { passive: true });

  /* ---------- Onda en botones y posición del último clic ---------- */
  let lastPoint = { x: innerWidth / 2, y: innerHeight / 2 };
  document.addEventListener('pointerdown', (e) => {
    lastPoint = { x: e.clientX, y: e.clientY };
    if (reduced()) return;
    const b = e.target.closest && e.target.closest('.btn, .chip, .play-go');
    if (!b) return;
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2;
    const w = document.createElement('span');
    w.className = 'ripple';
    w.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    b.appendChild(w);
    setTimeout(() => w.remove(), 650);
  }, { passive: true });
  fx.lastPoint = () => lastPoint;

  /* ---------- Confeti angular ---------- */
  let cv = null, ctx = null, parts = [], raf = 0;
  const COLORS = ['#3d8fff', '#ffd23f', '#ff3ea5', '#5bff8a', '#ffffff', '#ff7a1a', '#a35cff'];
  const loop = () => {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter((p) => p.life > 0);
    parts.forEach((p) => {
      p.life -= 1; p.vy += 0.28; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.globalAlpha = Math.min(1, p.life / 25); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
      if (p.tri) { ctx.beginPath(); ctx.moveTo(0, -p.s); ctx.lineTo(p.s, p.s); ctx.lineTo(-p.s, p.s); ctx.fill(); } else ctx.fillRect(-p.s, -p.s / 2.5, p.s * 2, p.s / 1.25);
      ctx.restore();
    });
    if (parts.length) raf = requestAnimationFrame(loop); else { raf = 0; cv.style.display = 'none'; }
  };
  fx.burst = (x, y, opts) => {
    if (reduced()) return;
    opts = opts || {};
    if (!cv) { cv = document.createElement('canvas'); cv.className = 'fx-canvas'; document.body.appendChild(cv); ctx = cv.getContext('2d'); }
    cv.width = innerWidth; cv.height = innerHeight; cv.style.display = 'block';
    const n = opts.count || 70, colors = opts.colors || COLORS;
    for (let i = 0; i < n; i++) {
      const a = (opts.up ? -Math.PI / 2 : 0) + (Math.random() - 0.5) * (opts.up ? 1.6 : Math.PI * 2), v = 4 + Math.random() * (opts.power || 9);
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (opts.up ? 2 : 3), s: 3 + Math.random() * 5, c: colors[i % colors.length], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, life: 70 + Math.random() * 40, tri: Math.random() < 0.4 });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  };
  fx.burstAt = (el, opts) => { if (!el) return; const r = el.getBoundingClientRect(); fx.burst(r.left + r.width / 2, r.top + r.height / 2, opts); };

  /* ---------- Entrada escalonada y contadores al navegar ---------- */
  const STAGGER = '.grid, .reward-grid, .l-play-row, .review-list, .lib-grid, .dev-games, .crit-groups, .pass-games, .kpis';
  fx.enter = (root) => {
    if (reduced() || !root) return;
    root.querySelectorAll(STAGGER).forEach((grid) => {
      Array.from(grid.children).slice(0, 24).forEach((c, i) => { c.style.setProperty('--si', i); c.classList.add('stagger-in'); });
    });
    root.querySelectorAll('.kpi b, .profile-stats b').forEach((b) => {
      const m = /^(\$?)([\d,.]+)(.*)$/.exec(b.textContent.trim());
      if (!m || b.children.length) return;
      const target = parseFloat(m[2].replace(/,/g, '')); if (!isFinite(target) || target === 0) return;
      const dec = (m[2].split('.')[1] || '').length, t0 = performance.now();
      const step = (t) => { const k = Math.min(1, (t - t0) / 900), v = target * (1 - Math.pow(1 - k, 3)); b.textContent = m[1] + v.toLocaleString('es-MX', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + m[3]; if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  };
})(window.DT);
