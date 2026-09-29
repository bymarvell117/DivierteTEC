/* DivertiTEC — perfil, inventario de recompensas y personalización. */
(function (DT) {
  'use strict';

  /* ¿Qué logro entrega esta recompensa? (para mostrar cómo desbloquearla) */
  DT.rewardSources = (rid) => {
    const out = [];
    DT.PLATFORM_ACH.forEach((a) => { if ([].concat(a.reward).includes(rid)) out.push(`Logro de DivertiTEC «${a.name}»: ${a.desc}`); });
    DT.state().games.filter((g) => g.status === 'approved' || g.devId === DT.me().id).forEach((g) => (g.achievements || []).forEach((a) => {
      if (a.reward === rid) out.push(`Logro «${a.hidden ? '???' : a.name}» en ${g.title}`);
    }));
    return out;
  };

  const SLOT = { theme: 'theme', frame: 'frame', avatar: 'avatar', effect: 'effect', badge: 'badge' };

  const itemCard = (rid, r, owned, equipped, canEquip) => {
    const rar = DT.RARITY[r.rarity] || DT.RARITY.comun;
    const src = owned ? '' : DT.rewardSources(rid)[0] || 'Recompensa de evento';
    return `<div class="reward-card ${owned ? '' : 'locked'} ${equipped ? 'equipped' : ''}" style="--rar:${rar.color}">
      <div class="reward-glyph ${r.type === 'frame' ? 'frame-demo' : ''}">${r.type === 'frame' ? `<span class="avatar frame-${r.data}" style="--s:54px"><span>${DT.esc(DT.avatarOf(DT.me()))}</span></span>` : DT.esc(r.glyph)}</div>
      <b>${DT.esc(r.name)}</b>
      <small style="color:${rar.color}">${rar.name}</small>
      <p>${owned ? DT.esc(r.desc || '') : `${DT.icon.lock} ${DT.esc(src)}`}</p>
      ${owned && canEquip ? `<button class="btn ${equipped ? 'ghost' : 'primary'} sm" data-equip="${rid}">${equipped ? 'Quitar' : 'Equipar'}</button>` : ''}
    </div>`;
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
    const devGames = s.games.filter((g) => g.devId === u.id && g.status === 'approved');

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
      if (type === 'avatar') extra = DT.FREE_AVATARS.map((a) => `<div class="reward-card ${eq.avatar === a ? 'equipped' : ''}" style="--rar:#8a9bb0"><div class="reward-glyph">${a}</div><b>Básico</b><small>Gratis</small>${mine ? `<button class="btn ${eq.avatar === a ? 'ghost' : 'primary'} sm" data-freeav="${a}">${eq.avatar === a ? 'En uso' : 'Equipar'}</button>` : ''}</div>`).join('');
      return `<h3 class="section-title">${title}</h3><div class="reward-grid">${extra}${ids.map((id) => {
        const r = all[id];
        const owned = inv.includes(id);
        if (!mine && !owned) return '';
        const equipped = SLOT[type] && eq[SLOT[type]] === r.data;
        return itemCard(id, r, owned, equipped, mine && type !== 'emoji');
      }).join('')}</div>`;
    };

    app.innerHTML = `
      <section class="page">
        <div class="profile-head card">
          ${DT.avatarHTML(u, 110)}
          <div class="profile-info">
            <h1>${DT.esc(u.name)} ${badges.map((b) => `<span class="badge-ico" title="${DT.esc(all[b].name)}">${all[b].glyph}</span>`).join('')}</h1>
            <p class="muted">${{ user: 'Jugador', dev: 'Desarrollador', admin: 'Administrador' }[u.role]}${u.verified ? ' · Estudio verificado ✔' : ''} · Miembro ${DT.timeAgo(u.createdAt)}</p>
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

        ${devGames.length ? `<h3 class="section-title">Juegos publicados</h3><div class="grid cols-4">${devGames.map((g) => `<a class="lib-tile" href="#/juego/${g.id}">${DT.coverHTML(g, 'fill')}<span>${DT.esc(g.title)}</span></a>`).join('')}</div>` : ''}

        <h3 class="section-title">${DT.icon.trophy} Logros de DivertiTEC</h3>
        <div class="grid cols-3">${DT.PLATFORM_ACH.map((a) => `
          <div class="ach-row big card ${pdone[a.id] ? 'got' : ''}"><span class="ach-ico">${a.icon}</span>
            <div><b>${DT.esc(a.name)}</b><small>${DT.esc(a.desc)}</small>
            <div class="reward-line">${[].concat(a.reward).map(DT.rewards.chip).join('')}</div>
            ${pdone[a.id] ? `<small class="ok">Desbloqueado ${DT.timeAgo(pdone[a.id])}</small>` : ''}</div></div>`).join('')}</div>

        ${section('theme', '🎨 Temas de página')}
        ${section('frame', '🖼️ Marcos de perfil')}
        ${section('avatar', '🙂 Avatares')}
        ${section('effect', '✨ Efectos')}
        ${section('emoji', '😀 Emojis <small class="muted">(úsalos en reseñas)</small>')}
        ${section('badge', '🏅 Insignias')}
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
