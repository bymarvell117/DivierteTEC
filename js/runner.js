/* DivierteTEC — ejecución de juegos HTML en el navegador y descarga de ejecutables.
   El juego corre en un <iframe sandbox="allow-scripts"> SIN allow-same-origin:
   no puede leer el localStorage de la plataforma ni tocar la página principal.
   La única vía de comunicación es postMessage, y aquí se valida cada mensaje. */
(function (DT) {
  'use strict';

  const SAVE_KEY = (uid, gid) => 'divierteTEC_save_' + uid + '_' + gid;
  let active = null;

  const mimeOf = (p) => {
    const ext = (p.split('.').pop() || '').toLowerCase();
    return ({
      html: 'text/html', htm: 'text/html', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json',
      png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml', ico: 'image/x-icon',
      mp3: 'audio/mpeg', ogg: 'audio/ogg', wav: 'audio/wav', m4a: 'audio/mp4', mp4: 'video/mp4', webm: 'video/webm',
      woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf', otf: 'font/otf', wasm: 'application/wasm', txt: 'text/plain'
    })[ext] || 'application/octet-stream';
  };
  DT.mimeOf = mimeOf;

  /* Guarda los archivos subidos por el desarrollador.
     fileList: FileList de <input type=file> (un .html) o de <input webkitdirectory> (carpeta). */
  DT.saveGameFiles = async (gid, fileList) => {
    const files = Array.from(fileList);
    if (!files.length) throw new Error('No se seleccionaron archivos.');
    let paths = files.map((f) => (f.webkitRelativePath || f.name).replace(/\\/g, '/'));
    // Si todo viene dentro de una carpeta raíz ("MiJuego/index.html"), se quita esa carpeta.
    const first = paths[0].split('/');
    if (first.length > 1 && paths.every((p) => p.startsWith(first[0] + '/'))) paths = paths.map((p) => p.slice(first[0].length + 1));
    const htmls = paths.filter((p) => /\.html?$/i.test(p));
    if (!htmls.length) throw new Error('No se encontró ningún archivo .html en lo que subiste.');
    await DT.files.removePrefix('game:' + gid + ':');
    let total = 0;
    for (let i = 0; i < files.length; i++) {
      if (/(^|\/)\.|(^|\/)(node_modules|__MACOSX)\//.test(paths[i])) continue; // archivos ocultos
      await DT.files.put('game:' + gid + ':' + paths[i], files[i]);
      total += files[i].size;
    }
    const entry = htmls.find((p) => /^index\.html?$/i.test(p)) || htmls.sort((a, b) => a.split('/').length - b.split('/').length)[0];
    return { entry, htmls, count: files.length, size: total, uploadedAt: Date.now() };
  };

  DT.saveDownloadFile = async (gid, file) => {
    await DT.files.put('dl:' + gid, file);
    return { name: file.name, size: file.size, uploadedAt: Date.now() };
  };

  /* ---------- Descarga / instalación (C++ y ejecutables) ---------- */
  DT.download = async (gid) => {
    const g = DT.game(gid);
    const blob = await DT.files.get('dl:' + gid);
    if (blob) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = (g.download && g.download.name) || g.title;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } else {
      DT.modal({
        title: 'Instalador de demostración',
        body: `<p><b>${DT.esc(g.title)}</b> es un juego de catálogo de ejemplo: su instalador
          <code>${DT.esc((g.download && g.download.name) || 'setup.exe')}</code> está simulado.</p>
          <p class="muted">En un juego real, el desarrollador sube el .exe/.zip desde su panel y aquí se descarga el archivo.</p>`,
        actions: '<button class="btn primary" data-close>Entendido</button>'
      });
    }
    const e = DT.lib()[gid];
    if (e) { e.installed = true; e.lastPlayed = Date.now(); }
    DT.emit('library');
  };

  /* ---------- Juegos integrados (js/games/*.js) ---------- */
  DT.BUILTIN = DT.BUILTIN || {};
  DT.registerBuiltin = (gid, pkg) => { DT.BUILTIN[gid] = pkg; };
  /* ¿Se puede jugar al instante en el navegador? (archivos subidos o integrados) */
  DT.isInstant = (g) => !!g && g.format === 'html' && (!!g.files || !!DT.BUILTIN[g.id]);

  /* Archivos de un juego: primero los subidos por el desarrollador (IndexedDB), luego los integrados */
  DT.gameFiles = async (gid) => {
    const g = DT.game(gid);
    if (g && g.files) {
      const list = await DT.files.list('game:' + gid + ':');
      if (list.length) return { entry: g.files.entry, list };
    }
    const b = DT.BUILTIN[gid];
    if (b) return { entry: b.entry, builtin: true, list: Object.keys(b.files).map((p) => ({ path: p, blob: builtinBlob(b.files[p], p) })) };
    return null;
  };

  /* Archivo integrado → Blob (texto o binario en base64) */
  const builtinBlob = (v, p) => {
    if (typeof v === 'string') return new Blob([v], { type: mimeOf(p) });
    const bin = atob(v.b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: v.type || mimeOf(p) });
  };
  /* URL de un recurso de un juego integrado, para usar su arte en las páginas */
  const assetCache = {};
  DT.assetURL = (gid, path) => {
    const key = gid + ':' + path;
    if (assetCache[key]) return assetCache[key];
    const b = DT.BUILTIN[gid];
    if (!b || !b.files[path]) return '';
    return (assetCache[key] = URL.createObjectURL(builtinBlob(b.files[path], path)));
  };

  /* ---------- Jugar en el navegador ---------- */
  DT.play = async (gid, opts) => {
    opts = opts || {};
    const g = DT.game(gid);
    if (!g) return;
    if (g.format !== 'html') return DT.download(gid);
    // Juegos de pago: sin compra (o Pase) se abre la caja
    if (!opts.test && DT.canAccess && !DT.canAccess(gid)) return DT.checkout(gid);
    const pkg = await DT.gameFiles(gid);
    if (!pkg) {
      DT.modal({
        title: 'Este juego aún no tiene archivos',
        body: DT.me().id === g.devId
          ? '<p>Sube el archivo <code>.html</code> o la carpeta del juego desde tu <a href="#/dev">panel de desarrollador</a>.</p>'
          : `<p><b>${DT.esc(g.title)}</b> es un juego de catálogo de ejemplo sin archivos. Los juegos subidos por desarrolladores se ejecutan aquí mismo.</p>`,
        actions: '<button class="btn primary" data-close>Cerrar</button>'
      });
      return;
    }
    if (active) active.close();

    const me = DT.me();
    const test = !!opts.test;
    // "Jugar ahora": el juego entra a la biblioteca sin descargar nada
    if (!test && !DT.lib()[gid]) { DT.lib()[gid] = { added: Date.now(), playtime: 0, lastPlayed: Date.now(), source: DT.accessSource ? DT.accessSource(gid) : 'free' }; DT.rewards.checkPlatform(); DT.save(); }
    const unlocked = Object.entries(DT.userAch(me.id, gid)).filter(([, v]) => v.unlockedAt).map(([k]) => k);
    let save = {};
    if (!test) { try { save = JSON.parse(localStorage.getItem(SAVE_KEY(me.id, gid))) || {}; } catch (e) { save = {}; } }

    const ov = document.createElement('div');
    ov.className = 'runner';
    ov.innerHTML = `
      <header class="runner-bar">
        <div class="runner-title">${DT.coverHTML(g, 'mini')}<div><strong>${DT.esc(g.title)}</strong>
          <small>${test ? '<span class="pill warn">🧪 Modo prueba — nada se guarda</span>' : 'Jugando como ' + DT.esc(me.name)}</small></div></div>
        <div class="runner-ach" data-ach></div>
        <div class="runner-actions">
          ${test ? `<button class="btn ghost sm" data-console>${DT.icon.code} Consola</button>` : ''}
          <button class="btn ghost sm" data-reload title="Reiniciar">${DT.icon.reset}</button>
          <button class="btn ghost sm" data-full title="Pantalla completa">${DT.icon.expand}</button>
          <button class="btn danger sm" data-exit>${DT.icon.close} Salir</button>
        </div>
      </header>
      <div class="runner-stage"><iframe title="${DT.esc(g.title)}"
        sandbox="allow-scripts allow-pointer-lock allow-modals allow-popups"
        allow="fullscreen; gamepad; autoplay; accelerometer; gyroscope"></iframe>
        <div class="runner-loading"><div class="spinner"></div><span>Cargando ${DT.esc(g.title)}…</span></div>
      </div>
      <pre class="runner-console" hidden></pre>`;
    document.body.appendChild(ov);
    document.body.classList.add('no-scroll');
    const frame = ov.querySelector('iframe');
    const con = ov.querySelector('.runner-console');
    const achEl = ov.querySelector('[data-ach]');
    const logLine = (lvl, text) => {
      const line = document.createElement('div');
      line.className = 'c-' + lvl;
      line.textContent = '[' + lvl + '] ' + text;
      con.appendChild(line);
      con.scrollTop = con.scrollHeight;
      if (opts.onConsole) opts.onConsole(lvl, text);
    };
    const refreshAch = () => {
      const s = DT.rewards.gameSummary(me.id, g);
      achEl.innerHTML = s.total ? `${DT.icon.trophy} ${test ? 'Logros (prueba)' : s.got + ' / ' + s.total + ' logros'}` : '';
    };
    refreshAch();

    const started = Date.now();
    const onMsg = async (e) => {
      if (e.source !== frame.contentWindow) return; // solo mensajes de ESTE iframe
      const m = e.data;
      if (!m || m.__dt !== 1) return;
      switch (m.type) {
        case 'boot': {
          const cur = await DT.gameFiles(gid);
          const payload = [];
          const transfer = [];
          for (const f of cur.list) {
            const buf = await f.blob.arrayBuffer();
            payload.push([f.path, buf, f.blob.type || mimeOf(f.path)]);
            transfer.push(buf);
          }
          frame.contentWindow.postMessage({
            __dt: 1, type: 'load', entry: cur.entry, files: payload, save,
            info: {
              user: { name: me.name, id: me.id },
              game: { id: g.id, title: g.title },
              achievements: (g.achievements || []).map((a) => ({ id: a.id, name: a.name, desc: a.desc, icon: a.icon, goal: a.goal || 0, hidden: !!a.hidden })),
              unlocked, test
            }
          }, '*', transfer);
          break;
        }
        case 'booted':
          ov.querySelector('.runner-loading').remove();
          frame.focus();
          break;
        case 'unlock':
          if (typeof m.id !== 'string') return;
          if (test) logLine('info', 'DivierteTEC.unlock("' + m.id + '")');
          if (DT.rewards.unlockGame(me.id, gid, m.id, { test })) frame.contentWindow.postMessage({ __dt: 1, type: 'unlocked', id: m.id }, '*');
          else if (test && !(g.achievements || []).some((a) => a.id === m.id)) logLine('warn', 'El logro "' + m.id + '" no está definido en el panel.');
          refreshAch();
          break;
        case 'progress':
          if (test) logLine('info', 'DivierteTEC.progress("' + m.id + '", ' + m.value + ')');
          DT.rewards.progress(me.id, gid, String(m.id), Number(m.value), { test });
          refreshAch();
          break;
        case 'stat':
          if (test) { logLine('info', 'DivierteTEC.setStat("' + m.key + '", ' + JSON.stringify(m.value) + ')'); break; }
          const st = DT.state().stats;
          ((st[me.id] = st[me.id] || {})[gid] = st[me.id][gid] || {})[String(m.key)] = m.value;
          DT.save();
          break;
        case 'save':
          if (!test) { try { localStorage.setItem(SAVE_KEY(me.id, gid), JSON.stringify(m.data || {})); } catch (err) { /* lleno */ } }
          break;
        case 'console':
          if (test) logLine(m.level, m.text);
          else if (m.level === 'error') console.warn('[' + g.title + ']', m.text);
          break;
      }
    };
    addEventListener('message', onMsg);
    frame.srcdoc = DT.bootDocument();

    const close = () => {
      removeEventListener('message', onMsg);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      ov.remove();
      document.body.classList.remove('no-scroll');
      active = null;
      if (!test) {
        const secs = Math.round((Date.now() - started) / 1000);
        const lib = DT.lib();
        if (!lib[gid]) lib[gid] = { added: Date.now(), playtime: 0 };
        lib[gid].playtime = (lib[gid].playtime || 0) + secs;
        lib[gid].lastPlayed = Date.now();
        DT.counters().sessions++;
        g.plays = (g.plays || 0) + 1;
        DT.rewards.checkPlatform();
        DT.emit('library');
      }
      if (opts.onClose) opts.onClose();
    };
    ov.querySelector('[data-exit]').onclick = close;
    ov.querySelector('[data-reload]').onclick = () => {
      ov.querySelector('.runner-stage').insertAdjacentHTML('beforeend', '<div class="runner-loading"><div class="spinner"></div><span>Reiniciando…</span></div>');
      frame.srcdoc = DT.bootDocument();
    };
    ov.querySelector('[data-full]').onclick = () => { ov.querySelector('.runner-stage').requestFullscreen && ov.querySelector('.runner-stage').requestFullscreen(); };
    const cbtn = ov.querySelector('[data-console]');
    if (cbtn) { con.hidden = false; cbtn.onclick = () => { con.hidden = !con.hidden; }; }
    const esc = (e) => { if (e.key === 'Escape' && !document.fullscreenElement && document.activeElement !== frame) { close(); document.removeEventListener('keydown', esc); } };
    document.addEventListener('keydown', esc);
    active = { close, frame, logLine };
    return active;
  };
})(window.DT);
