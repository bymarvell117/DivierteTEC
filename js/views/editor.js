/* DivierteTEC — editor visual de páginas de tienda y biblioteca.
   Bloques arrastrables y redimensionables dentro del perímetro del lienzo,
   con formas (incluido un editor de polígonos punto por punto), capas,
   rotación, bordes, sombras, textos enriquecidos, imágenes, GIFs y videos. */
(function (DT) {
  'use strict';

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const GRID = 10;

  DT.views.editor = (app, gid, which) => {
    const g = DT.game(gid);
    const me = DT.me();
    if (!g || (g.devId !== me.id && me.role !== 'admin')) return DT.views.notFound(app);
    const key = which === 'tienda' ? 'storeLayout' : 'libraryLayout';
    let L = clone(g[key] || { height: 500, blocks: [] });
    let sel = null;          // id del bloque seleccionado
    let editingText = false;
    let dirty = false;
    let preview = false;
    const history = [];
    const snapshot = () => { history.push(JSON.stringify(L)); if (history.length > 60) history.shift(); dirty = true; };
    const block = (id) => L.blocks.find((b) => b.id === id);

    app.innerHTML = `
      <div class="editor">
        <header class="ed-bar">
          <a class="btn ghost sm" href="#/dev/juego/${g.id}">${DT.icon.chevLeft} ${DT.esc(g.title)}</a>
          <div class="seg">
            <a class="${which === 'tienda' ? 'on' : ''}" href="#/dev/editor/${g.id}/tienda">Página de tienda</a>
            <a class="${which === 'biblioteca' ? 'on' : ''}" href="#/dev/editor/${g.id}/biblioteca">Página de biblioteca</a>
          </div>
          <span class="spacer"></span>
          <button class="btn ghost sm" data-undo title="Deshacer (Ctrl+Z)">${DT.icon.undo}</button>
          <button class="btn ghost sm" data-template>${DT.icon.reset} Plantilla</button>
          <button class="btn ghost sm" data-preview>${DT.icon.eye} Vista previa</button>
          <button class="btn primary sm" data-save>${DT.icon.check} Guardar</button>
        </header>
        <div class="ed-main">
          <aside class="ed-panel ed-left">
            <h4>Agregar bloque</h4>
            <div class="ed-add">${Object.entries(DT.BLOCK_TYPES).map(([k, t]) => `<button data-add="${k}">${DT.icon[t.icon]}<span>${t.name}</span></button>`).join('')}</div>
            <h4>Lienzo</h4>
            <label class="field sm"><span>Alto del espacio (px)</span><input type="number" min="200" max="4000" step="10" data-canvas-h value="${L.height}"></label>
            <label class="field sm"><span>Fondo</span>
              <div class="row nowrap"><input type="color" data-canvas-bgc value="#ffffff"><button class="btn ghost sm" data-canvas-bgclear>Transparente</button></div></label>
            <label class="field sm"><span>Fondo con degradado</span><div class="row nowrap"><input type="color" data-g1 value="#1a6fd8"><input type="color" data-g2 value="#0b2a55"><button class="btn ghost sm" data-canvas-grad>Aplicar</button></div></label>
            <h4>Capas</h4>
            <div class="ed-layers" data-layers></div>
            <p class="ed-help">Arrastra para mover · esquina para redimensionar · doble clic en un texto para editarlo · <kbd>Supr</kbd> borra · <kbd>Ctrl</kbd>+<kbd>D</kbd> duplica · flechas mueven · <kbd>Alt</kbd> desactiva la cuadrícula.</p>
          </aside>
          <div class="ed-stage" data-stage><div class="ed-canvas-host" data-host></div></div>
          <aside class="ed-panel ed-right" data-props></aside>
        </div>
      </div>`;

    const host = DT.$('[data-host]', app);
    const props = DT.$('[data-props]', app);
    const ctx = { editable: true, playHTML: DT.playButtonsHTML, uid: me.id };

    const draw = () => {
      ctx.editable = !preview;
      const canvas = DT.renderLayout(host, L, g, ctx);
      canvas.classList.toggle('grid-on', !preview);
      if (sel && !preview) {
        const el = canvas.querySelector(`[data-id="${sel}"]`);
        if (el) { el.classList.add('sel'); drawPoints(el); }
      }
      drawLayers();
      drawProps();
    };

    const scale = () => host.firstElementChild.getBoundingClientRect().width / DT.LAYOUT_W;
    const clamp = (b) => {
      b.w = Math.max(20, Math.min(DT.LAYOUT_W, Math.round(b.w)));
      b.h = Math.max(20, Math.min(L.height, Math.round(b.h)));
      b.x = Math.max(0, Math.min(DT.LAYOUT_W - b.w, Math.round(b.x)));
      b.y = Math.max(0, Math.min(L.height - b.h, Math.round(b.y)));
    };
    const snap = (v, e) => (e && e.altKey ? v : Math.round(v / GRID) * GRID);
    const place = (el, b) => { el.style.left = b.x + 'px'; el.style.top = b.y + 'px'; el.style.width = b.w + 'px'; el.style.height = b.h + 'px'; };

    /* ---------- Arrastrar / redimensionar ---------- */
    host.addEventListener('pointerdown', (e) => {
      if (preview) return;
      const el = e.target.closest('.blk');
      const pt = e.target.closest('[data-pt]');
      if (pt) return dragPoint(e, pt);
      if (!el) { if (e.target.closest('.layout-canvas')) { sel = null; editingText = false; draw(); } return; }
      if (editingText && el.dataset.id === sel) return; // escribiendo texto
      const b = block(el.dataset.id);
      if (sel !== b.id) { sel = b.id; editingText = false; draw(); }
      const cur = host.querySelector(`[data-id="${b.id}"]`);
      const resize = !!e.target.closest('[data-resize]');
      const s = scale();
      const start = { x: e.clientX, y: e.clientY, bx: b.x, by: b.y, bw: b.w, bh: b.h };
      let moved = false;
      e.preventDefault();
      const move = (ev) => {
        const dx = (ev.clientX - start.x) / s, dy = (ev.clientY - start.y) / s;
        if (!moved && Math.abs(dx) + Math.abs(dy) < 2) return;
        if (!moved) { snapshot(); moved = true; }
        if (resize) { b.w = snap(start.bw + dx, ev); b.h = snap(start.bh + dy, ev); if (ev.shiftKey) b.h = Math.round(b.w * start.bh / start.bw); }
        else { b.x = snap(start.bx + dx, ev); b.y = snap(start.by + dy, ev); }
        clamp(b);
        place(cur, b);
        const pos = props.querySelector('[data-pos]');
        if (pos) pos.textContent = `x ${b.x} · y ${b.y} · ${b.w}×${b.h}`;
      };
      const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); if (moved) draw(); };
      addEventListener('pointermove', move);
      addEventListener('pointerup', up);
    });

    /* Edición de texto en el propio lienzo */
    host.addEventListener('dblclick', (e) => {
      const el = e.target.closest('.blk-text');
      if (!el || preview) return;
      const b = block(el.closest('.blk').dataset.id);
      snapshot();
      editingText = true;
      el.contentEditable = 'true';
      el.focus();
      el.closest('.blk').classList.add('editing');
      el.addEventListener('blur', () => {
        b.html = DT.sanitize(el.innerHTML);
        editingText = false;
        el.contentEditable = 'false';
        draw();
      }, { once: true });
    });

    /* ---------- Editor de polígonos personalizados ---------- */
    function drawPoints(el) {
      const b = block(sel);
      if (!b || b.shape !== 'custom') return;
      el.insertAdjacentHTML('beforeend', `<svg class="pt-lines" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${b.points.map((p) => p.join(',')).join(' ')}"/></svg>` +
        b.points.map((p, i) => `<span class="pt" data-pt="${i}" style="left:${p[0]}%;top:${p[1]}%" title="Punto ${i + 1}"></span>`).join(''));
    }
    function dragPoint(e, pt) {
      e.preventDefault();
      e.stopPropagation();
      const b = block(sel);
      const el = pt.closest('.blk');
      const i = +pt.dataset.pt;
      snapshot();
      const shape = el.querySelector('.blk-shape');
      const poly = el.querySelector('.pt-lines polygon');
      const move = (ev) => {
        const r = el.getBoundingClientRect();
        const px = Math.max(0, Math.min(100, Math.round((ev.clientX - r.left) / r.width * 100)));
        const py = Math.max(0, Math.min(100, Math.round((ev.clientY - r.top) / r.height * 100)));
        b.points[i] = [px, py];
        pt.style.left = px + '%'; pt.style.top = py + '%';
        shape.style.clipPath = DT.clipFor(b);
        poly.setAttribute('points', b.points.map((p) => p.join(',')).join(' '));
      };
      const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); draw(); };
      addEventListener('pointermove', move);
      addEventListener('pointerup', up);
    }

    /* ---------- Capas ---------- */
    function drawLayers() {
      const host2 = DT.$('[data-layers]', app);
      const sorted = L.blocks.slice().sort((a, b) => (b.z || 1) - (a.z || 1));
      host2.innerHTML = sorted.map((b) => `<button class="${b.id === sel ? 'on' : ''}" data-layer="${b.id}">${DT.icon[DT.BLOCK_TYPES[b.type].icon]}<span>${DT.BLOCK_TYPES[b.type].name}</span><small>z${b.z || 1}</small></button>`).join('') || '<p class="muted">Lienzo vacío.</p>';
      DT.$$('[data-layer]', host2).forEach((x) => x.onclick = () => { sel = x.dataset.layer; draw(); });
    }

    /* ---------- Propiedades ---------- */
    function drawProps() {
      const b = block(sel);
      if (!b || preview) {
        props.innerHTML = `<div class="ed-empty">${DT.icon.layers}<p>Selecciona un bloque para editar su forma, tamaño, borde y contenido.</p>
          <p class="muted">Tu espacio: ${DT.LAYOUT_W} × ${L.height} px.</p></div>`;
        return;
      }
      const t = b.type;
      const media = t === 'media' || t === 'gallery' || t === 'cover';
      props.innerHTML = `
        <h4>${DT.BLOCK_TYPES[t].name}</h4>
        <small class="muted" data-pos>x ${b.x} · y ${b.y} · ${b.w}×${b.h}</small>
        <div class="prop-grid">
          <label>X<input type="number" data-p="x" value="${b.x}"></label>
          <label>Y<input type="number" data-p="y" value="${b.y}"></label>
          <label>Ancho<input type="number" data-p="w" value="${b.w}"></label>
          <label>Alto<input type="number" data-p="h" value="${b.h}"></label>
          <label>Rotación°<input type="number" data-p="rot" value="${b.rot || 0}" min="-180" max="180"></label>
          <label>Opacidad<input type="number" data-p="opacity" value="${b.opacity == null ? 1 : b.opacity}" min="0" max="1" step="0.05"></label>
        </div>
        <div class="row nowrap">
          <button class="btn ghost sm" data-z="up" title="Traer al frente">${DT.icon.arrowUp} Frente</button>
          <button class="btn ghost sm" data-z="down" title="Enviar atrás">${DT.icon.arrowDown} Atrás</button>
          <button class="btn ghost sm" data-dup title="Duplicar">${DT.icon.copy}</button>
          <button class="btn danger sm" data-delblk title="Eliminar">${DT.icon.trash}</button>
        </div>

        ${t !== 'text' && t !== 'achievements' && t !== 'play' ? `
        <h4>Forma</h4>
        <div class="shape-picker">${Object.entries(DT.SHAPES).map(([k, s]) => `<button class="${(b.shape || 'rect') === k ? 'on' : ''}" data-shape="${k}" title="${s.name}"><i style="clip-path:${k === 'custom' ? 'polygon(10% 0,100% 15%,85% 100%,0 80%)' : s.clip || 'none'};${k === 'rounded' ? 'border-radius:6px' : ''}"></i></button>`).join('')}</div>
        ${b.shape === 'rounded' ? `<label class="field sm"><span>Radio de esquinas</span><input type="range" min="0" max="200" data-p="radius" value="${b.radius || 14}"></label>` : ''}
        ${b.shape === 'custom' ? `<p class="ed-help">Arrastra los puntos azules sobre el bloque para dibujar tu forma.</p>
          <div class="row nowrap"><button class="btn ghost sm" data-pt-add>+ Punto</button><button class="btn ghost sm" data-pt-del>− Punto</button></div>` : ''}` : ''}

        <h4>Borde y sombra</h4>
        <div class="prop-grid">
          <label>Grosor<input type="number" min="0" max="30" data-p="borderW" value="${b.borderW || 0}"></label>
          <label>Color<input type="color" data-p="borderC" value="${b.borderC || '#ffffff'}"></label>
        </div>
        <label class="check"><input type="checkbox" data-p="shadow" ${b.shadow ? 'checked' : ''}> Sombra</label>
        ${t !== 'shape' ? `<label class="field sm"><span>Fondo del bloque</span><div class="row nowrap"><input type="color" data-p="bg" value="${b.bg && b.bg.startsWith('#') ? b.bg : '#ffffff'}"><button class="btn ghost sm" data-bgclear>Sin fondo</button></div></label>` : ''}

        ${t === 'text' ? `
          <h4>Texto</h4>
          <div class="row nowrap txt-tools">
            <button class="btn ghost sm" data-cmd="bold"><b>B</b></button><button class="btn ghost sm" data-cmd="italic"><i>I</i></button><button class="btn ghost sm" data-cmd="underline"><u>U</u></button>
            <button class="btn ghost sm" data-cmd="formatBlock" data-arg="H2">H2</button><button class="btn ghost sm" data-cmd="formatBlock" data-arg="P">¶</button>
          </div>
          <div class="prop-grid">
            <label>Tamaño<input type="number" min="10" max="96" data-p="fontSize" value="${b.fontSize || 16}"></label>
            <label>Color<input type="color" data-p="color" value="${b.color || '#16202d'}"></label>
          </div>
          <div class="seg sm">${['left', 'center', 'right'].map((a) => `<button class="${(b.align || 'left') === a ? 'on' : ''}" data-align="${a}">${{ left: 'Izq.', center: 'Centro', right: 'Der.' }[a]}</button>`).join('')}</div>
          <label class="field sm"><span>Contenido (o doble clic en el lienzo)</span><textarea rows="5" data-html>${DT.esc(b.html || '')}</textarea></label>` : ''}

        ${t === 'media' ? `
          <h4>Imagen / GIF / Video</h4>
          <label class="btn primary sm file-btn">${DT.icon.upload} Subir archivo<input type="file" accept="image/*,video/*" data-upload hidden></label>
          <label class="field sm"><span>…o pega una URL</span><input data-url value="${DT.esc(b.url || '')}" placeholder="https://…/imagen.gif"></label>` : ''}
        ${t === 'gallery' ? `
          <h4>Galería (${(b.items || []).length})</h4>
          <div class="gal-items">${(b.items || []).map((it, i) => `<div><img data-media="${it.id}" alt="">${it.kind === 'video' ? '<small>video</small>' : ''}<button class="icon-btn sm" data-galdel="${i}">${DT.icon.x}</button></div>`).join('')}</div>
          <label class="btn primary sm file-btn">${DT.icon.plus} Agregar imágenes/videos<input type="file" accept="image/*,video/*" multiple data-galadd hidden></label>` : ''}
        ${t === 'cover' ? `<label class="check"><input type="checkbox" data-p="plain" ${b.plain ? 'checked' : ''}> Ocultar título en la portada</label>` : ''}
        ${media ? `<label class="field sm"><span>Ajuste</span><select data-p="fit"><option value="cover" ${b.fit !== 'contain' ? 'selected' : ''}>Rellenar (recortar)</option><option value="contain" ${b.fit === 'contain' ? 'selected' : ''}>Contener</option></select></label>` : ''}
        ${t === 'shape' ? `
          <h4>Relleno</h4>
          <div class="row nowrap"><input type="color" data-shapecolor value="${b.color && b.color.startsWith('#') ? b.color : '#1a6fd8'}">
          <button class="btn ghost sm" data-shapeprimary>Color del tema</button></div>
          <label class="field sm"><span>Degradado</span><div class="row nowrap"><input type="color" data-sg1 value="#1a6fd8"><input type="color" data-sg2 value="#ff7a18"><button class="btn ghost sm" data-shapegrad>Aplicar</button></div></label>` : ''}`;
      DT.media.hydrate(props);
      bindProps(b);
    }

    function bindProps(b) {
      const apply = () => { clamp(b); draw(); };
      DT.$$('[data-p]', props).forEach((inp) => {
        inp.addEventListener('change', () => {
          snapshot();
          const k = inp.dataset.p;
          if (inp.type === 'checkbox') b[k] = inp.checked;
          else if (inp.type === 'number' || inp.type === 'range') b[k] = parseFloat(inp.value) || 0;
          else b[k] = inp.value;
          apply();
        });
      });
      const on = (sel2, fn) => { const el = props.querySelector(sel2); if (el) el.onclick = fn; };
      DT.$$('[data-shape]', props).forEach((x) => x.onclick = () => { snapshot(); b.shape = x.dataset.shape; draw(); });
      DT.$$('[data-z]', props).forEach((x) => x.onclick = () => {
        snapshot();
        const zs = L.blocks.map((o) => o.z || 1);
        b.z = x.dataset.z === 'up' ? Math.max(...zs) + 1 : Math.max(0, Math.min(...zs) - 1);
        draw();
      });
      on('[data-dup]', () => duplicate(b));
      on('[data-delblk]', () => remove(b));
      on('[data-bgclear]', () => { snapshot(); b.bg = ''; draw(); });
      on('[data-pt-add]', () => { snapshot(); b.points.push([50, 50]); draw(); });
      on('[data-pt-del]', () => { if (b.points.length > 3) { snapshot(); b.points.pop(); draw(); } });
      on('[data-shapeprimary]', () => { snapshot(); b.color = 'var(--primary)'; draw(); });
      on('[data-shapegrad]', () => { snapshot(); b.color = `linear-gradient(135deg, ${props.querySelector('[data-sg1]').value}, ${props.querySelector('[data-sg2]').value})`; draw(); });
      const sc = props.querySelector('[data-shapecolor]');
      if (sc) sc.onchange = () => { snapshot(); b.color = sc.value; draw(); };
      DT.$$('[data-align]', props).forEach((x) => x.onclick = () => { snapshot(); b.align = x.dataset.align; draw(); });
      DT.$$('[data-cmd]', props).forEach((x) => x.onmousedown = (e) => {
        e.preventDefault();
        const el = host.querySelector(`[data-id="${b.id}"] .blk-text`);
        if (!editingText) { el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })); }
        document.execCommand(x.dataset.cmd, false, x.dataset.arg || null);
      });
      const ta = props.querySelector('[data-html]');
      if (ta) ta.onchange = () => { snapshot(); b.html = DT.sanitize(ta.value); draw(); };
      const up = props.querySelector('[data-upload]');
      if (up) up.onchange = async () => {
        const f = up.files[0]; if (!f) return;
        snapshot();
        const m = await DT.media.add(f);
        b.mediaId = m.id; b.mediaKind = m.kind; b.url = '';
        draw();
      };
      const url = props.querySelector('[data-url]');
      if (url) url.onchange = () => { snapshot(); b.url = url.value.trim(); b.mediaId = ''; b.mediaKind = /\.(mp4|webm|ogg)(\?|$)/i.test(b.url) ? 'video' : 'image'; draw(); };
      const ga = props.querySelector('[data-galadd]');
      if (ga) ga.onchange = async () => {
        snapshot();
        b.items = b.items || [];
        for (const f of ga.files) { const m = await DT.media.add(f); b.items.push({ id: m.id, kind: m.kind }); }
        draw();
      };
      DT.$$('[data-galdel]', props).forEach((x) => x.onclick = () => { snapshot(); b.items.splice(+x.dataset.galdel, 1); draw(); });
    }

    /* ---------- Acciones ---------- */
    const add = (type) => {
      snapshot();
      const b = { id: DT.uid('b'), type, x: 40, y: 40, w: 300, h: 200, z: Math.max(0, ...L.blocks.map((o) => o.z || 1)) + 1, shape: 'rect' };
      if (type === 'text') Object.assign(b, { w: 400, h: 140, html: '<h2>Título</h2><p>Escribe aquí tu texto. Doble clic para editar.</p>' });
      if (type === 'shape') Object.assign(b, { w: 160, h: 160, shape: 'hexagon', color: 'var(--primary)', opacity: .8 });
      if (type === 'achievements') Object.assign(b, { w: 360, h: 320 });
      if (type === 'play') Object.assign(b, { w: 360, h: 70 });
      if (type === 'media') Object.assign(b, { shape: 'slant' });
      // Coloca el bloque visible en el área de trabajo actual
      const stage = DT.$('[data-stage]', app);
      b.y = Math.max(0, Math.round(stage.scrollTop / scale() + 20));
      clamp(b);
      L.blocks.push(b);
      sel = b.id;
      draw();
    };
    const duplicate = (b) => { snapshot(); const c = clone(b); c.id = DT.uid('b'); c.x += 20; c.y += 20; c.z = (b.z || 1) + 1; clamp(c); L.blocks.push(c); sel = c.id; draw(); };
    const remove = (b) => { snapshot(); L.blocks = L.blocks.filter((o) => o !== b); sel = null; draw(); };

    DT.$$('[data-add]', app).forEach((x) => x.onclick = () => add(x.dataset.add));
    DT.$('[data-canvas-h]', app).onchange = (e) => {
      snapshot();
      const minH = Math.max(200, ...L.blocks.map((b) => b.y + b.h));
      L.height = Math.max(minH, Math.min(4000, parseInt(e.target.value, 10) || 500));
      e.target.value = L.height;
      draw();
    };
    DT.$('[data-canvas-bgc]', app).onchange = (e) => { snapshot(); L.bg = e.target.value; draw(); };
    DT.$('[data-canvas-bgclear]', app).onclick = () => { snapshot(); L.bg = ''; draw(); };
    DT.$('[data-canvas-grad]', app).onclick = () => { snapshot(); L.bg = `linear-gradient(160deg, ${DT.$('[data-g1]', app).value}, ${DT.$('[data-g2]', app).value})`; draw(); };
    DT.$('[data-undo]', app).onclick = () => { if (history.length) { L = JSON.parse(history.pop()); sel = null; draw(); } };
    DT.$('[data-template]', app).onclick = async () => {
      if (!(await DT.confirm('Restablecer plantilla', 'Se reemplazará el diseño actual por la plantilla por defecto.'))) return;
      snapshot();
      L = clone(which === 'tienda' ? DT.defaultStoreLayout(g) : DT.defaultLibraryLayout(g));
      sel = null; draw();
    };
    DT.$('[data-preview]', app).onclick = (e) => { preview = !preview; e.currentTarget.classList.toggle('on', preview); sel = null; draw(); };
    const save = () => {
      g[key] = clone(L);
      dirty = false;
      DT.save();
      DT.toast(`${DT.icon.check} Página de ${which} guardada.`, { kind: 'ok' });
    };
    DT.$('[data-save]', app).onclick = save;

    const onKey = (e) => {
      if (editingText || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      const b = block(sel);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); DT.$('[data-undo]', app).click(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); return; }
      if (!b) return;
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); remove(b); }
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') { e.preventDefault(); duplicate(b); }
      else if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        snapshot();
        const d = e.shiftKey ? GRID : 1;
        if (e.key === 'ArrowLeft') b.x -= d; if (e.key === 'ArrowRight') b.x += d;
        if (e.key === 'ArrowUp') b.y -= d; if (e.key === 'ArrowDown') b.y += d;
        clamp(b); draw();
      }
    };
    document.addEventListener('keydown', onKey);
    const beforeUnload = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    addEventListener('beforeunload', beforeUnload);
    DT.setLeaveGuard({ label: 'la página de ' + which + ' de ' + g.title, isDirty: () => dirty, save: () => { save(); return true; }, discard: () => { dirty = false; } });

    draw();
    return () => {
      document.removeEventListener('keydown', onKey);
      removeEventListener('beforeunload', beforeUnload);
      if (dirty) { g[key] = clone(L); DT.save(); DT.toast('Cambios del editor guardados automáticamente.'); }
    };
  };
})(window.DT);
