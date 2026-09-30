/* DivierteTEC — capa de datos.
   - Estado (usuarios, juegos, logros, reportes…) en localStorage como JSON.
   - Archivos binarios (juegos subidos, imágenes, videos) en IndexedDB.
   Todo vive en el navegador: no hace falta servidor para la demostración. */
(function (DT) {
  'use strict';

  const KEY = 'divierteTEC_state_v10';
  let state = null;
  const listeners = new Set();

  DT.state = () => state;

  /* Completa los campos que toda ficha de juego necesita (juegos creados en versiones
     anteriores podían quedar sin precio y romper la tienda y el Pase). */
  DT.normalizeGame = (g) => {
    if (!g) return g;
    g.pricing = Object.assign({ mode: 'pwyw', price: 20, min: 0, inPass: false }, g.pricing || {});
    // Pilar de la plataforma: los juegos gratuitos funcionan con «Paga lo que quieras» desde $0
    if (g.private) return g;
    if (g.pricing.mode === 'free') Object.assign(g.pricing, { mode: 'pwyw', min: 0, price: g.pricing.price || 20 });
    ['tags', 'reviews', 'news', 'achievements'].forEach((k) => { if (!Array.isArray(g[k])) g[k] = []; });
    g.cover = g.cover || { c1: '#1a6fd8', c2: '#0b2a55' };
    g.plays = g.plays || 0;
    return g;
  };

  DT.load = () => {
    try { state = JSON.parse(localStorage.getItem(KEY)); } catch (e) { state = null; }
    if (!state || state.version !== 10) { state = DT.seedState(); DT.save(); }
    state.games.forEach(DT.normalizeGame); // repara juegos guardados con campos faltantes
    state.social = state.social || { follows: {}, friends: {}, blocks: {}, requests: [] };
    state.devRequests = state.devRequests || []; state.tecnmRequests = state.tecnmRequests || [];
    if (state.economy.passTecnmDiscount == null) state.economy.passTecnmDiscount = 0.3;
    delete state.economy.rateExternal; // ya no hay estudios externos
    if (state.economy.causeRate == null) state.economy.causeRate = 0.05;
    if (state.economy.seedDays == null) { state.economy.seedDays = 21; delete state.economy.seedAllowance; }
    return state;
  };

  let saveTimer = null;
  DT.save = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify(state)); }
      catch (e) { DT.toast('No se pudo guardar el estado (almacenamiento lleno).', { kind: 'error' }); }
    }, 60);
  };

  /* Notificación de cambios para que las vistas se re-rendericen */
  DT.on = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
  DT.emit = (what) => { DT.save(); listeners.forEach((fn) => { try { fn(what); } catch (e) { console.error(e); } }); };

  DT.resetDemo = async () => {
    localStorage.removeItem(KEY);
    await DT.files.clearAll();
    location.hash = '#/';
    location.reload();
  };

  /* ---------- Consultas ---------- */
  DT.me = () => state.users.find((u) => u.id === state.currentUserId) || state.users[0];
  DT.user = (id) => state.users.find((u) => u.id === id);
  DT.game = (id) => state.games.find((g) => g.id === id);
  /* Juegos personales (private) solo existen en la biblioteca de su dueño: fuera de tienda, estadísticas, Pase y admin */
  DT.catalogGames = () => state.games.filter((g) => !g.private);
  DT.canSee = (g) => !!g && (!g.private || g.ownerId === state.currentUserId);
  DT.gamesPublic = () => state.games.filter((g) => !g.private && g.status === 'approved' && (DT.user(g.devId) || {}).status !== 'suspended');
  DT.lib = (uid) => (state.library[uid || state.currentUserId] = state.library[uid || state.currentUserId] || {});
  DT.owns = (gid, uid) => !!DT.lib(uid)[gid];
  DT.counters = (uid) => {
    uid = uid || state.currentUserId;
    const c = state.counters[uid] = state.counters[uid] || {};
    c.sessions = c.sessions || 0; c.visited = c.visited || []; c.reports = c.reports || 0;
    return c;
  };
  DT.inventory = (uid) => (state.inventory[uid || state.currentUserId] = state.inventory[uid || state.currentUserId] || []);
  DT.equipped = (uid) => (state.equipped[uid || state.currentUserId] = state.equipped[uid || state.currentUserId] || {});
  DT.userAch = (uid, gid) => {
    uid = uid || state.currentUserId;
    const a = state.achievements[uid] = state.achievements[uid] || {};
    return (a[gid] = a[gid] || {});
  };
  DT.reward = (id) => DT.REWARDS[id] || state.customRewards[id];
  DT.allRewards = () => Object.assign({}, DT.REWARDS, state.customRewards);

  DT.avatarOf = (u) => {
    const eq = DT.equipped(u.id);
    return eq.avatar || (u.role === 'admin' ? 'shield' : u.role === 'dev' ? 'wrench' : 'gamepad');
  };
  DT.avatarHTML = (u, size) => {
    const eq = DT.equipped(u.id);
    return `<span class="avatar ${eq.frame ? 'frame-' + DT.esc(eq.frame) : ''}" style="--s:${size || 40}px">${DT.art.avatar(DT.avatarOf(u))}</span>`;
  };

  DT.log = (text) => { state.log.unshift({ date: Date.now(), actor: state.currentUserId, text }); state.log = state.log.slice(0, 200); };

  /* Filtro de palabras prohibidas (moderación automática) */
  DT.hasBanned = (text) => {
    const t = String(text || '').toLowerCase();
    return state.bannedWords.some((w) => w && t.includes(w.toLowerCase()));
  };
  DT.censor = (text) => {
    let t = String(text || '');
    state.bannedWords.forEach((w) => {
      if (!w) return;
      t = t.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), (m) => '✱'.repeat(m.length));
    });
    return t;
  };

  /* ---------- IndexedDB: almacén de archivos ---------- */
  const DB_NAME = 'divierteTEC_files';
  let dbp = null;
  const mem = new Map(); // respaldo si IndexedDB no está disponible
  const openDB = () => dbp || (dbp = new Promise((res) => {
    try {
      const r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = () => r.result.createObjectStore('files');
      r.onsuccess = () => res(r.result);
      r.onerror = () => res(null);
    } catch (e) { res(null); }
  }));
  const tx = async (mode, fn) => {
    const db = await openDB();
    if (!db) return fn(null);
    return new Promise((res, rej) => {
      const t = db.transaction('files', mode);
      const store = t.objectStore('files');
      let out;
      Promise.resolve(fn(store)).then((v) => { out = v; });
      t.oncomplete = () => res(out);
      t.onerror = () => rej(t.error);
    });
  };
  const req = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });

  DT.files = {
    put: (key, blob) => tx('readwrite', (s) => { if (!s) { mem.set(key, blob); return; } s.put(blob, key); }),
    get: async (key) => {
      const db = await openDB();
      if (!db) return mem.get(key);
      return req(db.transaction('files').objectStore('files').get(key));
    },
    /* Devuelve [{path, blob}] para todas las claves con el prefijo */
    list: async (prefix) => {
      const db = await openDB();
      if (!db) return [...mem.entries()].filter(([k]) => k.startsWith(prefix)).map(([k, v]) => ({ path: k.slice(prefix.length), blob: v }));
      const range = IDBKeyRange.bound(prefix, prefix + '￿');
      const store = db.transaction('files').objectStore('files');
      const [keys, vals] = await Promise.all([req(store.getAllKeys(range)), req(store.getAll(range))]);
      return keys.map((k, i) => ({ path: k.slice(prefix.length), blob: vals[i] }));
    },
    removePrefix: async (prefix) => {
      const db = await openDB();
      if (!db) { [...mem.keys()].forEach((k) => k.startsWith(prefix) && mem.delete(k)); return; }
      return tx('readwrite', (s) => s.delete(IDBKeyRange.bound(prefix, prefix + '￿')));
    },
    clearAll: async () => { mem.clear(); const db = await openDB(); if (db) return tx('readwrite', (s) => s.clear()); }
  };

  /* ---------- Medios (imágenes, gifs, videos) ---------- */
  const urlCache = new Map();
  DT.media = {
    add: async (file) => {
      const id = DT.uid('m');
      await DT.files.put('media:' + id, file);
      return { id, kind: file.type.startsWith('video') ? 'video' : 'image' };
    },
    url: async (id) => {
      if (!id) return '';
      if (urlCache.has(id)) return urlCache.get(id);
      const blob = await DT.files.get('media:' + id);
      const u = blob ? URL.createObjectURL(blob) : '';
      urlCache.set(id, u);
      return u;
    },
    /* Rellena src de <img|video data-media="id"> dentro de root */
    hydrate: (root) => {
      DT.$$('[data-media]', root).forEach(async (el) => {
        const u = await DT.media.url(el.dataset.media);
        if (u && el.getAttribute('src') !== u) el.src = u;
      });
    }
  };
})(window.DT);
