/* DivertiTEC — biblioteca estilo Steam (colecciones, novedades, jugados recientemente). */
(function (DT) {
  'use strict';

  const ui = { q: '', filter: 'all', collapsed: {} };

  const sidebar = (owned, gid) => {
    const q = ui.q.trim().toLowerCase();
    const list = owned.filter((g) => (!q || g.title.toLowerCase().includes(q))
      && (ui.filter === 'all' || (ui.filter === 'browser' ? g.format === 'html' : g.format !== 'html')));
    const groups = {};
    list.forEach((g) => { (groups[g.genre] = groups[g.genre] || []).push(g); });
    return `
      <aside class="lib-side">
        <div class="lib-side-top">
          <a class="lib-home ${gid ? '' : 'on'}" href="#/biblioteca">${DT.icon.home} Página principal</a>
          <a class="icon-btn" href="#/tienda" title="Ir a la tienda">${DT.icon.grid}</a>
        </div>
        <div class="row lib-filter">
          <select data-libfilter aria-label="Filtrar">
            <option value="all" ${ui.filter === 'all' ? 'selected' : ''}>Juegos y Software</option>
            <option value="browser" ${ui.filter === 'browser' ? 'selected' : ''}>Jugables en navegador</option>
            <option value="native" ${ui.filter === 'native' ? 'selected' : ''}>C++ y ejecutables</option>
          </select>
        </div>
        <label class="searchbox sm">${DT.icon.search}<input type="search" placeholder="Buscar" value="${DT.esc(ui.q)}" data-libq></label>
        <div class="lib-groups">
          ${Object.keys(groups).sort().map((k) => `
            <div class="lib-group ${ui.collapsed[k] ? 'collapsed' : ''}">
              <button class="lib-group-head" data-group="${DT.esc(k)}"><span>${ui.collapsed[k] ? '+' : '—'}</span> ${DT.esc(k.toUpperCase())} <small>(${groups[k].length})</small></button>
              ${groups[k].map((g) => `<a class="lib-item ${g.id === gid ? 'on' : ''}" href="#/biblioteca/${g.id}">${DT.coverHTML(g, 'mini')}<span>${DT.esc(g.title)}</span>${g.format === 'html' && g.files ? '<i class="dot-live" title="Jugable en navegador"></i>' : ''}</a>`).join('')}
            </div>`).join('') || '<p class="muted pad">Sin resultados.</p>'}
        </div>
      </aside>`;
  };

  const shelf = (title, inner, id) => `
    <section class="shelf">
      <header class="shelf-head"><h3>${title}</h3><span class="spacer"></span>
        <button class="icon-btn" data-scroll="${id}" data-dir="-1" aria-label="Anterior">${DT.icon.chevLeft}</button>
        <button class="icon-btn" data-scroll="${id}" data-dir="1" aria-label="Siguiente">${DT.icon.chevRight}</button></header>
      <div class="shelf-row" id="${id}">${inner}</div>
    </section>`;

  const home = (owned) => {
    const lib = DT.lib();
    const news = [];
    owned.forEach((g) => (g.news || []).forEach((n) => news.push({ g, n })));
    news.sort((a, b) => b.n.date - a.n.date);
    const recent = owned.slice().sort((a, b) => (lib[b.id].lastPlayed || lib[b.id].added) - (lib[a.id].lastPlayed || lib[a.id].added));
    const [first, ...rest] = recent;
    return `
      ${shelf(`Novedades <small class="muted">${DT.icon.news}</small>`, news.map(({ g, n }) => `
        <a class="news-card" href="#/biblioteca/${g.id}">
          <small class="muted">${DT.timeAgo(n.date)}</small>
          <div class="news-art">${n.mediaId ? `<img data-media="${n.mediaId}" alt="">` : DT.coverHTML(g, 'fill')}</div>
          <b>${DT.esc(n.title)}</b>
          <span class="chip-game">${DT.coverHTML(g, 'mini')} ${DT.esc(g.title)}</span>
        </a>`).join('') || '<p class="muted pad">Aquí aparecerán las noticias de los juegos de tu biblioteca.</p>', 'shelf-news')}
      ${first ? shelf('Jugados recientemente', `
        <div class="recent-big">
          <small class="muted">${DT.timeAgo(lib[first.id].lastPlayed || lib[first.id].added)}</small>
          <a href="#/biblioteca/${first.id}" class="recent-art">${DT.coverHTML(first, 'fill')}</a>
          <div class="recent-bar">
            ${playButton(first, true)}
            <div><b>TIEMPO JUGADO</b><small>Total: ${DT.fmtTime(lib[first.id].playtime)}</small></div>
          </div>
        </div>
        ${rest.map((g) => `<a class="recent-tall" href="#/biblioteca/${g.id}"><small class="muted">${DT.timeAgo(lib[g.id].lastPlayed || lib[g.id].added)}</small>${DT.coverHTML(g, 'fill')}</a>`).join('')}`, 'shelf-recent') : ''}
      <section class="shelf">
        <header class="shelf-head"><h3>Todos tus juegos <small class="muted">(${owned.length})</small></h3></header>
        <div class="grid lib-grid">${owned.map((g) => `<a class="lib-tile" href="#/biblioteca/${g.id}">${DT.coverHTML(g, 'fill')}<span>${DT.esc(g.title)}</span></a>`).join('')}</div>
      </section>`;
  };

  const playButton = (g, compact) => {
    if (g.format === 'html') return `<button class="btn play ${compact ? 'square' : 'big'}" data-act="play" data-gid="${g.id}">${DT.icon.play}${compact ? '' : ' JUGAR'}</button>`;
    const inst = (DT.lib()[g.id] || {}).installed;
    return `<button class="btn ${inst ? 'play' : 'primary'} ${compact ? 'square' : 'big'}" data-act="download" data-gid="${g.id}">${DT.icon.download}${compact ? '' : inst ? ' REINSTALAR' : ' INSTALAR'}</button>`;
  };

  const detail = (g) => {
    const me = DT.me();
    const e = DT.lib()[g.id];
    const s = DT.rewards.gameSummary(me.id, g);
    const mine = DT.userAch(me.id, g.id);
    const stats = ((DT.state().stats[me.id] || {})[g.id]) || {};
    return `
      <div class="lib-hero" data-layout></div>
      <div class="lib-playbar">
        ${playButton(g)}
        <div class="lib-stat"><small>ÚLTIMA SESIÓN</small><b>${DT.timeAgo(e.lastPlayed)}</b></div>
        <div class="lib-stat"><small>TIEMPO JUGADO</small><b>${DT.fmtTime(e.playtime)}</b></div>
        <div class="lib-stat"><small>LOGROS</small><b>${s.got} / ${s.total}</b><div class="bar"><i style="width:${s.pct}%"></i></div></div>
        <span class="spacer"></span>
        <a class="btn ghost sm" href="#/juego/${g.id}">Página de la tienda</a>
        ${me.id === g.devId ? `<a class="btn ghost sm" href="#/dev/editor/${g.id}/biblioteca">${DT.icon.edit} Editar</a>` : ''}
      </div>
      <div class="lib-cols">
        <section class="card">
          <h3>${DT.icon.news} Actividad y novedades</h3>
          ${(g.news || []).slice().sort((a, b) => b.date - a.date).map((n) => `<article class="news-item"><small class="muted">${DT.timeAgo(n.date)}</small><b>${DT.esc(n.title)}</b><p>${DT.esc(n.body)}</p></article>`).join('') || '<p class="muted">El desarrollador aún no ha publicado novedades.</p>'}
          ${Object.keys(stats).length ? `<h3 style="margin-top:18px">${DT.icon.chart} Tus estadísticas</h3><dl class="specs">${Object.entries(stats).map(([k, v]) => `<dt>${DT.esc(k)}</dt><dd>${DT.esc(v)}</dd>`).join('')}</dl>` : ''}
        </section>
        <section class="card">
          <h3>${DT.icon.trophy} Logros <small class="muted">${s.pct}%</small></h3>
          ${(g.achievements || []).map((a) => {
            const m = mine[a.id] || {};
            const got = !!m.unlockedAt;
            const hidden = a.hidden && !got;
            const r = a.reward && DT.reward(a.reward);
            return `<div class="ach-row big ${got ? 'got' : ''}">
              <span class="ach-ico">${hidden ? '❔' : DT.esc(a.icon || '🏆')}</span>
              <div><b>${hidden ? 'Logro oculto' : DT.esc(a.name)}</b><small>${hidden ? '???' : DT.esc(a.desc)}</small>
              ${a.goal && !got ? `<div class="bar"><i style="width:${Math.min(100, (m.progress || 0) / a.goal * 100)}%"></i></div><small>${m.progress || 0} / ${a.goal}</small>` : ''}
              ${got ? `<small class="ok">Desbloqueado ${DT.timeAgo(m.unlockedAt)}</small>` : ''}</div>
              ${r && !hidden ? `<span class="ach-reward-chip ${got ? 'got' : ''}">${DT.rewards.chip(a.reward)}</span>` : ''}
            </div>`;
          }).join('') || '<p class="muted">Este juego no tiene logros.</p>'}
        </section>
      </div>`;
  };

  DT.views.library = (app, gid) => {
    const lib = DT.lib();
    const owned = Object.keys(lib).map(DT.game).filter(Boolean);
    const g = gid && DT.game(gid);
    app.innerHTML = `<div class="library">${sidebar(owned, gid)}
      <div class="lib-main">${owned.length ? (g && lib[gid] ? detail(g) : home(owned)) : `
        <div class="empty-state"><div class="big-ico">📚</div><h2>Tu biblioteca está vacía</h2><p>Agrega juegos gratis desde la tienda.</p><a class="btn primary" href="#/tienda">Ir a la tienda</a></div>`}</div></div>`;

    if (g && lib[gid]) DT.renderLayout(DT.$('[data-layout]', app), g.libraryLayout, g, { uid: DT.me().id, playHTML: DT.playButtonsHTML });

    const q = DT.$('[data-libq]', app);
    q.addEventListener('input', () => {
      ui.q = q.value;
      const pos = q.selectionStart;
      DT.render(true);
      const nq = DT.$('[data-libq]'); nq.focus(); nq.setSelectionRange(pos, pos);
    });
    DT.$('[data-libfilter]', app).addEventListener('change', (e) => { ui.filter = e.target.value; DT.render(true); });
    DT.$$('[data-group]', app).forEach((b) => b.onclick = () => { ui.collapsed[b.dataset.group] = !ui.collapsed[b.dataset.group]; DT.render(true); });
    DT.$$('[data-scroll]', app).forEach((b) => b.onclick = () => { const row = document.getElementById(b.dataset.scroll); row.scrollBy({ left: row.clientWidth * .8 * +b.dataset.dir, behavior: 'smooth' }); });
  };
})(window.DT);
