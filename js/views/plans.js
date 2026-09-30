/* DivierteTEC — planes: Pase para jugadores y comisiones para desarrolladores. */
(function (DT) {
  'use strict';

  const pctT = (r) => Math.round(r * 100) + ' %';

  /* Transparencia: a dónde va el dinero, con los totales reales del libro de transacciones */
  const transparency = (e) => {
    const f = DT.financeSummary();
    const cr = e.causeRate || 0;
    return `<div class="card transp">
      <h2 class="section-title">${DT.ic('leaf')} Transparencia: ${pctT(cr)} para la educación ambiental</h2>
      <div class="transp-grid">
        <div>
          <p>DivierteTEC <b>absorbe de su propia comisión</b> un <b>${pctT(cr)} de cada venta</b> y de cada suscripción al Pase para el <b>${DT.esc(DT.CAUSE.name)}</b> (${DT.esc(DT.CAUSE.place)}). El estudio recibe exactamente lo mismo: el donativo sale de la parte de la plataforma. Durante la Semilla TEC no hay comisión, así que tampoco donativo.</p>
          <p>El Centro se creó para la educación, sensibilización y aprendizaje sobre el medio ambiente (cambio climático, biodiversidad y recursos naturales) y se concibió con tecnología sustentable: paneles solares, cosecha de agua y ecotecnias. El Parque Irekua es un organismo público descentralizado del municipio de Irapuato.</p>
          <p class="muted small">Acuerdo propuesto por DivierteTEC: se formalizará con el Parque Irekua al lanzar el sitio web. En esta demostración el dinero es simulado.</p>
        </div>
        <div>
          <h4>Cómo se reparte cada comisión</h4>
          <table class="faq-table">
            <tr><th>Tipo de venta</th><th>Estudio</th><th>${DT.esc(DT.CAUSE.short)}</th><th>DivierteTEC</th></tr>
            <tr><td>Juego TecNM en Semilla TEC</td><td>100 %</td><td>0 %</td><td>0 %</td></tr>
            <tr><td>Juego TecNM después de la Semilla</td><td>${pctT(1 - e.rateStudent)}</td><td>${pctT(Math.min(cr, e.rateStudent))}</td><td>${pctT(e.rateStudent - Math.min(cr, e.rateStudent))}</td></tr>
            <tr><td>Pase DivierteTEC</td><td>${pctT(e.passDevShare)} (fondo)</td><td>${pctT(Math.min(cr, 1 - e.passDevShare))}</td><td>${pctT(1 - e.passDevShare - Math.min(cr, 1 - e.passDevShare))}</td></tr>
            <tr><td>Propinas</td><td>100 %</td><td>0 %</td><td>0 %</td></tr>
          </table>
          <p class="muted small">La parte de DivierteTEC cubre la operación: alojamiento del sitio, procesador de pagos, revisión y moderación de contenido, y torneos.</p>
          <h4>Hasta ahora en esta demostración</h4>
          <div class="transp-kpis">
            <div><small>Recibido por estudios</small><b>${DT.money(f.toDevs)}</b></div>
            <div class="green"><small>Para el ${DT.esc(DT.CAUSE.short)}</small><b>${DT.money(f.toCause)}</b></div>
            <div><small>Operación de DivierteTEC</small><b>${DT.money(f.platformNet)}</b></div>
          </div>
        </div>
      </div>
    </div>`;
  };

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
          <div class="card tier"><div class="tier-rate">0 %</div><h4>Semilla TEC</h4><p>Las <b>${DT.seedText()}</b> de cada juego, desde que se publica, no pagan comisión.</p></div>
          <div class="card tier"><div class="tier-rate">${pct(e.rateStudent)}</div><h4>Después de la Semilla</h4><p>Recibes el ${pct(1 - e.rateStudent)} de cada venta.</p></div>
          <div class="card tier"><div class="tier-rate">${DT.ic('cap')}</div><h4>Solo estudiantes del TecNM</h4><p>Publicar es exclusivo para estudiantes verificados. <a href="#/verificacion-tecnm">Verifica tu cuenta</a> y <a href="#/ser-desarrollador">solicita ser desarrollador</a>.</p></div>
        </div>
        <div class="grid cols-2">
          <div class="card">
            <h3>${DT.icon.chart} Calculadora de ganancias</h3>
            <div class="form-grid">
              <label class="field"><span>Precio del juego (MXN)</span><input type="number" min="0" value="49" data-c="price"></label>
              <label class="field"><span>Copias vendidas</span><input type="number" min="0" value="200" data-c="units"></label>
              <label class="field wide"><span>De ellas, vendidas en las ${DT.seedText()} (Semilla TEC)</span><input type="number" min="0" value="50" data-c="early"></label>
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
            <p class="muted small">Venta de ${DT.money(100)} de un juego TecNM después de la Semilla:</p>
            <div class="flow">
              <div><b>Jugador</b><small>paga ${DT.money(100)}</small></div><i>→</i>
              <div class="accent"><b>Estudio</b><small>${DT.money(100 * (1 - e.rateStudent))}</small></div><i>+</i>
              <div class="green"><b>${DT.esc(DT.CAUSE.short)}</b><small>${DT.money(100 * Math.min(e.rateStudent, e.causeRate || 0))}: educación ambiental</small></div><i>+</i>
              <div><b>DivierteTEC</b><small>${DT.money(100 * (e.rateStudent - Math.min(e.rateStudent, e.causeRate || 0)))}: operación</small></div>
            </div>
          </div>
        </div>
        ${transparency(e)}
        <p class="muted small">Referencia de mercado: Steam cobra 30 % en su tramo estándar, Epic Games Store 12 % e itch.io deja elegir al estudio (10 % por defecto).</p>
      </section>`;

    DT.$$('[data-sub]', app).forEach((b) => b.onclick = () => { if (DT.subscribePass()) DT.render(true); });

    const calc = () => {
      const price = Math.max(0, Number(DT.$('[data-c="price"]', app).value) || 0);
      const units = Math.max(0, Number(DT.$('[data-c="units"]', app).value) || 0);
      const gross = price * units;
      const early = Math.min(units, Math.max(0, Number(DT.$('[data-c="early"]', app).value) || 0));
      const free = price * early;
      const rate = e.rateStudent;
      const net = gross - (gross - free) * rate;
      const cr = Math.min(rate, e.causeRate || 0);
      const cause = (gross - free) * cr;
      const steam = gross * 0.7;
      DT.$('[data-calc]', app).innerHTML = `
        <div><span>Ventas brutas</span><b>${DT.money(gross)}</b></div>
        ${free ? `<div><span>Sin comisión (Semilla TEC)</span><b>${DT.money(free)}</b></div>` : ''}
        <div><span>Comisión DivierteTEC (${Math.round(rate * 100)} %)</span><b>−${DT.money(gross - net)}</b></div>
        <div class="sub cause"><span>${DT.ic('leaf')} Para el ${DT.esc(DT.CAUSE.short)} (${pct(cr)} de las ventas con comisión)</span><b>${DT.money(cause)}</b></div>
        <div class="sub"><span>Operación de DivierteTEC (${pct(rate - cr)})</span><b>${DT.money(gross - net - cause)}</b></div>
        <div class="total"><span>Tú recibes en DivierteTEC</span><b>${DT.money(net)}</b></div>
        <div><span>Con el 30 % estándar de Steam</span><b class="muted">${DT.money(steam)}</b></div>
        <div class="gain"><span>Diferencia a tu favor</span><b>+${DT.money(net - steam)}</b></div>`;
    };
    DT.$$('[data-c]', app).forEach((i) => i.addEventListener('input', calc));
    calc();
  };
})(window.DT);
