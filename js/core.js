/* DivertiTEC — núcleo: namespace global, utilidades, iconos, modales y toasts.
   Se usan scripts clásicos (no ES modules) para que la página funcione abriendo
   index.html directamente desde el disco (file://), sin servidor. */
window.DT = window.DT || {};
window.DT.views = window.DT.views || {};

(function (DT) {
  'use strict';

  DT.$ = (sel, root) => (root || document).querySelector(sel);
  DT.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  DT.esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  DT.uid = (p) => (p || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  DT.slug = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40);

  DT.fmtTime = (sec) => {
    sec = Math.floor(sec || 0);
    if (sec < 60) return sec + ' s';
    const m = Math.floor(sec / 60);
    if (m < 60) return m + ' min';
    const h = Math.floor(m / 60);
    return h + ' h ' + (m % 60) + ' min';
  };

  DT.timeAgo = (ts) => {
    if (!ts) return 'nunca';
    const d = (Date.now() - ts) / 1000;
    if (d < 60) return 'hace un momento';
    if (d < 3600) return 'hace ' + Math.floor(d / 60) + ' min';
    if (d < 86400) return 'hace ' + Math.floor(d / 3600) + ' h';
    const days = Math.floor(d / 86400);
    if (days === 0) return 'Hoy';
    if (days < 7) return 'hace ' + days + (days === 1 ? ' día' : ' días');
    if (days < 30) return 'hace ' + Math.floor(days / 7) + (days < 14 ? ' semana' : ' semanas');
    return new Date(ts).toLocaleDateString('es-MX');
  };

  DT.fmtBytes = (b) => {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  };

  /* ---------- Iconos SVG inline (sin dependencias) ---------- */
  const I = (d, extra) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra || ''}>${d}</svg>`;
  DT.icon = {
    play: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>`,
    search: I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    filter: I('<path d="M4 6h16M7 12h10M10 18h4"/>'),
    close: I('<path d="M18 6 6 18M6 6l12 12"/>'),
    plus: I('<path d="M12 5v14M5 12h14"/>'),
    trophy: I('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'),
    gift: I('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v9H5v-9M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>'),
    upload: I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>'),
    download: I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>'),
    flag: I('<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>'),
    edit: I('<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
    trash: I('<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>'),
    check: I('<path d="M20 6 9 17l-5-5"/>'),
    x: I('<path d="M18 6 6 18M6 6l12 12"/>'),
    moon: I('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
    sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    grid: I('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>'),
    clock: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    expand: I('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>'),
    shield: I('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
    code: I('<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>'),
    users: I('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>'),
    chart: I('<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>'),
    image: I('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>'),
    video: I('<rect x="2" y="5" width="15" height="14" rx="2"/><path d="m22 7-5 4 5 4z"/>'),
    text: I('<path d="M4 7V4h16v3M9 20h6M12 4v16"/>'),
    shapes: I('<path d="M12 3 3 19h18z"/>'),
    layers: I('<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>'),
    eye: I('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'),
    lock: I('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
    star: I('<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>'),
    thumbUp: I('<path d="M7 10v11H3V10zM7 10l4-8a3 3 0 0 1 3 3v4h6a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 18.6 21H7"/>'),
    thumbDown: I('<path d="M17 14V3h4v11zM17 14l-4 8a3 3 0 0 1-3-3v-4H4a2 2 0 0 1-2-2.3l1.4-8A2 2 0 0 1 5.4 3H17"/>'),
    chevDown: I('<path d="m6 9 6 6 6-6"/>'),
    chevLeft: I('<path d="m15 18-6-6 6-6"/>'),
    chevRight: I('<path d="m9 18 6-6-6-6"/>'),
    undo: I('<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/>'),
    copy: I('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),
    news: I('<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9h4"/><path d="M10 6h8M10 10h8M10 14h5"/>'),
    home: I('<path d="m3 11 9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>'),
    sparkle: I('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'),
    reset: I('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>')
  };

  /* ---------- Toasts ---------- */
  DT.toast = (html, opts) => {
    opts = opts || {};
    let host = DT.$('#toasts');
    if (!host) { host = document.createElement('div'); host.id = 'toasts'; document.body.appendChild(host); }
    const el = document.createElement('div');
    el.className = 'toast ' + (opts.kind || '');
    el.innerHTML = html;
    host.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, opts.ms || 3200);
    return el;
  };

  /* ---------- Modales ---------- */
  DT.modal = (opts) => {
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = `<div class="modal ${opts.wide ? 'wide' : ''}" role="dialog" aria-modal="true">
      <header class="modal-head"><h3>${opts.title || ''}</h3><button class="icon-btn" data-close aria-label="Cerrar">${DT.icon.close}</button></header>
      <div class="modal-body">${opts.body || ''}</div>
      ${opts.actions ? `<footer class="modal-foot">${opts.actions}</footer>` : ''}
    </div>`;
    const close = () => { wrap.classList.remove('show'); setTimeout(() => wrap.remove(), 200); document.removeEventListener('keydown', onKey); if (opts.onClose) opts.onClose(); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    wrap.addEventListener('click', (e) => { if (e.target === wrap || e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('show'));
    if (opts.onOpen) opts.onOpen(wrap.querySelector('.modal'), close);
    return { el: wrap.querySelector('.modal'), close };
  };

  DT.confirm = (title, text) => new Promise((res) => {
    let done = false;
    const m = DT.modal({
      title, body: `<p>${text}</p>`,
      actions: `<button class="btn ghost" data-close>Cancelar</button><button class="btn primary" data-ok>Confirmar</button>`,
      onClose: () => { if (!done) res(false); }
    });
    m.el.querySelector('[data-ok]').onclick = () => { done = true; res(true); m.close(); };
  });

  DT.prompt = (title, label, value) => new Promise((res) => {
    let done = false;
    const m = DT.modal({
      title, body: `<label class="field"><span>${label}</span><textarea rows="3" data-in>${DT.esc(value || '')}</textarea></label>`,
      actions: `<button class="btn ghost" data-close>Cancelar</button><button class="btn primary" data-ok>Aceptar</button>`,
      onClose: () => { if (!done) res(null); }
    });
    m.el.querySelector('[data-in]').focus();
    m.el.querySelector('[data-ok]').onclick = () => { done = true; res(m.el.querySelector('[data-in]').value); m.close(); };
  });

  /* Portada generada (gradiente + glifo) para juegos sin imagen subida */
  DT.coverStyle = (g) => {
    const c = g.cover || {};
    return `background:linear-gradient(${c.angle || 135}deg, ${c.c1 || '#1a6fd8'}, ${c.c2 || '#0b2a55'})`;
  };
  DT.coverHTML = (g, cls) => {
    const c = g.cover || {};
    if (c.mediaId) return `<div class="cover ${cls || ''}"><img data-media="${c.mediaId}" alt="${DT.esc(g.title)}"></div>`;
    return `<div class="cover gen ${cls || ''}" style="${DT.coverStyle(g)}"><span class="cover-glyph">${DT.esc(c.glyph || '🎮')}</span><span class="cover-title">${DT.esc(g.title)}</span></div>`;
  };

  DT.formatLabel = { html: 'HTML5 · Navegador', cpp: 'C++ · Nativo', exe: 'Ejecutable instalable' };
  DT.formatShort = { html: 'HTML', cpp: 'C++', exe: 'EXE' };
})(window.DT);
