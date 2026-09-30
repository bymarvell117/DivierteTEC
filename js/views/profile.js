/* DivierteTEC — perfil, inventario de recompensas y personalización. */
(function (DT) {
  'use strict';

  /* ¿Qué logro entrega esta recompensa? (para mostrar cómo desbloquearla) */
  DT.rewardSources = (rid) => {
    const out = [];
    DT.PLATFORM_ACH.forEach((a) => { if ([].concat(a.reward).includes(rid)) out.push(`Logro de DivierteTEC «${a.name}»: ${a.desc}`); });
    DT.state().games.filter((g) => DT.canSee(g) && (g.status === 'approved' || g.devId === DT.me().id)).forEach((g) => (g.achievements || []).forEach((a) => {
      if (a.reward === rid) out.push(`Logro «${a.hidden ? '???' : a.name}» en ${g.title}`);
    }));
    return out;
  };

  const SLOT = { theme: 'theme', frame: 'frame', avatar: 'avatar', effect: 'effect', badge: 'badge' };

  const itemCard = (rid, r, owned, equipped, canEquip) => {
    const rar = DT.RARITY[r.rarity] || DT.RARITY.comun;
    const src = owned ? '' : DT.rewardSources(rid)[0] || 'Recompensa de evento';
    return `<div class="reward-card ${owned ? '' : 'locked'} ${equipped ? 'equipped' : ''}" style="--rar:${rar.color}">
      <div class="reward-glyph ${r.type === 'frame' ? 'frame-demo' : ''}">${r.type === 'frame' ? `<span class="avatar frame-${r.data}" style="--s:54px">${DT.art.avatar(DT.avatarOf(DT.me()))}</span>` : DT.art.badge(r)}</div>
      <b>${DT.esc(r.name)}</b>
      <small style="color:${rar.color}">${rar.name}</small>
      <p>${owned ? DT.esc(r.desc || '') : `${DT.icon.lock} ${DT.esc(src)}`}</p>
      ${owned && canEquip ? `<button class="btn ${equipped ? 'ghost' : 'primary'} sm" data-equip="${rid}">${equipped ? 'Quitar' : 'Equipar'}</button>` : ''}
    </div>`;
  };

  /* Infografía: colección por rareza y por tipo */
  const collection = (inv, all) => {
    const ids = Object.keys(DT.REWARDS);
    const rows = Object.entries(DT.RARITY).map(([k, r]) => {
      const tot = ids.filter((id) => all[id].rarity === k).length, got = ids.filter((id) => all[id].rarity === k && inv.includes(id)).length;
      return `<div class="coll-row"><span style="color:${r.color}">${r.name}</span><div class="coll-bar"><i style="width:${tot ? got / tot * 100 : 0}%;background:${r.color}"></i></div><b>${got}/${tot}</b></div>`;
    }).join('');
    const got = ids.filter((id) => inv.includes(id)).length, pct = Math.round(got / ids.length * 100), C = 2 * Math.PI * 40;
    const types = Object.entries(DT.REWARD_TYPES).map(([t, n]) => `<span class="coll-type">${DT.ic({ theme: 'palette', frame: 'frame', avatar: 'smile', effect: 'sparkle', emoji: 'heart', badge: 'medal' }[t])}<b>${ids.filter((id) => all[id].type === t && inv.includes(id)).length}</b><small>${n}</small></span>`).join('');
    return `<div class="card collection"><svg viewBox="0 0 100 100" class="coll-ring"><circle cx="50" cy="50" r="40" fill="none" stroke="var(--surface-3)" stroke-width="12"/><circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" stroke-width="12" stroke-dasharray="${C * pct / 100} ${C}" transform="rotate(-90 50 50)"/><text x="50" y="55" text-anchor="middle" font-size="20" font-weight="900" fill="currentColor">${pct}%</text></svg>
      <div class="coll-body"><h3>Tu colección</h3>${rows}<div class="coll-types">${types}</div></div></div>`;
  };

  DT.views.profile = (app, uid) => {
    const me = DT.me();
    const u = DT.user(uid) || me;
    const mine = u.id === me.id;
    const s = DT.state();
    const inv = DT.inventory(u.id);
    const eq = DT.equipped(u.id);
    const st = DT.rewards.userStats(u.id);
    const pdone = s.platformAch[u.id] || {};
    const all = DT.allRewards();
    const badges = inv.filter((id) => (all[id] || {}).type === 'badge');
    const devGames = DT.catalogGames().filter((g) => g.devId === u.id && g.status === 'approved');

    const section = (type, title) => {
      const ids = Object.keys(all).filter((id) => all[id].type === type);
      if (type === 'theme') {
        const themeCards = Object.entries(DT.THEMES).map(([key, t]) => {
          const rid = t.reward;
          const owned = t.free || inv.includes(rid);
          const r = rid ? all[rid] : { name: t.name, glyph: t.glyph, rarity: 'comun', desc: 'Siempre disponible.', type: 'theme' };
          const active = (eq.theme || 'light') === key;
          return `<div class="reward-card theme-card ${owned ? '' : 'locked'} ${active ? 'equipped' : ''}" style="--rar:${DT.RARITY[r.rarity].color}">
            <div class="theme-swatch" data-swatch="${key}"><i></i><i></i><i></i></div>
            <b>${DT.esc(r.name)}</b><small style="color:${DT.RARITY[r.rarity].color}">${t.free ? 'Gratis' : DT.RARITY[r.rarity].name}</small>
            <p>${owned ? DT.esc(r.desc) : DT.icon.lock + ' ' + DT.esc(DT.rewardSources(rid)[0] || '')}</p>
            ${owned && mine ? `<button class="btn ${active ? 'ghost' : 'primary'} sm" data-theme="${key}" ${active ? 'disabled' : ''}>${active ? 'En uso' : 'Usar tema'}</button>` : ''}
          </div>`;
        }).join('');
        return `<h3 class="section-title">${title}</h3><div class="reward-grid">${themeCards}</div>`;
      }
      let extra = '';
      if (type === 'avatar') extra = DT.FREE_AVATARS.map((a) => `<div class="reward-card ${eq.avatar === a ? 'equipped' : ''}" style="--rar:#8a9bb0"><div class="reward-glyph"><span class="avatar" style="--s:54px">${DT.art.avatar(a)}</span></div><b>${DT.AVATAR_NAMES[a] || 'Básico'}</b><small>Gratis</small>${mine ? `<button class="btn ${eq.avatar === a ? 'ghost' : 'primary'} sm" data-freeav="${a}">${eq.avatar === a ? 'En uso' : 'Equipar'}</button>` : ''}</div>`).join('');
      if (type === 'emoji') extra = DT.FREE_STICKERS.map((k) => `<div class="reward-card" style="--rar:#8a9bb0"><div class="reward-glyph">${DT.art.sticker(k)}</div><b>${DT.STICKER_NAMES[k]}</b><small>Gratis</small><p>Disponible para todos.</p></div>`).join('');
      return `<h3 class="section-title">${title}</h3><div class="reward-grid">${extra}${ids.map((id) => {
        const r = all[id];
        const owned = inv.includes(id);
        if (!mine && !owned) return '';
        const equipped = SLOT[type] && eq[SLOT[type]] === r.data;
        return itemCard(id, r, owned, equipped, mine && type !== 'emoji');
      }).join('')}</div>`;
    };

    /* Tarjetas de cuenta: verificación TecNM y solicitud para ser desarrollador */
    const accountCards = (u) => {
      const tr = (DT.state().tecnmRequests || []).filter((r) => r.userId === u.id).pop();
      const dr = (DT.state().devRequests || []).filter((r) => r.userId === u.id).pop();
      const st = (r) => r ? ({ pending: 'En revisión', info: 'Falta información', approved: 'Aprobada', rejected: 'Rechazada' })[r.status] : '';
      const cards = [];
      cards.push(DT.isTecnm(u)
        ? `<a class="card acct-card ok" href="#/verificacion-tecnm">${DT.ic('cap')}<div><b>Cuenta TecNM verificada</b><small>${DT.esc((u.tecnm && u.tecnm.campus) || u.campus || '')} · ver beneficios</small></div></a>`
        : `<a class="card acct-card" href="#/verificacion-tecnm">${DT.ic('cap')}<div><b>¿Eres del TecNM? Verifícate</b><small>${tr ? 'Solicitud: ' + st(tr) : 'Descuento en el Pase, insignia exclusiva y beneficios para estudios'}</small></div></a>`);
      if (u.role === 'user') cards.push(`<a class="card acct-card" href="#/ser-desarrollador">${DT.icon.code}<div><b>Quiero ser desarrollador</b><small>${dr ? 'Solicitud: ' + st(dr) : 'Envía tu trabajo previo y verifica tu identidad'}</small></div></a>`);
      return `<div class="acct-cards">${cards.join('')}</div>`;
    };

    app.innerHTML = `
      <section class="page">
        <div class="profile-head card">
          ${DT.avatarHTML(u, 110)}
          <div class="profile-info">
            <h1>${DT.esc(u.name)} ${DT.tecnmUserPill(u)} ${badges.map((b) => `<span class="badge-ico" title="${DT.esc(all[b].name)}">${DT.art.badge(all[b])}</span>`).join('')}</h1>
            <p class="muted">${{ user: 'Jugador', dev: 'Desarrollador', admin: 'Administrador' }[u.role]}${u.verified ? ' · Estudio verificado ✔' : ''}${u.tecnm && u.tecnm.campus ? ' · ' + DT.esc(u.tecnm.campus) : ''} · Miembro ${DT.timeAgo(u.createdAt)}</p>
            <p data-bio>${DT.esc(u.bio || '')}</p>
            ${mine ? `<button class="btn ghost sm" data-editbio>${DT.icon.edit} Editar biografía</button>` : `<button class="btn ghost sm" data-reportuser>${DT.icon.flag} Reportar</button>`}
          </div>
          <div class="profile-stats">
            <div><b>${st.owned}</b><small>Juegos</small></div>
            <div><b>${DT.fmtTime(st.playtime)}</b><small>Jugado</small></div>
            <div><b>${st.gameAch + Object.keys(pdone).length}</b><small>Logros</small></div>
            <div><b>${inv.length}</b><small>Recompensas</small></div>
          </div>
        </div>

        ${mine ? accountCards(u) : ''}

        ${collection(inv, all)}

        ${devGames.length ? `<h3 class="section-title">Juegos publicados</h3><div class="grid cols-4">${devGames.map((g) => `<a class="lib-tile" href="#/juego/${g.id}">${DT.coverHTML(g, 'fill')}<span>${DT.esc(g.title)}</span></a>`).join('')}</div>` : ''}

        <h3 class="section-title">${DT.icon.trophy} Logros de DivierteTEC</h3>
        <div class="grid cols-3">${DT.PLATFORM_ACH.map((a) => `
          <div class="ach-row big card ${pdone[a.id] ? 'got' : ''}"><span class="ach-ico">${DT.ic(a.icon)}</span>
            <div><b>${DT.esc(a.name)}</b><small>${DT.esc(a.desc)}</small>
            <div class="reward-line">${[].concat(a.reward).map(DT.rewards.chip).join('')}</div>
            ${pdone[a.id] ? `<small class="ok">Desbloqueado ${DT.timeAgo(pdone[a.id])}</small>` : ''}</div></div>`).join('')}</div>

        ${section('theme', DT.icon.palette + ' Temas de página')}
        ${section('frame', DT.icon.frame + ' Marcos de perfil')}
        ${section('avatar', DT.icon.smile + ' Avatares')}
        ${section('effect', DT.icon.sparkle + ' Efectos')}
        ${section('emoji', DT.icon.heart + ' Stickers <small class="muted">(úsalos en reseñas)</small>')}
        ${section('badge', DT.icon.medal + ' Insignias')}
      </section>`;

    if (!mine) {
      const rb = DT.$('[data-reportuser]', app);
      if (rb) rb.onclick = () => DT.reportModal('dev', u.id, null);
      return;
    }
    DT.$('[data-editbio]', app).onclick = async () => {
      const v = await DT.prompt('Editar biografía', 'Cuéntale a la comunidad sobre ti', u.bio);
      if (v != null) { u.bio = DT.hasBanned(v) ? DT.censor(v) : v.slice(0, 280); DT.emit('user'); }
    };
    DT.$$('[data-theme]', app).forEach((b) => b.onclick = () => DT.setTheme(b.dataset.theme));
    DT.$$('[data-freeav]', app).forEach((b) => b.onclick = () => { eq.avatar = b.dataset.freeav; DT.emit('user'); });
    DT.$$('[data-equip]', app).forEach((b) => b.onclick = () => {
      const r = all[b.dataset.equip];
      const slot = SLOT[r.type];
      if (r.type === 'theme') return DT.setTheme(r.data);
      eq[slot] = eq[slot] === r.data ? '' : r.data;
      DT.applyTheme();
      DT.emit('user');
    });
  };
})(window.DT);
