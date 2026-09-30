/* DivierteTEC — solicitudes para ser desarrollador y verificación TecNM.
   - Un usuario pide ser desarrollador: trabajo previo, motivo y verificación de identidad.
     La administración la revisa con criterios y aprueba, rechaza o pide más información.
   - Cualquier cuenta (jugador o desarrollador) puede verificar que pertenece al TecNM:
     correo institucional con código, número de control, campus y credencial. Al aprobarse
     obtiene beneficios exclusivos.
   En el prototipo los documentos se guardan solo en este navegador (IndexedDB) y el código del
   correo se muestra en pantalla como simulación; en el sitio web llegarían por correo y los
   documentos se cifrarían y eliminarían al terminar la revisión. */
(function (DT) {
  'use strict';

  const S = () => DT.state();
  const pct = (n) => Math.round(n * 100) + ' %';
  const ensure = () => { const s = S(); s.devRequests = s.devRequests || []; s.tecnmRequests = s.tecnmRequests || []; if (s.economy.passTecnmDiscount == null) s.economy.passTecnmDiscount = 0.3; };
  DT.on && DT.on(ensure);

  /* ---------- TecNM ---------- */
  DT.isTecnm = (u) => !!(u && ((u.tecnm && u.tecnm.verified) || (u.student && u.verified)));
  DT.TECNM_EMAIL = /^[^@\s]+@([a-z0-9-]+\.)*tecnm\.mx$/i;
  DT.CONTROL_RE = /^[A-Za-z]?\d{8,9}$/;
  DT.passPriceFor = (uid) => { ensure(); const e = DT.econ(); const u = DT.user(uid || S().currentUserId); return DT.isTecnm(u) ? Math.round(e.passPrice * (1 - e.passTecnmDiscount) * 100) / 100 : e.passPrice; };
  DT.TECNM_BENEFITS = () => {
    ensure(); const e = DT.econ();
    return {
      user: [
        ['ticket', `Pase DivierteTEC con ${pct(e.passTecnmDiscount)} de descuento (${DT.money(DT.passPriceFor ? Math.round(e.passPrice * (1 - e.passTecnmDiscount) * 100) / 100 : e.passPrice)} en lugar de ${DT.money(e.passPrice)})`],
        ['medal', 'Insignia exclusiva «Comunidad TecNM» para tu perfil'],
        ['cap', 'Sello TecNM verificado en tu perfil y tus reseñas']
      ],
      dev: [
        ['gift', `Semilla TEC: 0 % de comisión en tus primeros ${DT.money(e.seedAllowance)} de ventas`],
        ['chart', `Comisión de ${pct(e.rateStudent)} en lugar de ${pct(e.rateExternal)} después de la Semilla`],
        ['cap', 'Sello «Hecho en el TecNM» con tu campus y filtro propio en la tienda'],
        ['eye', 'Prioridad en la cola de revisión de juegos']
      ]
    };
  };
  const myTecnmReq = (uid) => { ensure(); return S().tecnmRequests.filter((r) => r.userId === uid).sort((a, b) => b.date - a.date)[0]; };
  const myDevReq = (uid) => { ensure(); return S().devRequests.filter((r) => r.userId === uid).sort((a, b) => b.date - a.date)[0]; };
  DT.pendingRequests = () => { ensure(); return S().devRequests.filter((r) => r.status === 'pending').length + S().tecnmRequests.filter((r) => r.status === 'pending').length; };
  DT.tecnmUserPill = (u) => (DT.isTecnm(u) ? `<span class="pill tecnm" title="Cuenta TecNM verificada">${DT.ic('cap')} TecNM</span>` : '');

  const STATUS = { pending: ['warn', 'En revisión'], info: ['warn', 'Se pidió más información'], approved: ['ok', 'Aprobada'], rejected: ['bad', 'Rechazada'] };
  const statusPill = (st) => `<span class="pill ${STATUS[st][0]}">${STATUS[st][1]}</span>`;
  const benefitList = (arr) => `<ul class="benefits">${arr.map(([ic, t]) => `<li>${DT.ic(ic)}<span>${t}</span></li>`).join('')}</ul>`;
  const fileField = (name, label, accept) => `<label class="field wide"><span>${label}</span><input type="file" name="${name}" accept="${accept}"></label>`;
  const saveFile = async (input) => { const f = input && input.files && input.files[0]; if (!f) return null; const m = await DT.media.add(f); return { id: m.id, name: f.name, type: f.type, size: f.size }; };
  const proto = `<p class="notice">${DT.icon.lock} <span><b>Prototipo:</b> tus documentos se guardan solo en este navegador. En el sitio web se transmitirán cifrados, solo los verá la administración y se eliminarán al terminar la revisión (aviso de privacidad).</span></p>`;

  /* ---------- Vista: Verificación TecNM ---------- */
  DT.views.tecnm = (app) => {
    ensure();
    const me = DT.me(), req = myTecnmReq(me.id), B = DT.TECNM_BENEFITS();
    const verified = DT.isTecnm(me);
    const draft = (DT.state().tecnmDraft || {})[me.id] || {};
    app.innerHTML = `
      <section class="page narrow verify">
        <div class="page-head"><div><h1>${DT.ic('cap')} Verificación TecNM</h1><p>Demuestra que eres parte del Tecnológico Nacional de México y obtén beneficios exclusivos.</p></div></div>
        <div class="grid cols-2">
          <div class="card"><h3>Para jugadores</h3>${benefitList(B.user)}</div>
          <div class="card"><h3>Para desarrolladores</h3>${benefitList(B.dev)}</div>
        </div>
        ${verified ? `<div class="card verify-ok"><h2>${DT.icon.check} Tu cuenta está verificada como TecNM</h2><p>${DT.esc((me.tecnm && me.tecnm.campus) || me.campus || '')}${me.tecnm && me.tecnm.since ? ' · desde ' + new Date(me.tecnm.since).toLocaleDateString('es-MX') : ''}</p></div>`
        : req && req.status === 'pending' ? `<div class="card"><h2>Solicitud ${statusPill('pending')}</h2><p>Enviada ${DT.timeAgo(req.date)}. La administración revisará tu correo institucional, número de control y credencial.</p></div>`
        : `${req && (req.status === 'rejected' || req.status === 'info') ? `<div class="notice warn">${DT.icon.warn} <span>Tu solicitud anterior: ${statusPill(req.status)} ${req.note ? '— ' + DT.esc(req.note) : ''}</span></div>` : ''}
        <form class="card form-grid" data-tecnm>
          <h3 class="wide">1 · Correo institucional</h3>
          <label class="field"><span>Correo (termina en tecnm.mx)</span><input name="email" type="email" required placeholder="numerodecontrol@campus.tecnm.mx" value="${DT.esc(draft.email || '')}"></label>
          <div class="field"><span>&nbsp;</span><button type="button" class="btn ghost" data-sendcode>${DT.icon.upload} Enviar código</button></div>
          <label class="field"><span>Código de 6 dígitos</span><input name="code" inputmode="numeric" maxlength="6" placeholder="••••••"></label>
          <div class="field"><span>&nbsp;</span><span data-codestate class="muted">${draft.emailOk ? DT.icon.check + ' Correo verificado' : 'Aún sin verificar'}</span></div>
          <h3 class="wide">2 · Datos escolares</h3>
          <label class="field"><span>Número de control</span><input name="control" required maxlength="10" placeholder="Ej. 21110123" value="${DT.esc(draft.control || '')}"></label>
          <label class="field"><span>Campus</span><input name="campus" required list="campus-list" placeholder="Ej. ITESI · Irapuato" value="${DT.esc(draft.campus || '')}"></label>
          <datalist id="campus-list">${['ITESI · Irapuato', 'Tecnológico de Celaya', 'Tecnológico de León', 'Tecnológico de Roque', 'Tecnológico de Uriangato', 'Tecnológico de Abasolo', 'Tecnológico de Purísima del Rincón', 'Tecnológico de San Miguel de Allende', 'Tecnológico de Salvatierra'].map((c) => `<option value="${c}">`).join('')}</datalist>
          <label class="field wide"><span>Carrera</span><input name="career" required placeholder="Ej. Ingeniería en Sistemas Computacionales" value="${DT.esc(draft.career || '')}"></label>
          <h3 class="wide">3 · Credencial</h3>
          ${fileField('card', 'Foto de tu credencial escolar vigente (imagen o PDF)', 'image/*,application/pdf')}
          <label class="check wide"><input type="checkbox" name="truth" required> Declaro que los datos son verdaderos y acepto el aviso de privacidad.</label>
          <div class="wide">${proto}</div>
          <div class="wide row"><span class="spacer"></span><button class="btn primary">${DT.ic('cap')} Enviar verificación</button></div>
        </form>`}
      </section>`;
    const form = DT.$('[data-tecnm]', app);
    if (!form) return;
    const st = S(); st.tecnmDraft = st.tecnmDraft || {}; const d = st.tecnmDraft[me.id] = st.tecnmDraft[me.id] || {};
    DT.$('[data-sendcode]', form).onclick = () => {
      const em = form.email.value.trim();
      if (!DT.TECNM_EMAIL.test(em)) { DT.toast('Usa tu correo institucional (termina en <b>tecnm.mx</b>).', { kind: 'error' }); return; }
      d.email = em; d.code = String(Math.floor(100000 + Math.random() * 900000)); d.emailOk = false; DT.save();
      DT.toast(`Simulación del prototipo: en el sitio web el código llegaría a <b>${DT.esc(em)}</b>. Tu código es <b>${d.code}</b>.`, { timeout: 9000 });
    };
    form.code.addEventListener('input', () => {
      if (form.code.value.length === 6) { d.emailOk = !!d.code && form.code.value === d.code && d.email === form.email.value.trim(); DT.save();
        DT.$('[data-codestate]', form).innerHTML = d.emailOk ? DT.icon.check + ' Correo verificado' : DT.icon.x + ' Código incorrecto'; }
    });
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (!d.emailOk || d.email !== form.email.value.trim()) { DT.toast('Primero verifica tu correo institucional con el código.', { kind: 'error' }); return; }
      if (!DT.CONTROL_RE.test(form.control.value.trim())) { DT.toast('El número de control debe tener 8 o 9 dígitos (puede iniciar con una letra).', { kind: 'error' }); return; }
      const card = await saveFile(form.card);
      if (!card) { DT.toast('Adjunta la foto de tu credencial.', { kind: 'error' }); return; }
      S().tecnmRequests.push({ id: DT.uid('tv'), userId: me.id, status: 'pending', date: Date.now(), email: d.email, emailOk: true, control: form.control.value.trim().toUpperCase(), campus: form.campus.value.trim(), career: form.career.value.trim(), card, checks: {} });
      delete st.tecnmDraft[me.id];
      DT.log(`${me.name} envió su verificación TecNM.`); DT.save();
      DT.toast('Verificación enviada. La administración la revisará.', { kind: 'ok' });
      DT.render();
    };
  };

  /* ---------- Vista: Solicitud para ser desarrollador ---------- */
  DT.views.devRequest = (app) => {
    ensure();
    const me = DT.me(), req = myDevReq(me.id);
    if (me.role !== 'user') {
      app.innerHTML = `<section class="page narrow empty-state"><div class="big-ico">${DT.icon.code}</div><h2>Ya tienes acceso de desarrollador</h2><p>Publica tus juegos desde el panel.</p><a class="btn primary" href="#/dev">Ir al panel</a></section>`;
      return;
    }
    const B = DT.TECNM_BENEFITS();
    app.innerHTML = `
      <section class="page narrow verify">
        <div class="page-head"><div><h1>${DT.icon.code} Quiero ser desarrollador</h1><p>Publicar en DivierteTEC es gratis. Para proteger a la comunidad, cada solicitud la revisa la administración.</p></div></div>
        <div class="card steps"><div><b>1</b>Envías tu solicitud</div><div><b>2</b>La administración revisa trabajo previo, motivo e identidad</div><div><b>3</b>Te aprueba y se abre tu panel de desarrollador</div></div>
        ${req && req.status === 'pending' ? `<div class="card"><h2>Tu solicitud ${statusPill('pending')}</h2><p>Enviada ${DT.timeAgo(req.date)} como <b>${DT.esc(req.studio)}</b>. Te avisaremos aquí mismo.</p></div>`
        : `${req && (req.status === 'rejected' || req.status === 'info') ? `<div class="notice warn">${DT.icon.warn} <span>Tu solicitud anterior: ${statusPill(req.status)} ${req.note ? '— ' + DT.esc(req.note) : ''}</span></div>` : ''}
        <form class="card form-grid" data-devreq>
          <h3 class="wide">1 · Tu estudio</h3>
          <label class="field"><span>Nombre del estudio o equipo</span><input name="studio" required maxlength="40" value="${DT.esc(req ? req.studio : '')}"></label>
          <label class="field"><span>Tipo</span><select name="kind"><option value="solo">Desarrollador individual</option><option value="team">Equipo</option></select></label>
          <h3 class="wide">2 · Trabajo previo</h3>
          <label class="field wide"><span>Describe tus proyectos (juegos, prácticas, hackatones, motores o herramientas que usas)</span><textarea name="work" rows="3" required minlength="40">${DT.esc(req ? req.work : '')}</textarea></label>
          <label class="field wide"><span>Enlaces a tu trabajo (portafolio, itch.io, GitHub, video; uno por línea)</span><textarea name="links" rows="2" placeholder="https://…">${DT.esc(req ? (req.links || []).join('\n') : '')}</textarea></label>
          ${fileField('work_file', 'O adjunta capturas o un documento de tu trabajo (opcional)', 'image/*,application/pdf')}
          <h3 class="wide">3 · ¿Por qué quieres ser desarrollador en DivierteTEC?</h3>
          <label class="field wide"><span>Mínimo 80 caracteres</span><textarea name="reason" rows="3" required minlength="80">${DT.esc(req ? req.reason : '')}</textarea></label>
          <h3 class="wide">4 · Verificación de identidad</h3>
          <label class="field"><span>Nombre completo (como en tu identificación)</span><input name="fullName" required></label>
          <label class="field"><span>Fecha de nacimiento</span><input name="birth" type="date" required></label>
          <label class="field"><span>Identificación oficial</span><select name="docType"><option>INE</option><option>Pasaporte</option><option>Credencial escolar con fotografía</option></select></label>
          ${fileField('doc', 'Foto de la identificación', 'image/*,application/pdf')}
          <label class="field wide" data-tutor hidden><span>Menor de edad: nombre de tu madre, padre o tutor que autoriza</span><input name="tutor"></label>
          <label class="check wide"><input type="checkbox" name="terms" required> Acepto los términos para desarrolladores, los criterios de contenido y el aviso de privacidad.</label>
          <div class="wide">${proto}</div>
          <div class="wide row"><span class="spacer"></span><button class="btn primary">${DT.icon.upload} Enviar solicitud</button></div>
        </form>`}
        <div class="card"><h3>${DT.ic('cap')} ¿Eres del TecNM?</h3><p>Verifica tu cuenta y como desarrollador tendrás:</p>${benefitList(B.dev)}<a class="btn ghost sm" href="#/verificacion-tecnm">${DT.isTecnm(me) ? DT.icon.check + ' Ya estás verificado' : 'Verificar mi cuenta TecNM'}</a></div>
      </section>`;
    const form = DT.$('[data-devreq]', app);
    if (!form) return;
    const age = () => { const b = form.birth.value ? new Date(form.birth.value) : null; return b ? (Date.now() - b.getTime()) / 31557600000 : 99; };
    form.birth.addEventListener('change', () => { DT.$('[data-tutor]', form).hidden = age() >= 18; });
    form.onsubmit = async (e) => {
      e.preventDefault();
      const links = form.links.value.split(/\s+/).map((x) => x.trim()).filter((x) => /^https?:\/\/\S+\.\S+/.test(x));
      const workFile = await saveFile(form.work_file);
      if (!links.length && !workFile) { DT.toast('Agrega al menos un enlace o un archivo de tu trabajo previo.', { kind: 'error' }); return; }
      const doc = await saveFile(form.doc);
      if (!doc) { DT.toast('Adjunta la foto de tu identificación.', { kind: 'error' }); return; }
      const minor = age() < 18;
      if (minor && !form.tutor.value.trim()) { DT.toast('Si eres menor de edad, indica quién te autoriza.', { kind: 'error' }); return; }
      if (DT.hasBanned([form.studio.value, form.work.value, form.reason.value].join(' '))) { DT.toast('Tu texto contiene palabras bloqueadas.', { kind: 'error' }); return; }
      S().devRequests.push({ id: DT.uid('dr'), userId: me.id, status: 'pending', date: Date.now(), studio: form.studio.value.trim(), kind: form.kind.value,
        work: form.work.value.trim(), links, workFile, reason: form.reason.value.trim(),
        identity: { fullName: form.fullName.value.trim(), birth: form.birth.value, minor, tutor: form.tutor.value.trim(), docType: form.docType.value, doc }, terms: true, checks: {} });
      DT.log(`${me.name} pidió ser desarrollador (${form.studio.value.trim()}).`); DT.save();
      DT.toast('Solicitud enviada. La administración la revisará.', { kind: 'ok' });
      DT.render();
    };
  };

  /* ---------- Criterios de revisión ---------- */
  DT.DEV_REQ_CRITERIA = [
    { id: 'work', text: 'Trabajo previo demostrable (enlaces o archivos revisados)' },
    { id: 'reason', text: 'Motivo claro y acorde a la plataforma', auto: (r) => (r.reason || '').length >= 80 ? null : false },
    { id: 'identity', text: 'La identidad coincide con el documento' },
    { id: 'age', text: 'Mayor de edad o con autorización de tutor', auto: (r) => !r.identity.minor || !!r.identity.tutor },
    { id: 'terms', text: 'Aceptó términos, criterios de contenido y aviso de privacidad', auto: (r) => !!r.terms },
    { id: 'clean', text: 'Cuenta activa y sin sanciones', auto: (r) => (DT.user(r.userId) || {}).status !== 'suspended' }
  ];
  DT.TECNM_REQ_CRITERIA = [
    { id: 'email', text: 'Correo institucional verificado con código', auto: (r) => !!r.emailOk && DT.TECNM_EMAIL.test(r.email) },
    { id: 'control', text: 'Número de control con formato válido', auto: (r) => DT.CONTROL_RE.test(r.control) },
    { id: 'card', text: 'La credencial coincide con nombre, número de control y campus' },
    { id: 'vigencia', text: 'Credencial vigente' }
  ];
  const critState = (list, r) => list.map((c) => { const a = c.auto ? c.auto(r) : null; return { c, auto: a !== null && a !== undefined, ok: a === true || (a == null && !!r.checks[c.id]) }; });

  /* ---------- Admin: pestaña Solicitudes ---------- */
  DT.adminSolicitudes = (body, act) => {
    ensure();
    const s = S();
    const media = (f) => !f ? '' : f.type && f.type.startsWith('image') ? `<a class="doc-thumb" data-media-open="${f.id}"><img data-media="${f.id}" alt="${DT.esc(f.name)}"></a>` : `<span class="pill">${DT.icon.news} ${DT.esc(f.name)}</span>`;
    const crit = (list, r, kind) => { const st = critState(list, r), ok = st.filter((x) => x.ok).length;
      return `<div class="crit-mini"><div class="row"><b>Criterios</b><span class="spacer"></span><small>${ok} / ${st.length}</small></div>${st.map((x) => x.auto
        ? `<div class="crit-item auto ${x.ok ? 'ok' : 'bad'}">${x.ok ? DT.icon.check : DT.icon.x}<span>${x.c.text}</span><small>automático</small></div>`
        : `<label class="crit-item"><input type="checkbox" data-rcheck="${x.c.id}" data-rid="${r.id}" data-kind="${kind}" ${x.ok ? 'checked' : ''}><span>${x.c.text}</span></label>`).join('')}</div>`; };
    const dev = s.devRequests.filter((r) => r.status === 'pending').sort((a, b) => a.date - b.date);
    const tv = s.tecnmRequests.filter((r) => r.status === 'pending').sort((a, b) => a.date - b.date);
    const hist = s.devRequests.concat(s.tecnmRequests).filter((r) => r.status !== 'pending').sort((a, b) => (b.decidedAt || 0) - (a.decidedAt || 0)).slice(0, 8);
    body.innerHTML = `
      <div class="page-head"><div><h1>Solicitudes</h1><p>Cuentas que piden ser desarrolladores y verificaciones TecNM. Aprobar se habilita al cumplir todos los criterios.</p></div></div>
      <h2 class="sec-title">${DT.icon.code} Para ser desarrollador (${dev.length})</h2>
      ${dev.map((r) => { const u = DT.user(r.userId) || {}; const all = critState(DT.DEV_REQ_CRITERIA, r).every((x) => x.ok);
        return `<div class="card req-card">
          <div class="row">${DT.avatarHTML(u, 40)}<div><h3 style="margin:0">${DT.esc(r.studio)} ${DT.tecnmUserPill(u)}</h3><small class="muted">${DT.esc(u.name)} · ${r.kind === 'team' ? 'Equipo' : 'Individual'} · enviada ${DT.timeAgo(r.date)}</small></div><span class="spacer"></span>${statusPill(r.status)}</div>
          <div class="req-grid">
            <div><h4>Trabajo previo</h4><p>${DT.esc(r.work)}</p>${(r.links || []).map((l) => `<div><a href="${DT.esc(l)}" target="_blank" rel="noopener">${DT.esc(l)}</a></div>`).join('')}${media(r.workFile)}
              <h4>Motivo</h4><p>${DT.esc(r.reason)}</p>
              <h4>Identidad</h4><p><b>${DT.esc(r.identity.fullName)}</b> · ${DT.esc(r.identity.docType)} · nacimiento ${DT.esc(r.identity.birth)}${r.identity.minor ? ` · <span class="pill warn">Menor: autoriza ${DT.esc(r.identity.tutor)}</span>` : ''}</p>${media(r.identity.doc)}</div>
            ${crit(DT.DEV_REQ_CRITERIA, r, 'dev')}
          </div>
          <div class="row"><span class="spacer"></span><button class="btn ghost sm" data-rdecide="info" data-rid="${r.id}" data-kind="dev">Pedir información</button><button class="btn danger sm" data-rdecide="rejected" data-rid="${r.id}" data-kind="dev">Rechazar</button><button class="btn success sm" data-rdecide="approved" data-rid="${r.id}" data-kind="dev" ${all ? '' : 'disabled title="Marca todos los criterios"'}>${DT.icon.check} Aprobar como desarrollador</button></div>
        </div>`; }).join('') || '<p class="muted">No hay solicitudes pendientes.</p>'}
      <h2 class="sec-title">${DT.ic('cap')} Verificación TecNM (${tv.length})</h2>
      ${tv.map((r) => { const u = DT.user(r.userId) || {}; const all = critState(DT.TECNM_REQ_CRITERIA, r).every((x) => x.ok);
        return `<div class="card req-card">
          <div class="row">${DT.avatarHTML(u, 40)}<div><h3 style="margin:0">${DT.esc(u.name)}</h3><small class="muted">${{ user: 'Jugador', dev: 'Desarrollador', admin: 'Admin' }[u.role]} · enviada ${DT.timeAgo(r.date)}</small></div><span class="spacer"></span>${statusPill(r.status)}</div>
          <div class="req-grid"><div><p><b>${DT.esc(r.email)}</b> ${r.emailOk ? '<span class="pill ok">' + DT.icon.check + ' verificado</span>' : ''}</p><p>No. de control <b>${DT.esc(r.control)}</b> · ${DT.esc(r.campus)} · ${DT.esc(r.career)}</p>${media(r.card)}</div>${crit(DT.TECNM_REQ_CRITERIA, r, 'tecnm')}</div>
          <div class="row"><span class="spacer"></span><button class="btn danger sm" data-rdecide="rejected" data-rid="${r.id}" data-kind="tecnm">Rechazar</button><button class="btn success sm" data-rdecide="approved" data-rid="${r.id}" data-kind="tecnm" ${all ? '' : 'disabled title="Marca todos los criterios"'}>${DT.icon.check} Verificar como TecNM</button></div>
        </div>`; }).join('') || '<p class="muted">No hay verificaciones pendientes.</p>'}
      ${hist.length ? `<h2 class="sec-title">Decisiones recientes</h2><div class="card">${hist.map((r) => `<div class="log-row">${statusPill(r.status)} <b>${DT.esc((DT.user(r.userId) || {}).name || '')}</b> · ${r.studio ? 'desarrollador (' + DT.esc(r.studio) + ')' : 'TecNM'} · ${DT.timeAgo(r.decidedAt || r.date)}${r.note ? ' · ' + DT.esc(r.note) : ''}</div>`).join('')}</div>` : ''}`;
    DT.media.hydrate(body);
    const find = (kind, id) => (kind === 'dev' ? s.devRequests : s.tecnmRequests).find((x) => x.id === id);
    DT.$$('[data-rcheck]', body).forEach((c) => c.onchange = () => { const r = find(c.dataset.kind, c.dataset.rid); r.checks[c.dataset.rcheck] = c.checked; DT.save(); DT.render(true); });
    DT.$$('[data-media-open]', body).forEach((a) => a.onclick = async () => { const u = await DT.media.url(a.dataset.mediaOpen); DT.modal({ title: 'Documento', wide: true, body: `<img src="${u}" style="max-width:100%">` }); });
    DT.$$('[data-rdecide]', body).forEach((b) => b.onclick = async () => {
      const r = find(b.dataset.kind, b.dataset.rid), u = DT.user(r.userId), st = b.dataset.rdecide;
      let note = '';
      if (st !== 'approved') { note = await DT.prompt(st === 'info' ? 'Pedir más información' : 'Motivo del rechazo', 'Mensaje para la persona solicitante', ''); if (note === null) return; }
      r.status = st; r.note = note; r.decidedAt = Date.now();
      if (st === 'approved' && b.dataset.kind === 'dev') {
        u.role = 'dev'; u.studio = r.studio; u.devSince = Date.now();
        if (DT.isTecnm(u)) { u.student = true; u.verified = true; }
        act(`Aprobó a ${u.name} como desarrollador (${r.studio}).`);
      } else if (st === 'approved') {
        u.tecnm = { verified: true, campus: r.campus, since: Date.now() }; u.campus = r.campus;
        if (u.role === 'dev') { u.student = true; u.verified = true; }
        DT.rewards.grant(u.id, 'badge_tecnm');
        act(`Verificó a ${u.name} como TecNM (${r.campus}).`);
      } else act(`${st === 'info' ? 'Pidió información a' : 'Rechazó la solicitud de'} ${u.name}.`);
      DT.toast(st === 'approved' ? 'Solicitud aprobada.' : 'Respuesta enviada.', { kind: st === 'approved' ? 'ok' : undefined });
    });
  };
})(window.DT);
