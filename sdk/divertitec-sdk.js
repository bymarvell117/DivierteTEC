/* DivertiTEC SDK v1.0.0 — incluye <script src="divertitec-sdk.js"></script> en tu juego.
   Dentro de DivertiTEC la plataforma inyecta el SDK real; fuera de ella funciona en modo local. */
(function DT_SDK_INSTALL(bridge) {
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
  })(null);
