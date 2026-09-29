/* DivierteTEC — página de bienvenida animada (scroll cinematográfico). */
(function (DT) {
  'use strict';

  DT.views.landing = (app) => {
    const s = DT.state();
    const games = DT.gamesPublic();
    const covers = games.concat(games, games).slice(0, 18);
    const instant = games.filter((g) => DT.isInstant(g));
    const star = DT.game('g_furia') && instant.includes(DT.game('g_furia')) ? DT.game('g_furia') : instant[0];
    const devs = s.users.filter((u) => u.role === 'dev').length;
    const secs = Object.values(s.library).reduce((t, lib) => t + Object.values(lib).reduce((a, e) => a + (e.playtime || 0), 0), 0);
    const plays = games.reduce((t, g) => t + (g.plays || 0), 0);
    const paid = Math.round((DT.financeSummary ? DT.financeSummary().toDevs : 0) || 0);
    const e = DT.econ();
    const rewardsShow = ['theme_cyber', 'frame_fire', 'av_dragon', 'fx_stars', 'em_crown', 'theme_arcade', 'badge_hackatec', 'frame_neon', 'av_ninja', 'theme_lava', 'av_pato', 'em_punch'];
    const CAMPUS = [['Irapuato', 'Búho Blanco', 28, 50], ['Celaya', 'Lince', 64, 46], ['León', 'León', 42, 22], ['Roque', 'Carnero', 88, 60], ['Uriangato', 'Halcón', 42, 84], ['Abasolo', 'Jaguar', 10, 76], ['Purísima del Rincón', 'Gato Negro', 14, 14], ['San Miguel de Allende', 'Coyote', 80, 16], ['Salvatierra', 'Puma', 74, 86]];
    const LINKS = [[0, 1], [0, 2], [0, 5], [2, 6], [1, 3], [1, 7], [3, 8], [4, 5], [4, 8], [0, 4], [6, 0], [7, 3]];
    const playBtn = (g, label) => `<button class="btn success big" data-act="play" data-gid="${g.id}">${DT.icon.play} ${label || 'Jugar'}</button>`;

    app.innerHTML = `
    <div class="landing">
      <section class="l-hero" data-hero>
        <div class="l-sky"></div>
        <canvas class="l-particles" data-particles></canvas>
        <div class="l-floaters" data-floaters>
          ${games.slice(0, 6).map((g, i) => `<div class="l-float f${i}" data-depth="${(i % 3) + 1}">${DT.coverHTML(g)}</div>`).join('')}
        </div>
        <div class="l-hero-content">
          <p class="l-kicker">Industria mexicana del entretenimiento · InnovaTec Hackatec 2026</p>
          <h1 class="l-title" aria-label="DivierteTEC">${'DIVIERTETEC'.split('').map((c, i) => `<span style="--i:${i}">${c}</span>`).join('')}</h1>
          <p class="l-sub"><b>Juega lo que se crea en México.</b> Juegos hechos por estudiantes de los Tecnológicos, listos para jugar en tu navegador. Cada partida impulsa a un estudio.</p>
          <div class="l-cta">
            ${star ? `<button class="btn l-play" data-act="play" data-gid="${star.id}"><span class="l-play-ico">${DT.icon.play}</span><span><b>JUGAR AHORA</b><small>${DT.esc(star.title)} · al instante, sin descargar</small></span></button>` : ''}
            <a class="btn glass big" href="#/tienda">${DT.icon.grid} Ver todos los juegos</a>
          </div>
        </div>
        <div class="l-scroll-hint"><span></span>Desliza</div>
      </section>

      <section class="l-oneclick">
        <h2 class="l-h2 in-view">Juega en 1 clic</h2>
        <p class="l-lead in-view">Sin instalar ni esperar. Juega gratis y, si te gusta, <b>paga lo que quieras</b> para apoyar al estudio.</p>
        <div class="l-play-row">
          ${instant.map((g, i) => `<article class="play-card in-view" style="--d:${i * .07}s">
            <a href="#/juego/${g.id}" class="play-art">${DT.coverHTML(g)}</a>
            <div class="play-body"><b>${DT.esc(g.title)}</b><small>${DT.esc(g.genre)} · ${DT.esc((DT.user(g.devId) || {}).name || '')}</small></div>
            <button class="play-go" data-act="play" data-gid="${g.id}" aria-label="Jugar ${DT.esc(g.title)}">${DT.icon.play}</button>
          </article>`).join('')}
        </div>
      </section>

      <section class="l-reveal" data-scrub>
        <div class="l-sticky">
          <div class="l-collage" data-collage>
            ${covers.map((g) => DT.coverHTML(g)).join('')}
          </div>
          <div class="l-mask" data-mask><span>JUEGA</span></div>
          <div class="l-reveal-copy">
            <div class="l-step" data-step="0"><h2>Juega aquí mismo</h2><p>Los juegos HTML5 corren en tu navegador con un clic. Sin instalar nada.</p></div>
            <div class="l-step" data-step="1"><h2>Hecho en México</h2><p>Detrás de cada juego hay un estudio estudiantil de los Tecnológicos de Guanajuato.</p></div>
            <div class="l-step" data-step="2"><h2>Cada logro cuenta</h2><p>Desbloquea temas, marcos, avatares, efectos y stickers mientras juegas.</p></div>
          </div>
        </div>
      </section>

      <section class="l-stats">
        <div data-count="${instant.length}"><b>0</b><span>juegos para jugar ya</span></div>
        <div data-count="${plays}"><b>0</b><span>partidas jugadas</span></div>
        <div data-count="${devs}"><b>0</b><span>estudios mexicanos</span></div>
        <div data-count="${paid}" data-prefix="$"><b>0</b><span>MXN pagados a estudios</span></div>
      </section>

      <section class="l-impact">
        <h2 class="l-h2 in-view">Cada partida impulsa a un estudio mexicano</h2>
        <div class="l-flow">
          <div class="l-node in-view" style="--d:0s"><span class="l-node-ico">${DT.icon.gamepad}</span><b>Paga lo que quieras</b><small>Los juegos gratuitos se juegan ya; aporta desde $0 al estudio que te gustó.</small></div>
          <svg class="l-arrow" viewBox="0 0 60 24" aria-hidden="true"><path d="M0 12h50M40 2l12 10-12 10" fill="none" stroke="currentColor" stroke-width="4"/></svg>
          <div class="l-node in-view" style="--d:.12s"><span class="l-node-ico">${DT.icon.coin}</span><b>${Math.round((1 - e.rateStudent) * 100)} % al estudio</b><small>De cada venta; 0 % de comisión en sus primeros ${DT.money(e.seedAllowance)} (Semilla TEC).</small></div>
          <svg class="l-arrow" viewBox="0 0 60 24" aria-hidden="true"><path d="M0 12h50M40 2l12 10-12 10" fill="none" stroke="currentColor" stroke-width="4"/></svg>
          <div class="l-node in-view" style="--d:.24s"><span class="l-node-ico">${DT.icon.ticket}</span><b>${Math.round(e.passDevShare * 100)} % del Pase</b><small>Se reparte entre estudios según el tiempo que juegas.</small></div>
          <svg class="l-arrow" viewBox="0 0 60 24" aria-hidden="true"><path d="M0 12h50M40 2l12 10-12 10" fill="none" stroke="currentColor" stroke-width="4"/></svg>
          <div class="l-node in-view" style="--d:.36s"><span class="l-node-ico">${DT.icon.rocket}</span><b>Nuevos juegos</b><small>El talento se queda en México y crea más.</small></div>
        </div>
        <p class="l-note in-view">Cifras de esta demostración: ${DT.fmtTime(secs)} jugadas en la plataforma · dinero simulado.</p>
      </section>

      <section class="l-campus">
        <div class="l-campus-copy in-view">
          <h2 class="l-h2">Hecho en los Tecnológicos de Guanajuato</h2>
          <p>Nueve campus, nueve mascotas, un mismo talento. Todas pelean juntas en <b>Furia TEC</b>.</p>
          ${DT.game('g_furia') ? playBtn(DT.game('g_furia'), 'Pelear con las mascotas') : ''}
        </div>
        <svg class="l-net in-view" viewBox="0 0 100 100" aria-label="Red de Tecnológicos de Guanajuato">
          ${LINKS.map(([a, b]) => `<line x1="${CAMPUS[a][2]}" y1="${CAMPUS[a][3]}" x2="${CAMPUS[b][2]}" y2="${CAMPUS[b][3]}" class="l-net-line"/>`).join('')}
          ${CAMPUS.map(([c, m, x, y], i) => `<g class="l-net-node" style="--d:${i * .15}s"><circle cx="${x}" cy="${y}" r="3.2"/><circle cx="${x}" cy="${y}" r="6" class="l-net-halo"/><text x="${x}" y="${y - 5.5}" text-anchor="middle">${c}</text><text x="${x}" y="${y + 8}" text-anchor="middle" class="l-net-sub">${m}</text></g>`).join('')}
        </svg>
      </section>

      <section class="l-rewards">
        <h2 class="l-h2 in-view">Recompensas que se sienten</h2>
        <div class="l-marquee"><div class="l-marquee-track">
          ${rewardsShow.concat(rewardsShow).map((id) => { const r = DT.REWARDS[id]; const rar = DT.RARITY[r.rarity]; return `<div class="l-reward" style="--rar:${rar.color}">${DT.art.badge(r)}<b>${DT.esc(r.name)}</b><small>${DT.REWARD_TYPES[r.type]} · ${rar.name}</small></div>`; }).join('')}
        </div></div>
      </section>

      <section class="l-featured">
        <h2 class="l-h2 in-view">Lo más jugado</h2>
        <div class="l-feat-row">
          ${games.slice().sort((a, b) => (b.plays || 0) - (a.plays || 0)).slice(0, 4).map((g, i) => `
            <div class="l-feat in-view" style="--d:${i * .1}s"><a href="#/juego/${g.id}">${DT.coverHTML(g)}</a><div><b>${DT.esc(g.title)}</b><small>${(g.plays || 0).toLocaleString('es-MX')} partidas · ${DT.formatLabel[g.format]}</small></div>
            ${DT.isInstant(g) ? `<button class="btn success sm" data-act="play" data-gid="${g.id}">${DT.icon.play} Jugar</button>` : `<a class="btn ghost sm" href="#/juego/${g.id}">Ver juego</a>`}</div>`).join('')}
        </div>
      </section>

      <section class="l-roles">
        <h2 class="l-h2 in-view">¿Haces juegos? Publícalos aquí</h2>
        <div class="l-role-cards">
          <article class="l-role in-view" style="--d:0s"><div class="l-role-ico">${DT.icon.gamepad}</div><h3>Jugadores</h3>
            <p>Tienda y biblioteca estilo Steam, reseñas con stickers y un perfil que presume tus logros.</p></article>
          <article class="l-role in-view" style="--d:.12s"><div class="l-role-ico">${DT.icon.wrench}</div><h3>Desarrolladores</h3>
            <p>Sube tu juego, define logros con un SDK de una línea y diseña tu página con imágenes, GIFs y videos en cualquier forma.</p>
            <a class="btn primary sm" href="#/dev" data-asdev>${DT.icon.code} Publicar mi juego</a></article>
          <article class="l-role in-view" style="--d:.24s"><div class="l-role-ico">${DT.icon.shield}</div><h3>Administradores</h3>
            <p>Revisión con criterios del TecNM, verificación de estudios, reportes y filtro de palabras.</p></article>
        </div>
      </section>

      <footer class="l-footer">
        <div class="brand"><span class="brand-mark">D</span><span class="brand-name">Divierte<b>TEC</b></span></div>
        <p>Impulsamos la industria mexicana del entretenimiento desde las aulas. Proyecto para InnovaTec · Hackatec regional 2026. Demostración offline: todos los datos viven en tu navegador.</p>
        ${star ? `<button class="btn l-play" data-act="play" data-gid="${star.id}"><span class="l-play-ico">${DT.icon.play}</span><span><b>JUGAR AHORA</b><small>${DT.esc(star.title)}</small></span></button>` : ''}
      </footer>
    </div>`;

    DT.$$('[data-asdev]', app).forEach((a) => a.addEventListener('click', (e) => {
      if (DT.me().role === 'user') {
        e.preventDefault();
        DT.state().currentUserId = 'u_maravilla';
        DT.applyTheme();
        DT.emit('user');
        DT.toast('Cambiaste al rol <b>Desarrollador</b> (Equipo Maravilla) para la demo.');
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
        const b = en.target.querySelector('b'); const target = +en.target.dataset.count; const pre = en.target.dataset.prefix || ''; const t0 = performance.now();
        const step = (t) => { const k = Math.min(1, (t - t0) / 1200); b.textContent = pre + Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString('es-MX'); if (k < 1) requestAnimationFrame(step); };
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
