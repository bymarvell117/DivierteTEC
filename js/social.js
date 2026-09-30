/* DivierteTEC — funciones sociales entre perfiles: seguir, amistad (con solicitud que la
   otra cuenta acepta), bloquear y compartir. No hay cuentas ni amistades sembradas: solo
   las cuentas de la demo y las que se registren en vivo. */
(function (DT) {
  'use strict';

  const S = () => DT.state();
  const I = (d) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  Object.assign(DT.icon, {
    share: DT.icon.share || I('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>'),
    userPlus: DT.icon.userPlus || I('<circle cx="9" cy="8" r="4"/><path d="M2 21v-1a7 7 0 0 1 14 0v1M19 8v6M16 11h6"/>'),
    userCheck: DT.icon.userCheck || I('<circle cx="9" cy="8" r="4"/><path d="M2 21v-1a7 7 0 0 1 14 0v1M16 11l2 2 4-4"/>'),
    ban: DT.icon.ban || I('<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>'),
    bell: DT.icon.bell || I('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0"/>'),
    logout: DT.icon.logout || I('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
    login: DT.icon.login || I('<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>')
  });

  const ensure = () => {
    const s = S();
    s.social = s.social || {};
    const so = s.social;
    so.follows = so.follows || {}; so.friends = so.friends || {}; so.blocks = so.blocks || {}; so.requests = so.requests || [];
    return so;
  };
  DT.on && DT.on(() => ensure());
  const list = (map, id) => (map[id] = map[id] || []);
  const drop = (arr, id) => { const i = arr.indexOf(id); if (i >= 0) arr.splice(i, 1); };
  const meId = () => S().currentUserId;
  const name = (id) => DT.esc((DT.user(id) || {}).name || '');

  /* ---------- Consultas ---------- */
  DT.isFollowing = (a, b) => list(ensure().follows, a).includes(b);
  DT.following = (id) => list(ensure().follows, id).filter((x) => DT.user(x));
  DT.followers = (id) => Object.entries(ensure().follows).filter(([, arr]) => arr.includes(id)).map(([k]) => k).filter((x) => DT.user(x));
  DT.friendsOf = (id) => list(ensure().friends, id).filter((x) => DT.user(x));
  DT.isBlocked = (a, b) => list(ensure().blocks, a).includes(b); // a bloqueó a b
  DT.blockedBy = (id) => list(ensure().blocks, id).filter((x) => DT.user(x));
  DT.friendRequests = (id) => ensure().requests.filter((r) => r.to === id && r.status === 'pending' && DT.user(r.from));
  DT.pendingFriendRequests = (id) => DT.friendRequests(id || meId()).length;
  DT.friendState = (a, b) => {
    if (DT.friendsOf(a).includes(b)) return 'friends';
    const r = ensure().requests.find((x) => x.status === 'pending' && ((x.from === a && x.to === b) || (x.from === b && x.to === a)));
    return !r ? 'none' : r.from === a ? 'sent' : 'received';
  };
  const reqBetween = (a, b) => ensure().requests.find((x) => x.status === 'pending' && ((x.from === a && x.to === b) || (x.from === b && x.to === a)));

  /* ---------- Acciones ---------- */
  const done = (msg) => { if (msg) DT.toast(msg, { kind: 'ok' }); DT.emit('social'); };
  const guardBlock = (id) => {
    if (DT.isBlocked(meId(), id)) { DT.toast('Desbloquea a esta cuenta primero.', { kind: 'error' }); return false; }
    if (DT.isBlocked(id, meId())) { DT.toast('Esta cuenta no acepta interacciones contigo.', { kind: 'error' }); return false; }
    return true;
  };
  DT.follow = (id) => { if (!guardBlock(id)) return; const a = list(ensure().follows, meId()); if (!a.includes(id)) a.push(id); DT.log(`Siguió a ${(DT.user(id) || {}).name}.`); done(`Ahora sigues a <b>${name(id)}</b>.`); };
  DT.unfollow = (id) => { drop(list(ensure().follows, meId()), id); done(`Dejaste de seguir a <b>${name(id)}</b>.`); };
  const makeFriends = (a, b) => { const fa = list(ensure().friends, a), fb = list(ensure().friends, b); if (!fa.includes(b)) fa.push(b); if (!fb.includes(a)) fb.push(a); };
  DT.sendFriend = (id) => {
    if (!guardBlock(id)) return;
    const me = meId(), st = DT.friendState(me, id);
    if (st === 'friends' || st === 'sent') return;
    if (st === 'received') { const r = reqBetween(me, id); r.status = 'accepted'; makeFriends(me, id); return done(`Ahora eres amigo de <b>${name(id)}</b>.`); }
    ensure().requests.push({ id: DT.uid('fr'), from: me, to: id, date: Date.now(), status: 'pending' });
    DT.log(`Envió solicitud de amistad a ${(DT.user(id) || {}).name}.`);
    done(`Solicitud de amistad enviada a <b>${name(id)}</b>.`);
  };
  DT.cancelFriend = (id) => { const r = reqBetween(meId(), id); if (r) r.status = 'cancelled'; done('Solicitud cancelada.'); };
  DT.respondFriend = (reqId, ok) => {
    const r = ensure().requests.find((x) => x.id === reqId);
    if (!r || r.status !== 'pending') return;
    r.status = ok ? 'accepted' : 'declined';
    if (ok) makeFriends(r.from, r.to);
    done(ok ? `Ahora eres amigo de <b>${name(r.from)}</b>.` : 'Solicitud rechazada.');
  };
  DT.unfriend = (id) => { drop(list(ensure().friends, meId()), id); drop(list(ensure().friends, id), meId()); done(`Quitaste a <b>${name(id)}</b> de tus amigos.`); };
  DT.block = async (id) => {
    if (!(await DT.confirm('Bloquear cuenta', `<b>${name(id)}</b> ya no podrá seguirte ni enviarte solicitudes, dejará de ser tu amigo y sus reseñas se ocultarán para ti. Puedes desbloquearla cuando quieras.`))) return;
    const so = ensure(), me = meId();
    const b = list(so.blocks, me); if (!b.includes(id)) b.push(id);
    drop(list(so.follows, me), id); drop(list(so.follows, id), me);
    drop(list(so.friends, me), id); drop(list(so.friends, id), me);
    so.requests.forEach((r) => { if (r.status === 'pending' && ((r.from === me && r.to === id) || (r.from === id && r.to === me))) r.status = 'cancelled'; });
    DT.log(`Bloqueó a ${(DT.user(id) || {}).name}.`);
    done(`Bloqueaste a <b>${name(id)}</b>.`);
  };
  DT.unblock = (id) => { drop(list(ensure().blocks, meId()), id); done(`Desbloqueaste a <b>${name(id)}</b>.`); };

  /* ---------- Compartir ---------- */
  DT.profileLink = (u) => location.href.split('#')[0] + '#/perfil/' + u.id;
  DT.shareProfile = (u) => {
    const link = DT.profileLink(u);
    const m = DT.modal({
      title: `${DT.icon.share} Compartir perfil`,
      body: `<div class="share-card">${DT.avatarHTML(u, 54)}<div><b>${DT.esc(u.name)}</b> ${DT.tecnmUserPill ? DT.tecnmUserPill(u) : ''}<small class="muted">Perfil en DivierteTEC</small></div></div>
        <label class="field"><span>Enlace</span><input data-link readonly value="${DT.esc(link)}"></label>
        <p class="muted small">En el sitio web el enlace será público. En este prototipo abre el perfil en este mismo navegador.</p>`,
      actions: `<button class="btn ghost" data-close>Cerrar</button>${navigator.share ? `<button class="btn ghost" data-native>${DT.icon.share} Compartir…</button>` : ''}<button class="btn primary" data-copy>${DT.icon.copy || ''} Copiar enlace</button>`
    });
    const inp = m.el.querySelector('[data-link]');
    m.el.querySelector('[data-copy]').onclick = async () => {
      try { await navigator.clipboard.writeText(link); } catch (e) { inp.select(); try { document.execCommand('copy'); } catch (e2) { /* sin portapapeles */ } }
      DT.toast('Enlace copiado.', { kind: 'ok' });
    };
    const nat = m.el.querySelector('[data-native]');
    if (nat) nat.onclick = () => navigator.share({ title: u.name + ' en DivierteTEC', url: link }).catch(() => {});
  };

  /* ---------- Piezas de interfaz reutilizables ---------- */
  const ROLE = { user: 'Jugador', dev: 'Desarrollador', admin: 'Administrador' };
  DT.socialButtons = (u, compact) => {
    const me = meId();
    if (!u || u.id === me) return '';
    if (DT.isBlocked(me, u.id)) return `<button class="btn ghost sm" data-unblock="${u.id}">${DT.icon.ban} Desbloquear</button>`;
    const fol = DT.isFollowing(me, u.id), fs = DT.friendState(me, u.id), off = DT.isBlocked(u.id, me) ? 'disabled' : '';
    const friendBtn = {
      none: `<button class="btn primary sm" data-friend="${u.id}" ${off}>${DT.icon.userPlus} Añadir amigo</button>`,
      sent: `<button class="btn ghost sm" data-cancelfriend="${u.id}">${DT.icon.clock} Solicitud enviada</button>`,
      received: `<button class="btn success sm" data-friend="${u.id}">${DT.icon.check} Aceptar amistad</button>`,
      friends: `<button class="btn ghost sm on" data-unfriend="${u.id}">${DT.icon.userCheck} Amigos</button>`
    }[fs];
    const followBtn = fol ? `<button class="btn ghost sm on" data-unfollow="${u.id}">${DT.icon.check} Siguiendo</button>` : `<button class="btn ghost sm" data-follow="${u.id}" ${off}>${DT.icon.plus} Seguir</button>`;
    if (compact) return followBtn + friendBtn;
    return followBtn + friendBtn + `<button class="btn ghost sm" data-share="${u.id}">${DT.icon.share} Compartir</button>
      <button class="btn ghost sm" data-reportuser="${u.id}">${DT.icon.flag} Reportar</button>
      <button class="btn ghost sm danger-text" data-block="${u.id}">${DT.icon.ban} Bloquear</button>`;
  };
  DT.userRow = (u, extra) => `<div class="user-row">${DT.avatarHTML(u, 40)}<div class="user-row-info"><a href="#/perfil/${u.id}"><b>${DT.esc(u.name)}</b></a> ${DT.tecnmUserPill ? DT.tecnmUserPill(u) : ''}
      <small class="muted">${ROLE[u.role] || ''}${u.studio ? ' · ' + DT.esc(u.studio) : ''}${(u.tecnm && u.tecnm.campus) || u.campus ? ' · ' + DT.esc((u.tecnm && u.tecnm.campus) || u.campus) : ''}</small></div>
      <div class="user-row-actions">${extra != null ? extra : DT.socialButtons(u, true)}</div></div>`;
  DT.peopleModal = (title, ids) => DT.modal({ title, body: ids.length ? ids.map((id) => DT.userRow(DT.user(id))).join('') : '<p class="muted">Todavía nadie.</p>' });
  DT.searchUsers = (q) => {
    const me = meId(), t = (q || '').trim().toLowerCase();
    return S().users.filter((u) => u.id !== me && u.status !== 'deleted' && !DT.isBlocked(me, u.id) && !DT.isBlocked(u.id, me))
      .filter((u) => !t || [u.name, u.studio, u.campus, u.tecnm && u.tecnm.campus].some((x) => x && x.toLowerCase().includes(t)));
  };

  /* Delegación de clics: los botones funcionan en cualquier vista o modal */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-follow],[data-unfollow],[data-friend],[data-cancelfriend],[data-unfriend],[data-block],[data-unblock],[data-share],[data-reportuser],[data-freq]');
    if (!b || b.disabled) return;
    const d = b.dataset;
    if (d.follow) DT.follow(d.follow);
    else if (d.unfollow) DT.unfollow(d.unfollow);
    else if (d.friend) DT.sendFriend(d.friend);
    else if (d.cancelfriend) DT.cancelFriend(d.cancelfriend);
    else if (d.unfriend) DT.confirm('Quitar amigo', `¿Quitar a <b>${name(d.unfriend)}</b> de tus amigos?`).then((ok) => ok && DT.unfriend(d.unfriend));
    else if (d.block) DT.block(d.block);
    else if (d.unblock) DT.unblock(d.unblock);
    else if (d.share) DT.shareProfile(DT.user(d.share));
    else if (d.reportuser) DT.reportModal('dev', d.reportuser, null);
    else if (d.freq) DT.respondFriend(d.freq, d.ok === '1');
    const modal = b.closest('.modal-backdrop');
    if (modal && !d.share && !d.reportuser && !d.block) modal.querySelector('[data-close]').click();
  });
})(window.DT);
