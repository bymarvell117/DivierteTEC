/* DivierteTEC — tienda y página de tienda de cada juego. */
(function (DT) {
  'use strict';

  const filters = { q: '', format: 'all', genre: 'all', sort: 'featured', tecnm: false };

  /* Botonera principal según precio, acceso (compra/Pase/gratis) y formato.
     Los juegos HTML se juegan al instante: nunca se descargan. */
  DT.playButtonsHTML = (g) => {
    if (g.private) return DT.owns(g.id) ? `<button class="btn success big" data-act="play" data-gid="${g.id}">${DT.icon.play} Jugar</button>` : '';
    const src = DT.accessSource(g.id);
    const owns = DT.owns(g.id);
    if (!src) {
      const p = DT.priceOf(g);
      const label = p.mode === 'pwyw' ? 'Obtener · Paga lo que quieras' : `Comprar · ${DT.money(p.final)}`;
      return `<button class="btn primary big" data-act="buy" data-gid="${g.id}">${DT.icon.gift} ${label}</button>` +
        ((g.pricing || {}).inPass ? `<a class="btn ghost big" href="#/planes">${DT.icon.ticket} Incluido en el Pase</a>` : '');
    }
    // Paga lo que quieras: se juega ya y el aporte al estudio es opcional
    const pw = (g.pricing || {}).mode === 'pwyw' && src === 'free' && !(DT.state().purchases[DT.me().id] || {})[g.id];
    const support = pw ? `<button class="btn ghost big pwyw-btn" data-act="buy" data-gid="${g.id}">${DT.icon.heart} Paga lo que quieras</button>` : '';
    if (g.format === 'html') {
      const play = `<button class="btn success big" data-act="play" data-gid="${g.id}">${DT.icon.play} ${owns ? 'Jugar en el navegador' : 'Jugar ahora'}</button>`;
      return (owns ? play : play + `<button class="btn ghost big" data-act="add" data-gid="${g.id}">${DT.icon.plus} A mi biblioteca</button>`) + support;
    }
    if (!owns) return `<button class="btn success big" data-act="add" data-gid="${g.id}">${DT.icon.plus} Agregar a la biblioteca · ${src === 'pass' ? 'con tu Pase' : 'desde $0'}</button>` + support;
    return `<button class="btn primary big" data-act="download" data-gid="${g.id}">${DT.icon.download} ${g.format === 'cpp' ? 'Descargar' : 'Instalar'}</button>`;
  };

  /* ---------- Reseñas: requieren 2 horas jugadas ---------- */
  DT.REVIEW_MIN = 7200; // segundos
  DT.playedSecs = (gid, uid) => ((DT.lib(uid)[gid] || {}).playtime || 0);
  DT.canReview = (gid, uid) => DT.owns(gid, uid) && DT.playedSecs(gid, uid) >= DT.REVIEW_MIN;
  /* Demostración: suma tiempo de juego sin esperar */
  DT.simulatePlay = (gid, secs) => {
    const lib = DT.lib();
    const ids = gid ? [gid] : Object.keys(lib);
    ids.forEach((id) => { if (lib[id]) { lib[id].playtime = (lib[id].playtime || 0) + (secs || 3600); lib[id].simulated = (lib[id].simulated || 0) + (secs || 3600); } });
    DT.rewards.checkPlatform();
    DT.toast(`${DT.icon.clock} Demo: +${Math.round((secs || 3600) / 60)} min de juego ${gid ? 'en ' + DT.esc(DT.game(gid).title) : 'en toda tu biblioteca'}.`, { kind: 'ok' });
    DT.emit('library');
  };
  /* Lanzador de juegos descargables: registra la sesión de juego */
  DT.toggleSession = (gid) => {
    const e = DT.lib()[gid];
    if (!e) return;
    if (e.sessionStart) {
      const secs = Math.max(1, Math.round((Date.now() - e.sessionStart) / 1000));
      e.playtime = (e.playtime || 0) + secs; e.lastPlayed = Date.now(); delete e.sessionStart;
      DT.toast(`Sesión terminada: ${DT.fmtTime(secs)} registrados.`, { kind: 'ok' });
    } else { e.sessionStart = Date.now(); DT.toast('Sesión de juego iniciada: el tiempo se registra hasta que la termines.'); }
    DT.emit('library');
  };
  const reviewScore = (list) => {
    const rated = list.filter((r) => r.stars);
    const avg = rated.length ? rated.reduce((t, r) => t + r.stars, 0) / rated.length : 0;
    const dist = [5, 4, 3, 2, 1].map((n) => rated.filter((r) => r.stars === n).length);
    const pct = list.length ? Math.round(list.filter((r) => r.up).length / list.length * 100) : 0;
    return { avg, dist, pct, n: rated.length };
  };
  DT.reviewScore = reviewScore;

  DT.addToLibrary = (gid) => {
    if (!DT.canAccess(gid)) return DT.checkout(gid);
    const lib = DT.lib();
    if (!lib[gid]) lib[gid] = { added: Date.now(), playtime: 0, lastPlayed: 0, source: DT.accessSource(gid) };
    DT.toast(`${DT.icon.check} <b>${DT.esc(DT.game(gid).title)}</b> se agregó a tu biblioteca.`, { kind: 'ok' });
    DT.rewards.checkPlatform();
    DT.emit('library');
  };

  /* Delegación global de acciones de juego */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b || !b.dataset.gid) return;
    const gid = b.dataset.gid;
    if (b.dataset.act === 'add') DT.addToLibrary(gid);
    else if (b.dataset.act === 'buy') DT.checkout(gid);
    else if (b.dataset.act === 'play') DT.play(gid);
    else if (b.dataset.act === 'download') DT.download(gid);
    else if (b.dataset.act === 'session') DT.toggleSession(gid);
    else if (b.dataset.act === 'simulate') DT.simulatePlay(gid);
  });

  DT.reportModal = (type, targetId, gameId) => {
    const reasons = { game: ['Contenido inapropiado', 'No funciona / enlace roto', 'Malware o engaño', 'Plagio / derechos de autor', 'Otro'],
      dev: ['Suplantación de identidad', 'Comportamiento abusivo', 'Spam', 'Otro'],
      review: ['Lenguaje ofensivo', 'Spam', 'Spoilers sin aviso', 'Otro'] }[type];
    const m = DT.modal({
      title: `${DT.icon.flag} Reportar ${{ game: 'juego', dev: 'desarrollador', review: 'reseña' }[type]}`,
      body: `<label class="field"><span>Motivo</span><select data-reason>${reasons.map((r) => `<option>${r}</option>`).join('')}</select></label>
        <label class="field"><span>Detalles (opcional)</span><textarea rows="3" data-text placeholder="Cuéntale al equipo de moderación qué pasó"></textarea></label>`,
      actions: `<button class="btn ghost" data-close>Cancelar</button><button class="btn danger" data-send>Enviar reporte</button>`
    });
    m.el.querySelector('[data-send]').onclick = () => {
      DT.state().reports.unshift({ id: DT.uid('rep'), type, targetId, gameId, reason: m.el.querySelector('[data-reason]').value,
        text: m.el.querySelector('[data-text]').value, by: DT.me().id, date: Date.now(), status: 'open' });
      DT.counters().reports++;
      m.close();
      DT.toast('Gracias. El equipo de administración revisará tu reporte.', { kind: 'ok' });
      DT.rewards.checkPlatform();
      DT.emit('admin');
    };
  };

  const card = (g) => `
    <a class="game-card" href="#/juego/${g.id}">
      ${DT.coverHTML(g)}
      <div class="game-card-body">
        <div class="row"><b class="game-card-title">${DT.esc(g.title)}</b><span class="spacer"></span><span class="fmt fmt-${g.format}">${DT.formatShort[g.format]}</span></div>
        <small class="muted row nowrap">${DT.esc(g.genre)} · ${DT.esc((DT.user(g.devId) || {}).name || '')} ${DT.tecnmPill(g)}</small>
        <div class="tags">${(g.tags || []).slice(0, 3).map((t) => `<span class="tag">${DT.esc(t)}</span>`).join('')}</div>
        <div class="card-foot">${DT.owns(g.id) ? `<span class="owned">${DT.icon.check} En tu biblioteca</span>` : DT.priceTag(g)}${DT.isInstant(g) ? '<span class="instant" title="Se juega en el navegador, sin descargar">' + DT.icon.bolt + ' Al instante</span>' : ''}</div>
      </div>
    </a>`;

  DT.views.store = (app) => {
    const all = DT.gamesPublic();
    const featured = all.filter((g) => g.featured).sort((a, b) => (DT.isSponsored(b) ? 1 : 0) - (DT.isSponsored(a) ? 1 : 0));
    const genres = [...new Set(all.map((g) => g.genre))].sort();
    app.innerHTML = `
      <section class="page">
        <div class="store-hero" data-hero>
          ${featured.map((g, i) => `
            <div class="hero-slide ${i ? '' : 'on'}" data-slide="${i}">
              <a class="hero-art" href="#/juego/${g.id}">${DT.coverHTML(g, 'fill')}</a>
              <div class="hero-info">
                ${DT.isSponsored(g) ? '<span class="pill sponsored">' + DT.icon.megaphone + ' Patrocinado</span>' : `<span class="pill">${DT.icon.star} Destacado</span>`}
                <div class="row">${DT.priceTag(g)}</div>
                <h2>${DT.esc(g.title)}</h2>
                <p>${DT.esc(g.short)}</p>
                <div class="tags">${g.tags.map((t) => `<span class="tag">${DT.esc(t)}</span>`).join('')}</div>
                <div class="row"><span class="fmt fmt-${g.format}">${DT.formatLabel[g.format]}</span></div>
                <div class="row">${DT.playButtonsHTML(g)}<a class="btn ghost" href="#/juego/${g.id}">Ver página</a></div>
              </div>
            </div>`).join('')}
          <div class="hero-dots">${featured.map((g, i) => `<button class="${i ? '' : 'on'}" data-dot="${i}" aria-label="Destacado ${i + 1}"></button>`).join('')}</div>
        </div>

        <div class="store-toolbar">
          <label class="searchbox">${DT.icon.search}<input type="search" placeholder="Buscar juegos, géneros o etiquetas" value="${DT.esc(filters.q)}" data-q></label>
          <div class="chips" role="group" aria-label="Formato">
            ${[['all', 'Todos'], ['html', 'HTML · Navegador'], ['cpp', 'C++'], ['exe', 'Ejecutables']].map(([k, v]) => `<button class="chip ${filters.format === k ? 'on' : ''}" data-format="${k}">${v}</button>`).join('')}
          </div>
          <button class="chip tecnm-chip ${filters.tecnm ? 'on' : ''}" data-tecnm title="Juegos de estudios de estudiantes del TecNM">${DT.icon.cap} Hecho en el TecNM</button>
          <select data-genre aria-label="Género"><option value="all">Todos los géneros</option>${genres.map((g) => `<option ${filters.genre === g ? 'selected' : ''}>${DT.esc(g)}</option>`).join('')}</select>
          <select data-sort aria-label="Ordenar">
            ${[['featured', 'Destacados'], ['new', 'Más recientes'], ['popular', 'Más jugados'], ['az', 'A–Z']].map(([k, v]) => `<option value="${k}" ${filters.sort === k ? 'selected' : ''}>${v}</option>`).join('')}
          </select>
        </div>
        <div class="grid cols-4" data-results></div>
      </section>`;

    const results = DT.$('[data-results]', app);
    const draw = () => {
      const q = filters.q.trim().toLowerCase();
      let list = all.filter((g) => (filters.format === 'all' || g.format === filters.format)
        && (filters.genre === 'all' || g.genre === filters.genre)
        && (!filters.tecnm || DT.isTecnmGame(g))
        && (!q || [g.title, g.genre, g.short, ...(g.tags || [])].join(' ').toLowerCase().includes(q)));
      const sorts = { featured: (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.plays - a.plays, new: (a, b) => b.createdAt - a.createdAt, popular: (a, b) => b.plays - a.plays, az: (a, b) => a.title.localeCompare(b.title) };
      list = list.sort(sorts[filters.sort]);
      results.innerHTML = list.map(card).join('') || `<div class="empty-inline">No hay juegos que coincidan con tu búsqueda.</div>`;
      DT.media.hydrate(results);
    };
    draw();

    DT.$('[data-q]', app).addEventListener('input', (e) => { filters.q = e.target.value; draw(); });
    DT.$('[data-tecnm]', app).addEventListener('click', (e) => { filters.tecnm = !filters.tecnm; e.currentTarget.classList.toggle('on', filters.tecnm); draw(); });
    DT.$('[data-genre]', app).addEventListener('change', (e) => { filters.genre = e.target.value; draw(); });
    DT.$('[data-sort]', app).addEventListener('change', (e) => { filters.sort = e.target.value; draw(); });
    DT.$$('[data-format]', app).forEach((b) => b.addEventListener('click', () => {
      filters.format = b.dataset.format;
      DT.$$('[data-format]', app).forEach((x) => x.classList.toggle('on', x === b));
      draw();
    }));

    /* Carrusel de destacados */
    let idx = 0;
    const show = (i) => {
      idx = (i + featured.length) % featured.length;
      DT.$$('[data-slide]', app).forEach((s) => s.classList.toggle('on', +s.dataset.slide === idx));
      DT.$$('[data-dot]', app).forEach((s) => s.classList.toggle('on', +s.dataset.dot === idx));
    };
    DT.$$('[data-dot]', app).forEach((d) => d.addEventListener('click', () => show(+d.dataset.dot)));
    const t = featured.length > 1 ? setInterval(() => show(idx + 1), 6000) : 0;
    return () => clearInterval(t);
  };

  /* ---------- Página de tienda de un juego ---------- */
  DT.views.gamePage = (app, gid) => {
    const g = DT.game(gid);
    const me = DT.me();
    const privileged = g && !g.private && (me.id === g.devId || me.role === 'admin');
    if (!g || !DT.canSee(g) || (g.status !== 'approved' && !privileged)) return DT.views.notFound(app);
    const dev = DT.user(g.devId) || {};
    const c = DT.counters();
    if (!c.visited.includes(gid)) { c.visited.push(gid); DT.rewards.checkPlatform(); DT.save(); }

    const reviews = g.reviews || [];
    const visible = reviews.filter((r) => !r.hidden);
    const ups = reviews.filter((r) => r.up).length;
    const pct = reviews.length ? Math.round(ups / reviews.length * 100) : 0;
    const sc = reviewScore(visible);
    const myStickers = DT.FREE_STICKERS.concat(DT.inventory().filter((id) => (DT.reward(id) || {}).type === 'emoji').map((id) => DT.reward(id).data));
    const rvSort = DT.rvSort || 'useful';
    const sorted = visible.slice().sort(rvSort === 'recent' ? (a, b) => b.date - a.date : (a, b) => ((b.helpful || []).length - (a.helpful || []).length) || b.date - a.date);
    const mineRv = reviews.find((r) => r.userId === me.id);
    const played = DT.playedSecs(g.id), need = DT.REVIEW_MIN;
    const reviewGate = !DT.owns(g.id) ? `<div class="rv-gate">${DT.icon.lock}<div><b>Juega para opinar</b><small>Agrega el juego a tu biblioteca y juega <b>2 horas</b> para calificarlo. Así las reseñas vienen de quien de verdad lo jugó.</small></div></div>`
      : played < need ? `<div class="rv-gate">
          <svg class="rv-ring" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="var(--surface-3)" stroke-width="6"/><circle cx="22" cy="22" r="18" fill="none" stroke="var(--primary)" stroke-width="6" stroke-dasharray="${2 * Math.PI * 18 * played / need} 200" transform="rotate(-90 22 22)"/></svg>
          <div><b>Has jugado ${DT.fmtTime(played)} de 2 h</b>${(DT.lib()[g.id] || {}).simulated ? ' <span class="pill warn">incluye tiempo simulado</span>' : ''}<small>Te faltan ${DT.fmtTime(need - played)} para poder calificar este juego.</small>
          <div class="row">${DT.isInstant(g) ? `<button class="btn success sm" data-act="play" data-gid="${g.id}">${DT.icon.play} Seguir jugando</button>` : `<a class="btn ghost sm" href="#/biblioteca/${g.id}">${DT.icon.clock} Abrir el lanzador</a>`}
          <button class="btn ghost sm" data-act="simulate" data-gid="${g.id}" title="Agrega tiempo simulado, marcado como tal, para mostrar la regla en la presentación">${DT.icon.clock} Simular +1 h (demo)</button></div></div></div>`
      : `<form class="review-form" data-review>
          <div class="row"><b>${mineRv ? 'Edita tu reseña' : 'Califica el juego'}</b><span class="muted small">${DT.icon.clock} ${DT.fmtTime(played)} jugadas</span></div>
          <div class="star-pick" data-stars>${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-star="${n}" class="${(mineRv ? mineRv.stars : 0) >= n ? 'on' : ''}" aria-label="${n} estrellas">${DT.icon.star}</button>`).join('')}</div>
          <div class="row">
            <label class="vote"><input type="radio" name="up" value="1" ${!mineRv || mineRv.up ? 'checked' : ''}><span>${DT.icon.thumbUp} Recomendado</span></label>
            <label class="vote"><input type="radio" name="up" value="0" ${mineRv && !mineRv.up ? 'checked' : ''}><span>${DT.icon.thumbDown} No recomendado</span></label>
          </div>
          <textarea name="text" rows="3" placeholder="¿Qué te pareció ${DT.esc(g.title)}?" required maxlength="600">${mineRv ? DT.esc(mineRv.text) : ''}</textarea>
          <div class="row">
            <div class="emoji-bar" title="Tus stickers (desbloquea más con logros)">${myStickers.map((k) => `<button type="button" data-sticker="${DT.esc(k)}" title="${DT.esc(DT.STICKER_NAMES[k] || k)}">${DT.art.sticker(k)}</button>`).join('')}</div>
            <span class="spacer"></span><button class="btn primary">${mineRv ? 'Guardar cambios' : 'Publicar reseña'}</button>
          </div>
        </form>`;
    const summary = DT.rewards.gameSummary(me.id, g);

    app.innerHTML = `
      <section class="page">
        ${g.status !== 'approved' ? `<div class="notice warn">${DT.icon.eye} Vista previa: este juego está en estado <b>${{ draft: 'borrador', pending: 'en revisión', rejected: 'rechazado', changes: 'cambios solicitados', withdrawn: 'retirado de la tienda' }[g.status] || g.status}</b> y no es visible para los usuarios.</div>` : ''}
        <nav class="crumbs"><a href="#/tienda">Tienda</a> › <span>${DT.esc(g.genre)}</span> › <b>${DT.esc(g.title)}</b></nav>
        <div class="game-head">
          <div>
            <h1>${DT.esc(g.title)}</h1>
            <div class="row muted">
              <a href="#/perfil/${dev.id}" class="dev-link">${DT.esc(dev.name)}${dev.verified ? ` <span class="verified" title="Estudio verificado">${DT.icon.check}</span>` : ''}</a>
              ${DT.tecnmPill(g, true)}
              · <span class="fmt fmt-${g.format}">${DT.formatLabel[g.format]}</span>
              · ${g.plays || 0} partidas
              ${reviews.length ? `· <span class="${pct >= 70 ? 'pos' : pct >= 40 ? 'mix' : 'neg'}">${sc.n ? sc.avg.toFixed(1) + ' ' + DT.icon.star + ' · ' : ''}${pct}% reseñas positivas</span>` : ''}
            </div>
          </div>
          <div class="row">
            ${privileged ? `<a class="btn ghost" href="#/dev/editor/${g.id}/tienda">${DT.icon.edit} Editar página</a>` : ''}
            ${privileged && g.status === 'approved' ? `<button class="btn danger sm" data-withdraw>${DT.icon.eyeOff} Retirar de la tienda</button>` : ''}
            ${privileged && g.status === 'withdrawn' && (me.role === 'admin' || !(g.withdrawn && g.withdrawn.admin)) ? `<button class="btn success sm" data-republish>${DT.icon.upload} Volver a publicar</button>` : ''}
            ${g.private ? '' : `<button class="btn ghost sm" data-tip>${DT.icon.heart} Apoyar al estudio</button>
            <button class="btn ghost sm" data-report="game">${DT.icon.flag} Reportar</button>`}
          </div>
        </div>
        ${g.private ? `<div class="notice">${DT.icon.lock || DT.icon.eye} Juego personal de tu biblioteca, sin fines comerciales: no aparece en la tienda ni para otras cuentas. Los personajes pertenecen a sus respectivos dueños.</div>` : ''}
        <div class="buy-strip">
          <div class="row">${DT.priceTag(g)}${DT.isInstant(g) ? '<span class="instant">' + DT.icon.bolt + ' Jugable al instante en el navegador · sin descargas</span>' : ''}</div>
          <div class="row">${DT.playButtonsHTML(g)}</div>
        </div>

        <div class="store-layout" data-layout></div>

        <div class="game-details">
          <div class="card">
            <h3>Información</h3>
            <dl class="specs">
              <dt>Formato</dt><dd>${DT.formatLabel[g.format]}</dd>
              <dt>Precio</dt><dd>${{ free: 'Gratis', paid: DT.money(g.pricing.price), pwyw: `Paga lo que quieras · desde ${DT.money(g.pricing.min || 0)} · sugerido ${DT.money(g.pricing.price)}` }[g.pricing.mode]}${g.pricing.inPass ? ' · ' + DT.icon.ticket + ' Pase' : ''}</dd>
              <dt>Género</dt><dd>${DT.esc(g.genre)}</dd>
              <dt>Desarrollador</dt><dd>${DT.esc(dev.name)}</dd>
              <dt>Publicado</dt><dd>${new Date(g.createdAt).toLocaleDateString('es-MX')}</dd>
              ${g.download ? `<dt>Archivo</dt><dd>${DT.esc(g.download.name)} (${DT.fmtBytes(g.download.size || 0)})</dd><dt>Plataforma</dt><dd>${DT.esc(g.download.platform || '—')}</dd>` : ''}
              ${g.files ? `<dt>Archivos</dt><dd>${g.files.count} (${DT.fmtBytes(g.files.size || 0)})</dd>` : ''}
              <dt>Tus logros</dt><dd>${summary.got} / ${summary.total}</dd>
            </dl>
            <div class="tags">${(g.tags || []).map((t) => `<span class="tag">${DT.esc(t)}</span>`).join('')}</div>
            ${g.private ? '' : `<hr><button class="btn ghost sm" data-report="dev">${DT.icon.flag} Reportar desarrollador</button>`}
          </div>

          <div class="card reviews" ${g.private ? 'hidden' : ''}>
            <h3>Reseñas ${reviews.length ? `<small class="muted">(${visible.length})</small>` : ''}</h3>
            ${visible.length ? `<div class="rv-summary">
              <div class="rv-score"><b>${sc.n ? sc.avg.toFixed(1) : '—'}</b>${DT.starsHTML(Math.round(sc.avg))}<small>${sc.n} calificaciones · ${sc.pct}% lo recomienda</small></div>
              <div class="rv-dist">${sc.dist.map((c, i) => `<div class="rv-bar"><span>${5 - i} ${DT.icon.star}</span><div><i style="width:${sc.n ? c / sc.n * 100 : 0}%"></i></div><small>${c}</small></div>`).join('')}</div>
            </div>` : ''}
            ${reviewGate}
            ${visible.length > 1 ? `<div class="row rv-sort"><span class="muted small">Ordenar:</span>${[['useful', 'Más útiles'], ['recent', 'Recientes']].map(([k, v]) => `<button class="chip ${rvSort === k ? 'on' : ''}" data-rvsort="${k}">${v}</button>`).join('')}</div>` : ''}
            <div class="review-list">
              ${sorted.map((r) => {
                const u = DT.user(r.userId) || { name: '¿?', id: '' };
                const useful = (r.helpful || []).length, voted = (r.helpful || []).includes(me.id);
                return `<article class="review ${r.up ? 'up' : 'down'}">
                  <header>${DT.avatarHTML(u, 34)}<div><b>${DT.esc(u.name)}</b>${r.stars ? DT.starsHTML(r.stars) : ''}<small>${r.up ? DT.icon.thumbUp + ' Recomendado' : DT.icon.thumbDown + ' No recomendado'} · ${r.hours ? `${r.hours.toFixed(1)} h jugadas al reseñar${r.simulated ? ' (incluye tiempo simulado para la demo)' : ''} · ` : ''}${DT.timeAgo(r.date)}${r.edited ? ' · editada' : ''}</small></div>
                  <button class="icon-btn sm" title="Reportar reseña" data-report-review="${r.id}">${DT.icon.flag}</button></header>
                  <p>${DT.stickerize(DT.esc(DT.censor(r.text)))}</p>
                  <footer><button class="rv-help ${voted ? 'on' : ''}" data-helpful="${r.id}" ${r.userId === me.id ? 'disabled' : ''}>${DT.icon.thumbUp} ¿Te fue útil? · ${useful}</button></footer></article>`;
              }).join('') || '<p class="muted">Todavía no hay reseñas. ¡Juega 2 horas y sé el primero!</p>'}
            </div>
          </div>
        </div>
      </section>`;

    DT.renderLayout(DT.$('[data-layout]', app), g.storeLayout, g, { uid: me.id, playHTML: DT.playButtonsHTML });

    const tip = DT.$('[data-tip]', app); if (tip) tip.onclick = () => DT.tipModal(g);
    const wd = DT.$('[data-withdraw]', app); if (wd) wd.onclick = () => DT.withdrawModal(g);
    const rp = DT.$('[data-republish]', app); if (rp) rp.onclick = () => DT.republish(g);
    DT.$$('[data-report]', app).forEach((b) => b.onclick = () => DT.reportModal(b.dataset.report, b.dataset.report === 'dev' ? g.devId : g.id, g.id));
    DT.$$('[data-report-review]', app).forEach((b) => b.onclick = () => DT.reportModal('review', b.dataset.reportReview, g.id));
    DT.$$('[data-rvsort]', app).forEach((b) => b.onclick = () => { DT.rvSort = b.dataset.rvsort; DT.render(true); });
    DT.$$('[data-helpful]', app).forEach((b) => b.onclick = () => {
      const r = g.reviews.find((x) => x.id === b.dataset.helpful);
      r.helpful = r.helpful || [];
      const i = r.helpful.indexOf(me.id);
      if (i >= 0) r.helpful.splice(i, 1); else r.helpful.push(me.id);
      DT.emit('review');
    });
    const form = DT.$('[data-review]', app);
    if (form) {
      let stars = mineRv ? mineRv.stars || 0 : 0;
      DT.$$('[data-star]', form).forEach((b) => b.onclick = () => { stars = +b.dataset.star; DT.$$('[data-star]', form).forEach((x) => x.classList.toggle('on', +x.dataset.star <= stars)); });
      DT.$$('[data-sticker]', form).forEach((b) => b.onclick = () => { form.text.value += ' :' + b.dataset.sticker + ': '; form.text.focus(); });
      form.onsubmit = (e) => {
        e.preventDefault();
        const text = form.text.value.trim();
        if (!text) return;
        if (!stars) { DT.toast('Elige de 1 a 5 estrellas.', { kind: 'warn' }); return; }
        if (!DT.canReview(g.id)) { DT.toast('Necesitas 2 horas de juego para calificar.', { kind: 'warn' }); return; }
        const flagged = DT.hasBanned(text);
        const data = { up: form.up.value === '1', stars, text, flagged, hours: Math.round(played / 360) / 10, simulated: !!((DT.lib()[g.id] || {}).simulated) };
        let r = mineRv;
        if (r) Object.assign(r, data, { edited: Date.now() });
        else { r = Object.assign({ id: DT.uid('r'), userId: me.id, date: Date.now(), helpful: [] }, data); g.reviews.push(r); }
        if (flagged) {
          DT.state().reports.unshift({ id: DT.uid('rep'), type: 'review', targetId: r.id, gameId: g.id, reason: 'Filtro automático de palabras', text: 'Detectado por el filtro de moderación.', by: 'system', date: Date.now(), status: 'open' });
          DT.toast('Tu reseña contiene palabras filtradas: se publicó censurada y quedó en revisión.', { kind: 'warn' });
        } else { DT.toast(mineRv ? 'Reseña actualizada.' : '¡Reseña publicada!', { kind: 'ok' }); if (DT.fx) DT.fx.burstAt(form, { count: 45 }); }
        DT.rewards.checkPlatform();
        DT.emit('review');
      };
    }
  };
})(window.DT);
