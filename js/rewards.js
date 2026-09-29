/* DivierteTEC — motor de logros y recompensas.
   Flujo: juego (SDK) → runner (postMessage validado) → DT.rewards.unlockGame()
          → se guarda el logro → se entrega la recompensa al inventario → toast
          → se re-evalúan los logros de plataforma. */
(function (DT) {
  'use strict';

  const R = DT.rewards = {};

  const rewardChip = (rid) => {
    const r = DT.reward(rid);
    if (!r) return '';
    const rar = DT.RARITY[r.rarity] || DT.RARITY.comun;
    return `<span class="reward-chip" style="--rar:${rar.color}">${DT.esc(r.glyph)} ${DT.esc(r.name)} <small>${DT.REWARD_TYPES[r.type] || ''}</small></span>`;
  };
  R.chip = rewardChip;

  const achToast = (icon, title, name, rewards, test) => {
    DT.toast(`<div class="ach-toast">
      <div class="ach-toast-icon">${DT.esc(icon || '🏆')}</div>
      <div><small>${test ? '🧪 PRUEBA · ' : ''}${DT.esc(title)}</small><strong>${DT.esc(name)}</strong>
      ${rewards.length ? `<div class="ach-toast-rewards">${rewards.map(rewardChip).join('')}</div>` : ''}</div>
    </div>`, { kind: 'achievement', ms: 5200 });
  };

  /* Entrega recompensas al inventario. Devuelve las que eran nuevas. */
  R.grant = (uid, ids) => {
    const inv = DT.inventory(uid);
    const fresh = [];
    [].concat(ids || []).forEach((id) => {
      if (id && DT.reward(id) && !inv.includes(id)) { inv.push(id); fresh.push(id); }
    });
    return fresh;
  };

  /* Desbloquea un logro definido por el desarrollador del juego */
  R.unlockGame = (uid, gid, achId, opts) => {
    opts = opts || {};
    const g = DT.game(gid);
    if (!g) return false;
    const def = (g.achievements || []).find((a) => a.id === achId);
    if (!def) { console.warn('[DivierteTEC] Logro desconocido:', achId); return false; }
    if (opts.test) { // modo prueba: no se guarda nada
      achToast(def.icon, 'Logro desbloqueado', def.name, def.reward ? [def.reward] : [], true);
      return true;
    }
    const mine = DT.userAch(uid, gid);
    if (mine[achId] && mine[achId].unlockedAt) return false;
    mine[achId] = Object.assign(mine[achId] || {}, { unlockedAt: Date.now() });
    const fresh = R.grant(uid, def.reward);
    achToast(def.icon, g.title + ' · Logro desbloqueado', def.name, fresh);
    R.checkPlatform(uid);
    DT.emit('achievement');
    return true;
  };

  /* Progreso numérico: al llegar a la meta se desbloquea */
  R.progress = (uid, gid, achId, value, opts) => {
    const g = DT.game(gid);
    const def = g && (g.achievements || []).find((a) => a.id === achId);
    if (!def) return;
    if (!def.goal) { if (value) R.unlockGame(uid, gid, achId, opts); return; }
    if (opts && opts.test) { if (value >= def.goal) R.unlockGame(uid, gid, achId, opts); return; }
    const mine = DT.userAch(uid, gid);
    const cur = mine[achId] = mine[achId] || {};
    if (cur.unlockedAt) return;
    cur.progress = Math.max(cur.progress || 0, Number(value) || 0);
    if (cur.progress >= def.goal) R.unlockGame(uid, gid, achId, opts);
    else DT.save();
  };

  /* Estadísticas del usuario para evaluar logros de plataforma */
  R.userStats = (uid) => {
    const s = DT.state();
    const c = DT.counters(uid);
    const lib = DT.lib(uid);
    const ach = s.achievements[uid] || {};
    let gameAch = 0;
    Object.values(ach).forEach((m) => Object.values(m).forEach((a) => { if (a.unlockedAt) gameAch++; }));
    return {
      sessions: c.sessions,
      visited: c.visited.length,
      reports: c.reports,
      owned: Object.keys(lib).length,
      playtime: Object.values(lib).reduce((t, e) => t + (e.playtime || 0), 0),
      reviews: s.games.reduce((t, g) => t + g.reviews.filter((r) => r.userId === uid).length, 0),
      gameAch,
      published: s.games.filter((g) => g.devId === uid && g.status === 'approved').length
    };
  };

  R.checkPlatform = (uid) => {
    uid = uid || DT.state().currentUserId;
    const s = DT.state();
    const done = s.platformAch[uid] = s.platformAch[uid] || {};
    const st = R.userStats(uid);
    let any = false;
    DT.PLATFORM_ACH.forEach((a) => {
      if (done[a.id] || !a.check(st)) return;
      done[a.id] = Date.now();
      const fresh = R.grant(uid, a.reward);
      if (uid === s.currentUserId) achToast(a.icon, 'Logro de DivierteTEC', a.name, fresh);
      any = true;
    });
    if (any) DT.emit('achievement');
  };

  /* Resumen de logros de un juego para el usuario */
  R.gameSummary = (uid, g) => {
    const mine = DT.userAch(uid, g.id);
    const total = (g.achievements || []).length;
    const got = (g.achievements || []).filter((a) => mine[a.id] && mine[a.id].unlockedAt).length;
    return { total, got, pct: total ? Math.round(got / total * 100) : 0 };
  };
})(window.DT);
