/* DivierteTEC — temas de página y efectos visuales desbloqueables. */
(function (DT) {
  'use strict';

  DT.THEMES = {
    light: { name: 'Institucional (claro)', glyph: '☀️', free: true },
    dark: { name: 'Oscuro', glyph: '🌙', free: true },
    arcade: { name: 'Retro Arcade', reward: 'theme_arcade' },
    cyber: { name: 'Neón Cyberpunk', reward: 'theme_cyber' },
    gameboy: { name: 'Pixel Boy', reward: 'theme_gameboy' },
    space: { name: 'Galaxia', reward: 'theme_space' },
    lava: { name: 'Volcán', reward: 'theme_lava' }
  };

  DT.applyTheme = () => {
    const eq = DT.equipped();
    const theme = eq.theme && DT.THEMES[eq.theme] ? eq.theme : 'light';
    document.documentElement.dataset.theme = theme;
    DT.effects.set(eq.effect || '');
  };

  DT.setTheme = (theme) => {
    DT.equipped().theme = theme;
    DT.applyTheme();
    DT.emit('theme');
  };

  DT.toggleDark = () => {
    const eq = DT.equipped();
    DT.setTheme(eq.theme === 'dark' ? 'light' : 'dark');
  };

  /* ---------- Efectos de partículas que siguen al cursor ---------- */
  DT.effects = (() => {
    let canvas, ctx, kind = '', parts = [], raf = 0, last = 0;
    const palettes = {
      sparkle: ['#ffd76a', '#fff3b0', '#ffb321'],
      pixels: ['#3d8fff', '#ff3ea5', '#5bd16b', '#ffd23f'],
      stars: ['#ffffff', '#b7a9ff', '#8be9ff'],
      fire: ['#ff5a1f', '#ffb321', '#ff2a00']
    };
    const onMove = (e) => {
      const now = performance.now();
      if (now - last < 16) return;
      last = now;
      const pal = palettes[kind];
      for (let i = 0; i < 2; i++) {
        parts.push({
          x: e.clientX, y: e.clientY,
          vx: (Math.random() - .5) * 1.6, vy: kind === 'fire' ? -Math.random() * 2 - .5 : (Math.random() - .5) * 1.6,
          life: 1, size: kind === 'pixels' ? 5 : Math.random() * 3 + 2,
          c: pal[Math.floor(Math.random() * pal.length)]
        });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const star = (x, y, r) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r / 2.4 : r;
        ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      ctx.closePath(); ctx.fill();
    };
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts = parts.filter((p) => p.life > 0);
      parts.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.life -= .025;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.c;
        if (kind === 'pixels') ctx.fillRect(Math.round(p.x / 5) * 5, Math.round(p.y / 5) * 5, p.size, p.size);
        else if (kind === 'stars') star(p.x, p.y, p.size * 1.6);
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill(); }
      });
      raf = parts.length ? requestAnimationFrame(tick) : 0;
    };
    const resize = () => { if (canvas) { canvas.width = innerWidth; canvas.height = innerHeight; } };
    return {
      set(k) {
        if (k === kind) return;
        kind = k;
        if (!k) { document.removeEventListener('pointermove', onMove); if (canvas) canvas.remove(); canvas = null; return; }
        if (!canvas) {
          canvas = document.createElement('canvas');
          canvas.id = 'fx-canvas';
          document.body.appendChild(canvas);
          ctx = canvas.getContext('2d');
          resize();
          addEventListener('resize', resize);
        }
        document.removeEventListener('pointermove', onMove);
        document.addEventListener('pointermove', onMove);
      }
    };
  })();
})(window.DT);
