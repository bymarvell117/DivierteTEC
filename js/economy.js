/* DivierteTEC — economía de la plataforma (modelo "Crece con tu estudio").
   Todo el dinero es SIMULADO: saldo de demostración, sin datos bancarios.
   - Venta de juegos: Semilla TEC (0 % durante las 3 primeras semanas de cada juego de un
     estudio TecNM verificado), luego 12 % estudios TecNM / 18 % estudios externos.
   - Pase DivierteTEC mensual: el 70 % va a un fondo que se reparte por tiempo jugado.
   - Promoción patrocinada en Destacados y propinas a desarrolladores.
   Cada movimiento queda en state.ledger (libro de transacciones). */
(function (DT) {
  'use strict';

  const DAY = 86400000;
  const r2 = (n) => Math.round(n * 100) / 100;
  const fmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
  DT.money = (n) => fmt.format(n || 0);

  const S = () => DT.state();
  DT.econ = () => S().economy;
  /* Estudios de estudiantes del TecNM verificados: comisión preferente, sello y prioridad en revisión */
  DT.isTecnmDev = (u) => !!(u && ((u.tecnm && u.tecnm.verified) || (u.student && u.verified)));
  DT.isTecnm = DT.isTecnmDev;
  DT.isTecnmGame = (g) => DT.isTecnmDev(DT.user(g.devId));
  DT.tecnmPill = (g, long) => { if (!DT.isTecnmGame(g)) return ''; const c = (DT.user(g.devId) || {}).campus; return `<span class="pill tecnm" title="Estudio de estudiantes del TecNM verificado">${DT.icon.cap} ${long ? 'Hecho en el TecNM' + (c ? ' · ' + DT.esc(c) : '') : 'TecNM'}</span>`; };
  DT.wallet = (uid) => r2(S().wallets[uid || S().currentUserId] || 0);
  const credit = (uid, n) => { S().wallets[uid] = r2((S().wallets[uid] || 0) + n); };
  const record = (e) => { e.id = DT.uid('tx'); e.date = Date.now(); S().ledger.unshift(e); return e; };

  /* ---------- Precios y acceso ---------- */
  DT.hasPass = (uid) => { const p = S().passes[uid || S().currentUserId]; return !!(p && p.until > Date.now()); };

  DT.priceOf = (g, uid) => {
    const p = g.pricing || { mode: 'free' };
    if (p.mode === 'free') return { mode: 'free', base: 0, final: 0, discount: 0 };
    const disc = Number(p.discount) || 0;
    let final = r2(p.price * (1 - disc / 100));
    const passOff = DT.hasPass(uid) && p.mode === 'paid' ? DT.econ().passDiscount : 0;
    if (passOff) final = r2(final * (1 - passOff));
    return { mode: p.mode, base: p.price, final, discount: disc, passOff, min: Number(p.min) || 0 };
  };

  /* ¿Por qué vía puede jugar el usuario? dev | purchase | pass | free | null */
  DT.accessSource = (gid, uid) => {
    uid = uid || S().currentUserId;
    const g = DT.game(gid);
    const u = DT.user(uid);
    if (!g || (g.private && g.ownerId !== uid)) return null;
    if (g.devId === uid || (u && u.role === 'admin')) return 'dev';
    if ((S().purchases[uid] || {})[gid]) return 'purchase';
    const pr = g.pricing || {};
    if (!pr.mode || pr.mode === 'free' || (pr.mode === 'pwyw' && !(Number(pr.min) > 0))) return 'free'; // se juega ya; pagar es opcional
    if (pr.inPass && DT.hasPass(uid)) return 'pass';
    return null;
  };
  DT.canAccess = (gid, uid) => !!DT.accessSource(gid, uid);

  /* Etiqueta de precio para tarjetas */
  DT.priceTag = (g) => {
    if (g.private) return '<span class="price">Personal · no comercial</span>';
    const src = DT.accessSource(g.id);
    const p = DT.priceOf(g);
    const pass = (g.pricing || {}).inPass ? '<span class="pass-tag" title="Incluido en el Pase DivierteTEC">' + DT.icon.ticket + ' Pase</span>' : '';
    const paid = (S().purchases[S().currentUserId] || {})[g.id];
    if (src === 'purchase' || (paid && p.mode === 'pwyw')) return `<span class="price owned-price">${p.mode === 'pwyw' ? 'Apoyaste con ' + DT.money(paid.paid) : 'Comprado'}</span>${pass}`;
    if (p.mode === 'free') return `<span class="price">Gratis</span>${pass}`;
    if (p.mode === 'pwyw') return `<span class="price pwyw">Paga lo que quieras<small>${p.min > 0 ? 'desde ' + DT.money(p.min) : 'desde $0'} · sugerido ${DT.money(p.base)}</small></span>${pass}`;
    return `${p.discount ? `<span class="disc">−${p.discount}%</span><s class="muted">${DT.money(p.base)}</s>` : ''}<span class="price">${DT.money(p.final)}</span>${pass}`;
  };

  /* ---------- Comisión escalonada ---------- */
  DT.devSalesTotal = (devId) => S().ledger.filter((e) => e.type === 'sale' && e.to === devId).reduce((t, e) => t + e.gross, 0);
  /* Semilla TEC: cada juego de un estudio TecNM no paga comisión durante sus primeros
     seedDays días desde que se publica (g.createdAt se fija al aprobarlo). */
  DT.seedWeeks = () => Math.max(0, Math.round(DT.econ().seedDays / 7));
  DT.seedText = () => { const w = DT.seedWeeks(); return w === 1 ? 'primera semana' : w + ' primeras semanas'; };
  DT.seedUntil = (g) => (g && DT.isTecnm(DT.user(g.devId)) && g.status === 'approved' ? (g.createdAt || 0) + DT.econ().seedDays * DAY : 0);
  DT.inSeed = (g) => Date.now() < DT.seedUntil(g);
  DT.seedDaysLeft = (g) => Math.max(0, Math.ceil((DT.seedUntil(g) - Date.now()) / DAY));
  DT.commissionFor = (devId, gross, gameId) => {
    const e = DT.econ();
    const dev = DT.user(devId) || {};
    const student = DT.isTecnm(dev);
    const rate = student ? e.rateStudent : e.rateExternal;
    const g = gameId ? DT.game(gameId) : null;
    const freePart = g && DT.inSeed(g) ? gross : 0;
    const commission = r2((gross - freePart) * rate);
    const note = freePart > 0 ? `Semilla TEC (0 %) · quedan ${DT.seedDaysLeft(g)} días` : (student ? 'Estudio TecNM' : 'Estudio externo') + ` (${Math.round(rate * 100)} %)`;
    return { rate, student, freePart: r2(freePart), commission, net: r2(gross - commission), note };
  };

  /* ---------- Compra ---------- */
  DT.buy = (gid, amount) => {
    const me = DT.me();
    const g = DT.game(gid);
    const gross = r2(amount);
    if (DT.wallet(me.id) < gross) { DT.toast('Saldo insuficiente. Recarga saldo de demostración.', { kind: 'error' }); return false; }
    const c = DT.commissionFor(g.devId, gross, g.id);
    credit(me.id, -gross);
    credit(g.devId, c.net);
    if (gross > 0) record({ type: 'sale', from: me.id, to: g.devId, gameId: gid, gross, commission: c.commission, net: c.net, note: c.note });
    (S().purchases[me.id] = S().purchases[me.id] || {})[gid] = { date: Date.now(), paid: gross };
    const lib = DT.lib();
    if (!lib[gid]) lib[gid] = { added: Date.now(), playtime: 0, lastPlayed: 0, source: 'purchase' };
    DT.log(`Compró «${g.title}» por ${DT.money(gross)}.`);
    DT.toast((g.pricing || {}).mode === 'pwyw' && gross > 0 ? `${DT.icon.heart} ¡Gracias! Apoyaste a <b>${DT.esc((DT.user(g.devId) || {}).name || 'el estudio')}</b> con ${DT.money(gross)}. <b>${DT.esc(g.title)}</b> está en tu biblioteca.` : `${DT.icon.check} <b>${DT.esc(g.title)}</b> es tuyo. Ya está en tu biblioteca.`, { kind: 'ok' });
    if (DT.fx) DT.fx.burst(innerWidth / 2, innerHeight * 0.55, { up: true, count: 90, power: 12 });
    DT.rewards.checkPlatform();
    DT.emit('library');
    return true;
  };

  DT.topUp = (amount) => {
    const me = DT.me();
    credit(me.id, amount);
    record({ type: 'topup', from: 'demo', to: me.id, gross: amount, commission: 0, net: amount, note: 'Saldo de demostración' });
    DT.emit('wallet');
  };

  /* Caja: desglose de lo que recibe el desarrollador y la comisión */
  DT.checkout = (gid) => {
    const g = DT.game(gid);
    const me = DT.me();
    const p = DT.priceOf(g);
    const pwyw = p.mode === 'pwyw';
    const m = DT.modal({
      title: `${DT.icon.gift} ${pwyw ? 'Paga lo que quieras' : 'Comprar'} · ${DT.esc(g.title)}`,
      body: `
        <div class="checkout">
          ${DT.coverHTML(g)}
          <div>
            ${pwyw ? `<p class="pwyw-pitch">${DT.icon.heart} <b>Tú decides el precio.</b> ${p.min > 0 ? '' : 'Puedes jugarlo gratis; '}lo que aportes va directo al estudio que lo creó (precio sugerido: ${DT.money(p.base)}).</p>
              <label class="field"><span>¿Cuánto quieres aportar? (mínimo ${DT.money(p.min)})</span>
              <div class="row nowrap"><span>$</span><input type="number" min="${p.min}" step="1" value="${p.base}" data-amount></div></label>
              <div class="chips">${[...new Set([0, 10, p.base, 50, 100])].filter((v) => v >= p.min).sort((a, b) => a - b).map((v) => `<button class="chip" data-quick="${v}">${v ? DT.money(v) + (v === p.base ? ' · sugerido' : '') : 'Solo jugar ($0)'}</button>`).join('')}</div>`
              : `<div class="big-price">${p.discount ? `<s class="muted">${DT.money(p.base)}</s> ` : ''}${DT.money(p.final)}</div>
              ${p.discount ? `<span class="pill ok">Oferta −${p.discount}%</span>` : ''} ${p.passOff ? `<span class="pill">${DT.icon.ticket} −${Math.round(p.passOff * 100)}% por tu Pase</span>` : ''}`}
            <div class="breakdown" data-breakdown></div>
            <p class="muted small">Tu saldo: <b>${DT.money(DT.wallet(me.id))}</b> · Pago simulado para la demostración.</p>
            ${(g.pricing || {}).inPass && !DT.hasPass() ? `<p class="small">${DT.icon.ticket} Este juego está incluido en el <a href="#/planes" data-close>Pase DivierteTEC</a>.</p>` : ''}
          </div>
        </div>`,
      actions: `<button class="btn ghost" data-topup>${DT.icon.plus} Recargar $200 (demo)</button><span class="spacer"></span>
        <button class="btn ghost" data-close>Cancelar</button><button class="btn success" data-pay>Pagar con saldo</button>`
    });
    const amountEl = m.el.querySelector('[data-amount]');
    const amount = () => (pwyw ? Math.max(p.min, Number(amountEl.value) || 0) : p.final);
    const draw = () => {
      const a = amount();
      const c = DT.commissionFor(g.devId, a, g.id);
      m.el.querySelector('[data-breakdown]').innerHTML = `
        <div><span>${DT.esc((DT.user(g.devId) || {}).name)} recibe</span><b>${DT.money(c.net)}</b></div>
        <div><span>Comisión DivierteTEC <small class="muted">${DT.esc(c.note)}</small></span><b>${DT.money(c.commission)}</b></div>
        <div class="total"><span>Total</span><b>${DT.money(a)}</b></div>`;
      m.el.querySelector('[data-pay]').textContent = a > 0 ? `${pwyw ? 'Aportar' : 'Pagar'} ${DT.money(a)}` : 'Obtener gratis';
    };
    if (amountEl) amountEl.addEventListener('input', draw);
    m.el.querySelectorAll('[data-quick]').forEach((b) => b.onclick = () => { amountEl.value = b.dataset.quick; draw(); });
    m.el.querySelector('[data-topup]').onclick = () => { DT.topUp(200); m.el.querySelector('.small b').textContent = DT.money(DT.wallet()); DT.toast('+$200 de saldo de demostración.'); };
    m.el.querySelector('[data-pay]').onclick = () => { if (DT.buy(gid, amount())) m.close(); };
    draw();
  };

  /* ---------- Propinas ---------- */
  DT.tipModal = (g) => {
    const dev = DT.user(g.devId);
    const m = DT.modal({
      title: `${DT.icon.heart} Apoyar a ${DT.esc(dev.name)}`,
      body: `<p>Las propinas van completas al estudio (en la demo sin comisión).</p>
        <div class="chips">${[10, 20, 50, 100].map((v) => `<button class="chip" data-tip="${v}">${DT.money(v)}</button>`).join('')}</div>
        <p class="muted small">Tu saldo: ${DT.money(DT.wallet())}</p>`,
      actions: '<button class="btn ghost" data-close>Cerrar</button>'
    });
    m.el.querySelectorAll('[data-tip]').forEach((b) => b.onclick = () => {
      const v = Number(b.dataset.tip);
      if (DT.wallet() < v) { DT.toast('Saldo insuficiente.', { kind: 'error' }); return; }
      credit(DT.me().id, -v); credit(g.devId, v);
      record({ type: 'tip', from: DT.me().id, to: g.devId, gameId: g.id, gross: v, commission: 0, net: v, note: 'Propina' });
      m.close();
      DT.toast(`¡Gracias! ${DT.esc(dev.name)} recibió ${DT.money(v)}.`, { kind: 'ok' });
      DT.emit('wallet');
    });
  };

  /* ---------- Pase DivierteTEC ---------- */
  DT.subscribePass = () => {
    const me = DT.me();
    const e = DT.econ();
    const price = DT.passPriceFor ? DT.passPriceFor(me.id) : e.passPrice;
    if (DT.wallet(me.id) < price) { DT.toast('Saldo insuficiente para el Pase. Recarga saldo de demostración.', { kind: 'error' }); return false; }
    credit(me.id, -price);
    const cur = S().passes[me.id];
    const from = cur && cur.until > Date.now() ? cur.until : Date.now();
    S().passes[me.id] = { since: (cur && cur.since) || Date.now(), until: from + 30 * DAY };
    const fund = r2(price * e.passDevShare);
    record({ type: 'pass', from: me.id, to: 'platform', gross: price, commission: r2(price - fund), net: fund, note: 'Pase DivierteTEC · 1 mes' + (price < e.passPrice ? ' · precio TecNM' : '') });
    DT.rewards.grant(me.id, 'badge_pase');
    DT.log('Se suscribió al Pase DivierteTEC.');
    DT.toast(DT.icon.ticket + ' ¡Bienvenido al Pase DivierteTEC! Los juegos del Pase ya están disponibles.', { kind: 'ok' });
    DT.emit('library');
    return true;
  };

  /* Fondo del Pase pendiente de repartir (70 % de las suscripciones menos lo ya pagado) */
  DT.passFund = () => {
    const L = S().ledger;
    const inFund = L.filter((x) => x.type === 'pass').reduce((t, x) => t + x.net, 0);
    const paid = L.filter((x) => x.type === 'pass_payout').reduce((t, x) => t + x.gross, 0);
    return r2(inFund - paid);
  };
  /* Reparto proporcional al tiempo jugado en juegos del Pase */
  DT.distributePassFund = () => {
    const pool = DT.passFund();
    if (pool <= 0) return [];
    const passGames = DT.catalogGames().filter((g) => (g.pricing || {}).inPass && g.status === 'approved');
    const weight = {};
    passGames.forEach((g) => {
      const t = Object.values(S().library).reduce((a, lib) => a + ((lib[g.id] && lib[g.id].playtime) || 0), 0);
      weight[g.devId] = (weight[g.devId] || 0) + t + 1; // +1: mínimo para que todo juego del Pase participe
    });
    const total = Object.values(weight).reduce((a, b) => a + b, 0);
    const entries = Object.entries(weight);
    let left = pool;
    const out = entries.map(([devId, w], i) => {
      // El último recibe el remanente para que el fondo quede exactamente en cero
      const amount = i === entries.length - 1 ? r2(left) : r2(pool * w / total);
      left -= amount;
      credit(devId, amount);
      record({ type: 'pass_payout', from: 'platform', to: devId, gross: amount, commission: 0, net: amount, note: `Fondo del Pase · ${Math.round(w / total * 100)} % del tiempo jugado` });
      return { devId, amount };
    });
    DT.log(`Repartió ${DT.money(pool)} del fondo del Pase.`);
    DT.emit('admin');
    return out;
  };

  /* ---------- Promoción patrocinada ---------- */
  DT.requestPromo = (gid) => {
    const g = DT.game(gid);
    const e = DT.econ();
    if (DT.wallet(g.devId) < e.promoPrice) { DT.toast(`Necesitas ${DT.money(e.promoPrice)} de saldo en tu cuenta de estudio.`, { kind: 'error' }); return; }
    if (S().promos.some((p) => p.gameId === gid && p.status === 'pending')) { DT.toast('Ya hay una solicitud pendiente para este juego.'); return; }
    credit(g.devId, -e.promoPrice);
    S().promos.unshift({ id: DT.uid('promo'), gameId: gid, devId: g.devId, date: Date.now(), status: 'pending', price: e.promoPrice });
    DT.toast('Solicitud enviada. La administración la revisará.', { kind: 'ok' });
    DT.emit('admin');
  };
  DT.decidePromo = (id, ok) => {
    const p = S().promos.find((x) => x.id === id);
    const g = DT.game(p.gameId);
    p.status = ok ? 'active' : 'rejected';
    if (ok) {
      g.featured = true;
      g.sponsoredUntil = Date.now() + DT.econ().promoDays * DAY;
      record({ type: 'promo', from: p.devId, to: 'platform', gameId: g.id, gross: p.price, commission: p.price, net: 0, note: `Destacado patrocinado · ${DT.econ().promoDays} días` });
    } else {
      credit(p.devId, p.price);
    }
    DT.log(`${ok ? 'Aprobó' : 'Rechazó'} la promoción de «${g.title}».`);
    DT.emit('admin');
  };
  DT.isSponsored = (g) => !!(g.sponsoredUntil && g.sponsoredUntil > Date.now());

  /* ---------- Retiro del desarrollador (simulado) ---------- */
  DT.payout = (devId) => {
    const amount = DT.wallet(devId);
    if (amount <= 0) return;
    credit(devId, -amount);
    record({ type: 'payout', from: devId, to: 'banco', gross: amount, commission: 0, net: amount, note: 'Retiro a cuenta bancaria (simulado)' });
    DT.toast(`Retiro de ${DT.money(amount)} solicitado.`, { kind: 'ok' });
    DT.emit('wallet');
  };

  /* ---------- Resumen financiero para la administración ---------- */
  DT.financeSummary = () => {
    const L = S().ledger;
    const sum = (type, key) => r2(L.filter((x) => x.type === type).reduce((t, x) => t + x[key], 0));
    const sales = sum('sale', 'gross');
    const saleFees = sum('sale', 'commission');
    const pass = sum('pass', 'gross');
    const passPlatform = sum('pass', 'commission');
    const promos = sum('promo', 'gross');
    return {
      sales, saleFees, pass, passPlatform, promos,
      tips: sum('tip', 'gross'),
      platform: r2(saleFees + passPlatform + promos),
      toDevs: r2(sum('sale', 'net') + sum('tip', 'net') + sum('pass_payout', 'gross')),
      subscribers: Object.values(S().passes).filter((p) => p.until > Date.now()).length,
      fund: DT.passFund()
    };
  };

  DT.TX_LABEL = { sale: 'Venta', tip: 'Propina', pass: 'Pase', pass_payout: 'Reparto del Pase', promo: 'Promoción', topup: 'Recarga', payout: 'Retiro' };
  DT.txRow = (e) => {
    const who = (id) => (DT.user(id) || {}).name || ({ platform: 'DivierteTEC', demo: 'Saldo demo', banco: 'Banco' }[id] || id);
    const g = e.gameId && DT.game(e.gameId);
    return `<div class="tr tx"><span>${DT.timeAgo(e.date)}</span><span><span class="pill">${DT.TX_LABEL[e.type] || e.type}</span></span>
      <span>${DT.esc(who(e.from))} → ${DT.esc(who(e.to))}${g ? `<small class="muted"> · ${DT.esc(g.title)}</small>` : ''}</span>
      <span>${DT.money(e.gross)}</span><span>${e.commission ? DT.money(e.commission) : '—'}</span><span class="muted small">${DT.esc(e.note || '')}</span></div>`;
  };

  /* ---------- Monedero (barra superior) ---------- */
  DT.walletModal = () => {
    const me = DT.me();
    const mine = S().ledger.filter((e) => e.from === me.id || e.to === me.id).slice(0, 8);
    const pass = S().passes[me.id];
    const m = DT.modal({
      title: DT.icon.wallet + ' Mi monedero',
      wide: true,
      body: `
        <div class="wallet-head">
          <div><small class="muted">Saldo disponible</small><div class="big-price">${DT.money(DT.wallet())}</div></div>
          <div><small class="muted">Pase DivierteTEC</small><div>${DT.hasPass() ? `${DT.icon.ticket} Activo hasta ${new Date(pass.until).toLocaleDateString('es-MX')}` : 'No activo · <a href="#/planes" data-close>ver planes</a>'}</div></div>
        </div>
        <p class="notice">Dinero simulado para la demostración: no se piden ni guardan datos bancarios.</p>
        <h4>Movimientos recientes</h4>
        <div class="table">${mine.map(DT.txRow).join('') || '<p class="muted pad">Sin movimientos.</p>'}</div>`,
      actions: `${me.role === 'dev' ? `<button class="btn ghost" data-payout>Retirar ganancias</button>` : ''}<span class="spacer"></span>
        <button class="btn primary" data-top>${DT.icon.plus} Recargar $200 (demo)</button>`
    });
    m.el.querySelector('[data-top]').onclick = () => { DT.topUp(200); m.close(); DT.walletModal(); };
    const po = m.el.querySelector('[data-payout]');
    if (po) po.onclick = () => { DT.payout(me.id); m.close(); };
  };
})(window.DT);
