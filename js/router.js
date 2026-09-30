/* DivierteTEC — router por hash (#/ruta) y barra superior. */
(function (DT) {
  'use strict';

  DT.views = DT.views || {};
  const routes = [
    [/^#?\/?$/, 'landing'],
    [/^#\/tienda\/?$/, 'store'],
    [/^#\/juego\/([\w-]+)$/, 'gamePage'],
    [/^#\/biblioteca(?:\/([\w-]+))?$/, 'library'],
    [/^#\/comunidad$/, 'community'],
    [/^#\/planes$/, 'plans'],
    [/^#\/faq$/, 'faq'],
    [/^#\/perfil(?:\/([\w-]+))?$/, 'profile'],
    [/^#\/dev$/, 'dev', 'dev'],
    [/^#\/dev\/juego\/([\w-]+)$/, 'devGame', 'dev'],
    [/^#\/dev\/editor\/([\w-]+)\/(tienda|biblioteca)$/, 'editor', 'dev'],
    [/^#\/admin(?:\/(\w+))?$/, 'admin', 'admin']
  ];

  let current = { name: null, params: [] };
  DT.route = () => current;

  /* ---------- Guardia de salida: "¿Seguro que quieres salir?" ----------
     Una vista con cambios sin guardar registra { isDirty, save, discard }. */
  let guard = null, lastHash = location.hash || '#/';
  DT.setLeaveGuard = (g) => { guard = g; };
  DT.leaveCheck = (proceed, verb) => {
    if (!guard || !guard.isDirty()) { proceed(); return; }
    const v = verb || 'salir';
    const m = DT.modal({
      title: `${DT.icon.warn} ¿Seguro que quieres ${v}?`,
      body: `<p>Tienes cambios sin guardar${guard.label ? ' en <b>' + DT.esc(guard.label) + '</b>' : ''}. Tu borrador se conserva en este navegador, pero no se ha publicado.</p>`,
      actions: `<button class="btn ghost" data-close>Cancelar</button><button class="btn danger" data-leave>${v === 'salir' ? 'Salir' : 'Continuar'} sin guardar</button><button class="btn primary" data-savego>Guardar y ${v}</button>`
    });
    m.el.querySelector('[data-leave]').onclick = () => { const g = guard; guard = null; if (g && g.discard) g.discard(); m.close(); proceed(); };
    m.el.querySelector('[data-savego]').onclick = () => { const g = guard; if (g && g.save() === false) { m.close(); return; } guard = null; m.close(); proceed(); };
  };
  addEventListener('beforeunload', (e) => { if (guard && guard.isDirty()) { e.preventDefault(); e.returnValue = ''; } });

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
    app.classList.toggle('enter', !keepScroll); // animación de entrada solo al navegar
    DT.renderTopbar();
    if (!canAccess(found.need)) {
      app.innerHTML = `<section class="page narrow empty-state"><div class="big-ico">${DT.icon.lock}</div>
        <h2>Acceso restringido</h2><p>Esta sección es para ${found.need === 'admin' ? 'administradores' : 'desarrolladores'}.
        Cambia de rol desde el menú de usuario (arriba a la derecha) para la demostración.</p></section>`;
      return;
    }
    guard = null;
    lastHash = hash;
    const view = DT.views[found.name] || DT.views.notFound;
    let r = null;
    try { r = view(app, ...found.params); }
    catch (err) {
      console.error(err);
      app.innerHTML = `<section class="page narrow empty-state"><div class="big-ico">${DT.icon.flag}</div><h2>Algo salió mal en esta página</h2>
        <p>Los datos guardados en este navegador podrían estar incompletos. Puedes reintentar o restablecer la demo.</p>
        <p class="muted small">${DT.esc(String((err && err.message) || err))}</p>
        <div class="row" style="justify-content:center"><button class="btn primary" data-retry>Reintentar</button><button class="btn ghost" data-reset>Restablecer demo</button></div></section>`;
      DT.$('[data-retry]', app).onclick = () => DT.render();
    }
    current.cleanup = typeof r === 'function' ? r : null;
    DT.media.hydrate(app);
    if (!keepScroll && DT.fx) DT.fx.enter(app);
    if (keepScroll) scrollTo(0, y); else { scrollTo(0, 0); }
  };

  DT.go = (hash) => { if (location.hash === hash) DT.render(); else location.hash = hash; };

  DT.views.notFound = (app) => {
    app.innerHTML = `<section class="page narrow empty-state"><div class="big-ico">${DT.icon.joystick}</div><h2>Página no encontrada</h2>
      <p>Este nivel no existe… todavía.</p><a class="btn primary" href="#/tienda">Ir a la tienda</a></section>`;
  };

  /* ---------- Barra superior ---------- */
  DT.renderTopbar = () => {
    const me = DT.me();
    const r = current.name;
    const isActive = (names) => names.includes(r) ? 'active' : '';
    const eq = DT.equipped();
    const dark = eq.theme && eq.theme !== 'light';
    const unread = me.role === 'admin' ? DT.state().reports.filter((x) => x.status === 'open').length + DT.catalogGames().filter((g) => g.status === 'pending').length : 0;
    DT.$('#topbar').innerHTML = `
      <div class="topbar-inner">
        <a class="brand" href="#/" aria-label="DivierteTEC inicio">
          <span class="brand-mark">D</span><span class="brand-name">Divierte<b>TEC</b></span>
        </a>
        <button class="icon-btn nav-toggle" aria-label="Menú" data-navtoggle>${DT.icon.grid}</button>
        <nav class="mainnav" data-nav>
          <a href="#/tienda" class="${isActive(['store', 'gamePage'])}">TIENDA</a>
          <a href="#/biblioteca" class="${isActive(['library'])}">BIBLIOTECA</a>
          <a href="#/comunidad" class="${isActive(['community'])}">COMUNIDAD</a>
          <a href="#/planes" class="${isActive(['plans'])}">PASE</a>
          <a href="#/faq" class="${isActive(['faq'])}">FAQ</a>
          ${me.role === 'dev' || me.role === 'admin' ? `<a href="#/dev" class="${isActive(['dev', 'devGame', 'editor'])}">DESARROLLADOR</a>` : ''}
          ${me.role === 'admin' ? `<a href="#/admin" class="${isActive(['admin'])}">ADMIN${unread ? `<span class="badge-count">${unread}</span>` : ''}</a>` : ''}
          <a href="#/perfil" class="nav-user ${isActive(['profile'])}">${DT.esc(me.name.toUpperCase())}</a>
        </nav>
        <div class="topbar-right">
          <button class="wallet-chip" data-wallet title="Mi monedero">${DT.hasPass() ? DT.icon.ticket : DT.icon.wallet}<span class="amt"> ${DT.money(DT.wallet())}</span></button>
          <button class="icon-btn" data-dark title="${dark ? 'Tema claro' : 'Tema oscuro'}" aria-label="Cambiar tema">${dark ? DT.icon.sun : DT.icon.moon}</button>
          <div class="role-menu">
            <button class="user-chip" data-rolemenu aria-haspopup="true">${DT.avatarHTML(me, 30)}<span class="role-tag role-${me.role}">${{ user: 'Usuario', dev: 'Desarrollador', admin: 'Admin' }[me.role]}</span>${DT.icon.chevDown}</button>
            <div class="dropdown" data-dropdown hidden>
              <div class="dropdown-title">Cambiar de rol (demo)</div>
              ${DT.state().users.filter((u) => ['u_player', 'u_maravilla', 'u_admin'].includes(u.id)).map((u) => `
                <button class="dropdown-item ${u.id === me.id ? 'current' : ''}" data-switch="${u.id}">
                  ${DT.avatarHTML(u, 26)}<span><b>${DT.esc(u.name)}</b><small>${{ user: 'Usuario', dev: 'Desarrollador', admin: 'Administrador' }[u.role]}</small></span></button>`).join('')}
              <hr>
              <a class="dropdown-item" href="#/perfil">${DT.icon.gift}<span>Perfil y recompensas</span></a>
              <button class="dropdown-item" data-simulate>${DT.icon.clock}<span>Simular +1 h de juego<small>Simulación para la presentación · ${['gamePage', 'library'].includes(r) && current.params[0] ? 'en este juego' : 'en toda tu biblioteca'}</small></span></button>
              <button class="dropdown-item" data-reset>${DT.icon.reset}<span>Restablecer demo</span></button>
            </div>
          </div>
        </div>
      </div>`;
  };

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-dark]')) { DT.toggleDark(); return; }
    if (t.closest('[data-wallet]')) { DT.walletModal(); return; }
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
    if (t.closest('[data-simulate]')) {
      const gid = ['gamePage', 'library'].includes(current.name) ? current.params[0] : null;
      DT.simulatePlay(gid && DT.owns(gid) ? gid : null);
      dd.hidden = true;
      return;
    }
    if (t.closest('[data-reset]')) {
      DT.confirm('Restablecer demo', 'Se borrarán todos los datos locales (juegos subidos, logros, recompensas) y se cargarán los datos de ejemplo.').then((ok) => ok && DT.resetDemo());
      return;
    }
    if (dd && !dd.hidden && !t.closest('.role-menu')) dd.hidden = true;
    if (t.closest('.mainnav a')) DT.$('[data-nav]').classList.remove('open');
  });

  addEventListener('hashchange', () => {
    const target = location.hash || '#/';
    if (guard && guard.isDirty() && target !== lastHash) {
      history.replaceState(null, '', lastHash); // se queda en la página hasta que el usuario decida
      DT.leaveCheck(() => { location.hash = target; });
      return;
    }
    DT.render();
  });
})(window.DT);
