/* DivierteTEC — sesión de demostración (placeholder).
   Iniciar sesión, registrarse y cerrar sesión funcionan de extremo a extremo en el prototipo,
   pero las contraseñas NO se validan ni se guardan: en el sitio web esto lo haría un servidor
   de autenticación. Al registrarse se ofrece verificar la cuenta como TecNM o hacerlo más tarde. */
(function (DT) {
  'use strict';

  const S = () => DT.state();
  DT.isLoggedIn = () => !S().loggedOut;
  /* Rutas visibles con la sesión cerrada */
  DT.PUBLIC_ROUTES = ['landing', 'store', 'gamePage', 'faq', 'login', 'signup', 'notFound'];

  DT.logout = () => {
    S().loggedOut = true;
    DT.log('Cerró sesión (demostración).');
    DT.save();
    DT.toast('Sesión cerrada (demostración).');
    DT.go('#/');
    DT.render();
  };
  const startSession = (u, msg) => {
    const s = S();
    s.loggedOut = false;
    s.currentUserId = u.id;
    DT.applyTheme();
    DT.rewards.checkPlatform();
    DT.emit('user');
    if (msg) DT.toast(msg, { kind: 'ok' });
  };
  const proto = `<p class="notice">${DT.icon.lock} <span><b>Prototipo:</b> la contraseña no se valida ni se guarda. En el sitio web la sesión la maneja un servidor seguro.</span></p>`;
  const tabs = (on) => `<div class="auth-tabs"><a href="#/entrar" class="${on === 'login' ? 'on' : ''}">${DT.icon.login} Iniciar sesión</a><a href="#/registro" class="${on === 'signup' ? 'on' : ''}">${DT.icon.userPlus} Registrarse</a></div>`;
  const brand = `<div class="auth-brand"><span class="brand-mark">D</span><span class="brand-name">Divierte<b>TEC</b></span></div>`;

  /* Con la sesión cerrada, jugar, comprar, reseñar o reportar piden iniciar sesión */
  document.addEventListener('click', (e) => {
    if (DT.isLoggedIn()) return;
    const b = e.target.closest('[data-act],[data-report],[data-report-review],[data-helpful],[data-review] button,[data-wallet]');
    if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation();
    DT.toast('Inicia sesión o regístrate para jugar, comprar y participar.');
    DT.go('#/entrar');
  }, true);

  /* ---------- Iniciar sesión ---------- */
  DT.views.login = (app) => {
    const demo = S().users.filter((u) => ['u_player', 'u_maravilla', 'u_admin'].includes(u.id));
    const others = S().users.filter((u) => u.email && !demo.includes(u));
    app.innerHTML = `
      <section class="page auth">
        <div class="card auth-card">
          ${brand}${tabs('login')}
          <form data-login class="auth-form">
            <label class="field"><span>Correo o nombre de usuario</span><input name="who" required autocomplete="username"></label>
            <label class="field"><span>Contraseña</span><input name="pass" type="password" required autocomplete="current-password"></label>
            <p class="err" data-err hidden></p>
            <button class="btn primary big">${DT.icon.login} Entrar</button>
          </form>
          ${proto}
          <h4>Cuentas de la demostración</h4>
          <div class="auth-quick">${demo.concat(others).map((u) => `<button class="auth-acc" data-as="${u.id}">${DT.avatarHTML(u, 30)}<span><b>${DT.esc(u.name)}</b><small>${{ user: 'Jugador', dev: 'Desarrollador', admin: 'Administrador' }[u.role]}</small></span></button>`).join('')}</div>
        </div>
      </section>`;
    const f = DT.$('[data-login]', app);
    f.onsubmit = (e) => {
      e.preventDefault();
      const who = f.who.value.trim().toLowerCase();
      const u = S().users.find((x) => x.name.toLowerCase() === who || (x.email || '').toLowerCase() === who);
      const err = DT.$('[data-err]', app);
      if (!u) { err.hidden = false; err.innerHTML = `No encontramos esa cuenta. <a href="#/registro">¿Quieres registrarte?</a>`; return; }
      if (u.status === 'suspended') { err.hidden = false; err.textContent = 'Esta cuenta está suspendida por la administración.'; return; }
      startSession(u, `¡Hola de nuevo, <b>${DT.esc(u.name)}</b>!`);
      DT.go(u.role === 'admin' ? '#/admin' : '#/tienda');
    };
    DT.$$('[data-as]', app).forEach((b) => b.onclick = () => { const u = DT.user(b.dataset.as); startSession(u, `¡Hola de nuevo, <b>${DT.esc(u.name)}</b>!`); DT.go(u.role === 'admin' ? '#/admin' : '#/tienda'); });
  };

  /* ---------- Registrarse ---------- */
  let justCreated = null; // id de la cuenta recién creada: muestra el paso TecNM
  DT.views.signup = (app) => {
    const created = justCreated && DT.user(justCreated);
    if (created) return tecnmStep(app, created);
    app.innerHTML = `
      <section class="page auth">
        <div class="card auth-card">
          ${brand}${tabs('signup')}
          <form data-signup class="auth-form">
            <label class="field"><span>Nombre de usuario</span><input name="name" required minlength="3" maxlength="24" autocomplete="username"></label>
            <label class="field"><span>Correo</span><input name="email" type="email" required autocomplete="email" placeholder="tu@correo.com"></label>
            <small class="muted" data-tecnmhint hidden>${DT.ic('cap')} Es un correo del TecNM: en el siguiente paso puedes verificarte y obtener beneficios.</small>
            <div class="form-grid">
              <label class="field"><span>Contraseña</span><input name="pass" type="password" required minlength="8" autocomplete="new-password"></label>
              <label class="field"><span>Confirmar contraseña</span><input name="pass2" type="password" required minlength="8" autocomplete="new-password"></label>
            </div>
            <label class="check"><input type="checkbox" name="terms" required> Acepto los términos de uso y el aviso de privacidad.</label>
            <p class="err" data-err hidden></p>
            <button class="btn primary big">${DT.icon.userPlus} Crear cuenta</button>
          </form>
          ${proto}
          <p class="muted small">¿Ya tienes cuenta? <a href="#/entrar">Inicia sesión</a></p>
        </div>
      </section>`;
    const f = DT.$('[data-signup]', app), err = DT.$('[data-err]', app);
    f.email.addEventListener('input', () => { DT.$('[data-tecnmhint]', app).hidden = !DT.TECNM_EMAIL.test(f.email.value.trim()); });
    f.onsubmit = (e) => {
      e.preventDefault();
      const nm = f.name.value.trim(), em = f.email.value.trim().toLowerCase();
      const fail = (m) => { err.hidden = false; err.textContent = m; };
      if (DT.hasBanned(nm)) return fail('El nombre contiene palabras no permitidas.');
      if (S().users.some((u) => u.name.toLowerCase() === nm.toLowerCase())) return fail('Ese nombre de usuario ya existe.');
      if (S().users.some((u) => (u.email || '').toLowerCase() === em)) return fail('Ya hay una cuenta con ese correo.');
      if (f.pass.value !== f.pass2.value) return fail('Las contraseñas no coinciden.');
      const u = { id: DT.uid('u'), name: nm, email: em, role: 'user', bio: '', status: 'active', createdAt: Date.now() };
      S().users.push(u);
      S().wallets[u.id] = 0;
      DT.log(`Se registró ${nm}.`);
      justCreated = u.id;
      startSession(u, `¡Bienvenido a DivierteTEC, <b>${DT.esc(nm)}</b>!`);
      DT.go('#/registro');
    };
  };

  /* Paso 2: ¿Eres del TecNM? */
  function tecnmStep(app, u) {
    const B = DT.TECNM_BENEFITS();
    const isTec = DT.TECNM_EMAIL.test(u.email || '');
    const li = (arr) => `<ul class="benefits">${arr.map(([ic, t]) => `<li>${DT.ic(ic)}<span>${t}</span></li>`).join('')}</ul>`;
    app.innerHTML = `
      <section class="page auth">
        <div class="card auth-card wide">
          ${brand}
          <div class="auth-done">${DT.icon.check} Cuenta creada: <b>${DT.esc(u.name)}</b></div>
          <h2>${DT.ic('cap')} ¿Eres del TecNM?</h2>
          <p>${isTec ? `Tu correo <b>${DT.esc(u.email)}</b> es del TecNM. ` : ''}Verifica tu cuenta con tu correo institucional, número de control y credencial para obtener beneficios exclusivos:</p>
          <div class="grid cols-2">
            <div class="card"><h4>Como jugador</h4>${li(B.user)}</div>
            <div class="card"><h4>Para publicar juegos (requisito)</h4>${li(B.dev)}</div>
          </div>
          <div class="auth-choice">
            <button class="btn ghost big" data-later>Hacerlo más tarde</button>
            <button class="btn primary big ${isTec ? 'glow' : ''}" data-tecnm>${DT.ic('cap')} Registrarme como TecNM</button>
          </div>
          <p class="muted small">Puedes verificarte cuando quieras desde tu perfil o el menú de usuario.</p>
        </div>
      </section>`;
    DT.$('[data-later]', app).onclick = () => { justCreated = null; DT.toast('Listo. Puedes verificarte como TecNM desde tu perfil cuando quieras.'); DT.go('#/tienda'); };
    DT.$('[data-tecnm]', app).onclick = () => {
      justCreated = null;
      if (isTec) { const s = S(); s.tecnmDraft = s.tecnmDraft || {}; s.tecnmDraft[u.id] = Object.assign(s.tecnmDraft[u.id] || {}, { email: u.email }); DT.save(); }
      DT.go('#/verificacion-tecnm');
    };
  }
})(window.DT);
