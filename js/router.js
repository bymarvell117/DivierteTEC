/* DivertiTEC — router por hash (#/ruta) y barra superior. */
(function (DT) {
  'use strict';

  DT.views = DT.views || {};
  const routes = [
    [/^#?\/?$/, 'landing'],
    [/^#\/tienda\/?$/, 'store'],
    [/^#\/juego\/([\w-]+)$/, 'gamePage'],
    [/^#\/biblioteca(?:\/([\w-]+))?$/, 'library'],
    [/^#\/comunidad$/, 'community'],
    [/^#\/perfil(?:\/([\w-]+))?$/, 'profile'],
    [/^#\/dev$/, 'dev', 'dev'],
    [/^#\/dev\/juego\/([\w-]+)$/, 'devGame', 'dev'],
    [/^#\/dev\/editor\/([\w-]+)\/(tienda|biblioteca)$/, 'editor', 'dev'],
    [/^#\/admin(?:\/(\w+))?$/, 'admin', 'admin']
  ];

  let current = { name: null, params: [] };
  DT.route = () => current;

  const canAccess = (need) => {
    if (!need) return true;
    const me = DT.me();
    if (need === 'dev') return me.role === 'dev' || me.role === 'admin';
    return me.role === need;
  };

  DT.render = (keepScroll) => {
    const hash = location.hash || '#/';
    let found = null;
    for (const [re, name, need] of routes) {
      const m = hash.match(re);
      if (m) { found = { name, params: m.slice(1), need }; break; }
    }
    const app = DT.$('#app');
    const y = scrollY;
    if (current.cleanup) { try { current.cleanup(); } catch (e) { console.error(e); } }
    if (!found) found = { name: 'notFound', params: [] };
    current = found;
    document.body.dataset.route = found.name;
    DT.renderTopbar();
    if (!canAccess(found.need)) {
      app.innerHTML = `<section class="page narrow empty-state"><div class="big-ico">${DT.icon.lock}</div>
        <h2>Acceso restringido</h2><p>Esta sección es para ${found.need === 'admin' ? 'administradores' : 'desarrolladores'}.
        Cambia de rol desde el menú de usuario (arriba a la derecha) para la demostración.</p></section>`;
      return;
    }
    const view = DT.views[found.name] || DT.views.notFound;
    const r = view(app, ...found.params);
    current.cleanup = typeof r === 'function' ? r : null;
    DT.media.hydrate(app);
    if (keepScroll) scrollTo(0, y); else { scrollTo(0, 0); }
  };

  DT.go = (hash) => { if (location.hash === hash) DT.render(); else location.hash = hash; };

  DT.views.notFound = (app) => {
    app.innerHTML = `<section class="page narrow empty-state"><div class="big-ico">🕹️</div><h2>Página no encontrada</h2>
      <p>Este nivel no existe… todavía.</p><a class="btn primary" href="#/tienda">Ir a la tienda</a></section>`;
  };

  /* ---------- Barra superior ---------- */
  DT.renderTopbar = () => {
    const me = DT.me();
    const r = current.name;
    const isActive = (names) => names.includes(r) ? 'active' : '';
    const eq = DT.equipped();
    const dark = eq.theme && eq.theme !== 'light';
    const unread = me.role === 'admin' ? DT.state().reports.filter((x) => x.status === 'open').length + DT.state().games.filter((g) => g.status === 'pending').length : 0;
    DT.$('#topbar').innerHTML = `
      <div class="topbar-inner">
        <a class="brand" href="#/" aria-label="DivertiTEC inicio">
          <span class="brand-mark">D</span><span class="brand-name">Diverti<b>TEC</b></span>
        </a>
        <button class="icon-btn nav-toggle" aria-label="Menú" data-navtoggle>${DT.icon.grid}</button>
        <nav class="mainnav" data-nav>
          <a href="#/tienda" class="${isActive(['store', 'gamePage'])}">TIENDA</a>
          <a href="#/biblioteca" class="${isActive(['library'])}">BIBLIOTECA</a>
          <a href="#/comunidad" class="${isActive(['community'])}">COMUNIDAD</a>
          ${me.role === 'dev' || me.role === 'admin' ? `<a href="#/dev" class="${isActive(['dev', 'devGame', 'editor'])}">DESARROLLADOR</a>` : ''}
          ${me.role === 'admin' ? `<a href="#/admin" class="${isActive(['admin'])}">ADMIN${unread ? `<span class="badge-count">${unread}</span>` : ''}</a>` : ''}
          <a href="#/perfil" class="${isActive(['profile'])}">${DT.esc(me.name.toUpperCase())}</a>
        </nav>
        <div class="topbar-right">
          <button class="icon-btn" data-dark title="${dark ? 'Tema claro' : 'Tema oscuro'}" aria-label="Cambiar tema">${dark ? DT.icon.sun : DT.icon.moon}</button>
          <div class="role-menu">
            <button class="user-chip" data-rolemenu aria-haspopup="true">${DT.avatarHTML(me, 30)}<span class="role-tag role-${me.role}">${{ user: 'Usuario', dev: 'Desarrollador', admin: 'Admin' }[me.role]}</span>${DT.icon.chevDown}</button>
            <div class="dropdown" data-dropdown hidden>
              <div class="dropdown-title">Cambiar de rol (demo)</div>
              ${DT.state().users.filter((u) => ['u_player', 'u_dev', 'u_admin', 'u_dev2', 'u_luna'].includes(u.id)).map((u) => `
                <button class="dropdown-item ${u.id === me.id ? 'current' : ''}" data-switch="${u.id}">
                  ${DT.avatarHTML(u, 26)}<span><b>${DT.esc(u.name)}</b><small>${{ user: 'Usuario', dev: 'Desarrollador', admin: 'Administrador' }[u.role]}</small></span></button>`).join('')}
              <hr>
              <a class="dropdown-item" href="#/perfil">${DT.icon.gift}<span>Perfil y recompensas</span></a>
              <button class="dropdown-item" data-reset>${DT.icon.reset}<span>Restablecer demo</span></button>
            </div>
          </div>
        </div>
      </div>`;
  };

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-dark]')) { DT.toggleDark(); return; }
    if (t.closest('[data-navtoggle]')) { DT.$('[data-nav]').classList.toggle('open'); return; }
    const dd = DT.$('[data-dropdown]');
    if (t.closest('[data-rolemenu]')) { dd.hidden = !dd.hidden; return; }
    const sw = t.closest('[data-switch]');
    if (sw) {
      DT.state().currentUserId = sw.dataset.switch;
      DT.applyTheme();
      DT.rewards.checkPlatform();
      DT.emit('user');
      const u = DT.me();
      DT.toast(`Ahora eres <b>${DT.esc(u.name)}</b> (${{ user: 'usuario', dev: 'desarrollador', admin: 'administrador' }[u.role]})`);
      if (u.role === 'admin' && !location.hash.startsWith('#/admin')) DT.go('#/admin');
      else if (u.role === 'dev' && location.hash.startsWith('#/admin')) DT.go('#/dev');
      else DT.render(true);
      return;
    }
    if (t.closest('[data-reset]')) {
      DT.confirm('Restablecer demo', 'Se borrarán todos los datos locales (juegos subidos, logros, recompensas) y se cargarán los datos de ejemplo.').then((ok) => ok && DT.resetDemo());
      return;
    }
    if (dd && !dd.hidden && !t.closest('.role-menu')) dd.hidden = true;
    if (t.closest('.mainnav a')) DT.$('[data-nav]').classList.remove('open');
  });

  addEventListener('hashchange', () => DT.render());
})(window.DT);
