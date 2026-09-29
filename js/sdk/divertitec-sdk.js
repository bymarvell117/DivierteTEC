/* DivertiTEC — SDK de logros y cargador de juegos HTML.

   Aquí viven dos funciones que NO se ejecutan en la página principal: se
   convierten a texto (Function.toString) e se inyectan dentro del iframe del juego.

   1) DT_SDK_INSTALL(bridge): crea window.DivertiTEC (API que usan los juegos).
      - Dentro de la plataforma, `bridge` envía mensajes a la página padre.
      - Fuera de la plataforma (archivo sdk/divertitec-sdk.js), `bridge` es null
        y el SDK funciona en "modo local": muestra los logros en consola y pantalla,
        así el juego no se rompe si se abre por separado.

   2) DT_BOOT(): corre dentro del iframe con sandbox (origen opaco). Recibe los
      archivos del juego por postMessage, crea blob: URLs *dentro* del iframe
      (las blob URLs del padre no se pueden cargar desde un origen opaco),
      reescribe las rutas relativas del HTML/CSS/JS y escribe el documento.
*/
(function (DT) {
  'use strict';

  function DT_SDK_INSTALL(bridge) {
    if (window.DivertiTEC && window.DivertiTEC.__real) return;
    var unlocked = {};
    var readyCbs = [];
    var listeners = { unlock: [] };
    var info = { user: { name: 'Jugador local' }, game: { title: document.title }, achievements: [] };
    var isReady = false;

    function localToast(text) {
      try {
        var d = document.createElement('div');
        d.textContent = '🏆 ' + text;
        d.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483647;background:#1a6fd8;color:#fff;padding:10px 14px;border-radius:8px;font:600 14px system-ui;box-shadow:0 6px 20px #0006';
        (document.body || document.documentElement).appendChild(d);
        setTimeout(function () { d.remove(); }, 2500);
      } catch (e) { /* nada */ }
    }
    function send(msg) {
      if (bridge) bridge(msg);
      else console.log('[DivertiTEC SDK · modo local]', msg);
    }

    var api = {
      __real: !!bridge,
      version: '1.0.0',
      /** Desbloquea un logro por su id (definido en el panel de desarrollador). */
      unlock: function (id) {
        id = String(id);
        if (unlocked[id]) return false;
        unlocked[id] = true;
        send({ type: 'unlock', id: id });
        if (!bridge) localToast('Logro: ' + id);
        listeners.unlock.forEach(function (cb) { try { cb(id); } catch (e) { console.error(e); } });
        return true;
      },
      /** Reporta progreso numérico (p. ej. puntos). Se desbloquea al llegar a la meta. */
      progress: function (id, value) { send({ type: 'progress', id: String(id), value: Number(value) || 0 }); },
      /** Guarda una estadística libre (récord, nivel máximo…) visible para el desarrollador. */
      setStat: function (key, value) { send({ type: 'stat', key: String(key), value: value }); },
      /** ¿El jugador ya tiene este logro? */
      isUnlocked: function (id) { return !!unlocked[String(id)]; },
      /** Datos del jugador y del juego: { user, game, achievements } */
      getInfo: function () { return info; },
      /** Llama a cb(info) cuando la plataforma está lista. */
      onReady: function (cb) { if (isReady) cb(info); else readyCbs.push(cb); },
      /** Escucha desbloqueos: DivertiTEC.on('unlock', function(id){...}) */
      on: function (ev, cb) { (listeners[ev] = listeners[ev] || []).push(cb); },
      /** Guardado simple de partida (también funciona localStorage normal). */
      save: function (key, value) { try { localStorage.setItem('dt_' + key, JSON.stringify(value)); } catch (e) { /* nada */ } },
      load: function (key, fallback) { try { var v = localStorage.getItem('dt_' + key); return v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; } },
      __markUnlocked: function (id) { unlocked[id] = true; },
      __setReady: function (data) {
        info = data || info;
        (info.unlocked || []).forEach(function (id) { unlocked[id] = true; });
        isReady = true;
        readyCbs.splice(0).forEach(function (cb) { try { cb(info); } catch (e) { console.error(e); } });
      }
    };
    window.DivertiTEC = api;
    if (!bridge) setTimeout(function () { api.__setReady(info); }, 0);
  }

  function DT_BOOT(SDK_SRC) {
    var post = function (msg) { msg.__dt = 1; parent.postMessage(msg, '*'); };

    /* --- localStorage/sessionStorage simulados (el sandbox bloquea los reales) --- */
    function makeStorage(initial, persist) {
      var data = Object.assign({}, initial || {});
      var timer = null;
      var flush = function () { if (!persist) return; clearTimeout(timer); timer = setTimeout(function () { post({ type: 'save', data: data }); }, 300); };
      var s = {
        getItem: function (k) { k = String(k); return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null; },
        setItem: function (k, v) { data[String(k)] = String(v); flush(); },
        removeItem: function (k) { delete data[String(k)]; flush(); },
        clear: function () { data = {}; flush(); },
        key: function (i) { return Object.keys(data)[i] || null; }
      };
      Object.defineProperty(s, 'length', { get: function () { return Object.keys(data).length; } });
      return new Proxy(s, {
        get: function (t, p) { return p in t ? t[p] : t.getItem(p); },
        set: function (t, p, v) { t.setItem(p, v); return true; },
        deleteProperty: function (t, p) { t.removeItem(p); return true; }
      });
    }

    /* --- consola y errores → página padre (útil en modo prueba) --- */
    ['log', 'warn', 'error', 'info'].forEach(function (lvl) {
      var orig = console[lvl];
      console[lvl] = function () {
        try { post({ type: 'console', level: lvl, text: Array.prototype.map.call(arguments, function (a) { try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch (e) { return String(a); } }).join(' ') }); } catch (e) { /* nada */ }
        return orig.apply(console, arguments);
      };
    });
    window.addEventListener('error', function (e) { post({ type: 'console', level: 'error', text: (e.message || 'Error') + (e.filename ? ' (' + e.filename.split('/').pop() + ':' + e.lineno + ')' : '') }); });

    /* --- utilidades de rutas --- */
    var EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;
    function dirOf(p) { var i = p.lastIndexOf('/'); return i < 0 ? '' : p.slice(0, i + 1); }
    function resolve(base, rel) {
      if (!rel || EXTERNAL.test(rel)) return null;
      rel = rel.split('#')[0].split('?')[0];
      try { rel = decodeURIComponent(rel); } catch (e) { /* nada */ }
      var parts = (rel.charAt(0) === '/' ? rel.slice(1) : dirOf(base) + rel).split('/');
      var out = [];
      parts.forEach(function (s) { if (s === '..') out.pop(); else if (s !== '.' && s !== '') out.push(s); });
      return out.join('/');
    }

    window.addEventListener('message', function onLoad(ev) {
      var d = ev.data;
      if (!d || d.__dt !== 1 || d.type !== 'load') return;
      window.removeEventListener('message', onLoad);

      var ls = makeStorage(d.save, true);
      var ss = makeStorage({}, false);
      try { Object.defineProperty(window, 'localStorage', { configurable: true, get: function () { return ls; } }); } catch (e) { /* nada */ }
      try { Object.defineProperty(window, 'sessionStorage', { configurable: true, get: function () { return ss; } }); } catch (e) { /* nada */ }

      /* SDK real, conectado a la plataforma */
      (0, eval)(SDK_SRC)(function (msg) { post(msg); });
      window.addEventListener('message', function (e) {
        var m = e.data;
        if (m && m.__dt === 1 && m.type === 'unlocked' && window.DivertiTEC) window.DivertiTEC.__markUnlocked(m.id);
      });

      var files = {};  // ruta → {buf, type}
      var lower = {};  // ruta en minúsculas → ruta real (tolerancia a mayúsculas)
      d.files.forEach(function (f) { files[f[0]] = { buf: f[1], type: f[2] }; lower[f[0].toLowerCase()] = f[0]; });
      var urls = {};
      var entry = d.entry;
      var entryDir = dirOf(entry);
      var dec = new TextDecoder();
      var find = function (p) { return p == null ? null : (files[p] ? p : lower[p.toLowerCase()] || null); };
      var isText = function (p) { return /\.(css|js|mjs|json|html?|txt|svg|xml|glsl|frag|vert|csv)$/i.test(p); };

      function urlFor(path, stack) {
        path = find(path);
        if (!path) return null;
        if (urls[path]) return urls[path];
        stack = stack || {};
        if (stack[path]) return null; // dependencia circular
        stack[path] = 1;
        var f = files[path], blob;
        if (/\.css$/i.test(path)) blob = new Blob([rewriteCSS(dec.decode(f.buf), path, stack)], { type: 'text/css' });
        else if (/\.(m?js)$/i.test(path)) blob = new Blob([rewriteJS(dec.decode(f.buf), path, stack)], { type: 'text/javascript' });
        else blob = new Blob([f.buf], { type: f.type || 'application/octet-stream' });
        urls[path] = URL.createObjectURL(blob);
        return urls[path];
      }
      function rewriteCSS(css, base, stack) {
        return css
          .replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, function (m, q, u) { var r = urlFor(resolve(base, u.trim()), stack); return r ? 'url("' + r + '")' : m; })
          .replace(/@import\s+(['"])([^'"]+)\1/gi, function (m, q, u) { var r = urlFor(resolve(base, u), stack); return r ? '@import "' + r + '"' : m; });
      }
      /* En JS las rutas se resuelven contra el documento (carpeta del HTML) y, si no, contra el propio archivo */
      function rewriteJS(js, base, stack) {
        return js.replace(/(['"`])((?:\.{0,2}\/)?[^'"`\s<>]+\.[a-z0-9]{1,5})\1/gi, function (m, q, u) {
          if (EXTERNAL.test(u)) return m;
          var p = find(resolve(entry, u)) || find(resolve(base, u));
          if (!p || p === entry) return m;
          var r = urlFor(p, stack);
          return r ? q + r + q : m;
        });
      }

      /* --- reescritura del HTML de entrada --- */
      var html = dec.decode(files[entry].buf);
      var doc = new DOMParser().parseFromString(html, 'text/html');
      ['src', 'href', 'poster', 'data', 'data-src'].forEach(function (attr) {
        Array.prototype.forEach.call(doc.querySelectorAll('[' + attr + ']'), function (el) {
          if (el.tagName === 'A') return; // los enlaces se dejan igual
          var r = urlFor(resolve(entry, el.getAttribute(attr)));
          if (r) el.setAttribute(attr, r);
        });
      });
      Array.prototype.forEach.call(doc.querySelectorAll('[srcset]'), function (el) {
        el.setAttribute('srcset', el.getAttribute('srcset').split(',').map(function (part) {
          var bits = part.trim().split(/\s+/); var r = urlFor(resolve(entry, bits[0])); if (r) bits[0] = r; return bits.join(' ');
        }).join(', '));
      });
      Array.prototype.forEach.call(doc.querySelectorAll('[style]'), function (el) { el.setAttribute('style', rewriteCSS(el.getAttribute('style'), entry)); });
      Array.prototype.forEach.call(doc.querySelectorAll('style'), function (el) { el.textContent = rewriteCSS(el.textContent, entry); });
      Array.prototype.forEach.call(doc.querySelectorAll('script:not([src])'), function (el) { el.textContent = rewriteJS(el.textContent, entry); });

      /* --- rutas pedidas en tiempo de ejecución (fetch, XHR, new Image, Audio…) --- */
      var mapRuntime = function (u) {
        if (typeof u !== 'string') return u;
        var p = find(resolve(entry, u));
        return p ? urlFor(p) : u;
      };
      var oFetch = window.fetch;
      if (oFetch) window.fetch = function (input, init) { return oFetch.call(this, typeof input === 'string' ? mapRuntime(input) : input, init); };
      var oOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function (m, u) { var a = Array.prototype.slice.call(arguments); a[1] = mapRuntime(u); return oOpen.apply(this, a); };
      [window.HTMLImageElement, window.HTMLMediaElement, window.HTMLSourceElement, window.HTMLScriptElement].forEach(function (C) {
        if (!C) return;
        var desc = Object.getOwnPropertyDescriptor(C.prototype, 'src');
        if (desc && desc.set) Object.defineProperty(C.prototype, 'src', { configurable: true, get: desc.get, set: function (v) { desc.set.call(this, mapRuntime(v)); } });
      });
      var oSet = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function (n, v) {
        if ((n === 'src' || (n === 'href' && this.tagName !== 'A')) && typeof v === 'string') v = mapRuntime(v);
        return oSet.call(this, n, v);
      };
      if (window.Audio) {
        var OAudio = window.Audio;
        window.Audio = function (u) { return u === undefined ? new OAudio() : new OAudio(mapRuntime(u)); };
        window.Audio.prototype = OAudio.prototype;
      }

      window.DivertiTEC.__setReady(d.info);
      post({ type: 'booted' });
      var out = (doc.doctype ? '<!DOCTYPE html>' : '') + doc.documentElement.outerHTML;
      document.open();
      document.write(out);
      document.close();
    });
    post({ type: 'boot' });
  }

  /* Texto del SDK para inyectarlo en el iframe o descargarlo como archivo */
  DT.SDK_SOURCE = '(' + DT_SDK_INSTALL.toString() + ')';

  /* Archivo independiente que los desarrolladores pueden incluir en su juego */
  DT.SDK_STANDALONE = '/* DivertiTEC SDK v1.0.0 — incluye <script src="divertitec-sdk.js"></script> en tu juego.\n' +
    '   Dentro de DivertiTEC la plataforma inyecta el SDK real; fuera de ella funciona en modo local. */\n' +
    DT.SDK_SOURCE + '(null);\n';

  /* Documento de arranque que se carga en el iframe (srcdoc) */
  DT.bootDocument = () => '<!doctype html><html><head><meta charset="utf-8"><script>(' +
    DT_BOOT.toString() + ')(' + JSON.stringify(DT.SDK_SOURCE) + ');<\/script></head><body style="background:#000"></body></html>';

  if (typeof module !== 'undefined') module.exports = { DT_SDK_INSTALL, DT_BOOT };
})(window.DT = window.DT || {});
