/* DivierteTEC — página de bienvenida animada (scroll cinematográfico). */
(function (DT) {
  'use strict';

  const axIco = (d) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const AX = {
    inclusion: axIco('<circle cx="9" cy="7" r="3"/><circle cx="17" cy="8" r="2.4"/><path d="M3 20v-1.5a6 6 0 0 1 12 0V20M15 20v-1a4.5 4.5 0 0 1 6-4.2"/>'),
    social: axIco('<path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>'),
    sust: axIco('<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15M5 19l7-7"/>'),
    tech: axIco('<path d="M12 2l8.5 5v10L12 22l-8.5-5V7z"/><path d="M12 22V12M20.5 7 12 12 3.5 7"/>')
  };
  DT.views.landing = (app) => {
    const s = DT.state();
    const games = DT.gamesPublic();
    const covers = games.concat(games, games).slice(0, 18);
    const instant = games.filter((g) => DT.isInstant(g));
    const star = DT.game('g_furia') && instant.includes(DT.game('g_furia')) ? DT.game('g_furia') : instant[0];
    const secs = Object.values(s.library).reduce((t, lib) => t + Object.values(lib).reduce((a, e) => a + (e.playtime || 0), 0), 0);
    const plays = games.reduce((t, g) => t + (g.plays || 0), 0);
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
            <div class="l-step" data-step="1"><h2>Hecho en México</h2><p>Detrás de cada juego hay un estudio estudiantil del TecNM.</p></div>
            <div class="l-step" data-step="2"><h2>Cada logro cuenta</h2><p>Desbloquea temas, marcos, avatares, efectos y stickers mientras juegas.</p></div>
          </div>
        </div>
      </section>

      <section class="l-impact">
        <h2 class="l-h2 in-view">Cada partida impulsa a un estudio mexicano</h2>
        <div class="l-flow">
          <div class="l-node in-view" style="--d:0s"><span class="l-node-ico">${DT.icon.gamepad}</span><b>Paga lo que quieras</b><small>Los juegos gratuitos se juegan ya; aporta desde $0 al estudio que te gustó.</small></div>
          <svg class="l-arrow" viewBox="0 0 60 24" aria-hidden="true"><path d="M0 12h50M40 2l12 10-12 10" fill="none" stroke="currentColor" stroke-width="4"/></svg>
          <div class="l-node in-view" style="--d:.12s"><span class="l-node-ico">${DT.icon.coin}</span><b>${Math.round((1 - e.rateStudent) * 100)} % al estudio</b><small>De cada venta; 0 % de comisión en las ${DT.seedText()} de cada juego (Semilla TEC).</small></div>
          <svg class="l-arrow" viewBox="0 0 60 24" aria-hidden="true"><path d="M0 12h50M40 2l12 10-12 10" fill="none" stroke="currentColor" stroke-width="4"/></svg>
          <div class="l-node in-view" style="--d:.24s"><span class="l-node-ico">${DT.icon.ticket}</span><b>${Math.round(e.passDevShare * 100)} % del Pase</b><small>Se reparte entre estudios según el tiempo que juegas.</small></div>
          <svg class="l-arrow" viewBox="0 0 60 24" aria-hidden="true"><path d="M0 12h50M40 2l12 10-12 10" fill="none" stroke="currentColor" stroke-width="4"/></svg>
          <div class="l-node in-view" style="--d:.36s"><span class="l-node-ico">${DT.ic('leaf')}</span><b>${Math.round((e.causeRate || 0) * 100)} % al Parque Irekua</b><small>De cada venta, desde nuestra comisión, para educación ambiental en Irapuato.</small></div>
        </div>
        <p class="l-note in-view">Cifras de esta demostración: ${DT.fmtTime(secs)} jugadas en la plataforma · dinero simulado.</p>
      </section>

      <section class="l-campus">
        <div class="l-campus-copy in-view">
          <span class="l-kicker">Juego destacado · Furia TEC</span>
          <h2 class="l-h2">Un homenaje a los Tecnológicos de Guanajuato</h2>
          <p><b>Furia TEC</b> es un juego de pelea 3D creado por el <b>Equipo Maravilla (ITESI)</b>. En él, las mascotas de nueve Tecnológicos de Guanajuato se enfrentan como homenaje a sus campus.</p>
          <p class="l-small">Los Tecnológicos no participaron en su desarrollo; las mascotas se representan sin logotipos oficiales.</p>
          ${DT.game('g_furia') ? playBtn(DT.game('g_furia'), 'Jugar Furia TEC') : ''}
        </div>
        <svg class="l-net in-view" viewBox="0 0 100 100" aria-label="Mascotas de los Tecnológicos de Guanajuato que aparecen en Furia TEC">
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
        <h2 class="l-h2 in-view">${plays ? 'Lo más jugado' : 'Destacados'}</h2>
        <div class="l-feat-row">
          ${games.slice().sort((a, b) => (b.plays || 0) - (a.plays || 0)).slice(0, 4).map((g, i) => `
            <div class="l-feat in-view" style="--d:${i * .1}s"><a href="#/juego/${g.id}">${DT.coverHTML(g)}</a><div><b>${DT.esc(g.title)}</b><small>${g.plays ? g.plays.toLocaleString('es-MX') + ' partidas · ' : ''}${DT.formatLabel[g.format]}</small></div>
            ${DT.isInstant(g) ? `<button class="btn success sm" data-act="play" data-gid="${g.id}">${DT.icon.play} Jugar</button>` : `<a class="btn ghost sm" href="#/juego/${g.id}">Ver juego</a>`}</div>`).join('')}
        </div>
      </section>

      <section class="l-roles l-axes">
        <h2 class="l-h2 in-view">Ejes transversales</h2>
        <div class="l-role-cards l-axes-cards">
          <article class="l-role in-view" style="--d:0s"><div class="l-role-ico">${AX.inclusion}</div><h3>Inclusión y equidad</h3>
            <p>Cualquier alumno de la comunidad tecnológica puede dar a conocer sus videojuegos: publicar es gratis y se juega desde $0 en cualquier navegador; los estudiantes del TecNM verificados tienen beneficios exclusivos.</p></article>
          <article class="l-role in-view" style="--d:.1s"><div class="l-role-ico">${AX.social}</div><h3>Impacto social</h3>
            <p>Impulsa las habilidades tecnológicas y el entretenimiento hecho en México, con apoyo económico para los estudios: Semilla TEC, Pase y propinas.</p></article>
          <article class="l-role in-view" style="--d:.2s"><div class="l-role-ico">${AX.sust}</div><h3>Sustentabilidad y sostenibilidad</h3>
            <p>Distribución 100 % digital, sin discos, empaques ni envíos. Un 5 % de cada venta, absorbido de nuestra comisión, va al Centro de Educación Ambiental del Parque Irekua (Irapuato).</p></article>
          <article class="l-role in-view" style="--d:.3s"><div class="l-role-ico">${AX.tech}</div><h3>Tecnologías emergentes</h3>
            <p>Gráficos 3D con WebGL en el navegador, mandos con vibración, prototipo que funciona sin conexión y juegos aislados con un SDK de logros.</p></article>
        </div>
      </section>

      <section class="l-roles">
        <h2 class="l-h2 in-view">¿Haces juegos? Publícalos aquí</h2>
        <div class="l-role-cards">
          <article class="l-role in-view" style="--d:0s"><div class="l-role-ico">${DT.icon.gamepad}</div><h3>Jugadores</h3>
            <p>Tienda y biblioteca estilo Steam, reseñas con stickers y un perfil que presume tus logros.</p></article>
          <article class="l-role in-view" style="--d:.12s"><div class="l-role-ico">${DT.icon.wrench}</div><h3>Desarrolladores</h3>
            <p>Sube tu juego, define logros con un SDK de una línea y diseña tu página con imágenes, GIFs y videos en cualquier forma. Para publicar, solicita tu cuenta de desarrollador: la administración revisa tu trabajo previo y tu identidad.</p>
            <a class="btn primary sm" href="#/dev" data-asdev>${DT.icon.code} Publicar mi juego</a></article>
          <article class="l-role in-view" style="--d:.24s"><div class="l-role-ico">${DT.icon.shield}</div><h3>Administradores</h3>
            <p>Revisión de contenido (violencia, temas bélicos, odio), solicitudes de desarrollador, verificación TecNM, reportes y filtro de palabras.</p></article>
        </div>
      </section>

      <footer class="l-footer">
        <div class="brand"><span class="brand-mark">D</span><span class="brand-name">Divierte<b>TEC</b></span></div>
        <p>Impulsamos la industria mexicana del entretenimiento desde las aulas. Proyecto para InnovaTec · Hackatec regional 2026. DivierteTEC es un sitio web; este prototipo funciona sin conexión y guarda los datos en tu navegador. <a href="#/faq">Preguntas frecuentes</a></p>
        ${star ? `<button class="btn l-play" data-act="play" data-gid="${star.id}"><span class="l-play-ico">${DT.icon.play}</span><span><b>JUGAR AHORA</b><small>${DT.esc(star.title)}</small></span></button>` : ''}
      </footer>
    </div>`;

    DT.$$('[data-asdev]', app).forEach((a) => a.addEventListener('click', (e) => {
      if (DT.me().role === 'user') { e.preventDefault(); DT.go('#/ser-desarrollador'); }
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

    /* --- Aparición al entrar en pantalla --- */
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('visible');
      io.unobserve(en.target);
    }), { threshold: .2 });
    DT.$$('.in-view', app).forEach((el) => io.observe(el));

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
