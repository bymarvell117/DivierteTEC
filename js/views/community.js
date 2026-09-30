/* DivierteTEC — comunidad: actividad reciente y tabla de cazadores de logros. */
(function (DT) {
  'use strict';

  let peopleQ = ''; // se conserva al redibujar (seguir, amistad…)
  DT.views.community = (app) => {
    const s = DT.state();
    const feed = [];
    DT.catalogGames().filter((g) => g.status === 'approved').forEach((g) => {
      g.reviews.filter((r) => !r.hidden).forEach((r) => feed.push({ date: r.date, html: `${DT.avatarHTML(DT.user(r.userId) || { id: '' }, 36)}<div><b>${DT.esc((DT.user(r.userId) || {}).name)}</b> reseñó <a href="#/juego/${g.id}">${DT.esc(g.title)}</a> ${r.up ? DT.icon.thumbUp : DT.icon.thumbDown}${r.stars ? DT.starsHTML(r.stars) : ''}<p>${DT.stickerize(DT.esc(DT.censor(r.text)))}</p></div>` }));
      (g.news || []).forEach((n) => feed.push({ date: n.date, html: `${DT.coverHTML(g, 'mini')}<div><b>${DT.esc(g.title)}</b> publicó una novedad<p><b>${DT.esc(n.title)}</b> — ${DT.esc(n.body)}</p></div>` }));
    });
    Object.entries(s.achievements).forEach(([uid, games]) => Object.entries(games).forEach(([gid, achs]) => Object.entries(achs).forEach(([aid, v]) => {
      const g = DT.game(gid); const a = g && g.achievements.find((x) => x.id === aid); const u = DT.user(uid);
      if (v.unlockedAt && a && u) feed.push({ date: v.unlockedAt, html: `${DT.avatarHTML(u, 36)}<div><b>${DT.esc(u.name)}</b> desbloqueó <b>${DT.ic(a.icon)} ${DT.esc(a.hidden ? 'un logro secreto' : a.name)}</b> en <a href="#/juego/${gid}">${DT.esc(g.title)}</a></div>` });
    })));
    feed.sort((a, b) => b.date - a.date);

    const board = s.users.filter((u) => u.role !== 'admin').map((u) => {
      const st = DT.rewards.userStats(u.id);
      return { u, score: st.gameAch + Object.keys(s.platformAch[u.id] || {}).length, rewards: DT.inventory(u.id).length, time: st.playtime };
    }).sort((a, b) => b.score - a.score || b.time - a.time);

    app.innerHTML = `
      <section class="page">
        <div class="page-head"><div><h1>Comunidad</h1><p>Lo que está pasando en DivierteTEC.</p></div></div>
        <div class="grid cols-2 people-grid">
          <div class="card">
            <h3>${DT.icon.search} Buscar perfiles</h3>
            <label class="searchbox"><span>${DT.icon.search}</span><input data-peopleq placeholder="Nombre, estudio o campus" value="${DT.esc(peopleQ)}" autocomplete="off"></label>
            <div class="people-list" data-people></div>
          </div>
          <div class="card">
            <h3>${DT.icon.users} Tus amigos (${DT.friendsOf(DT.me().id).length})</h3>
            ${DT.friendRequests(DT.me().id).map((r) => DT.userRow(DT.user(r.from), `<button class="btn success sm" data-freq="${r.id}" data-ok="1">${DT.icon.check} Aceptar</button><button class="btn ghost sm" data-freq="${r.id}" data-ok="0">Rechazar</button>`)).join('')}
            ${DT.friendsOf(DT.me().id).map((id) => DT.userRow(DT.user(id))).join('') || (DT.friendRequests(DT.me().id).length ? '' : '<p class="muted">Aún no tienes amigos. Busca perfiles y envía una solicitud; la otra cuenta la acepta.</p>')}
            <p class="muted small">Siguiendo a ${DT.following(DT.me().id).length} · ${DT.followers(DT.me().id).length} seguidores</p>
          </div>
        </div>
        <div class="community">
          <div class="card">
            <h3>Actividad reciente</h3>
            <div class="feed">${feed.slice(0, 40).map((f) => `<div class="feed-item">${f.html}<small class="muted">${DT.timeAgo(f.date)}</small></div>`).join('') || '<p class="muted">Aún no hay actividad.</p>'}</div>
          </div>
          <div class="card">
            <h3>${DT.icon.trophy} Cazadores de logros</h3>
            <ol class="board">${board.map((b, i) => `<li><span class="rank r${i + 1}">${i + 1}</span>${DT.avatarHTML(b.u, 34)}<a href="#/perfil/${b.u.id}">${DT.esc(b.u.name)}</a><span class="spacer"></span><small class="muted">${b.rewards} ${DT.icon.gift}</small><b>${b.score} ${DT.icon.trophy}</b></li>`).join('')}</ol>
          </div>
        </div>
      </section>`;
    const q = DT.$('[data-peopleq]', app), box = DT.$('[data-people]', app);
    const draw = () => {
      peopleQ = q.value;
      const res = DT.searchUsers(peopleQ);
      box.innerHTML = res.map((u) => DT.userRow(u)).join('') || `<p class="muted">Ningún perfil coincide con «${DT.esc(peopleQ)}».</p>`;
    };
    q.addEventListener('input', draw);
    draw();
    if (peopleQ && document.activeElement !== q && location.hash === '#/comunidad') { q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
  };
})(window.DT);
