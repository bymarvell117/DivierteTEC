/* DivierteTEC — panel de desarrollador: juegos, subida de archivos, logros, novedades y estadísticas. */
(function (DT) {
  'use strict';

  const STATUS = {
    draft: ['Borrador', 'muted'], pending: ['En revisión', 'warn'], approved: ['Publicado', 'ok'],
    rejected: ['Rechazado', 'bad'], changes: ['Cambios solicitados', 'warn']
  };
  DT.statusPill = (st) => `<span class="pill ${STATUS[st] ? STATUS[st][1] : ''}">${STATUS[st] ? STATUS[st][0] : st}</span>`;
  const GENRES = ['Acción', 'Arcade', 'Aventura', 'Carreras', 'Deportes', 'Educativo', 'Estrategia', 'Puzle', 'RPG', 'Sandbox', 'Simulación', 'Terror'];

  /* Página HTML de prueba del SDK (no es un juego: sirve para validar la subida y los logros) */
  const SDK_TEST_HTML = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><title>Prueba del SDK DivierteTEC</title>
<style>body{font:16px system-ui;background:#0f1722;color:#e7edf5;margin:0;padding:24px}h1{margin:0 0 4px}button{font:inherit;margin:4px;padding:8px 14px;border:0;border-radius:8px;background:#1a6fd8;color:#fff;cursor:pointer}button.got{background:#1f9d55}.box{background:#1b2533;border-radius:10px;padding:14px;margin:14px 0}</style>
</head><body>
<h1>🧪 Prueba del SDK de DivierteTEC</h1>
<p>Este archivo de ejemplo solo prueba la plataforma: cada botón llama a <code>DivierteTEC.unlock(id)</code>.</p>
<div class="box"><b>Jugador:</b> <span id="who">…</span></div>
<div class="box" id="achs"></div>
<div class="box"><b>Progreso:</b> <button id="pts">+250 puntos</button> <span id="score">0</span>
<p><small>Llama a <code>DivierteTEC.progress('puntos_1000', puntos)</code>. Se guarda con localStorage.</small></p></div>
<script>
var score = Number(localStorage.getItem('score') || 0);
document.getElementById('score').textContent = score;
DivierteTEC.onReady(function (info) {
  document.getElementById('who').textContent = info.user.name + (info.test ? ' (modo prueba)' : '');
  var box = document.getElementById('achs');
  box.innerHTML = '<b>Logros definidos en el panel:</b><br>';
  info.achievements.forEach(function (a) {
    var b = document.createElement('button');
    b.textContent = a.icon + ' ' + a.name + ' (' + a.id + ')';
    if (DivierteTEC.isUnlocked(a.id)) b.className = 'got';
    b.onclick = function () { if (a.goal) DivierteTEC.progress(a.id, a.goal); else DivierteTEC.unlock(a.id); b.className = 'got'; };
    box.appendChild(b);
  });
});
document.getElementById('pts').onclick = function () {
  score += 250; localStorage.setItem('score', score);
  document.getElementById('score').textContent = score;
  DivierteTEC.progress('puntos_1000', score);
  DivierteTEC.setStat('récord', score);
};
</script></body></html>`;

  const ui = { tab: 'info' };

  /* ---------- Resumen del desarrollador ---------- */
  DT.views.dev = (app) => {
    const me = DT.me();
    const s = DT.state();
    const mine = s.games.filter((g) => g.devId === me.id);
    const players = new Set();
    let unlocks = 0;
    Object.entries(s.library).forEach(([uid, lib]) => mine.forEach((g) => { if (lib[g.id]) players.add(uid); }));
    Object.values(s.achievements).forEach((games) => mine.forEach((g) => Object.values(games[g.id] || {}).forEach((a) => { if (a.unlockedAt) unlocks++; })));

    app.innerHTML = `
      <section class="page">
        <div class="page-head">
          <div><h1>Panel de desarrollador</h1><p>${DT.esc(me.name)} ${me.verified ? '<span class="pill ok">✔ Verificado</span>' : '<span class="pill">Sin verificar</span>'}</p></div>
          <button class="btn primary" data-new>${DT.icon.plus} Nuevo juego</button>
        </div>
        <div class="grid cols-4 kpis">
          <div class="kpi"><small>Juegos</small><b>${mine.length}</b></div>
          <div class="kpi"><small>Partidas totales</small><b>${mine.reduce((t, g) => t + (g.plays || 0), 0)}</b></div>
          <div class="kpi"><small>Jugadores</small><b>${players.size}</b></div>
          <div class="kpi"><small>Logros desbloqueados</small><b>${unlocks}</b></div>
        </div>
        <div class="grid cols-3 kpis">
          <div class="kpi"><small>Ventas brutas</small><b>${DT.money(DT.devSalesTotal(me.id))}</b></div>
          <div class="kpi"><small>Saldo del estudio</small><b>${DT.money(DT.wallet(me.id))}</b></div>
          <div class="kpi"><small>Comisión actual</small><b>${(() => { const c = DT.commissionFor(me.id, 100); return c.freePart >= 100 ? '0 % <small>Semilla TEC</small>' : Math.round(c.rate * 100) + ' %'; })()}</b></div>
        </div>
        <h3 class="section-title">Mis juegos</h3>
        <div class="dev-games">
          ${mine.map((g) => `
            <a class="dev-game card" href="#/dev/juego/${g.id}">
              ${DT.coverHTML(g)}
              <div><b>${DT.esc(g.title)}</b><small class="muted">${DT.formatLabel[g.format]} · ${(g.achievements || []).length} logros</small>
              ${g.reviewNote && g.status !== 'approved' ? `<small class="note">📝 Admin: ${DT.esc(g.reviewNote)}</small>` : ''}</div>
              ${DT.statusPill(g.status)}
            </a>`).join('') || '<p class="muted">Aún no tienes juegos. ¡Crea el primero!</p>'}
        </div>

        <h3 class="section-title">${DT.icon.code} SDK de logros en 3 pasos</h3>
        <div class="grid cols-3 steps">
          <div class="card"><span class="step-n">1</span><h4>Define los logros</h4><p>En la pestaña <b>Logros</b> de tu juego crea cada logro con un <code>id</code>, su meta y la recompensa que entrega.</p></div>
          <div class="card"><span class="step-n">2</span><h4>Llama al SDK</h4><p>DivierteTEC inyecta el SDK automáticamente en tu juego HTML:</p>
            <pre class="code">DivierteTEC.unlock('jefe_final');
DivierteTEC.progress('puntos_1000', score);</pre></div>
          <div class="card"><span class="step-n">3</span><h4>Prueba y publica</h4><p>Usa <b>Probar</b> para ver los logros y la consola sin guardar nada. Después envía tu juego a revisión.</p>
            <button class="btn ghost sm" data-sdk>${DT.icon.download} Descargar SDK (modo local)</button></div>
        </div>
      </section>`;

    DT.$('[data-sdk]', app).onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([DT.SDK_STANDALONE], { type: 'text/javascript' }));
      a.download = 'divierte-tec-sdk.js';
      a.click();
    };
    DT.$('[data-new]', app).onclick = () => {
      const m = DT.modal({
        title: 'Nuevo juego',
        body: `<label class="field"><span>Título</span><input data-title maxlength="60" placeholder="Nombre del juego"></label>
          <label class="field"><span>Formato</span><select data-format>
            <option value="html">HTML5 — se juega en el navegador</option>
            <option value="cpp">C++ — descarga (binario o código)</option>
            <option value="exe">Ejecutable instalable (.exe / .msi / .zip)</option></select></label>`,
        actions: '<button class="btn ghost" data-close>Cancelar</button><button class="btn primary" data-ok>Crear borrador</button>'
      });
      const t = m.el.querySelector('[data-title]');
      t.focus();
      m.el.querySelector('[data-ok]').onclick = () => {
        const title = t.value.trim();
        if (!title) { t.focus(); return; }
        const g = { id: 'g_' + DT.slug(title).slice(0, 20) + '_' + Math.random().toString(36).slice(2, 6), title, devId: me.id, format: m.el.querySelector('[data-format]').value,
          genre: 'Arcade', tags: [], short: '', description: '', status: 'draft', createdAt: Date.now(), files: null, reviews: [], news: [], plays: 0,
          achievements: [], cover: { c1: '#1a6fd8', c2: '#0b2a55', glyph: '🎮' }, reviewNote: '', pricing: { mode: 'free', price: 0, inPass: false } };
        g.storeLayout = DT.defaultStoreLayout(g);
        g.libraryLayout = DT.defaultLibraryLayout(g);
        s.games.push(g);
        DT.lib()[g.id] = { added: Date.now(), playtime: 0 };
        DT.log(`Creó el borrador «${title}».`);
        DT.save();
        m.close();
        ui.tab = 'files';
        DT.go('#/dev/juego/' + g.id);
      };
    };
  };

  /* ---------- Administración de un juego ---------- */
  DT.views.devGame = (app, gid) => {
    const g = DT.game(gid);
    const me = DT.me();
    if (!g || (g.devId !== me.id && me.role !== 'admin')) return DT.views.notFound(app);
    const tabs = [['info', 'Información'], ['files', g.format === 'html' ? 'Archivos del juego' : 'Descarga'], ['ach', 'Logros y recompensas'], ['sales', 'Precio y ventas'], ['pages', 'Páginas'], ['news', 'Novedades'], ['stats', 'Estadísticas']];
    if (!tabs.some(([k]) => k === ui.tab)) ui.tab = 'info';

    app.innerHTML = `
      <section class="page">
        <nav class="crumbs"><a href="#/dev">Panel de desarrollador</a> › <b>${DT.esc(g.title)}</b></nav>
        <div class="page-head">
          <div class="row">${DT.coverHTML(g, 'thumb')}<div><h1>${DT.esc(g.title)}</h1><p>${DT.formatLabel[g.format]} · ${DT.statusPill(g.status)}</p></div></div>
          <div class="row">
            ${g.format === 'html' ? `<button class="btn ghost" data-test>${DT.icon.play} Probar</button>` : ''}
            <a class="btn ghost" href="#/juego/${g.id}">${DT.icon.eye} Ver página</a>
            ${['draft', 'rejected', 'changes'].includes(g.status) ? `<button class="btn primary" data-submit>Enviar a revisión</button>` : ''}
          </div>
        </div>
        ${g.reviewNote && g.status !== 'approved' ? `<div class="notice ${g.status === 'rejected' ? 'bad' : 'warn'}">📝 <b>Nota de administración:</b> ${DT.esc(g.reviewNote)}</div>` : ''}
        ${g.status === 'pending' ? `<div class="notice">${DT.icon.clock} Tu juego está en revisión. Un administrador lo aprobará pronto.</div>` : ''}
        <div class="tabs" role="tablist">${tabs.map(([k, v]) => `<button role="tab" class="${ui.tab === k ? 'on' : ''}" data-tab="${k}">${v}</button>`).join('')}</div>
        <div class="tab-body" data-body></div>
      </section>`;

    DT.$$('[data-tab]', app).forEach((b) => b.onclick = () => { ui.tab = b.dataset.tab; DT.render(true); });
    const test = DT.$('[data-test]', app);
    if (test) test.onclick = () => DT.play(g.id, { test: true });
    const submit = DT.$('[data-submit]', app);
    if (submit) submit.onclick = () => {
      const problems = [];
      if (g.format === 'html' && !g.files) problems.push('Sube los archivos del juego (.html o carpeta).');
      if (g.format !== 'html' && !(g.download && g.download.uploadedAt)) problems.push('Sube el archivo descargable.');
      if (!g.short || !g.description) problems.push('Completa la descripción corta y la descripción larga.');
      if (problems.length) return DT.modal({ title: 'Faltan algunos datos', body: `<ul>${problems.map((p) => `<li>${p}</li>`).join('')}</ul>`, actions: '<button class="btn primary" data-close>Entendido</button>' });
      g.status = 'pending';
      g.submittedAt = Date.now();
      DT.log(`Envió «${g.title}» a revisión.`);
      DT.toast('Enviado a revisión. Recibirás la respuesta en este panel.', { kind: 'ok' });
      DT.emit('admin');
      DT.render(true);
    };
    const body = DT.$('[data-body]', app);
    ({ info: tabInfo, files: tabFiles, ach: tabAch, sales: tabSales, pages: tabPages, news: tabNews, stats: tabStats })[ui.tab](body, g);
    DT.media.hydrate(app);
  };

  /* --- Pestaña: información --- */
  function tabInfo(body, g) {
    const c = g.cover || {};
    body.innerHTML = `
      <form class="card form-grid" data-form>
        <label class="field"><span>Título</span><input name="title" value="${DT.esc(g.title)}" maxlength="60" required></label>
        <label class="field"><span>Género</span><select name="genre">${GENRES.map((x) => `<option ${g.genre === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
        <label class="field wide"><span>Descripción corta (tarjetas y destacados)</span><input name="short" value="${DT.esc(g.short)}" maxlength="140"></label>
        <label class="field wide"><span>Descripción larga</span><textarea name="description" rows="5">${DT.esc(g.description)}</textarea></label>
        <label class="field"><span>Etiquetas (separadas por comas)</span><input name="tags" value="${DT.esc((g.tags || []).join(', '))}"></label>
        <label class="field"><span>Formato</span><select name="format">${Object.entries(DT.formatLabel).map(([k, v]) => `<option value="${k}" ${g.format === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
        <fieldset class="field wide cover-editor">
          <legend>Portada</legend>
          <div class="row">
            <div class="cover-preview">${DT.coverHTML(g)}</div>
            <div class="grid" style="gap:8px">
              <div class="row"><label>Color 1 <input type="color" name="c1" value="${c.c1 || '#1a6fd8'}"></label><label>Color 2 <input type="color" name="c2" value="${c.c2 || '#0b2a55'}"></label>
                <label>Emoji <input name="glyph" value="${DT.esc(c.glyph || '🎮')}" maxlength="4" style="width:60px"></label></div>
              <div class="row"><label class="btn ghost sm file-btn">${DT.icon.image} Subir imagen de portada<input type="file" accept="image/*" data-coverfile hidden></label>
              ${c.mediaId ? '<button type="button" class="btn ghost sm" data-coverclear>Quitar imagen</button>' : ''}</div>
            </div>
          </div>
        </fieldset>
        <div class="wide row"><span class="spacer"></span><button class="btn primary">Guardar cambios</button></div>
      </form>`;
    const f = DT.$('[data-form]', body);
    f.onsubmit = (e) => {
      e.preventDefault();
      const text = [f.title.value, f.short.value, f.description.value, f.tags.value].join(' ');
      if (DT.hasBanned(text)) { DT.toast('El texto contiene palabras no permitidas por la moderación.', { kind: 'error' }); return; }
      Object.assign(g, { title: f.title.value.trim(), genre: f.genre.value, short: f.short.value.trim(), description: f.description.value.trim(),
        tags: f.tags.value.split(',').map((t) => t.trim()).filter(Boolean), format: f.format.value });
      g.cover = Object.assign({}, g.cover, { c1: f.c1.value, c2: f.c2.value, glyph: f.glyph.value || '🎮' });
      DT.save();
      DT.toast('Cambios guardados.', { kind: 'ok' });
      DT.render(true);
    };
    DT.$('[data-coverfile]', body).onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const m = await DT.media.add(file);
      g.cover = Object.assign({}, g.cover, { mediaId: m.id });
      DT.save(); DT.render(true);
    };
    const clr = DT.$('[data-coverclear]', body);
    if (clr) clr.onclick = () => { delete g.cover.mediaId; DT.save(); DT.render(true); };
  }

  /* --- Pestaña: archivos / descarga --- */
  async function tabFiles(body, g) {
    if (g.format !== 'html') {
      const d = g.download || {};
      body.innerHTML = `
        <div class="card">
          <h3>${DT.icon.download} Archivo descargable</h3>
          <p class="muted">Sube el instalador (.exe, .msi), el binario compilado de C++ o un .zip con tu juego. Los jugadores lo descargarán desde su biblioteca.</p>
          <div class="dropzone" data-drop>
            ${DT.icon.upload}<b>Arrastra tu archivo aquí</b><span>o</span>
            <label class="btn primary file-btn">Elegir archivo<input type="file" data-dl hidden></label>
          </div>
          ${d.uploadedAt ? `<p class="ok">${DT.icon.check} ${DT.esc(d.name)} · ${DT.fmtBytes(d.size)} · subido ${DT.timeAgo(d.uploadedAt)}</p>` : ''}
          <label class="field"><span>Plataformas y requisitos</span><input data-platform value="${DT.esc(d.platform || '')}" placeholder="Windows 10/11 · 64 bits · 4 GB RAM"></label>
          <button class="btn ghost sm" data-saveplat>Guardar requisitos</button>
        </div>`;
      const handle = async (file) => {
        if (!file) return;
        const meta = await DT.saveDownloadFile(g.id, file);
        g.download = Object.assign({}, g.download, meta);
        DT.save(); DT.toast('Archivo subido.', { kind: 'ok' }); DT.render(true);
      };
      DT.$('[data-dl]', body).onchange = (e) => handle(e.target.files[0]);
      dropzone(DT.$('[data-drop]', body), (files) => handle(files[0]));
      DT.$('[data-saveplat]', body).onclick = () => { g.download = Object.assign({}, g.download, { platform: DT.$('[data-platform]', body).value }); DT.save(); DT.toast('Guardado.', { kind: 'ok' }); };
      return;
    }

    body.innerHTML = `
      <div class="card">
        <h3>${DT.icon.upload} Sube tu juego HTML</h3>
        <p class="muted">Puedes subir un solo archivo <code>.html</code> o la <b>carpeta completa</b> del juego (HTML, JS, CSS, imágenes, sonidos, fuentes…).
        Las rutas relativas (<code>img/jugador.png</code>, <code>js/juego.js</code>) se conectan solas y <code>localStorage</code> funciona para guardar partidas.</p>
        <div class="dropzone" data-drop>
          ${DT.icon.upload}<b>Arrastra aquí tu archivo .html</b>
          <div class="row" style="justify-content:center">
            <label class="btn primary file-btn">${DT.icon.code} Subir archivo .html<input type="file" accept=".html,.htm" data-single hidden></label>
            <label class="btn primary file-btn">${DT.icon.layers} Subir carpeta del juego<input type="file" webkitdirectory directory multiple data-folder hidden></label>
          </div>
          <button class="btn ghost sm" data-sample>🧪 Usar HTML de prueba del SDK</button>
        </div>
        <div data-filelist><div class="spinner"></div></div>
      </div>`;
    const handle = async (files) => {
      try {
        const meta = await DT.saveGameFiles(g.id, files);
        g.files = meta;
        DT.save();
        DT.toast(`${DT.icon.check} ${meta.count} archivo(s) subidos. Archivo de inicio: <b>${DT.esc(meta.entry)}</b>`, { kind: 'ok' });
        DT.render(true);
      } catch (err) { DT.toast(err.message, { kind: 'error' }); }
    };
    DT.$('[data-single]', body).onchange = (e) => handle(e.target.files);
    DT.$('[data-folder]', body).onchange = (e) => handle(e.target.files);
    dropzone(DT.$('[data-drop]', body), handle);
    DT.$('[data-sample]', body).onclick = () => handle([new File([SDK_TEST_HTML], 'index.html', { type: 'text/html' })]);

    const list = await DT.files.list('game:' + g.id + ':');
    const host = DT.$('[data-filelist]', body);
    if (!host) return;
    if (!list.length) { host.innerHTML = '<p class="muted">Todavía no hay archivos.</p>'; return; }
    host.innerHTML = `
      <div class="row" style="margin:14px 0 8px"><b>${list.length} archivos · ${DT.fmtBytes(list.reduce((t, f) => t + f.blob.size, 0))}</b><span class="spacer"></span>
        <label class="row">Archivo de inicio <select data-entry>${list.filter((f) => /\.html?$/i.test(f.path)).map((f) => `<option ${f.path === g.files.entry ? 'selected' : ''}>${DT.esc(f.path)}</option>`).join('')}</select></label>
        <button class="btn success" data-testnow>${DT.icon.play} Probar ahora</button></div>
      <div class="file-table">${list.sort((a, b) => a.path.localeCompare(b.path)).map((f) => `<div><span>${f.path === g.files.entry ? '▶️' : '📄'} ${DT.esc(f.path)}</span><small>${DT.fmtBytes(f.blob.size)}</small></div>`).join('')}</div>`;
    DT.$('[data-entry]', host).onchange = (e) => { g.files.entry = e.target.value; DT.save(); DT.toast('Archivo de inicio actualizado.'); };
    DT.$('[data-testnow]', host).onclick = () => DT.play(g.id, { test: true });
  }

  function dropzone(el, onFiles) {
    el.addEventListener('dragover', (e) => { e.preventDefault(); el.classList.add('over'); });
    el.addEventListener('dragleave', () => el.classList.remove('over'));
    el.addEventListener('drop', (e) => { e.preventDefault(); el.classList.remove('over'); if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files); });
  }

  /* --- Pestaña: logros y recompensas --- */
  function tabAch(body, g) {
    const all = DT.allRewards();
    const rewardOptions = (sel) => `<option value="">— Sin recompensa —</option>` + Object.keys(DT.REWARD_TYPES).map((type) =>
      `<optgroup label="${DT.REWARD_TYPES[type]}">${Object.entries(all).filter(([, r]) => r.type === type).map(([id, r]) => `<option value="${id}" ${sel === id ? 'selected' : ''}>${r.glyph} ${DT.esc(r.name)} (${DT.RARITY[r.rarity].name})</option>`).join('')}</optgroup>`).join('');
    body.innerHTML = `
      <div class="card">
        <div class="row"><h3 style="margin:0">${DT.icon.trophy} Logros del juego</h3><span class="spacer"></span>
          <button class="btn ghost sm" data-customreward>${DT.icon.gift} Crear recompensa personalizada</button>
          <button class="btn primary sm" data-addach>${DT.icon.plus} Agregar logro</button></div>
        <p class="muted">Cada logro tiene un <b>id</b> que usarás en el código. Si pones una <b>meta</b> mayor que 0, el logro se desbloquea con <code>DivierteTEC.progress(id, valor)</code> al alcanzarla.</p>
        <div class="ach-table">
          <div class="ach-th"><span>Icono</span><span>ID (código)</span><span>Nombre</span><span>Descripción</span><span>Meta</span><span>Oculto</span><span>Recompensa</span><span></span></div>
          ${(g.achievements || []).map((a, i) => `
            <div class="ach-tr" data-i="${i}">
              <input data-k="icon" value="${DT.esc(a.icon)}" maxlength="4" aria-label="Icono">
              <input data-k="id" value="${DT.esc(a.id)}" aria-label="ID" pattern="[a-z0-9_]+">
              <input data-k="name" value="${DT.esc(a.name)}" aria-label="Nombre">
              <input data-k="desc" value="${DT.esc(a.desc)}" aria-label="Descripción">
              <input data-k="goal" type="number" min="0" value="${a.goal || 0}" aria-label="Meta">
              <input data-k="hidden" type="checkbox" ${a.hidden ? 'checked' : ''} aria-label="Oculto">
              <select data-k="reward" aria-label="Recompensa">${rewardOptions(a.reward)}</select>
              <div class="row nowrap"><button class="icon-btn sm" title="Simular desbloqueo" data-sim="${i}">${DT.icon.play}</button><button class="icon-btn sm danger" title="Eliminar" data-del="${i}">${DT.icon.trash}</button></div>
            </div>`).join('') || '<p class="muted pad">Sin logros todavía.</p>'}
        </div>
        <div class="row" style="margin-top:12px"><span class="spacer"></span><button class="btn primary" data-saveach>Guardar logros</button></div>
      </div>

      <div class="card">
        <h3>${DT.icon.code} Código para tu juego</h3>
        <p class="muted">Copia estas líneas donde ocurra cada evento de tu juego:</p>
        <pre class="code" data-snippet>${DT.esc(snippet(g))}</pre>
        <button class="btn ghost sm" data-copy>${DT.icon.copy} Copiar</button>
      </div>`;

    const collect = () => DT.$$('.ach-tr', body).map((row) => {
      const v = (k) => row.querySelector(`[data-k="${k}"]`);
      return { id: DT.slug(v('id').value) || DT.uid('a'), icon: v('icon').value || '🏆', name: v('name').value.trim() || 'Logro', desc: v('desc').value.trim(),
        goal: Math.max(0, parseInt(v('goal').value, 10) || 0), hidden: v('hidden').checked, reward: v('reward').value };
    });
    const persist = (silent) => {
      const list = collect();
      const ids = list.map((a) => a.id);
      if (new Set(ids).size !== ids.length) { DT.toast('Hay ids de logro repetidos.', { kind: 'error' }); return false; }
      g.achievements = list;
      DT.save();
      if (!silent) { DT.toast('Logros guardados.', { kind: 'ok' }); DT.render(true); }
      return true;
    };
    DT.$('[data-saveach]', body).onclick = () => persist();
    DT.$('[data-addach]', body).onclick = () => {
      if (!persist(true)) return;
      const n = g.achievements.length + 1;
      g.achievements.push({ id: 'logro_' + n, icon: '🏆', name: 'Nuevo logro', desc: '', goal: 0, hidden: false, reward: '' });
      DT.save(); DT.render(true);
    };
    DT.$$('[data-del]', body).forEach((b) => b.onclick = () => { persist(true); g.achievements.splice(+b.dataset.del, 1); DT.save(); DT.render(true); });
    DT.$$('[data-sim]', body).forEach((b) => b.onclick = () => { persist(true); DT.rewards.unlockGame(DT.me().id, g.id, g.achievements[+b.dataset.sim].id, { test: true }); });
    DT.$('[data-copy]', body).onclick = () => { navigator.clipboard && navigator.clipboard.writeText(snippet(g)).then(() => DT.toast('Copiado.')); };
    DT.$('[data-customreward]', body).onclick = () => customRewardModal(() => { persist(true); DT.render(true); });
  }

  const snippet = (g) => ['// El SDK se inyecta solo cuando el juego corre en DivierteTEC.',
    '// Para probar fuera de la plataforma incluye: <script src="divierte-tec-sdk.js"></script>', '']
    .concat((g.achievements || []).map((a) => a.goal ? `DivierteTEC.progress('${a.id}', valor);   // ${a.name}: meta ${a.goal}` : `DivierteTEC.unlock('${a.id}');   // ${a.name}`))
    .concat(['', '// Opcional', "DivierteTEC.setStat('record', puntos);", 'DivierteTEC.onReady(function (info) { console.log(info.user.name); });']).join('\n');

  function customRewardModal(done) {
    const m = DT.modal({
      title: 'Recompensa personalizada',
      body: `<p class="muted">Crea una recompensa exclusiva de tu juego (emoji, avatar o insignia).</p>
        <label class="field"><span>Tipo</span><select data-type><option value="emoji">Emoji</option><option value="avatar">Avatar</option><option value="badge">Insignia</option></select></label>
        <label class="field"><span>Emoji / símbolo</span><input data-glyph maxlength="4" value="⭐"></label>
        <label class="field"><span>Nombre</span><input data-name maxlength="30" placeholder="Estrella de mi juego"></label>
        <label class="field"><span>Rareza</span><select data-rar>${Object.entries(DT.RARITY).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('')}</select></label>`,
      actions: '<button class="btn ghost" data-close>Cancelar</button><button class="btn primary" data-ok>Crear</button>'
    });
    m.el.querySelector('[data-ok]').onclick = () => {
      const name = m.el.querySelector('[data-name]').value.trim();
      const glyph = m.el.querySelector('[data-glyph]').value.trim();
      if (!name || !glyph) return;
      const id = 'c_' + DT.slug(name) + '_' + Math.random().toString(36).slice(2, 5);
      DT.state().customRewards[id] = { type: m.el.querySelector('[data-type]').value, name, glyph, data: glyph, rarity: m.el.querySelector('[data-rar]').value, desc: 'Recompensa de ' + DT.me().name, by: DT.me().id };
      DT.save();
      m.close();
      DT.toast('Recompensa creada: ya puedes asignarla a un logro.', { kind: 'ok' });
      done();
    };
  }

  /* --- Pestaña: precio y ventas --- */
  function tabSales(body, g) {
    const s = DT.state();
    const p = g.pricing;
    const e = DT.econ();
    const dev = DT.user(g.devId);
    const sales = s.ledger.filter((x) => x.gameId === g.id && (x.type === 'sale' || x.type === 'tip'));
    const c = DT.commissionFor(g.devId, 100);
    const promo = s.promos.find((x) => x.gameId === g.id && x.status === 'pending');
    body.innerHTML = `
      <div class="grid cols-2">
        <form class="card" data-price>
          <h3>${DT.icon.gift} Modelo de precio</h3>
          <div class="seg price-mode">${[['free', 'Gratis'], ['paid', 'Precio fijo'], ['pwyw', 'Paga lo que quieras']].map(([k, v]) => `<label><input type="radio" name="mode" value="${k}" ${p.mode === k ? 'checked' : ''}><span>${v}</span></label>`).join('')}</div>
          <div class="form-grid" style="margin-top:12px">
            <label class="field"><span>Precio / precio sugerido (MXN)</span><input type="number" name="price" min="0" step="1" value="${p.price || 0}"></label>
            <label class="field"><span>Mínimo (paga lo que quieras)</span><input type="number" name="min" min="0" step="1" value="${p.min || 0}"></label>
            <label class="field"><span>Descuento temporal (%)</span><input type="number" name="discount" min="0" max="90" step="5" value="${p.discount || 0}"></label>
            <label class="field"><span>&nbsp;</span><label class="check"><input type="checkbox" name="inPass" ${p.inPass ? 'checked' : ''}> Incluir en el Pase DivierteTEC</label></label>
          </div>
          <p class="muted small">Al incluirlo en el Pase, los suscriptores lo juegan sin comprarlo y tu estudio recibe parte del fondo mensual (${Math.round(e.passDevShare * 100)} % de las suscripciones) según el tiempo jugado.</p>
          <div class="breakdown" data-prev></div>
          <div class="row"><span class="spacer"></span><button class="btn primary">Guardar precio</button></div>
        </form>
        <div>
          <div class="card">
            <h3>💼 Tu comisión</h3>
            <p>${dev.student && dev.verified ? `Estudio <b>estudiantil verificado</b>: Semilla TEC de ${DT.money(e.seedAllowance)} sin comisión, después ${Math.round(e.rateStudent * 100)} %.` : `Estudio <b>${dev.student ? 'estudiantil (sin verificar)' : 'externo'}</b>: ${Math.round(c.rate * 100)} % por venta.${dev.student ? ' Pide la verificación a la administración para activar la Semilla TEC.' : ''}`}</p>
            ${dev.student && dev.verified ? `<div class="bar"><i style="width:${Math.min(100, DT.devSalesTotal(dev.id) / e.seedAllowance * 100)}%"></i></div><small class="muted">${DT.money(Math.min(e.seedAllowance, DT.devSalesTotal(dev.id)))} de ${DT.money(e.seedAllowance)} usados de la Semilla TEC</small>` : ''}
          </div>
          <div class="card">
            <h3>📣 Destacado patrocinado</h3>
            <p>Aparece en el carrusel principal de la tienda durante ${e.promoDays} días por ${DT.money(e.promoPrice)} (se cobra del saldo del estudio: ${DT.money(DT.wallet(g.devId))}).</p>
            ${DT.isSponsored(g) ? `<p class="ok">Activo hasta ${new Date(g.sponsoredUntil).toLocaleDateString('es-MX')}</p>` : promo ? '<span class="pill warn">Solicitud en revisión</span>'
              : `<button class="btn primary sm" data-promo ${g.status !== 'approved' ? 'disabled title="Disponible cuando el juego esté publicado"' : ''}>Solicitar promoción</button>`}
          </div>
        </div>
      </div>
      <div class="card">
        <h3>${DT.icon.chart} Ventas y propinas de este juego</h3>
        <div class="grid cols-3 kpis">
          <div class="kpi"><small>Ventas</small><b>${sales.filter((x) => x.type === 'sale').length}</b></div>
          <div class="kpi"><small>Ingreso bruto</small><b>${DT.money(sales.reduce((t, x) => t + x.gross, 0))}</b></div>
          <div class="kpi"><small>Recibido por el estudio</small><b>${DT.money(sales.reduce((t, x) => t + x.net, 0))}</b></div>
        </div>
        <div class="table">${sales.map(DT.txRow).join('') || '<p class="muted pad">Aún no hay ventas.</p>'}</div>
      </div>`;
    const f = DT.$('[data-price]', body);
    const preview = () => {
      const price = Math.max(0, Number(f.price.value) || 0) * (1 - (Number(f.discount.value) || 0) / 100);
      const cc = DT.commissionFor(g.devId, price);
      DT.$('[data-prev]', body).innerHTML = f.mode.value === 'free' ? '<div><span>Juego gratuito</span><b>$0</b></div>'
        : `<div><span>Precio al público</span><b>${DT.money(price)}</b></div><div><span>Comisión (${DT.esc(cc.note)})</span><b>−${DT.money(cc.commission)}</b></div><div class="total"><span>Recibes por copia</span><b>${DT.money(cc.net)}</b></div>`;
    };
    f.addEventListener('input', preview);
    preview();
    f.onsubmit = (ev) => {
      ev.preventDefault();
      g.pricing = { mode: f.mode.value, price: Math.max(0, Number(f.price.value) || 0), min: Math.max(0, Number(f.min.value) || 0),
        discount: Math.max(0, Math.min(90, Number(f.discount.value) || 0)), inPass: f.inPass.checked };
      DT.log(`Actualizó el precio de «${g.title}».`);
      DT.save();
      DT.toast('Precio guardado.', { kind: 'ok' });
      DT.render(true);
    };
    const pb = DT.$('[data-promo]', body);
    if (pb) pb.onclick = () => { DT.requestPromo(g.id); DT.render(true); };
  }

  /* --- Pestaña: páginas personalizables --- */
  function tabPages(body, g) {
    body.innerHTML = `
      <div class="grid cols-2">
        <div class="card"><div class="row"><h3 style="margin:0">Página de tienda</h3><span class="spacer"></span><a class="btn primary sm" href="#/dev/editor/${g.id}/tienda">${DT.icon.edit} Editar</a></div>
          <p class="muted">Lo que ven los jugadores antes de obtener tu juego.</p><div class="page-preview" data-prev="store"></div></div>
        <div class="card"><div class="row"><h3 style="margin:0">Página de biblioteca</h3><span class="spacer"></span><a class="btn primary sm" href="#/dev/editor/${g.id}/biblioteca">${DT.icon.edit} Editar</a></div>
          <p class="muted">La cabecera que ven los jugadores en su biblioteca.</p><div class="page-preview" data-prev="lib"></div></div>
      </div>`;
    DT.renderLayout(DT.$('[data-prev="store"]', body), g.storeLayout, g, { playHTML: DT.playButtonsHTML });
    DT.renderLayout(DT.$('[data-prev="lib"]', body), g.libraryLayout, g, {});
  }

  /* --- Pestaña: novedades --- */
  function tabNews(body, g) {
    body.innerHTML = `
      <form class="card" data-news>
        <h3>${DT.icon.news} Publicar novedad</h3>
        <label class="field"><span>Título</span><input name="title" required maxlength="90" placeholder="¡Actualización 1.1 disponible!"></label>
        <label class="field"><span>Contenido</span><textarea name="body" rows="3" required></textarea></label>
        <div class="row"><label class="btn ghost sm file-btn">${DT.icon.image} Imagen (opcional)<input type="file" name="img" accept="image/*,video/*" hidden></label><span class="spacer"></span><button class="btn primary">Publicar</button></div>
      </form>
      <div class="card">${(g.news || []).slice().reverse().map((n, i) => `<article class="news-item"><div class="row"><b>${DT.esc(n.title)}</b><span class="spacer"></span><small class="muted">${DT.timeAgo(n.date)}</small><button class="icon-btn sm" data-delnews="${n.id}">${DT.icon.trash}</button></div><p>${DT.esc(n.body)}</p></article>`).join('') || '<p class="muted">Sin novedades publicadas.</p>'}</div>`;
    const f = DT.$('[data-news]', body);
    f.onsubmit = async (e) => {
      e.preventDefault();
      if (DT.hasBanned(f.title.value + ' ' + f.body.value)) { DT.toast('El texto contiene palabras no permitidas.', { kind: 'error' }); return; }
      const n = { id: DT.uid('n'), title: f.title.value.trim(), body: f.body.value.trim(), date: Date.now() };
      if (f.img.files[0]) n.mediaId = (await DT.media.add(f.img.files[0])).id;
      g.news.push(n);
      DT.save(); DT.toast('Novedad publicada.', { kind: 'ok' }); DT.render(true);
    };
    DT.$$('[data-delnews]', body).forEach((b) => b.onclick = () => { g.news = g.news.filter((n) => n.id !== b.dataset.delnews); DT.save(); DT.render(true); });
  }

  /* --- Pestaña: estadísticas --- */
  function tabStats(body, g) {
    const s = DT.state();
    const players = Object.entries(s.library).filter(([, lib]) => lib[g.id]);
    const time = players.reduce((t, [, lib]) => t + (lib[g.id].playtime || 0), 0);
    const reviews = g.reviews || [];
    const pct = reviews.length ? Math.round(reviews.filter((r) => r.up).length / reviews.length * 100) : 0;
    body.innerHTML = `
      <div class="grid cols-4 kpis">
        <div class="kpi"><small>Jugadores</small><b>${players.length}</b></div>
        <div class="kpi"><small>Partidas</small><b>${g.plays || 0}</b></div>
        <div class="kpi"><small>Tiempo total</small><b>${DT.fmtTime(time)}</b></div>
        <div class="kpi"><small>Reseñas positivas</small><b>${reviews.length ? pct + '%' : '—'}</b></div>
      </div>
      <div class="card"><h3>Porcentaje de jugadores por logro</h3>
        ${(g.achievements || []).map((a) => {
          const n = players.filter(([uid]) => ((s.achievements[uid] || {})[g.id] || {})[a.id] && s.achievements[uid][g.id][a.id].unlockedAt).length;
          const p = players.length ? Math.round(n / players.length * 100) : 0;
          return `<div class="stat-row"><span>${DT.esc(a.icon)} ${DT.esc(a.name)}</span><div class="bar"><i style="width:${p}%"></i></div><b>${p}%</b></div>`;
        }).join('') || '<p class="muted">Sin logros.</p>'}
      </div>`;
  }
})(window.DT);
