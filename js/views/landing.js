/* DivertiTEC — página de bienvenida animada (scroll cinematográfico). */
(function (DT) {
  'use strict';

  DT.views.landing = (app) => {
    const s = DT.state();
    const games = DT.gamesPublic();
    const covers = games.concat(games, games).slice(0, 18);
    const devs = s.users.filter((u) => u.role === 'dev').length;
    const totalAch = games.reduce((t, g) => t + (g.achievements || []).length, 0) + DT.PLATFORM_ACH.length;
    const rewardsShow = ['theme_cyber', 'frame_fire', 'av_dragon', 'fx_stars', 'em_crown', 'theme_arcade', 'badge_hackatec', 'frame_neon', 'av_ninja', 'theme_lava'];

    app.innerHTML = `
    <div class="landing">
      <section class="l-hero" data-hero>
        <div class="l-sky"></div>
        <canvas class="l-particles" data-particles></canvas>
        <div class="l-floaters" data-floaters>
          ${games.slice(0, 6).map((g, i) => `<div class="l-float f${i}" data-depth="${(i % 3) + 1}">${DT.coverHTML(g)}</div>`).join('')}
        </div>
        <div class="l-hero-content">
          <p class="l-kicker">InnovaTec · Hackatec regional 2026</p>
          <h1 class="l-title" aria-label="DivertiTEC">${'DIVERTITEC'.split('').map((c, i) => `<span style="--i:${i}">${c}</span>`).join('')}</h1>
          <p class="l-sub">Crea. Publica. Juega. La plataforma de videojuegos hecha por y para estudiantes.</p>
          <div class="l-cta">
            <a class="btn primary big" href="#/tienda">${DT.icon.play} Explorar la tienda</a>
            <a class="btn glass big" href="#/dev" data-asdev>${DT.icon.code} Publicar mi juego</a>
          </div>
        </div>
        <div class="l-scroll-hint"><span></span>Desliza</div>
      </section>

      <section class="l-reveal" data-scrub>
        <div class="l-sticky">
          <div class="l-collage" data-collage>
            ${covers.map((g) => DT.coverHTML(g)).join('')}
          </div>
          <div class="l-mask" data-mask><span>JUEGA</span></div>
          <div class="l-reveal-copy">
            <div class="l-step" data-step="0"><h2>Juega aquí mismo</h2><p>Los juegos HTML5 corren en tu navegador con un clic. Sin instalar nada.</p></div>
            <div class="l-step" data-step="1"><h2>HTML, C++ o ejecutables</h2><p>Publica en el formato que domines: web, nativo o instalador.</p></div>
            <div class="l-step" data-step="2"><h2>Cada logro cuenta</h2><p>Desbloquea temas, marcos, avatares, efectos y emojis jugando.</p></div>
          </div>
        </div>
      </section>

      <section class="l-stats">
        <div data-count="${games.length}"><b>0</b><span>juegos publicados</span></div>
        <div data-count="${devs}"><b>0</b><span>estudios creativos</span></div>
        <div data-count="${totalAch}"><b>0</b><span>logros por conseguir</span></div>
        <div data-count="${Object.keys(DT.REWARDS).length}"><b>0</b><span>recompensas desbloqueables</span></div>
      </section>

      <section class="l-roles">
        <h2 class="l-h2 in-view">Una plataforma, tres roles</h2>
        <div class="l-role-cards">
          <article class="l-role in-view" style="--d:0s"><div class="l-role-ico">🎮</div><h3>Jugadores</h3>
            <p>Tienda y biblioteca estilo Steam, tiempo de juego, reseñas con emojis desbloqueables y un perfil que presume tus logros.</p></article>
          <article class="l-role in-view" style="--d:.12s"><div class="l-role-ico">🛠️</div><h3>Desarrolladores</h3>
            <p>Sube tu juego, define logros con un SDK de una línea y diseña tu página con imágenes, GIFs y videos en cualquier forma.</p></article>
          <article class="l-role in-view" style="--d:.24s"><div class="l-role-ico">🛡️</div><h3>Administradores</h3>
            <p>Revisión de juegos, verificación de estudios, reportes, filtro de palabras y registro de actividad.</p></article>
        </div>
      </section>

      <section class="l-shapes">
        <div class="l-shapes-copy in-view">
          <h2 class="l-h2">Tu página, tus formas</h2>
          <p>Rectángulos, triángulos, hexágonos, estrellas o polígonos dibujados punto por punto. Arrastra, gira y apila tus imágenes dentro de tu espacio.</p>
          <a class="btn primary" href="#/dev" data-asdev>Abrir el editor</a>
        </div>
        <div class="l-morph-stage in-view">
          <div class="l-morph m1" style="${DT.coverStyle(games[0] || {})}"></div>
          <div class="l-morph m2" style="${DT.coverStyle(games[1] || {})}"></div>
          <div class="l-morph m3" style="${DT.coverStyle(games[2] || {})}"></div>
        </div>
      </section>

      <section class="l-rewards">
        <h2 class="l-h2 in-view">Recompensas que se sienten</h2>
        <div class="l-marquee"><div class="l-marquee-track">
          ${rewardsShow.concat(rewardsShow).map((id) => { const r = DT.REWARDS[id]; const rar = DT.RARITY[r.rarity]; return `<div class="l-reward" style="--rar:${rar.color}"><span>${r.glyph}</span><b>${DT.esc(r.name)}</b><small>${DT.REWARD_TYPES[r.type]} · ${rar.name}</small></div>`; }).join('')}
        </div></div>
      </section>

      <section class="l-featured">
        <h2 class="l-h2 in-view">Destacados</h2>
        <div class="l-feat-row">
          ${games.filter((g) => g.featured).concat(games.filter((g) => !g.featured)).slice(0, 4).map((g, i) => `
            <a class="l-feat in-view" style="--d:${i * .1}s" href="#/juego/${g.id}">${DT.coverHTML(g)}<div><b>${DT.esc(g.title)}</b><small>${DT.formatLabel[g.format]}</small></div></a>`).join('')}
        </div>
      </section>

      <footer class="l-footer">
        <div class="brand"><span class="brand-mark">D</span><span class="brand-name">Diverti<b>TEC</b></span></div>
        <p>Proyecto para InnovaTec · Hackatec regional 2026. Demostración offline: todos los datos viven en tu navegador.</p>
        <a class="btn primary big" href="#/tienda">Entrar a DivertiTEC</a>
      </footer>
    </div>`;

    DT.$$('[data-asdev]', app).forEach((a) => a.addEventListener('click', (e) => {
      if (DT.me().role === 'user') {
        e.preventDefault();
        DT.state().currentUserId = 'u_dev';
        DT.applyTheme();
        DT.emit('user');
        DT.toast('Cambiaste al rol <b>Desarrollador</b> (PixelForge Studio) para la demo.');
        DT.go('#/dev');
      }
    }));

    /* --- Parallax del héroe con el mouse --- */
    const floaters = DT.$$('.l-float', app);
    const onMouse = (e) => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      floaters.forEach((f) => { const d = +f.dataset.depth * 18; f.style.setProperty('--mx', (x * d) + 'px'); f.style.setProperty('--my', (y * d) + 'px'); });
    };
    addEventListener('pointermove', onMouse);

    /* --- Scroll: revelado con máscara gigante y pasos de texto --- */
    const scrub = DT.$('[data-scrub]', app);
    const mask = DT.$('[data-mask]', app);
    const collage = DT.$('[data-collage]', app);
    const steps = DT.$$('[data-step]', app);
    const hero = DT.$('[data-hero]', app);
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const hy = Math.min(1, scrollY / innerHeight);
        hero.style.setProperty('--h', hy.toFixed(3));
        const r = scrub.getBoundingClientRect();
        const total = r.height - innerHeight;
        const p = Math.max(0, Math.min(1, -r.top / total));
        // La palabra "JUEGA" crece hasta desaparecer revelando el collage (efecto logo-zoom)
        const zoomP = Math.min(1, p / .4);
        const scale = 1 + Math.pow(zoomP, 3) * 60;
        mask.style.transform = `translate(-50%,-50%) scale(${scale})`;
        mask.style.opacity = Math.max(0, Math.min(1, 1 - (zoomP - .55) / .45)).toFixed(3);
        collage.style.transform = `scale(${1.25 - zoomP * .25}) rotate(${-6 + p * 6}deg)`;
        collage.style.filter = `brightness(${.45 + zoomP * .25})`;
        steps.forEach((st, i) => {
          const a = .4 + i * .2;
          st.classList.toggle('on', p >= a && p < a + .2 || (i === steps.length - 1 && p >= a));
        });
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* --- Aparición al entrar en pantalla y contadores --- */
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('visible');
      if (en.target.dataset.count !== undefined) {
        const b = en.target.querySelector('b'); const target = +en.target.dataset.count; const t0 = performance.now();
        const step = (t) => { const k = Math.min(1, (t - t0) / 1200); b.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }
      io.unobserve(en.target);
    }), { threshold: .2 });
    DT.$$('.in-view, [data-count]', app).forEach((el) => io.observe(el));

    /* --- Partículas del héroe --- */
    const cv = DT.$('[data-particles]', app);
    const ctx = cv.getContext('2d');
    let W, H, dots, raf;
    const size = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; dots = Array.from({ length: Math.min(90, W / 14) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + .3, v: Math.random() * .4 + .1 })); };
    size();
    addEventListener('resize', size);
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#cfe4ff';
      dots.forEach((d) => { d.y -= d.v; if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; } ctx.globalAlpha = d.r / 2.2; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 7); ctx.fill(); });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      removeEventListener('pointermove', onMouse);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', size);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  };
})(window.DT);
