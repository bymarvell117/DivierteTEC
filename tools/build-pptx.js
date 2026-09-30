/* Genera la versión editable en PowerPoint de la presentación del jurado:
   presentacion/DivierteTEC-presentacion.pptx (13 diapositivas, 16:9).
   Textos, formas y diagramas son nativos y editables; las capturas salen de
   presentacion/img/ y las notas del orador de los <aside> de presentacion/index.html.
   Requiere: npm install pptxgenjs react-icons react react-dom sharp
   Uso: node tools/build-pptx.js */
const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const sharp = require('sharp');
const Lu = require('react-icons/lu');

const ROOT = path.join(__dirname, '..', 'presentacion');
const IMG = (n) => path.join(ROOT, 'img', n + '.jpg');
const OUT = path.join(ROOT, 'DivierteTEC-presentacion.pptx');

const C = { navy: '0B1A3A', ink: '13203A', blue: '1A6FD8', blue2: '3D8FFF', yellow: 'FFD23F', green: '1F8A4C', pink: 'E0467C', bg: 'F3F6FB', muted: '5A6A86', line: 'D9E2F1', white: 'FFFFFF', paleBlue: 'E6F0FF', palePink: 'FDECF2', paleGreen: 'EEFAF2', purple: '7C3AED', teal: '0F766E' };
const FONT = 'Arial';

/* Notas del orador: los <aside> del HTML, en orden */
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const NOTES = [...html.matchAll(/<aside>([\s\S]*?)<\/aside>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());

/* Iconos de react-icons rasterizados a PNG */
async function icon(name, color = '#FFFFFF', size = 256) {
  const Comp = Lu[name] || Lu.LuCircle;
  const svg = renderToStaticMarkup(React.createElement(Comp, { color, size: String(size) }));
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + png.toString('base64');
}

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE'; // 13.33 × 7.5 in
  pres.title = 'DivierteTEC · Presentación HackaTec 2026';
  pres.author = 'Equipo Maravilla';
  const W = 13.333, H = 7.5, M = 0.6;

  const txt = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, fontFace: FONT, color: C.ink, margin: 0, valign: 'top' }, o));
  const shadow = () => ({ type: 'outer', color: '0B1A3A', blur: 18, offset: 6, angle: 90, opacity: 0.22 });
  const shot = (s, name, x, y, w) => s.addImage({ path: IMG(name), x, y, w, h: w / 1.6, shadow: shadow() });
  const footer = (s, n, dark) => {
    txt(s, [{ text: 'Divierte', options: { color: dark ? C.white : C.navy } }, { text: 'TEC', options: { color: C.blue2 } }], { x: M, y: H - 0.5, w: 3, h: 0.3, fontSize: 11, bold: true });
    if (n) txt(s, String(n), { x: W - M - 1, y: H - 0.5, w: 1, h: 0.3, fontSize: 11, color: dark ? 'B8C6E0' : C.muted, align: 'right' });
  };
  const head = (s, kicker, plain, em) => {
    txt(s, kicker.toUpperCase(), { x: M, y: 0.45, w: 9, h: 0.3, fontSize: 13, bold: true, color: C.blue, charSpacing: 4 });
    txt(s, [{ text: plain }, { text: em, options: { color: C.blue } }], { x: M, y: 0.8, w: W - 2 * M, h: 0.85, fontSize: 38, bold: true, color: C.navy, valign: 'middle' });
  };
  const slide = (bg) => { const s = pres.addSlide(); s.background = { color: bg || C.bg }; return s; };
  const iconCircle = async (s, ic, x, y, d, fill) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill || C.blue }, line: { color: fill || C.blue } });
    s.addImage({ data: await icon(ic), x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52 });
  };
  const chip = (s, text, x, y, fill, color) => {
    const w = 0.22 + text.length * 0.115;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.46, fill: { color: fill }, line: { color: fill } });
    txt(s, text, { x, y, w, h: 0.46, fontSize: 15, bold: true, color: color || C.white, align: 'center', valign: 'middle' });
  };
  const mosaic = (s, names) => {
    names.forEach((n, i) => s.addImage({ path: IMG(n), x: (i % 3) * 4.45, y: Math.floor(i / 3) * 2.78, w: 4.45, h: 2.78, transparency: 70 }));
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.navy, transparency: 18 }, line: { color: C.navy, transparency: 100 } });
  };
  let n = 0;
  const notes = (s) => s.addNotes(NOTES[n++] || '');

  /* 1 · Portada */
  {
    const s = slide(C.navy);
    mosaic(s, ['landing', 'furia', 'tienda', 'aerodron', 'biblioteca', 'juego', 'perfil', 'editor', 'pase']);
    s.addShape(pres.shapes.RECTANGLE, { x: M, y: 2.35, w: 1.35, h: 1.35, fill: { color: C.blue }, line: { color: C.blue } });
    txt(s, 'D', { x: M, y: 2.35, w: 1.35, h: 1.35, fontSize: 70, bold: true, color: C.white, align: 'center', valign: 'middle' });
    txt(s, [{ text: 'Divierte', options: { color: C.white } }, { text: 'TEC', options: { color: C.blue2 } }], { x: 2.2, y: 2.2, w: 9, h: 1.6, fontSize: 96, bold: true, valign: 'middle' });
    txt(s, 'Hecho en el TecNM. Jugado en todo México.', { x: M, y: 3.95, w: 10, h: 0.6, fontSize: 28, bold: true, color: 'DCE7FF' });
    [['RETO', 'Tecnologías para el Entretenimiento', M, 4.8, 4.4], ['TEMÁTICA', 'Impulso de la industria del Entretenimiento en México', 5.2, 4.8, 6.6]].forEach(([k, v, x, y, w]) => {
      s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.5, fill: { color: C.navy, transparency: 30 }, line: { color: '6F83AA', width: 1 } });
      txt(s, [{ text: k + '  ', options: { color: C.blue2, bold: true, fontSize: 11, charSpacing: 2 } }, { text: v, options: { color: C.white, fontSize: 15 } }], { x: x + 0.18, y, w: w - 0.3, h: 0.5, valign: 'middle' });
    });
    txt(s, 'Equipo Maravilla · Instituto Tecnológico Superior de Irapuato', { x: M, y: H - 0.55, w: 8, h: 0.3, fontSize: 12, color: 'B8C6E0' });
    txt(s, 'HackaTec Regional 2026', { x: W - M - 4, y: H - 0.55, w: 4, h: 0.3, fontSize: 12, color: 'B8C6E0', align: 'right' });
    notes(s);
  }

  /* 2 · Problema */
  {
    const s = slide();
    head(s, 'El problema', 'México juega mucho, ', 'pero produce poco');
    const stats = [['39', 'mil millones de pesos', 'Mercado de videojuegos en México, 2023 · Statista (vía El Universal)'], ['67', 'empresas de videojuegos', '≈2,400 empleos en todo el país · Endeavor (vía DPL News)'], ['2.2', 'horas al día', 'Juega quien juega videojuegos · IFT, ENCCA 2024']];
    stats.forEach(([big, lab, src], i) => {
      const x = M + i * 4.1;
      s.addShape(pres.shapes.RECTANGLE, { x, y: 2.0, w: 3.8, h: 3.0, fill: { color: C.white }, line: { color: C.line }, shadow: shadow() });
      txt(s, big, { x: x + 0.35, y: 2.25, w: 3.2, h: 1.3, fontSize: 80, bold: true, color: C.blue, valign: 'middle' });
      txt(s, lab, { x: x + 0.35, y: 3.6, w: 3.2, h: 0.5, fontSize: 18, bold: true, color: C.navy });
      txt(s, src, { x: x + 0.35, y: 4.2, w: 3.2, h: 0.7, fontSize: 11, color: C.muted });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: M, y: 5.45, w: W - 2 * M, h: 0.9, fill: { color: C.navy }, line: { color: C.navy } });
    txt(s, [{ text: 'Hay público. Falta ', options: { color: C.white } }, { text: 'una vitrina para el talento estudiantil', options: { color: C.yellow } }, { text: '.', options: { color: C.white } }], { x: M + 0.35, y: 5.45, w: W - 2 * M - 0.7, h: 0.9, fontSize: 24, bold: true, valign: 'middle' });
    footer(s, 2); notes(s);
  }

  /* 3 · Esto es DivierteTEC */
  {
    const s = slide();
    txt(s, 'LA SOLUCIÓN', { x: M, y: 1.9, w: 4, h: 0.3, fontSize: 13, bold: true, color: C.blue, charSpacing: 4 });
    txt(s, [{ text: 'Esto es', options: { breakLine: true } }, { text: 'DivierteTEC', options: { color: C.blue } }], { x: M, y: 2.25, w: 4.3, h: 1.6, fontSize: 40, bold: true, color: C.navy });
    txt(s, 'La tienda de videojuegos de los estudiantes del TecNM.', { x: M, y: 3.95, w: 3.8, h: 1, fontSize: 20, color: C.ink });
    shot(s, 'landing', 5.1, 0.9, 7.6);
    chip(s, 'Juega en 1 clic', 4.6, 1.5, C.blue);
    chip(s, 'Sitio web · prototipo sin conexión', 8.6, 5.2, C.green);
    chip(s, 'Hecho en el TecNM', 4.8, 5.75, C.navy);
    footer(s, 3); notes(s);
  }

  /* 4 · Juegos */
  {
    const s = slide();
    head(s, 'Juegos reales, jugables hoy', 'De 2D a ', '3D en el navegador');
    shot(s, 'aerodron', M, 2.75, 4.2);
    shot(s, 'juego', W - M - 4.2, 2.75, 4.2);
    shot(s, 'furia', 3.9, 2.35, 5.5);
    chip(s, 'Aerodron 3D', M, 2.25, C.blue);
    chip(s, 'Furia TEC', 5.95, 1.85, C.navy);
    chip(s, 'Mecaquack', W - M - 1.4, 2.25, C.green);
    txt(s, '7 juegos del Equipo Maravilla · motores 3D propios en WebGL · mandos con vibración', { x: M, y: 6.25, w: W - 2 * M, h: 0.4, fontSize: 15, color: C.muted, align: 'center' });
    footer(s, 4); notes(s);
  }

  /* 5–7 · Lista con iconos + capturas en cascada */
  const listSlide = async (num, kicker, plain, em, items, imgs, cap) => {
    const s = slide();
    head(s, kicker, plain, em);
    for (let i = 0; i < items.length; i++) {
      const y = 2.05 + i * 0.95;
      await iconCircle(s, items[i][0], M, y, 0.7);
      txt(s, items[i][1], { x: M + 0.95, y, w: 4.4, h: 0.7, fontSize: 21, bold: true, color: C.navy, valign: 'middle' });
    }
    imgs.forEach((im, i) => shot(s, im, 6.5 + i * 0.5, 1.8 + i * 0.75, 5.2));
    if (cap) txt(s, cap, { x: M, y: 6.1, w: 5.4, h: 0.6, fontSize: 13, color: C.muted });
    footer(s, num); notes(s);
  };
  await listSlide(5, 'Para jugadores', 'Como Steam, ', 'pero nuestro', [['LuShoppingBag', 'Tienda y biblioteca'], ['LuTrophy', 'Logros con recompensas'], ['LuStar', 'Reseñas tras 2 h de juego'], ['LuHeart', 'Paga lo que quieras']], ['tienda', 'biblioteca', 'perfil']);
  await listSlide(6, 'Para estudios', 'Publicar es ', 'gratis y rápido', [['LuUpload', 'Sube HTML5, C++ o EXE'], ['LuLayoutTemplate', 'Diseña su página'], ['LuShieldCheck', 'Revisión de contenido'], ['LuChartLine', 'Ventas y estadísticas']], ['editor', 'revision', 'ventas'], 'Logros con una línea de código · prueba antes de publicar');
  await listSlide(7, 'Confianza', 'Cuentas ', 'verificadas', [['LuCode', 'Solicitud para ser dev'], ['LuIdCard', 'Trabajo, motivo e identidad'], ['LuGraduationCap', 'Verificación TecNM'], ['LuGift', 'Beneficios exclusivos']], ['solicitud', 'verificacion', 'solicitudes'], 'Correo institucional + número de control + credencial · la administración aprueba con criterios');

  /* 8 · Diagrama de flujo (formas y conectores nativos) */
  {
    const s = slide();
    head(s, 'Diagrama de flujo', 'Cómo ', 'fluye DivierteTEC');
    const lanes = [['ESTUDIO', C.purple, 1.85, 1.35], ['ADMIN', C.teal, 3.35, 1.35], ['JUGADOR', C.blue, 4.85, 1.45]];
    lanes.forEach(([t, col, y, h]) => {
      s.addShape(pres.shapes.RECTANGLE, { x: M, y, w: W - 2 * M, h, fill: { color: C.white }, line: { color: C.line } });
      s.addShape(pres.shapes.RECTANGLE, { x: M, y, w: 1.3, h, fill: { color: col }, line: { color: col } });
      txt(s, t, { x: M, y, w: 1.3, h, fontSize: 13, bold: true, color: C.white, align: 'center', valign: 'middle', charSpacing: 2 });
    });
    const node = (t, x, y, w, style, sub) => {
      const fill = { solid: style.fill, line: style.line };
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.62, rectRadius: 0.08, fill: { color: fill.solid }, line: { color: fill.line, width: 1.5 } });
      txt(s, sub ? [{ text: t, options: { breakLine: true } }, { text: sub, options: { fontSize: 10, color: style.dark ? 'DCE7FF' : C.muted, bold: false } }] : t, { x, y, w, h: 0.62, fontSize: 14, bold: true, color: style.dark ? C.white : C.navy, align: 'center', valign: 'middle' });
    };
    const P = { fill: 'F1EBFF', line: C.purple }, PD = { fill: C.purple, line: C.purple, dark: true }, T = { fill: 'E3F5F2', line: C.teal }, TD = { fill: C.teal, line: C.teal, dark: true }, B = { fill: C.paleBlue, line: C.blue }, BD = { fill: C.blue, line: C.blue, dark: true };
    const X = [2.2, 4.8, 7.4, 10.0], NW = 2.3;
    const arrow = (x1, y1, x2, y2, color, dash, arrowEnd = true) => s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipH: x2 < x1, flipV: y2 < y1, line: { color: color || C.blue, width: 2.25, dashType: dash ? 'dash' : 'solid', endArrowType: arrowEnd ? 'triangle' : 'none' } });
    const yS = 2.21, yA = 3.71, yJ = 5.26;
    node('Sube su juego', X[0], yS, NW, P, 'cuenta de dev aprobada'); node('Logros con SDK', X[1], yS, NW, P); node('Diseña su página', X[2], yS, NW, P); node('Envía a revisión', X[3], yS, NW, PD);
    for (let i = 0; i < 3; i++) arrow(X[i] + NW, yS + 0.31, X[i + 1], yS + 0.31);
    node('10 criterios', X[3], yA, NW, T, 'de contenido · 4 automáticos'); node('¿Aprobado?', X[2], yA, NW, TD);
    arrow(X[3] + NW / 2, yS + 0.62, X[3] + NW / 2, yA);
    arrow(X[3], yA + 0.31, X[2] + NW, yA + 0.31);
    arrow(X[2], yA + 0.31, X[0] + NW / 2, yA + 0.31, C.pink, true, false);
    arrow(X[0] + NW / 2, yA + 0.31, X[0] + NW / 2, yS + 0.62, C.pink, true);
    txt(s, 'No: pide cambios', { x: X[0] + NW / 2 + 0.15, y: yA - 0.05, w: 2.2, h: 0.3, fontSize: 12, bold: true, color: C.pink });
    node('Tienda', X[0], yJ, NW, B); node('Juega al instante', X[1], yJ, NW, BD); node('Paga lo que quieras', X[2], yJ, NW, B, 'o con el Pase'); node('Logros y reseña', X[3], yJ, NW, B, 'reseña tras 2 h de juego');
    for (let i = 0; i < 3; i++) arrow(X[i] + NW, yJ + 0.31, X[i + 1], yJ + 0.31);
    arrow(X[2] + NW / 2, yA + 0.62, X[2] + NW / 2, 4.77, C.teal, false, false);
    arrow(X[2] + NW / 2, 4.77, X[0] + NW / 2, 4.77, C.teal, false, false);
    arrow(X[0] + NW / 2, 4.77, X[0] + NW / 2, yJ, C.teal);
    txt(s, 'Sí: se publica', { x: X[2] + NW / 2 + 0.12, y: 4.38, w: 1.8, h: 0.28, fontSize: 12, bold: true, color: C.teal });
    const xr = W - M - 0.12;
    arrow(X[3] + NW, yJ + 0.31, xr, yJ + 0.31, C.pink, true, false);
    arrow(xr, yJ + 0.31, xr, yS + 0.31, C.pink, true, false);
    arrow(xr, yS + 0.31, X[3] + NW, yS + 0.31, C.pink, true);
    txt(s, 'Ingresos y opiniones regresan al estudio', { x: 7.2, y: 6.38, w: xr - 7.2, h: 0.3, fontSize: 12, bold: true, color: C.pink, align: 'right' });
    footer(s, 8); notes(s);
  }

  /* 9 · Prueba y error */
  {
    const s = slide();
    head(s, 'Proceso de desarrollo', 'Así lo construimos: ', 'prueba y error');
    const cx = 3.35, cy = 4.25, r = 1.75;
    s.addShape(pres.shapes.OVAL, { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fill: { color: C.bg }, line: { color: C.blue, width: 4 } });
    // flechas del ciclo (sentido horario) en las diagonales
    [[45, 135], [135, 225], [225, 315], [315, 45]].forEach(([deg, rot]) => {
      const a = deg * Math.PI / 180, x = cx + r * Math.sin(a), y = cy - r * Math.cos(a);
      s.addShape(pres.shapes.ISOSCELES_TRIANGLE, { x: x - 0.17, y: y - 0.17, w: 0.34, h: 0.34, rotate: rot, fill: { color: C.blue }, line: { color: C.blue } });
    });
    const ln = (t, x, y, bad) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - 0.8, y: y - 0.3, w: 1.6, h: 0.6, rectRadius: 0.1, fill: { color: bad ? C.palePink : C.white }, line: { color: bad ? C.pink : C.blue, width: 2 } });
      txt(s, t, { x: x - 0.8, y: y - 0.3, w: 1.6, h: 0.6, fontSize: 20, bold: true, color: bad ? 'B4234F' : C.navy, align: 'center', valign: 'middle' });
    };
    ln('Idea', cx, cy - r); ln('Probar', cx + r, cy); ln('Falla', cx, cy + r, true); ln('Ajustar', cx - r, cy);
    txt(s, 'se repite\nhasta que\nfunciona', { x: cx - 0.9, y: cy - 0.55, w: 1.8, h: 1.1, fontSize: 17, bold: true, color: C.muted, align: 'center', valign: 'middle' });
    // camino de intentos
    const pts = [[20, 380], [62, 350], [104, 330], [146, 366], [188, 320], [230, 290], [272, 270], [314, 318], [356, 255], [398, 230], [440, 272], [482, 200], [524, 160], [566, 118], [612, 72]];
    const fails = new Set([3, 7, 10]);
    const ox = 6.55, oy = 1.95, k = 6.0 / 640;
    const P = pts.map(([x, y]) => [ox + x * k, oy + y * k]);
    for (let i = 0; i < P.length - 1; i++) {
      const [x1, y1] = P[i], [x2, y2] = P[i + 1];
      s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipV: y2 < y1, line: { color: C.blue, width: 3.5 } });
    }
    P.slice(0, -1).forEach(([x, y], i) => {
      const bad = fails.has(i), d = bad ? 0.3 : 0.2;
      s.addShape(pres.shapes.OVAL, { x: x - d / 2, y: y - d / 2, w: d, h: d, fill: { color: bad ? C.pink : C.blue }, line: { color: C.white, width: 1.5 } });
      if (bad) txt(s, '✕', { x: x - d / 2, y: y - d / 2, w: d, h: d, fontSize: 11, bold: true, color: C.white, align: 'center', valign: 'middle' });
    });
    const [gx, gy] = P[P.length - 1];
    s.addShape(pres.shapes.OVAL, { x: gx - 0.25, y: gy - 0.25, w: 0.5, h: 0.5, fill: { color: C.green }, line: { color: C.white, width: 2 } });
    txt(s, '✓', { x: gx - 0.25, y: gy - 0.25, w: 0.5, h: 0.5, fontSize: 20, bold: true, color: C.white, align: 'center', valign: 'middle' });
    txt(s, 'DivierteTEC', { x: gx - 1.6, y: gy - 0.72, w: 2.1, h: 0.35, fontSize: 18, bold: true, color: C.navy, align: 'right' });
    txt(s, 'Muchos intentos, varios tropiezos y un resultado que ya funciona.', { x: 4.6, y: 6.3, w: W - M - 4.6, h: 0.4, fontSize: 16, bold: true, color: C.muted, align: 'right' });
    footer(s, 9); notes(s);
  }

  /* 10 · Modelo de negocio */
  {
    const s = slide();
    head(s, 'Modelo de negocio', 'Ganamos ', 'cuando el estudio gana');
    const tiles = [['$0+', 'Paga lo que quieras', 'Se juega sin pagar; quien quiere, apoya al estudio.'], ['0 %', 'Semilla TEC', 'Las 3 primeras semanas de cada juego TecNM sin comisión; luego 12 %.'], ['70 %', 'Pase mensual', 'De cada suscripción va a los estudios, según el tiempo jugado.'], ['+', 'Destacados', 'Los estudios pueden pagar por aparecer en portada.'], ['5 %', 'Parque Irekua', 'De cada venta, lo absorbemos de nuestra comisión para educación ambiental.']];
    const tw = (W - 2 * M - 4 * 0.2) / 5;
    tiles.forEach(([big, t, d], i) => {
      const x = M + i * (tw + 0.2), eco = i === 4;
      s.addShape(pres.shapes.RECTANGLE, { x, y: 1.9, w: tw, h: 2.7, fill: { color: eco ? C.paleGreen : C.white }, line: { color: eco ? C.green : C.line, width: eco ? 1.5 : 1 } });
      txt(s, big, { x: x + 0.22, y: 2.05, w: tw - 0.4, h: 0.85, fontSize: 44, bold: true, color: eco ? C.green : C.blue, valign: 'middle' });
      txt(s, t, { x: x + 0.22, y: 2.95, w: tw - 0.4, h: 0.62, fontSize: 16, bold: true, color: C.navy, valign: 'middle' });
      txt(s, d, { x: x + 0.22, y: 3.62, w: tw - 0.4, h: 0.9, fontSize: 11.5, color: C.muted });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: M, y: 4.8, w: W - 2 * M, h: 1.8, fill: { color: C.navy }, line: { color: C.navy } });
    txt(s, 'ANTECEDENTES · MODELOS QUE YA FUNCIONAN', { x: M + 0.3, y: 4.97, w: 8, h: 0.3, fontSize: 12, bold: true, color: C.yellow, charSpacing: 3 });
    const ant = [['itch.io', '«Paga lo que quieras» desde $0; el creador decide la comisión (10 % por defecto).'], ['Humble Bundle', 'Desde 2010 vende juegos indie a «paga lo que quieras».'], ['Epic Games Store', 'Cobra 12 % y atrajo estudios con esa comisión baja.'], ['Steam', 'La referencia: 30 % en su tramo estándar. Nosotros: 0 % a 12 %.']];
    const aw = (W - 2 * M - 0.6) / 4;
    ant.forEach(([t, d], i) => txt(s, [{ text: t, options: { bold: true, fontSize: 17, color: C.white, breakLine: true } }, { text: d, options: { fontSize: 12, color: 'DCE7FF' } }], { x: M + 0.3 + i * aw, y: 5.38, w: aw - 0.25, h: 1.15 }));
    footer(s, 10); notes(s);
  }

  /* 11 · SCAMPER */
  {
    const s = slide();
    head(s, 'Validación · SCAMPER', 'Así ', 'mejoramos el prototipo');
    const sc = [['S', 'Sustituir', 'Emojis por arte propio'], ['C', 'Combinar', 'Tienda, biblioteca y SDK en uno'], ['A', 'Adaptar', 'Mecaquack a la plataforma'], ['M', 'Modificar', 'Reseñas tras 2 h de juego'], ['P', 'Otros usos', 'Medio de aprendizaje'], ['E', 'Eliminar', 'La barrera de pago'], ['R', 'Reordenar', 'Primero jugar, luego explicar']];
    const cw = (W - 2 * M - 3 * 0.25) / 4;
    sc.forEach(([l, t, d], i) => {
      const row = i < 4 ? 0 : 1, col = row ? i - 4 : i;
      const x = M + col * (cw + 0.25) + (row ? (cw + 0.25) / 2 : 0), y = 1.95 + row * 2.2;
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: 1.95, fill: { color: C.white }, line: { color: C.line }, shadow: shadow() });
      s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: y + 0.25, w: 0.7, h: 0.7, fill: { color: C.blue }, line: { color: C.blue } });
      txt(s, l, { x: x + 0.25, y: y + 0.25, w: 0.7, h: 0.7, fontSize: 26, bold: true, color: C.white, align: 'center', valign: 'middle' });
      txt(s, t, { x: x + 1.1, y: y + 0.3, w: cw - 1.3, h: 0.6, fontSize: 19, bold: true, color: C.navy, valign: 'middle' });
      txt(s, d, { x: x + 0.25, y: y + 1.1, w: cw - 0.5, h: 0.7, fontSize: 15, color: C.ink });
    });
    footer(s, 11); notes(s);
  }

  /* 12 · Ejes transversales */
  {
    const s = slide();
    head(s, 'Ejes transversales', 'Impacto ', 'más allá del juego');
    const ejes = [['LuUsers', 'Inclusión y equidad', ['Cualquier alumno publica sus videojuegos', 'Publicar es gratis', 'Juegos desde $0 en el navegador', 'Beneficios exclusivos TecNM']], ['LuHeartHandshake', 'Impacto social', ['Impulsa habilidades tecnológicas', 'Fortalece el entretenimiento mexicano', 'Apoyo económico a los estudios']], ['LuLeaf', 'Sustentabilidad y sostenibilidad', ['100 % digital: sin discos, empaques ni envíos', '5 % de cada venta al Parque Irekua (educación ambiental)', 'Se financia con comisiones bajas']], ['LuBox', 'Tecnologías emergentes', ['3D en el navegador (WebGL)', 'Mandos con vibración', 'Prototipo sin conexión']]];
    const cw = (W - 2 * M - 3 * 0.25) / 4;
    for (let i = 0; i < 4; i++) {
      const [ic, t, items] = ejes[i], x = M + i * (cw + 0.25), y = 1.9;
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: 4.55, fill: { color: C.white }, line: { color: C.line }, shadow: shadow() });
      await iconCircle(s, ic, x + 0.3, y + 0.3, 0.8, i === 2 ? C.green : C.blue);
      txt(s, t, { x: x + 0.3, y: y + 1.25, w: cw - 0.6, h: 0.8, fontSize: 18, bold: true, color: C.navy, valign: 'middle' });
      txt(s, items.map((it, j) => ({ text: it, options: { bullet: true, breakLine: j < items.length - 1 } })), { x: x + 0.3, y: y + 2.15, w: cw - 0.5, h: 2.25, fontSize: 14, color: C.ink, paraSpaceAfter: 6 });
    }
    footer(s, 12); notes(s);
  }

  /* 13 · Cierre */
  {
    const s = slide(C.navy);
    mosaic(s, ['juego', 'aerodron', 'furia', 'faq', 'pase', 'tienda', 'revision', 'ventas', 'landing']);
    txt(s, 'HECHO EN EL TECNM', { x: M, y: 2.0, w: 8, h: 0.35, fontSize: 15, bold: true, color: C.yellow, charSpacing: 4 });
    txt(s, [{ text: 'Cada partida ', options: { color: C.white } }, { text: 'impulsa a un estudio mexicano.', options: { color: C.blue2 } }], { x: M, y: 2.5, w: 11.5, h: 2.2, fontSize: 54, bold: true, valign: 'top' });
    txt(s, 'Ahora, véanlo funcionar.', { x: M, y: 4.85, w: 10, h: 0.6, fontSize: 28, bold: true, color: 'DCE7FF' });
    txt(s, 'Equipo Maravilla · Instituto Tecnológico Superior de Irapuato', { x: M, y: H - 0.55, w: 8, h: 0.3, fontSize: 12, color: 'B8C6E0' });
    txt(s, 'HackaTec Regional 2026', { x: W - M - 4, y: H - 0.55, w: 4, h: 0.3, fontSize: 12, color: 'B8C6E0', align: 'right' });
    notes(s);
  }

  await pres.writeFile({ fileName: OUT });
  console.log('Escrito', path.relative(process.cwd(), OUT), `· ${n} notas`);
})();
