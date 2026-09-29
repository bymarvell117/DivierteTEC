/* DivierteTEC — tienda y página de tienda de cada juego. */
(function (DT) {
  'use strict';

  const filters = { q: '', format: 'all', genre: 'all', sort: 'featured' };

  /* Botonera principal según precio, acceso (compra/Pase/gratis) y formato.
     Los juegos HTML se juegan al instante: nunca se descargan. */
  DT.playButtonsHTML = (g) => {
    const src = DT.accessSource(g.id);
    const owns = DT.owns(g.id);
    if (!src) {
      const p = DT.priceOf(g);
      const label = p.mode === 'pwyw' ? 'Obtener · Paga lo que quieras' : `Comprar · ${DT.money(p.final)}`;
      return `<button class="btn primary big" data-act="buy" data-gid="${g.id}">${DT.icon.gift} ${label}</button>` +
        (g.pricing.inPass ? `<a class="btn ghost big" href="#/planes">🎟️ Incluido en el Pase</a>` : '');
    }
    if (g.format === 'html') {
      const play = `<button class="btn success big" data-act="play" data-gid="${g.id}">${DT.icon.play} ${owns ? 'Jugar en el navegador' : 'Jugar ahora'}</button>`;
      return owns ? play : play + `<button class="btn ghost big" data-act="add" data-gid="${g.id}">${DT.icon.plus} A mi biblioteca</button>`;
    }
    if (!owns) return `<button class="btn success big" data-act="add" data-gid="${g.id}">${DT.icon.plus} Agregar a la biblioteca · ${src === 'pass' ? 'con tu Pase' : 'Gratis'}</button>`;
    return `<button class="btn primary big" data-act="download" data-gid="${g.id}">${DT.icon.download} ${g.format === 'cpp' ? 'Descargar' : 'Instalar'}</button>`;
  };

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
        <small class="muted">${DT.esc(g.genre)} · ${DT.esc((DT.user(g.devId) || {}).name || '')}</small>
        <div class="tags">${(g.tags || []).slice(0, 3).map((t) => `<span class="tag">${DT.esc(t)}</span>`).join('')}</div>
        <div class="card-foot">${DT.owns(g.id) ? `<span class="owned">${DT.icon.check} En tu biblioteca</span>` : DT.priceTag(g)}${DT.isInstant(g) ? '<span class="instant" title="Se juega en el navegador, sin descargar">⚡ Al instante</span>' : ''}</div>
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
                ${DT.isSponsored(g) ? '<span class="pill sponsored">📣 Patrocinado</span>' : `<span class="pill">${DT.icon.star} Destacado</span>`}
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
        && (!q || [g.title, g.genre, g.short, ...(g.tags || [])].join(' ').toLowerCase().includes(q)));
      const sorts = { featured: (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.plays - a.plays, new: (a, b) => b.createdAt - a.createdAt, popular: (a, b) => b.plays - a.plays, az: (a, b) => a.title.localeCompare(b.title) };
      list = list.sort(sorts[filters.sort]);
      results.innerHTML = list.map(card).join('') || `<div class="empty-inline">No hay juegos que coincidan con tu búsqueda.</div>`;
      DT.media.hydrate(results);
    };
    draw();

    DT.$('[data-q]', app).addEventListener('input', (e) => { filters.q = e.target.value; draw(); });
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
    const privileged = g && (me.id === g.devId || me.role === 'admin');
    if (!g || (g.status !== 'approved' && !privileged)) return DT.views.notFound(app);
    const dev = DT.user(g.devId) || {};
    const c = DT.counters();
    if (!c.visited.includes(gid)) { c.visited.push(gid); DT.rewards.checkPlatform(); DT.save(); }

    const reviews = g.reviews || [];
    const ups = reviews.filter((r) => r.up).length;
    const pct = reviews.length ? Math.round(ups / reviews.length * 100) : 0;
    const myEmojis = DT.FREE_EMOJIS.concat(DT.inventory().filter((id) => (DT.reward(id) || {}).type === 'emoji').map((id) => DT.reward(id).data));
    const summary = DT.rewards.gameSummary(me.id, g);

    app.innerHTML = `
      <section class="page">
        ${g.status !== 'approved' ? `<div class="notice warn">${DT.icon.eye} Vista previa: este juego está en estado <b>${{ draft: 'borrador', pending: 'en revisión', rejected: 'rechazado', changes: 'cambios solicitados' }[g.status] || g.status}</b> y no es visible para los usuarios.</div>` : ''}
        <nav class="crumbs"><a href="#/tienda">Tienda</a> › <span>${DT.esc(g.genre)}</span> › <b>${DT.esc(g.title)}</b></nav>
        <div class="game-head">
          <div>
            <h1>${DT.esc(g.title)}</h1>
            <div class="row muted">
              <a href="#/perfil/${dev.id}" class="dev-link">${DT.esc(dev.name)}${dev.verified ? ` <span class="verified" title="Estudio verificado">${DT.icon.check}</span>` : ''}</a>
              · <span class="fmt fmt-${g.format}">${DT.formatLabel[g.format]}</span>
              · ${g.plays || 0} partidas
              ${reviews.length ? `· <span class="${pct >= 70 ? 'pos' : pct >= 40 ? 'mix' : 'neg'}">${pct}% reseñas positivas</span>` : ''}
            </div>
          </div>
          <div class="row">
            ${privileged ? `<a class="btn ghost" href="#/dev/editor/${g.id}/tienda">${DT.icon.edit} Editar página</a>` : ''}
            <button class="btn ghost sm" data-tip>💙 Apoyar al estudio</button>
            <button class="btn ghost sm" data-report="game">${DT.icon.flag} Reportar</button>
          </div>
        </div>
        <div class="buy-strip">
          <div class="row">${DT.priceTag(g)}${DT.isInstant(g) ? '<span class="instant">⚡ Jugable al instante en el navegador · sin descargas</span>' : ''}</div>
          <div class="row">${DT.playButtonsHTML(g)}</div>
        </div>

        <div class="store-layout" data-layout></div>

        <div class="game-details">
          <div class="card">
            <h3>Información</h3>
            <dl class="specs">
              <dt>Formato</dt><dd>${DT.formatLabel[g.format]}</dd>
              <dt>Precio</dt><dd>${{ free: 'Gratis', paid: DT.money(g.pricing.price), pwyw: 'Paga lo que quieras' }[g.pricing.mode]}${g.pricing.inPass ? ' · 🎟️ Pase' : ''}</dd>
              <dt>Género</dt><dd>${DT.esc(g.genre)}</dd>
              <dt>Desarrollador</dt><dd>${DT.esc(dev.name)}</dd>
              <dt>Publicado</dt><dd>${new Date(g.createdAt).toLocaleDateString('es-MX')}</dd>
              ${g.download ? `<dt>Archivo</dt><dd>${DT.esc(g.download.name)} (${DT.fmtBytes(g.download.size || 0)})</dd><dt>Plataforma</dt><dd>${DT.esc(g.download.platform || '—')}</dd>` : ''}
              ${g.files ? `<dt>Archivos</dt><dd>${g.files.count} (${DT.fmtBytes(g.files.size || 0)})</dd>` : ''}
              <dt>Tus logros</dt><dd>${summary.got} / ${summary.total}</dd>
            </dl>
            <div class="tags">${(g.tags || []).map((t) => `<span class="tag">${DT.esc(t)}</span>`).join('')}</div>
            <hr><button class="btn ghost sm" data-report="dev">${DT.icon.flag} Reportar desarrollador</button>
          </div>

          <div class="card reviews">
            <h3>Reseñas ${reviews.length ? `<small class="muted">(${reviews.length})</small>` : ''}</h3>
            ${DT.owns(g.id) ? `
            <form class="review-form" data-review>
              <div class="row">
                <label class="vote"><input type="radio" name="up" value="1" checked><span>${DT.icon.thumbUp} Recomendado</span></label>
                <label class="vote"><input type="radio" name="up" value="0"><span>${DT.icon.thumbDown} No recomendado</span></label>
              </div>
              <textarea name="text" rows="3" placeholder="¿Qué te pareció ${DT.esc(g.title)}?" required maxlength="600"></textarea>
              <div class="row">
                <div class="emoji-bar" title="Tus emojis (desbloquea más con logros)">${myEmojis.map((e) => `<button type="button" data-emoji="${DT.esc(e)}">${DT.esc(e)}</button>`).join('')}</div>
                <span class="spacer"></span><button class="btn primary">Publicar reseña</button>
              </div>
            </form>` : '<p class="muted">Agrega el juego a tu biblioteca para dejar una reseña.</p>'}
            <div class="review-list">
              ${reviews.slice().reverse().map((r) => {
                const u = DT.user(r.userId) || { name: '¿?', id: '' };
                if (r.hidden) return '';
                return `<article class="review ${r.up ? 'up' : 'down'}">
                  <header>${DT.avatarHTML(u, 34)}<div><b>${DT.esc(u.name)}</b><small>${r.up ? '👍 Recomendado' : '👎 No recomendado'} · ${DT.timeAgo(r.date)}</small></div>
                  <button class="icon-btn sm" title="Reportar reseña" data-report-review="${r.id}">${DT.icon.flag}</button></header>
                  <p>${DT.esc(DT.censor(r.text))}</p></article>`;
              }).join('') || '<p class="muted">Todavía no hay reseñas. ¡Sé el primero!</p>'}
            </div>
          </div>
        </div>
      </section>`;

    DT.renderLayout(DT.$('[data-layout]', app), g.storeLayout, g, { uid: me.id, playHTML: DT.playButtonsHTML });

    DT.$('[data-tip]', app).onclick = () => DT.tipModal(g);
    DT.$$('[data-report]', app).forEach((b) => b.onclick = () => DT.reportModal(b.dataset.report, b.dataset.report === 'dev' ? g.devId : g.id, g.id));
    DT.$$('[data-report-review]', app).forEach((b) => b.onclick = () => DT.reportModal('review', b.dataset.reportReview, g.id));
    const form = DT.$('[data-review]', app);
    if (form) {
      DT.$$('[data-emoji]', form).forEach((b) => b.onclick = () => { form.text.value += b.dataset.emoji; form.text.focus(); });
      form.onsubmit = (e) => {
        e.preventDefault();
        const text = form.text.value.trim();
        if (!text) return;
        const flagged = DT.hasBanned(text);
        const r = { id: DT.uid('r'), userId: me.id, up: form.up.value === '1', text, date: Date.now(), flagged };
        g.reviews.push(r);
        if (flagged) {
          DT.state().reports.unshift({ id: DT.uid('rep'), type: 'review', targetId: r.id, gameId: g.id, reason: 'Filtro automático de palabras', text: 'Detectado por el filtro de moderación.', by: 'system', date: Date.now(), status: 'open' });
          DT.toast('Tu reseña contiene palabras filtradas: se publicó censurada y quedó en revisión.', { kind: 'warn' });
        } else DT.toast('¡Reseña publicada!', { kind: 'ok' });
        DT.rewards.checkPlatform();
        DT.emit('review');
      };
    }
  };
})(window.DT);
