/* DivierteTEC — planes: Pase para jugadores y comisiones para desarrolladores. */
(function (DT) {
  'use strict';

  DT.views.plans = (app) => {
    const e = DT.econ();
    const tp = DT.passPriceFor ? DT.passPriceFor() : e.passPrice;
    const me = DT.me();
    const pass = DT.state().passes[me.id];
    const active = DT.hasPass();
    const passGames = DT.gamesPublic().filter((g) => (g.pricing || {}).inPass);
    const pct = (r) => Math.round(r * 100) + ' %';

    app.innerHTML = `
      <section class="page plans">
        <div class="plans-hero">
          <h1>Juega más. <span>Crea sin miedo.</span></h1>
          <p>DivierteTEC se sostiene con comisiones justas y un Pase mensual que reparte la mayor parte de lo que recauda entre los estudios que hacen los juegos.</p>
        </div>

        <h2 class="section-title">${DT.icon.gamepad} Para jugadores</h2>
        <div class="grid cols-2 plan-cards">
          <div class="card plan">
            <h3>${DT.icon.heart} Paga lo que quieras</h3>
            <div class="plan-price">Desde $0 <small>tú decides</small></div>
            <ul class="checks">
              <li><b>Todos los juegos gratuitos</b> funcionan así: juégalos al instante y aporta lo que quieras al estudio</li>
              <li>Juegos HTML al instante en el navegador</li>
              <li>Logros, recompensas, temas y perfil</li>
              <li>Compra juegos de pago con tu monedero</li>
            </ul>
            <span class="pill">${active ? 'Incluido en tu Pase' : 'Tu plan actual'}</span>
          </div>
          <div class="card plan featured-plan">
            <span class="ribbon">Recomendado</span>
            <h3>${DT.icon.ticket} Pase DivierteTEC</h3>
            <div class="plan-price">${tp < e.passPrice ? `<s class="muted">${DT.money(e.passPrice)}</s> ` : ''}${DT.money(tp)} <small>al mes</small></div>
            ${tp < e.passPrice ? `<span class="pill tecnm">${DT.ic('cap')} Precio TecNM verificado</span>` : `<a class="muted small" href="#/verificacion-tecnm">${DT.ic('cap')} ¿Eres del TecNM? Verifícate y paga ${DT.money(Math.round(e.passPrice * (1 - (e.passTecnmDiscount || 0.3)) * 100) / 100)}</a>`}
            <ul class="checks">
              <li><b>${passGames.length} juegos del Pase</b> incluidos sin comprarlos</li>
              <li><b>${pct(e.passDiscount)} de descuento</b> en juegos de pago</li>
              <li>Insignia <b>Miembro del Pase</b> en tu perfil</li>
              <li><b>${pct(e.passDevShare)}</b> de tu pago va a los estudios, según el tiempo que juegas sus juegos</li>
            </ul>
            ${active ? `<p class="ok">Activo hasta el ${new Date(pass.until).toLocaleDateString('es-MX')}</p><button class="btn ghost" data-sub>Extender 1 mes</button>`
              : `<button class="btn primary big" data-sub>Suscribirme por ${DT.money(tp)}</button>`}
            <small class="muted">Pago simulado con el saldo de demostración (tu saldo: ${DT.money(DT.wallet())}).</small>
          </div>
        </div>
        <div class="pass-games">${passGames.map((g) => `<a href="#/juego/${g.id}">${DT.coverHTML(g)}<b>${DT.esc(g.title)}</b></a>`).join('')}</div>

        <h2 class="section-title">${DT.icon.wrench} Para desarrolladores</h2>
        <div class="grid cols-3 tiers">
          <div class="card tier"><div class="tier-rate">0 %</div><h4>Semilla TEC</h4><p>Tus primeros <b>${DT.money(e.seedAllowance)}</b> en ventas no pagan comisión. Para estudios de estudiantes del TecNM verificados.</p></div>
          <div class="card tier"><div class="tier-rate">${pct(e.rateStudent)}</div><h4>Estudio TecNM</h4><p>Después de la Semilla. Recibes el ${pct(1 - e.rateStudent)} de cada venta.</p></div>
          <div class="card tier"><div class="tier-rate">${pct(e.rateExternal)}</div><h4>Estudio externo</h4><p>Indies y empresas fuera del TecNM. Recibes el ${pct(1 - e.rateExternal)}.</p></div>
        </div>
        <div class="grid cols-2">
          <div class="card">
            <h3>${DT.icon.chart} Calculadora de ganancias</h3>
            <div class="form-grid">
              <label class="field"><span>Precio del juego (MXN)</span><input type="number" min="0" value="49" data-c="price"></label>
              <label class="field"><span>Copias vendidas</span><input type="number" min="0" value="200" data-c="units"></label>
              <label class="field wide"><span>Tipo de estudio</span><select data-c="type"><option value="student">Estudio TecNM verificado (con Semilla TEC)</option><option value="external">Externo</option></select></label>
            </div>
            <div class="calc" data-calc></div>
          </div>
          <div class="card">
            <h3>Otras formas de ganar</h3>
            <ul class="checks">
              <li><b>Fondo del Pase:</b> cada mes se reparte el ${pct(e.passDevShare)} de las suscripciones entre los juegos del Pase, según el tiempo jugado.</li>
              <li><b>Propinas:</b> los jugadores pueden apoyarte directamente desde tu página.</li>
              <li><b>Paga lo que quieras:</b> publica gratis y deja que la comunidad decida.</li>
              <li><b>Destacado patrocinado:</b> ${DT.money(e.promoPrice)} por ${e.promoDays} días en el carrusel principal (lo aprueba la administración).</li>
            </ul>
            <h3 style="margin-top:16px">¿A dónde va cada peso?</h3>
            <div class="flow">
              <div><b>Jugador</b><small>paga ${DT.money(100)}</small></div><i>→</i>
              <div class="accent"><b>Estudio</b><small>${DT.money(100 * (1 - e.rateStudent))}</small></div><i>+</i>
              <div><b>DivierteTEC</b><small>${DT.money(100 * e.rateStudent)}: servidores, moderación, torneos</small></div>
            </div>
          </div>
        </div>
        <p class="muted small">Referencia de mercado: Steam cobra 30 % en su tramo estándar, Epic Games Store 12 % e itch.io deja elegir al estudio (10 % por defecto).</p>
      </section>`;

    DT.$$('[data-sub]', app).forEach((b) => b.onclick = () => { if (DT.subscribePass()) DT.render(true); });

    const calc = () => {
      const price = Math.max(0, Number(DT.$('[data-c="price"]', app).value) || 0);
      const units = Math.max(0, Number(DT.$('[data-c="units"]', app).value) || 0);
      const student = DT.$('[data-c="type"]', app).value === 'student';
      const gross = price * units;
      const free = student ? Math.min(gross, e.seedAllowance) : 0;
      const rate = student ? e.rateStudent : e.rateExternal;
      const net = gross - (gross - free) * rate;
      const steam = gross * 0.7;
      DT.$('[data-calc]', app).innerHTML = `
        <div><span>Ventas brutas</span><b>${DT.money(gross)}</b></div>
        ${free ? `<div><span>Sin comisión (Semilla TEC)</span><b>${DT.money(free)}</b></div>` : ''}
        <div><span>Comisión DivierteTEC (${Math.round(rate * 100)} %)</span><b>−${DT.money(gross - net)}</b></div>
        <div class="total"><span>Tú recibes en DivierteTEC</span><b>${DT.money(net)}</b></div>
        <div><span>Con el 30 % estándar de Steam</span><b class="muted">${DT.money(steam)}</b></div>
        <div class="gain"><span>Diferencia a tu favor</span><b>+${DT.money(net - steam)}</b></div>`;
    };
    DT.$$('[data-c]', app).forEach((i) => i.addEventListener('input', calc));
    calc();
  };
})(window.DT);
