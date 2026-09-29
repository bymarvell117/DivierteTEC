/* DivierteTEC — motor de layouts personalizados (páginas de tienda y biblioteca).
   Un layout es { height, bg, blocks[] } sobre un lienzo lógico de 1000px de ancho que
   se escala para caber en cualquier pantalla. Cada bloque tiene posición, tamaño,
   rotación, capa (z) y forma (clip-path): rectángulo, círculo, triángulo, hexágono,
   rombo, estrella, paralelogramo o un polígono personalizado. */
(function (DT) {
  'use strict';

  DT.SHAPES = {
    rect: { name: 'Rectángulo', clip: '' },
    rounded: { name: 'Redondeado', clip: '' },
    circle: { name: 'Círculo / elipse', clip: 'ellipse(50% 50% at 50% 50%)' },
    triangle: { name: 'Triángulo', clip: 'polygon(50% 0%, 100% 100%, 0% 100%)' },
    diamond: { name: 'Rombo', clip: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
    hexagon: { name: 'Hexágono', clip: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
    star: { name: 'Estrella', clip: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
    parallelogram: { name: 'Paralelogramo', clip: 'polygon(18% 0%, 100% 0%, 82% 100%, 0% 100%)' },
    slant: { name: 'Corte diagonal', clip: 'polygon(0% 0%, 100% 0%, 100% 78%, 0% 100%)' },
    custom: { name: 'Personalizada (polígono)', clip: '' }
  };

  DT.BLOCK_TYPES = {
    text: { name: 'Texto', icon: 'text' },
    media: { name: 'Imagen / GIF / Video', icon: 'image' },
    gallery: { name: 'Galería', icon: 'layers' },
    cover: { name: 'Portada del juego', icon: 'grid' },
    shape: { name: 'Forma decorativa', icon: 'shapes' },
    achievements: { name: 'Lista de logros', icon: 'trophy' },
    play: { name: 'Botón Jugar / Obtener', icon: 'play' }
  };

  DT.DEFAULT_POINTS = [[10, 0], [100, 15], [85, 100], [0, 80]];
  DT.clipFor = (b) => {
    if (b.shape === 'custom' && !(b.points && b.points.length >= 3)) b.points = DT.DEFAULT_POINTS.map((p) => p.slice());
    if (b.shape === 'custom') return 'polygon(' + b.points.map((p) => p[0] + '% ' + p[1] + '%').join(', ') + ')';
    return (DT.SHAPES[b.shape] || {}).clip || '';
  };

  /* Sanitizador simple (lista blanca) para el HTML de los bloques de texto */
  const OK_TAGS = /^(H1|H2|H3|H4|P|B|I|U|S|STRONG|EM|SPAN|BR|UL|OL|LI|A|DIV|BLOCKQUOTE|SMALL|MARK|FONT|HR)$/;
  DT.sanitize = (html) => {
    const t = document.createElement('template');
    t.innerHTML = String(html || '');
    const walk = (node) => {
      Array.from(node.children).forEach((el) => {
        if (!OK_TAGS.test(el.tagName)) { el.replaceWith(document.createTextNode(el.textContent)); return; }
        Array.from(el.attributes).forEach((a) => {
          const n = a.name.toLowerCase();
          if (!['style', 'href', 'color', 'size', 'align'].includes(n)) el.removeAttribute(a.name);
          else if (/javascript:|expression\(|url\(/i.test(a.value)) el.removeAttribute(a.name);
        });
        if (el.tagName === 'A') { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener'); }
        walk(el);
      });
    };
    walk(t.content);
    return t.innerHTML;
  };

  const filterFor = (b) => {
    const f = [];
    const bw = Number(b.borderW) || 0;
    if (bw > 0) {
      const c = b.borderC || '#ffffff';
      f.push(`drop-shadow(${bw}px 0 0 ${c})`, `drop-shadow(-${bw}px 0 0 ${c})`, `drop-shadow(0 ${bw}px 0 ${c})`, `drop-shadow(0 -${bw}px 0 ${c})`);
    }
    if (b.shadow) f.push('drop-shadow(0 10px 18px rgba(0,0,0,.35))');
    return f.join(' ');
  };

  /* Contenido interno de un bloque según su tipo */
  const inner = (b, g, ctx) => {
    const fit = b.fit || 'cover';
    switch (b.type) {
      case 'text':
        return `<div class="blk-text" style="${b.color ? 'color:' + DT.esc(b.color) + ';' : ''}${b.align ? 'text-align:' + DT.esc(b.align) + ';' : ''}${b.fontSize ? 'font-size:' + Number(b.fontSize) + 'px;' : ''}">${DT.sanitize(b.html)}</div>`;
      case 'media': {
        if (!b.mediaId && !b.url) return `<div class="blk-empty">${DT.icon.image}<span>Sin imagen</span></div>`;
        const src = b.mediaId ? `data-media="${DT.esc(b.mediaId)}"` : `src="${DT.esc(b.url)}"`;
        return b.mediaKind === 'video'
          ? `<video ${src} autoplay muted loop playsinline style="object-fit:${fit}"></video>`
          : `<img ${src} alt="" style="object-fit:${fit}" draggable="false">`;
      }
      case 'gallery': {
        const items = b.items || [];
        if (!items.length) return `<div class="blk-empty">${DT.icon.layers}<span>Galería vacía</span></div>`;
        return `<div class="blk-gallery" data-gallery>${items.map((it, i) => it.kind === 'video'
          ? `<video data-media="${DT.esc(it.id)}" autoplay muted loop playsinline class="${i ? '' : 'on'}" style="object-fit:${fit}"></video>`
          : `<img data-media="${DT.esc(it.id)}" alt="" class="${i ? '' : 'on'}" style="object-fit:${fit}" draggable="false">`).join('')}</div>`;
      }
      case 'cover':
        return DT.coverHTML(g, 'fill' + (b.plain ? ' plain' : ''));
      case 'shape':
        return `<div class="blk-fill" style="background:${DT.esc(b.color || 'var(--primary)')}"></div>`;
      case 'achievements': {
        const uid = ctx.uid;
        const mine = uid ? DT.userAch(uid, g.id) : {};
        const list = g.achievements || [];
        return `<div class="blk-ach"><h4>${DT.icon.trophy} Logros (${list.length})</h4>${list.map((a) => {
          const got = mine[a.id] && mine[a.id].unlockedAt;
          const hidden = a.hidden && !got;
          const r = a.reward && DT.reward(a.reward);
          return `<div class="ach-row ${got ? 'got' : ''}"><span class="ach-ico">${hidden ? '❔' : DT.esc(a.icon || '🏆')}</span>
            <div><b>${hidden ? 'Logro oculto' : DT.esc(a.name)}</b><small>${hidden ? 'Sigue jugando para descubrirlo.' : DT.esc(a.desc || '')}</small></div>
            ${r && !hidden ? `<span class="ach-reward" title="${DT.esc(r.name)}">${DT.esc(r.glyph)}</span>` : ''}</div>`;
        }).join('') || '<p class="muted">Este juego aún no tiene logros.</p>'}</div>`;
      }
      case 'play':
        return `<div class="blk-play">${ctx.playHTML ? ctx.playHTML(g) : `<button class="btn primary big">${DT.icon.play} Jugar</button>`}</div>`;
    }
    return '';
  };

  DT.blockHTML = (b, g, ctx) => {
    ctx = ctx || {};
    const clip = DT.clipFor(b);
    const radius = b.shape === 'rounded' ? (Number(b.radius) || 14) + 'px' : '0';
    const style = [
      `left:${b.x}px`, `top:${b.y}px`, `width:${b.w}px`, `height:${b.h}px`, `z-index:${b.z || 1}`,
      `transform:rotate(${Number(b.rot) || 0}deg)`, `opacity:${b.opacity == null ? 1 : b.opacity}`
    ].join(';');
    const shapeStyle = [clip ? `clip-path:${clip}` : '', `border-radius:${radius}`, b.bg ? `background:${DT.esc(b.bg)}` : ''].filter(Boolean).join(';');
    const needsClip = b.type !== 'text' && b.type !== 'achievements' && b.type !== 'play';
    return `<div class="blk blk-${b.type}" data-id="${DT.esc(b.id)}" style="${style}">
      <div class="blk-shadow" style="filter:${filterFor(b)}">
        <div class="blk-shape ${needsClip ? '' : 'noclip'}" style="${shapeStyle}">${inner(b, g, ctx)}</div>
      </div>${ctx.editable ? '<span class="blk-handle" data-resize></span>' : ''}</div>`;
  };

  /* Renderiza un layout completo dentro de `host` y lo mantiene escalado */
  DT.renderLayout = (host, layout, g, ctx) => {
    ctx = ctx || {};
    layout = layout || { height: 400, blocks: [] };
    host.classList.add('layout-wrap');
    host.innerHTML = `<div class="layout-canvas" style="height:${layout.height}px;${layout.bg ? 'background:' + DT.esc(layout.bg) : ''}">
      ${(layout.blocks || []).map((b) => DT.blockHTML(b, g, ctx)).join('')}</div>`;
    const canvas = host.firstElementChild;
    const fit = () => {
      const s = Math.min(1, host.clientWidth / DT.LAYOUT_W) || 1;
      canvas.style.transform = `scale(${s})`;
      host.style.height = layout.height * s + 'px';
    };
    fit();
    if (host._ro) host._ro.disconnect();
    host._ro = new ResizeObserver(fit);
    host._ro.observe(host);
    DT.media.hydrate(host);
    DT.startGalleries(host);
    return canvas;
  };

  /* Galerías: rotan cada 3 s */
  DT.startGalleries = (root) => {
    DT.$$('[data-gallery]', root).forEach((gal) => {
      if (gal._t) return;
      const items = gal.children;
      if (items.length < 2) return;
      let i = 0;
      gal._t = setInterval(() => {
        if (!document.body.contains(gal)) { clearInterval(gal._t); return; }
        items[i].classList.remove('on');
        i = (i + 1) % items.length;
        items[i].classList.add('on');
      }, 3000);
    });
  };
})(window.DT);
