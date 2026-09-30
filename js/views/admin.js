/* DivierteTEC — panel de administración: revisión de juegos, desarrolladores,
   reportes, moderación de contenido, destacados y registro de actividad. */
(function (DT) {
  'use strict';

  const TABS = [['resumen', 'Resumen', 'chart'], ['revision', 'Revisión de juegos', 'eye'], ['criterios', 'Criterios de aprobación', 'shield'], ['solicitudes', 'Solicitudes de cuentas', 'users'], ['juegos', 'Catálogo', 'grid'], ['finanzas', 'Finanzas', 'chart'], ['usuarios', 'Desarrolladores y usuarios', 'users'],
    ['reportes', 'Reportes', 'flag'], ['moderacion', 'Moderación', 'shield'], ['registro', 'Registro', 'clock']];

  DT.views.admin = (app, tab) => {
    tab = TABS.some(([k]) => k === tab) ? tab : 'resumen';
    // La administración trabaja solo con el catálogo: los juegos personales (private) no se listan
    const st = DT.state();
    const s = Object.create(st, { games: { get: () => DT.catalogGames(), set: (v) => { st.games = v.concat(st.games.filter((g) => g.private)); } } });
    const openReports = s.reports.filter((r) => r.status === 'open');
    const pending = s.games.filter((g) => g.status === 'pending');
    app.innerHTML = `
      <div class="admin">
        <aside class="admin-side">
          <h3>${DT.icon.shield} Administración</h3>
          ${TABS.map(([k, v, ic]) => `<a href="#/admin/${k}" class="${tab === k ? 'on' : ''}">${DT.icon[ic]}<span>${v}</span>
            ${k === 'revision' && pending.length ? `<b class="badge-count static">${pending.length}</b>` : ''}
            ${k === 'finanzas' && s.promos.some((p) => p.status === 'pending') ? `<b class="badge-count static">${s.promos.filter((p) => p.status === 'pending').length}</b>` : ''}
            ${k === 'solicitudes' && DT.pendingRequests() ? `<b class="badge-count static">${DT.pendingRequests()}</b>` : ''}
            ${k === 'reportes' && openReports.length ? `<b class="badge-count static">${openReports.length}</b>` : ''}</a>`).join('')}
        </aside>
        <section class="admin-main" data-body></section>
      </div>`;
    const body = DT.$('[data-body]', app);
    ({ resumen, revision, criterios, solicitudes: (b) => DT.adminSolicitudes(b, act), juegos, finanzas, usuarios, reportes, moderacion, registro })[tab](body, s);
    DT.media.hydrate(body);
  };

  const act = (text) => { DT.log(text); DT.emit('admin'); };

  function resumen(body, s) {
    const users = s.users.filter((u) => u.role === 'user').length;
    const devs = s.users.filter((u) => u.role === 'dev');
    const byFormat = ['html', 'cpp', 'exe'].map((f) => [f, s.games.filter((g) => g.format === f && g.status === 'approved').length]);
    const maxF = Math.max(1, ...byFormat.map(([, n]) => n));
    const totalTime = Object.values(s.library).reduce((t, lib) => t + Object.values(lib).reduce((a, e) => a + (e.playtime || 0), 0), 0);
    body.innerHTML = `
      <div class="page-head"><div><h1>Resumen</h1><p>Estado general de DivierteTEC.</p></div></div>
      <div class="grid cols-4 kpis">
        <div class="kpi"><small>Juegos publicados</small><b>${s.games.filter((g) => g.status === 'approved').length}</b></div>
        <div class="kpi warn"><small>Pendientes de revisión</small><b>${s.games.filter((g) => g.status === 'pending').length}</b></div>
        <div class="kpi bad"><small>Reportes abiertos</small><b>${s.reports.filter((r) => r.status === 'open').length}</b></div>
        <div class="kpi"><small>Usuarios / Devs</small><b>${users} / ${devs.length}</b></div>
      </div>
      <div class="grid cols-2">
        <div class="card"><h3>Juegos por formato</h3>
          ${byFormat.map(([f, n]) => `<div class="stat-row"><span>${DT.formatLabel[f]}</span><div class="bar"><i style="width:${n / maxF * 100}%"></i></div><b>${n}</b></div>`).join('')}
          <p class="muted">Tiempo total jugado en la plataforma: <b>${DT.fmtTime(totalTime)}</b></p>
        </div>
        <div class="card"><h3>Actividad reciente</h3>${s.log.slice(0, 8).map(logRow).join('') || '<p class="muted">Sin actividad.</p>'}</div>
      </div>`;
  }

  const logRow = (l) => `<div class="log-row"><small class="muted">${DT.timeAgo(l.date)}</small><b>${DT.esc((DT.user(l.actor) || { name: 'Sistema' }).name)}</b> <span>${DT.esc(l.text)}</span></div>`;

  function revision(body, s) {
    const list = s.games.filter((g) => g.status === 'pending').sort((a, b) => (DT.isTecnmGame(b) ? 1 : 0) - (DT.isTecnmGame(a) ? 1 : 0) || (a.submittedAt || 0) - (b.submittedAt || 0));
    body.innerHTML = `
      <div class="page-head"><div><h1>Revisión de juegos</h1><p>Los juegos no son públicos hasta que se aprueban. Los estudios TecNM verificados tienen prioridad en la cola.</p></div></div>
      ${list.map((g) => {
        const dev = DT.user(g.devId) || {};
        const flagged = DT.hasBanned([g.title, g.short, g.description, (g.tags || []).join(' ')].join(' '));
        return `<div class="card review-card">
          ${DT.coverHTML(g)}
          <div class="review-card-body">
            <div class="row"><h3 style="margin:0">${DT.esc(g.title)}</h3>${flagged ? '<span class="pill bad">' + DT.icon.warn + ' Palabras filtradas</span>' : ''}${DT.isTecnmGame(g) ? '<span class="pill tecnm">' + DT.icon.cap + ' Prioridad TecNM</span>' : ''}<span class="pill">${DT.formatLabel[g.format]}</span></div>
            <small class="muted">${DT.esc(dev.name)} ${dev.verified ? '✔' : '(sin verificar)'} · enviado ${DT.timeAgo(g.submittedAt || g.createdAt)}</small>
            <p>${DT.esc(g.short)}</p>
            <div class="row small muted">${g.format === 'html' ? `Archivos: ${g.files ? g.files.count + ' · ' + DT.fmtBytes(g.files.size) : 'integrado'}` : 'Descargable'} · ${(g.achievements || []).length} logros · Edad: <b>${DT.esc((g.compliance || {}).age || 'sin declarar')}</b> · Violencia: <b>${DT.esc(((DT.VIOLENCE.find((v) => v[0] === (g.compliance || {}).violence) || [])[1]) || 'sin declarar')}</b></div>
            ${criteriaBlock(g)}
            <div class="row">
              ${g.format === 'html' ? `<button class="btn ghost sm" data-test="${g.id}">${DT.icon.play} Probar juego</button>` : ''}
              <a class="btn ghost sm" href="#/juego/${g.id}">${DT.icon.eye} Ver página</a>
              <span class="spacer"></span>
              <button class="btn warn sm" data-decide="changes" data-gid="${g.id}">Pedir cambios</button>
              <button class="btn danger sm" data-decide="rejected" data-gid="${g.id}">${DT.icon.x} Rechazar</button>
              <button class="btn success sm" data-decide="approved" data-gid="${g.id}" ${DT.criteriaStatus(g).every((x) => x.ok) ? '' : 'disabled title="Marca todos los criterios para aprobar"'}>${DT.icon.check} Aprobar</button>
            </div>
          </div></div>`;
      }).join('') || `<div class="empty-inline">${DT.icon.check} No hay juegos pendientes de revisión.</div>`}`;

    DT.$$('[data-test]', body).forEach((b) => b.onclick = () => DT.play(b.dataset.test, { test: true }));
    DT.$$('[data-crit]', body).forEach((c) => c.onchange = () => {
      const g = DT.game(c.dataset.gid);
      g.review = g.review || {}; g.review.checks = g.review.checks || {};
      g.review.checks[c.dataset.crit] = c.checked;
      DT.save();
      const card = c.closest('.review-card'), st = DT.criteriaStatus(g), ok = st.filter((x) => x.ok).length;
      card.querySelector('[data-decide="approved"]').disabled = ok < st.length;
      card.querySelector('[data-critcount]').textContent = ok + ' / ' + st.length;
      card.querySelector('.crit-meter i').style.width = (ok / st.length * 100) + '%';
    });
    DT.$$('[data-critall]', body).forEach((b) => b.onclick = () => DT.$$(`[data-crit][data-gid="${b.dataset.critall}"]`, body).forEach((c) => { if (!c.checked) { c.checked = true; c.onchange(); } }));
    DT.$$('[data-decide]', body).forEach((b) => b.onclick = async () => {
      const g = DT.game(b.dataset.gid);
      const st = b.dataset.decide;
      let note = '';
      if (st === 'approved' && !DT.criteriaStatus(g).every((x) => x.ok)) { DT.toast('Faltan criterios por cumplir.', { kind: 'warn' }); return; }
      if (st !== 'approved') {
        const missing = DT.criteriaStatus(g).filter((x) => !x.ok).map((x) => '• ' + x.c.text);
        note = await DT.prompt(st === 'rejected' ? 'Motivo del rechazo' : 'Cambios solicitados', 'Mensaje para el desarrollador', missing.length ? 'No cumple estos criterios de aprobación:\n' + missing.join('\n') : '');
        if (note == null) return;
      }
      g.status = st;
      g.reviewNote = note;
      g.review = Object.assign(g.review || {}, { by: DT.me().id, date: Date.now(), decision: st });
      if (st === 'approved') { g.createdAt = Date.now(); DT.rewards.checkPlatform(g.devId); if (DT.fx) DT.fx.burstAt(b, { up: true, count: 80 }); }
      DT.toast(`«${DT.esc(g.title)}» → ${{ approved: 'aprobado', rejected: 'rechazado', changes: 'cambios solicitados' }[st]}`, { kind: st === 'approved' ? 'ok' : 'warn' });
      act(`${{ approved: 'Aprobó', rejected: 'Rechazó', changes: 'Pidió cambios en' }[st]} «${g.title}».${note ? ' Nota: ' + note : ''}`);
    });
  }

  /* Lista de criterios de aprobación de un juego: automáticos (✓/✗) y casillas para el admin */
  function criteriaBlock(g) {
    const st = DT.criteriaStatus(g), ok = st.filter((x) => x.ok).length;
    return `<div class="crit">
      <div class="row"><b>${DT.icon.shield} Criterios de aprobación</b><span class="spacer"></span><small data-critcount>${ok} / ${st.length}</small><button class="btn ghost sm" data-critall="${g.id}">Marcar revisados</button></div>
      <div class="crit-meter"><i style="width:${ok / st.length * 100}%"></i></div>
      <div class="crit-groups">${DT.APPROVAL_CRITERIA.map((grp) => `<div class="crit-group"><h5>${DT.ic(grp.icon)} ${grp.group}</h5>${grp.items.map((c) => {
        const x = st.find((y) => y.c === c);
        return c.auto ? `<div class="crit-item auto ${x.ok ? 'ok' : 'bad'}">${x.ok ? DT.icon.check : DT.icon.x}<span>${c.text}</span><small>automático</small></div>`
          : `<label class="crit-item"><input type="checkbox" data-crit="${c.id}" data-gid="${g.id}" ${x.ok ? 'checked' : ''}><span>${c.text}</span></label>`;
      }).join('')}</div>`).join('')}</div>
    </div>`;
  }

  function criterios(body) {
    body.innerHTML = `
      <div class="page-head"><div><h1>Criterios de aprobación</h1><p>Lista ligera enfocada en el contenido: lo que revisa la administración antes de publicar un juego.</p></div></div>
      <div class="notice">${DT.icon.shield} ${DT.CRITERIA_REF}</div>
      <div class="grid cols-2">${DT.APPROVAL_CRITERIA.map((grp) => `<div class="card crit-card"><h3>${DT.ic(grp.icon)} ${grp.group}</h3>${grp.ref ? `<small class="muted">Referencia: ${grp.ref}</small>` : ''}
        <ul class="crit-list">${grp.items.map((c) => `<li>${c.auto ? `<span class="pill ok">Automático</span>` : `<span class="pill">Revisión</span>`} ${c.text}</li>`).join('')}</ul></div>`).join('')}</div>
      <div class="card"><h3>${DT.icon.chart} Flujo de revisión</h3><ol class="crit-flow"><li><b>El estudio se autoevalúa</b> en su panel y declara edad recomendada, tipo de violencia y créditos.</li><li><b>Los criterios técnicos</b> se verifican solos (archivos, ficha, violencia acorde a la edad, créditos).</li><li><b>La administración prueba el juego</b> y confirma los criterios de contenido: violencia, temas bélicos, odio, contenido adulto y seguridad.</li><li><b>Aprobar</b> se habilita al cumplir todo; si falta algo, «Pedir cambios» redacta la nota con lo pendiente.</li></ol></div>`;
  }

  function juegos(body, s) {
    body.innerHTML = `
      <div class="page-head"><div><h1>Catálogo</h1><p>Destacados de la portada, visibilidad y retiro de juegos. Retirar oculta el juego de la tienda; quien ya lo tiene lo conserva.</p></div></div>
      <div class="table">
        <div class="tr th"><span>Juego</span><span>Desarrollador</span><span>Estado</span><span>Partidas</span><span>Destacado</span><span>Acciones</span></div>
        ${s.games.map((g) => `<div class="tr">
          <span class="row nowrap">${DT.coverHTML(g, 'mini')}<a href="#/juego/${g.id}">${DT.esc(g.title)}</a></span>
          <span>${DT.esc((DT.user(g.devId) || {}).name)}</span>
          <span>${DT.statusPill(g.status)}</span>
          <span>${g.plays || 0}</span>
          <span><label class="switch"><input type="checkbox" data-feat="${g.id}" ${g.featured ? 'checked' : ''} ${g.status !== 'approved' ? 'disabled' : ''}><i></i></label></span>
          <span class="row nowrap">
            ${g.status === 'approved' ? `<button class="btn danger sm" data-unpub="${g.id}">${DT.icon.eyeOff} Retirar</button>` : ''}
            ${['rejected', 'changes', 'withdrawn'].includes(g.status) ? `<button class="btn success sm" data-repub="${g.id}">${DT.icon.upload} Publicar</button>` : ''}
            <button class="icon-btn sm danger" data-delgame="${g.id}" title="Eliminar">${DT.icon.trash}</button>
          </span></div>`).join('')}
      </div>`;
    DT.$$('[data-feat]', body).forEach((c) => c.onchange = () => { const g = DT.game(c.dataset.feat); g.featured = c.checked; act(`${c.checked ? 'Destacó' : 'Quitó de destacados'} «${g.title}».`); });
    DT.$$('[data-unpub]', body).forEach((b) => b.onclick = () => DT.withdrawModal(DT.game(b.dataset.unpub)));
    DT.$$('[data-repub]', body).forEach((b) => b.onclick = () => DT.republish(DT.game(b.dataset.repub)));
    DT.$$('[data-delgame]', body).forEach((b) => b.onclick = async () => {
      const g = DT.game(b.dataset.delgame);
      if (!(await DT.confirm('Eliminar juego', `¿Eliminar definitivamente «${DT.esc(g.title)}» y sus archivos?`))) return;
      s.games = s.games.filter((x) => x !== g);
      Object.values(s.library).forEach((lib) => delete lib[g.id]);
      await DT.files.removePrefix('game:' + g.id + ':');
      act(`Eliminó «${g.title}».`);
    });
  }

  function finanzas(body, s) {
    const f = DT.financeSummary();
    const e = s.economy;
    const pending = s.promos.filter((p) => p.status === 'pending');
    const bars = [['Comisiones por ventas', f.saleFees], ['Pase (30 % plataforma)', f.passPlatform], ['Destacados patrocinados', f.promos]];
    const maxB = Math.max(1, ...bars.map((b) => b[1]));
    body.innerHTML = `
      <div class="page-head"><div><h1>Finanzas</h1><p>Modelo "Crece con tu estudio" · dinero simulado para la demostración.</p></div></div>
      <div class="grid cols-4 kpis">
        <div class="kpi"><small>Ventas brutas de juegos</small><b>${DT.money(f.sales)}</b></div>
        <div class="kpi"><small>Ingresos de la plataforma</small><b>${DT.money(f.platform)}</b></div>
        <div class="kpi"><small>Pagado a estudios</small><b>${DT.money(f.toDevs)}</b></div>
        <div class="kpi"><small>Suscriptores del Pase</small><b>${f.subscribers}</b></div>
      </div>
      <div class="grid cols-2">
        <div class="card">
          <h3>De dónde vienen los ingresos</h3>
          ${bars.map(([k, v]) => `<div class="stat-row"><span>${k}</span><div class="bar"><i style="width:${v / maxB * 100}%"></i></div><b>${DT.money(v)}</b></div>`).join('')}
          <p class="muted small">Propinas (van completas a los estudios): ${DT.money(f.tips)}</p>
          <hr>
          <h3>${DT.icon.ticket} Fondo del Pase</h3>
          <p>Pendiente de repartir: <b>${DT.money(f.fund)}</b> (${Math.round(e.passDevShare * 100)} % de las suscripciones).</p>
          <button class="btn primary sm" data-distribute ${f.fund <= 0 ? 'disabled' : ''}>Repartir por tiempo jugado</button>
        </div>
        <form class="card" data-rates>
          <h3>${DT.icon.gear} Tasas y precios</h3>
          <div class="form-grid">
            <label class="field"><span>Comisión estudios TecNM (%)</span><input type="number" name="rateStudent" min="0" max="50" value="${Math.round(e.rateStudent * 100)}"></label>
            <label class="field"><span>Comisión externa (%)</span><input type="number" name="rateExternal" min="0" max="50" value="${Math.round(e.rateExternal * 100)}"></label>
            <label class="field"><span>Semilla TEC (MXN sin comisión)</span><input type="number" name="seedAllowance" min="0" value="${e.seedAllowance}"></label>
            <label class="field"><span>Precio del Pase (MXN/mes)</span><input type="number" name="passPrice" min="0" value="${e.passPrice}"></label>
            <label class="field"><span>Parte del Pase para estudios (%)</span><input type="number" name="passDevShare" min="0" max="100" value="${Math.round(e.passDevShare * 100)}"></label>
            <label class="field"><span>Destacado patrocinado (MXN)</span><input type="number" name="promoPrice" min="0" value="${e.promoPrice}"></label>
          </div>
          <div class="row"><span class="spacer"></span><button class="btn primary sm">Guardar tasas</button></div>
        </form>
      </div>
      <div class="card">
        <h3>${DT.icon.megaphone} Solicitudes de promoción (${pending.length})</h3>
        ${pending.map((p) => { const g = DT.game(p.gameId); return `<div class="log-row"><b>${DT.esc(g.title)}</b> · ${DT.esc((DT.user(p.devId) || {}).name)} · ${DT.money(p.price)} · ${DT.timeAgo(p.date)}
          <div class="row"><button class="btn success sm" data-promo-ok="${p.id}">Aprobar</button><button class="btn ghost sm" data-promo-no="${p.id}">Rechazar y reembolsar</button></div></div>`; }).join('') || '<p class="muted">Sin solicitudes pendientes.</p>'}
      </div>
      <div class="card">
        <h3>Libro de transacciones</h3>
        <div class="table"><div class="tr tx th"><span>Fecha</span><span>Tipo</span><span>Movimiento</span><span>Monto</span><span>Comisión</span><span>Nota</span></div>
        ${s.ledger.filter((x) => x.type !== 'topup').slice(0, 60).map(DT.txRow).join('')}</div>
      </div>`;
    DT.$('[data-distribute]', body).onclick = () => {
      const out = DT.distributePassFund();
      DT.toast('Fondo repartido: ' + out.map((o) => `${DT.esc(DT.user(o.devId).name)} ${DT.money(o.amount)}`).join(' · '), { kind: 'ok', ms: 5000 });
    };
    DT.$('[data-rates]', body).onsubmit = (ev) => {
      ev.preventDefault();
      const fm = ev.target;
      Object.assign(e, { rateStudent: fm.rateStudent.value / 100, rateExternal: fm.rateExternal.value / 100, seedAllowance: +fm.seedAllowance.value,
        passPrice: +fm.passPrice.value, passDevShare: fm.passDevShare.value / 100, promoPrice: +fm.promoPrice.value });
      act('Actualizó las tasas de la plataforma.');
      DT.toast('Tasas guardadas.', { kind: 'ok' });
    };
    DT.$$('[data-promo-ok]', body).forEach((b) => b.onclick = () => DT.decidePromo(b.dataset.promoOk, true));
    DT.$$('[data-promo-no]', body).forEach((b) => b.onclick = () => DT.decidePromo(b.dataset.promoNo, false));
  }

  function usuarios(body, s) {
    body.innerHTML = `
      <div class="page-head"><div><h1>Desarrolladores y usuarios</h1><p>Verifica estudios, suspende cuentas y asigna roles.</p></div></div>
      <div class="table">
        <div class="tr th"><span>Cuenta</span><span>Rol</span><span>Estado</span><span>Juegos</span><span>Reportes</span><span>Acciones</span></div>
        ${s.users.map((u) => {
          const reps = s.reports.filter((r) => (r.type === 'dev' && r.targetId === u.id) || (r.type === 'review' && s.games.some((g) => g.reviews.some((rv) => rv.id === r.targetId && rv.userId === u.id)))).length;
          return `<div class="tr">
            <span class="row nowrap">${DT.avatarHTML(u, 30)}<a href="#/perfil/${u.id}">${DT.esc(u.name)}</a>${u.verified ? ' <span class="verified">' + DT.icon.check + '</span>' : ''}</span>
            <span><select data-role="${u.id}" ${u.id === DT.me().id ? 'disabled' : ''}>${['user', 'dev', 'admin'].map((r) => `<option value="${r}" ${u.role === r ? 'selected' : ''}>${{ user: 'Usuario', dev: 'Desarrollador', admin: 'Admin' }[r]}</option>`).join('')}</select></span>
            <span>${u.status === 'suspended' ? '<span class="pill bad">Suspendido</span>' : '<span class="pill ok">Activo</span>'}</span>
            <span>${s.games.filter((g) => g.devId === u.id).length}</span>
            <span>${reps ? `<span class="pill warn">${reps}</span>` : '0'}</span>
            <span class="row nowrap">
              ${u.role === 'dev' ? `<button class="btn ghost sm" data-verify="${u.id}">${u.verified ? 'Quitar verificación' : '✔ Verificar'}</button>
                <button class="btn ghost sm" data-student="${u.id}" title="Define la comisión que paga">${u.student ? DT.icon.cap + ' TecNM' : DT.icon.building + ' Externo'}</button>` : ''}
              ${u.id !== DT.me().id ? `<button class="btn ${u.status === 'suspended' ? 'ghost' : 'danger'} sm" data-suspend="${u.id}">${u.status === 'suspended' ? 'Reactivar' : 'Suspender'}</button>` : ''}
            </span></div>`;
        }).join('')}
      </div>
      <p class="muted">Suspender a un desarrollador oculta todos sus juegos de la tienda.</p>`;
    DT.$$('[data-verify]', body).forEach((b) => b.onclick = () => { const u = DT.user(b.dataset.verify); u.verified = !u.verified; act(`${u.verified ? 'Verificó' : 'Quitó la verificación a'} ${u.name}.`); });
    DT.$$('[data-student]', body).forEach((b) => b.onclick = () => { const u = DT.user(b.dataset.student); u.student = !u.student; act(`Marcó a ${u.name} como estudio ${u.student ? 'TecNM' : 'externo'}.`); });
    DT.$$('[data-suspend]', body).forEach((b) => b.onclick = () => { const u = DT.user(b.dataset.suspend); u.status = u.status === 'suspended' ? 'active' : 'suspended'; act(`${u.status === 'suspended' ? 'Suspendió' : 'Reactivó'} a ${u.name}.`); });
    DT.$$('[data-role]', body).forEach((sel) => sel.onchange = () => { const u = DT.user(sel.dataset.role); u.role = sel.value; act(`Cambió el rol de ${u.name} a ${sel.value}.`); });
  }

  function reportes(body, s) {
    const findReview = (id) => { for (const g of s.games) { const r = g.reviews.find((x) => x.id === id); if (r) return { g, r }; } return null; };
    const target = (r) => {
      if (r.type === 'game') { const g = DT.game(r.targetId); return g ? `Juego: <a href="#/juego/${g.id}">${DT.esc(g.title)}</a>` : 'Juego eliminado'; }
      if (r.type === 'dev') { const u = DT.user(r.targetId); return u ? `Cuenta: <a href="#/perfil/${u.id}">${DT.esc(u.name)}</a>` : 'Cuenta eliminada'; }
      const f = findReview(r.targetId);
      return f ? `Reseña de <b>${DT.esc((DT.user(f.r.userId) || {}).name)}</b> en ${DT.esc(f.g.title)}: <q>${DT.esc(f.r.text)}</q>${f.r.hidden ? ' <span class="pill">oculta</span>' : ''}` : 'Reseña eliminada';
    };
    const list = s.reports.slice().sort((a, b) => (a.status === 'open' ? -1 : 1) - (b.status === 'open' ? -1 : 1) || b.date - a.date);
    body.innerHTML = `
      <div class="page-head"><div><h1>Reportes</h1><p>Reportes de la comunidad y del filtro automático.</p></div></div>
      ${list.map((r) => `
        <div class="card report ${r.status}">
          <div class="row"><span class="pill ${r.status === 'open' ? 'warn' : r.status === 'resolved' ? 'ok' : ''}">${{ open: 'Abierto', resolved: 'Resuelto', dismissed: 'Descartado' }[r.status]}</span>
            <b>${DT.esc(r.reason)}</b><span class="spacer"></span><small class="muted">por ${DT.esc(r.by === 'system' ? 'Filtro automático' : (DT.user(r.by) || {}).name)} · ${DT.timeAgo(r.date)}</small></div>
          <p>${target(r)}</p>
          ${r.text ? `<p class="muted">“${DT.esc(r.text)}”</p>` : ''}
          ${r.note ? `<p class="note">${DT.icon.note} ${DT.esc(r.note)}</p>` : ''}
          ${r.status === 'open' ? `<div class="row">
            ${r.type === 'review' ? `<button class="btn danger sm" data-hide="${r.id}">Ocultar reseña</button>` : ''}
            ${r.type === 'game' ? `<button class="btn danger sm" data-unpubr="${r.id}">Retirar juego</button>` : ''}
            ${r.type === 'dev' ? `<button class="btn danger sm" data-susp="${r.id}">Suspender cuenta</button>` : ''}
            <span class="spacer"></span>
            <button class="btn ghost sm" data-dismiss="${r.id}">Descartar</button>
            <button class="btn success sm" data-resolve="${r.id}">Marcar resuelto</button></div>` : ''}
        </div>`).join('') || `<div class="empty-inline">${DT.icon.check} No hay reportes.</div>`}`;

    const close = async (id, status, note) => {
      const r = s.reports.find((x) => x.id === id);
      if (note === undefined) { note = await DT.prompt('Nota de resolución', 'Opcional: qué se hizo', ''); if (note == null) return; }
      r.status = status; r.note = note;
      act(`${status === 'resolved' ? 'Resolvió' : 'Descartó'} el reporte «${r.reason}».`);
    };
    DT.$$('[data-resolve]', body).forEach((b) => b.onclick = () => close(b.dataset.resolve, 'resolved'));
    DT.$$('[data-dismiss]', body).forEach((b) => b.onclick = () => close(b.dataset.dismiss, 'dismissed'));
    DT.$$('[data-hide]', body).forEach((b) => b.onclick = () => { const r = s.reports.find((x) => x.id === b.dataset.hide); const f = findReview(r.targetId); if (f) f.r.hidden = true; close(r.id, 'resolved', 'Reseña ocultada.'); });
    DT.$$('[data-unpubr]', body).forEach((b) => b.onclick = () => { const r = s.reports.find((x) => x.id === b.dataset.unpubr); const g = DT.game(r.targetId); if (g) { g.status = 'withdrawn'; g.withdrawn = { by: DT.me().id, admin: true, reason: 'Reporte: ' + r.reason, date: Date.now() }; g.reviewNote = 'Retirado por reporte: ' + r.reason; g.featured = false; } close(r.id, 'resolved', 'Juego retirado.'); });
    DT.$$('[data-susp]', body).forEach((b) => b.onclick = () => { const r = s.reports.find((x) => x.id === b.dataset.susp); const u = DT.user(r.targetId); if (u) u.status = 'suspended'; close(r.id, 'resolved', 'Cuenta suspendida.'); });
  }

  function moderacion(body, s) {
    const flagged = [];
    s.games.forEach((g) => g.reviews.forEach((r) => { if (r.flagged || DT.hasBanned(r.text)) flagged.push({ g, r }); }));
    body.innerHTML = `
      <div class="page-head"><div><h1>Moderación</h1><p>Filtro automático de palabras para reseñas, biografías y fichas de juegos.</p></div></div>
      <div class="grid cols-2">
        <div class="card">
          <h3>Palabras prohibidas</h3>
          <div class="wordlist">${s.bannedWords.map((w, i) => `<span class="tag">${DT.esc(w)} <button class="icon-btn xs" data-delword="${i}" aria-label="Quitar">${DT.icon.x}</button></span>`).join('')}</div>
          <form class="row" data-addword style="margin-top:10px"><input name="w" placeholder="Nueva palabra" required><button class="btn primary sm">Agregar</button></form>
          <p class="muted">Las reseñas con estas palabras se publican censuradas (✱✱✱) y generan un reporte automático.</p>
        </div>
        <div class="card">
          <h3>Contenido marcado (${flagged.length})</h3>
          ${flagged.map(({ g, r }) => `<div class="log-row"><b>${DT.esc((DT.user(r.userId) || {}).name)}</b> en ${DT.esc(g.title)}: <q>${DT.esc(r.text)}</q>
            <div class="row">${r.hidden ? '<span class="pill">Oculta</span>' : `<button class="btn danger sm" data-hide-rv="${r.id}">Ocultar</button>`}<button class="btn ghost sm" data-del-rv="${r.id}">Eliminar</button></div></div>`).join('') || '<p class="muted">Nada marcado.</p>'}
        </div>
      </div>`;
    DT.$('[data-addword]', body).onsubmit = (e) => { e.preventDefault(); const w = e.target.w.value.trim().toLowerCase(); if (w && !s.bannedWords.includes(w)) { s.bannedWords.push(w); act(`Agregó «${w}» al filtro.`); } };
    DT.$$('[data-delword]', body).forEach((b) => b.onclick = () => { const w = s.bannedWords.splice(+b.dataset.delword, 1)[0]; act(`Quitó «${w}» del filtro.`); });
    const each = (id, fn) => s.games.forEach((g) => g.reviews.forEach((r, i) => { if (r.id === id) fn(g, r, i); }));
    DT.$$('[data-hide-rv]', body).forEach((b) => b.onclick = () => each(b.dataset.hideRv, (g, r) => { r.hidden = true; act(`Ocultó una reseña en «${g.title}».`); }));
    DT.$$('[data-del-rv]', body).forEach((b) => b.onclick = () => each(b.dataset.delRv, (g, r, i) => { g.reviews.splice(i, 1); act(`Eliminó una reseña en «${g.title}».`); }));
  }

  function registro(body, s) {
    body.innerHTML = `
      <div class="page-head"><div><h1>Registro de actividad</h1><p>Últimas ${s.log.length} acciones.</p></div></div>
      <div class="card">${s.log.map(logRow).join('') || '<p class="muted">Sin actividad.</p>'}</div>`;
  }
})(window.DT);
