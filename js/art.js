/* DivierteTEC — arte propio en SVG (sin emojis).
   - Íconos extra de línea para la interfaz y los logros (DT.ic).
   - Avatares, stickers e insignias de recompensas ilustrados.
   - Portadas ilustradas de los juegos del catálogo y portadas generativas
     (patrón angular + motivo del género) para los juegos nuevos. */
(function (DT) {
  'use strict';

  /* ---------- Íconos extra (trazo de 24×24, mismo estilo que core.js) ---------- */
  const P = {
    ticket: '<path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2.5 2.5 0 0 0 0 5v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2.5 2.5 0 0 0 0-5z"/><path d="M14 5v2M14 11v2M14 17v2"/>',
    megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h3l8 5V5L7 10H4a1 1 0 0 0-1 1z"/><path d="M19 9a4 4 0 0 1 0 6M7 14l1 5h3"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
    note: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    cap: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 3 9 3 12 0v-5M22 9v6"/>',
    building: '<path d="M4 21V5l8-3v19M12 8h8v13M2 21h20M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/><circle cx="12" cy="12" r="7"/>',
    gamepad: '<path d="M6 11h4M8 9v4M15 12h.01M18 10h.01"/><path d="M17.3 5H6.7a4 4 0 0 0-4 3.6L2 15.4a2.8 2.8 0 0 0 2.8 3.1c1 0 1.9-.5 2.4-1.3L8.5 15h7l1.3 2.2c.5.8 1.4 1.3 2.4 1.3a2.8 2.8 0 0 0 2.8-3.1l-.7-6.8A4 4 0 0 0 17.3 5z"/>',
    flame: '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-9-2 2-2 4-2 5-1-1-2-3-2-5-3 3-6 6-6 9a7 7 0 0 0 7 7z"/>',
    crown: '<path d="M3 18h18M4 18 3 7l5 4 4-7 4 7 5-4-1 11"/>',
    rocket: '<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2a2.1 2.1 0 0 0-3-3z"/><path d="m12 15-3-3a22 22 0 0 1 2-4A13 13 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1 5 0 5 0M12 15v5s3-.6 4-2c1-1.6 0-5 0-5"/>',
    fist: '<path d="M7 11V7a2 2 0 0 1 4 0v3M11 10V6a2 2 0 0 1 4 0v4M15 10V7a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-1a6 6 0 0 1-6-6v-2a2 2 0 0 1 3-1.7"/><path d="M7 11a2 2 0 0 0 0 4h3"/>',
    medal: '<circle cx="12" cy="15" r="6"/><path d="M8.5 10.5 5 3h5l2 4 2-4h5l-3.5 7.5"/>',
    skull: '<path d="M12 3a8 8 0 0 0-8 8c0 2.8 1.4 4.6 3 5.7V20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3.3c1.6-1.1 3-2.9 3-5.7a8 8 0 0 0-8-8z"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><path d="M10 21v-2M14 21v-2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 8 8h1a7 7 0 0 0 7-7v-3a2 2 0 0 0-4 0"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6z"/>',
    stopwatch: '<circle cx="12" cy="14" r="7"/><path d="M12 11v3l2 2M10 2h4M12 2v5M19 7l1.5-1.5"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13a6 6 0 0 1-8 1.5L6 21a2.1 2.1 0 0 1-3-3l6.5-7A6 6 0 0 1 11 3z"/>',
    joystick: '<path d="M4 17h16v4H4zM12 17V9"/><circle cx="12" cy="6" r="3"/>',
    raceflag: '<path d="M4 22V3h15l-2 5 2 5H4"/><path d="M8 3v10M12 3v10M16 8H4"/>',
    ball: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    puzzle: '<path d="M4 8h4a2 2 0 1 1 4 0h4v4a2 2 0 1 1 0 4v4h-4a2 2 0 1 0-4 0H4v-4a2 2 0 1 0 0-4z"/>',
    cube: '<path d="m12 2 9 5v10l-9 5-9-5V7z"/><path d="m3 7 9 5 9-5M12 12v10"/>',
    ghost: '<path d="M5 21V10a7 7 0 0 1 14 0v11l-2.5-2-2.3 2-2.2-2-2.2 2-2.3-2z"/><circle cx="9.5" cy="10" r="1"/><circle cx="14.5" cy="10" r="1"/>',
    sword: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2"/>',
    castle: '<path d="M3 21V8h3v3h3V8h3v3h3V8h3v13zM10 21v-4a2 2 0 0 1 4 0v4"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>',
    planet: '<circle cx="12" cy="12" r="6"/><path d="M4.5 16.5C2 19 1.5 21 3 21.5c2 .8 7-1.8 11-5.8s6.6-9 5.8-11c-.5-1.5-2.5-1-5 1.5"/>',
    snow: '<path d="M12 2v20M4.9 7l14.2 10M19.1 7 4.9 17M9 4l3 2 3-2M9 20l3-2 3 2"/>',
    drone: '<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="m7 8 3 3M17 8l-3 3M7 16l3-3M17 16l-3-3"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4M10 10h4v4h-4z"/>',
    atom: '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
    map: '<path d="m9 3-6 3v15l6-3 6 3 6-3V3l-6 3zM9 3v15M15 6v15"/>',
    wallet: '<path d="M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/><path d="M21 11h-5a2 2 0 0 0 0 4h5z"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9a2.5 2 0 0 0-2.5-1.5c-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2A2.5 2 0 0 1 9.5 15M12 6v1.5M12 16.5V18"/>',
    paw: '<circle cx="7" cy="9" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="17" cy="9" r="2"/><path d="M12 12c-3 0-6 4-6 6.5 0 1.5 1.3 2.5 3 2 1.2-.3 2-.8 3-.8s1.8.5 3 .8c1.7.5 3-.5 3-2 0-2.5-3-6.5-6-6.5z"/>',
    feather: '<path d="M20.2 12.2A6 6 0 0 0 11.8 3.8L5 10.5V19h8.5z"/><path d="M16 8 2 22M17.5 15H9"/>',
    hourglass: '<path d="M6 2h12M6 22h12M7 2v3a5 5 0 0 0 10 0V2M7 22v-3a5 5 0 0 1 10 0v3"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    palette: '<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2a10 10 0 0 0 0 20c.9 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h2A5.6 5.6 0 0 0 22 11 10 10 0 0 0 12 2z"/>',
    frame: '<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10"/>',
    warn: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7 15h10"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    arrowUp: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    arrowDown: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
    ruler: '<path d="M3 17 17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2"/>',
    car: '<path d="M5 17h14M3 17v-4l2-5h14l2 5v4"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
    fish: '<path d="M2 12c4-6 12-6 16 0-4 6-12 6-16 0zM18 12l4-4v8z"/><circle cx="7" cy="11" r="1"/>',
    hat: '<path d="M4 18h16M7 18V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v11M7 13h10"/>',
    battery: '<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2M6 10v4M10 10v4"/>',
    wave: '<path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
    burst: '<path d="m12 2 2 6 6-3-3 6 6 2-6 2 3 6-6-3-2 6-2-6-6 3 3-6-6-2 6-2-3-6 6 3z"/>',
    seed: '<path d="M12 22v-9M12 13c-4 0-7-3-7-7 4 0 7 3 7 7zM12 13c4 0 7-3 7-7-4 0-7 3-7 7z"/>',
    island: '<path d="M2 20c3-2 17-2 20 0M12 20V9M12 9c-2-3-6-3-8-1M12 9c2-3 6-3 8-1M12 9c-1-3 1-6 4-6"/>',
    eyeOff: '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c7 0 11 7 11 7a18 18 0 0 1-3.2 4M6.6 6.6A18 18 0 0 0 1 12s4 7 11 7a10 10 0 0 0 5.4-1.6"/>',
    thumbs: '<path d="M7 10v11H3V10zM7 10l4-8a3 3 0 0 1 3 3v4h6a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 18.6 21H7"/>',
    sprout: '<path d="M7 20h10M12 20v-8M12 12C12 8 9 5 5 5c0 4 3 7 7 7zM12 12c0-3 2-6 6-6 0 3-2 6-6 6z"/>',
    joy: '<circle cx="12" cy="12" r="9"/><path d="M7 13c1 3 3 4 5 4s4-1 5-4zM8 9l2 1M16 9l-2 1"/>',
    wow: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="15" r="2.2"/><path d="M9 9h.01M15 9h.01"/>'
  };
  const I = (d) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  Object.keys(P).forEach((k) => { if (!DT.icon[k]) DT.icon[k] = I(P[k]); });

  /* Íconos disponibles para logros y recompensas personalizadas */
  DT.ICON_KEYS = ['trophy', 'star', 'medal', 'crown', 'target', 'bolt', 'flame', 'heart', 'shield', 'sword', 'fist', 'skull', 'rocket', 'planet', 'gamepad', 'joystick', 'raceflag', 'stopwatch', 'compass', 'map', 'book', 'note', 'leaf', 'sprout', 'snow', 'drone', 'chip', 'atom', 'puzzle', 'cube', 'ghost', 'castle', 'coin', 'paw', 'feather', 'wave', 'burst', 'sparkle', 'hand', 'eye', 'battery', 'car', 'fish', 'hat', 'island', 'wrench', 'cap', 'palette'];
  DT.ICON_LABELS = { trophy: 'Trofeo', star: 'Estrella', medal: 'Medalla', crown: 'Corona', target: 'Diana', bolt: 'Rayo', flame: 'Flama', heart: 'Corazón', shield: 'Escudo', sword: 'Espada', fist: 'Puño', skull: 'Calavera', rocket: 'Cohete', planet: 'Planeta', gamepad: 'Control', joystick: 'Palanca', raceflag: 'Bandera de meta', stopwatch: 'Cronómetro', compass: 'Brújula', map: 'Mapa', book: 'Libro', note: 'Nota', leaf: 'Hoja', sprout: 'Brote', snow: 'Copo de nieve', drone: 'Dron', chip: 'Chip', atom: 'Átomo', puzzle: 'Pieza', cube: 'Cubo', ghost: 'Fantasma', castle: 'Castillo', coin: 'Moneda', paw: 'Huella', feather: 'Pluma', wave: 'Olas', burst: 'Explosión', sparkle: 'Destello', hand: 'Mano', eye: 'Ojo', battery: 'Batería', car: 'Auto', fish: 'Pez', hat: 'Sombrero', island: 'Isla', wrench: 'Llave', cap: 'Birrete', palette: 'Paleta' };
  const inner = (key) => { const s = DT.icon[key] || DT.icon.trophy; return s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, ''); };
  /* Ícono por clave; cualquier valor desconocido (p. ej. datos antiguos) usa el trofeo */
  DT.ic = (key) => DT.icon[key] || DT.icon.trophy;
  const glyph = (key, x, y, s, color, sw) => `<g transform="translate(${x} ${y}) scale(${s / 24})" fill="none" stroke="${color || '#fff'}" stroke-width="${sw || 2.2}" stroke-linecap="round" stroke-linejoin="round">${inner(key)}</g>`;

  let seq = 0;
  const uid = () => 'dt' + (++seq).toString(36);
  const hash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = (seed) => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const svg = (vb, body, cls) => `<svg class="${cls || 'art'}" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${body}</svg>`;

  /* ---------- Avatares ilustrados (64×64) ---------- */
  const AV = {
    robot: (b) => `<rect width="64" height="64" fill="#1a6fd8"/><path d="M32 8v8" stroke="#cfd8e6" stroke-width="3"/><circle cx="32" cy="7" r="3.5" fill="#ffd23f"/><rect x="13" y="16" width="38" height="32" rx="6" fill="#dfe6f1"/><rect x="18" y="24" width="10" height="8" rx="2" fill="#12c2ff"/><rect x="36" y="24" width="10" height="8" rx="2" fill="#12c2ff"/><path d="M22 40h20" stroke="#8a97ab" stroke-width="3"/><path d="M26 40v-3M32 40v-3M38 40v-3" stroke="#8a97ab" stroke-width="2"/><rect x="8" y="26" width="5" height="12" rx="2" fill="#aab6c8"/><rect x="51" y="26" width="5" height="12" rx="2" fill="#aab6c8"/><rect x="20" y="50" width="24" height="14" fill="#aab6c8"/>`,
    invasor: () => `<rect width="64" height="64" fill="#2a1244"/>${[[2, 0], [8, 0], [3, 1], [7, 1], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [1, 3], [2, 3], [4, 3], [5, 3], [6, 3], [8, 3], [9, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [0, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [10, 5], [0, 6], [2, 6], [8, 6], [10, 6], [3, 7], [4, 7], [6, 7], [7, 7]].map(([x, y]) => `<rect x="${10 + x * 4}" y="${18 + y * 4}" width="4" height="4" fill="#7cff6b"/>`).join('')}`,
    ninja: () => `<rect width="64" height="64" fill="#1f2230"/><circle cx="32" cy="34" r="20" fill="#2d3142"/><rect x="12" y="27" width="40" height="11" fill="#f0c7a1"/><path d="M20 32h9M35 32h9" stroke="#1f2230" stroke-width="3.5" stroke-linecap="round"/><rect x="12" y="20" width="40" height="5" fill="#d92a2a"/><path d="M52 22l9-5-2 8z" fill="#d92a2a"/>`,
    dragon: () => `<rect width="64" height="64" fill="#0d3b2e"/><path d="M14 18l8 6M50 18l-8 6" stroke="#f6c945" stroke-width="4" stroke-linecap="round"/><path d="M12 30c0-10 9-15 20-15s20 5 20 15c0 6-3 10-6 13l2 9H16l2-9c-3-3-6-7-6-13z" fill="#2fbf71"/><path d="M22 44h20l-3 8H25z" fill="#8be3b0"/><circle cx="24" cy="30" r="4" fill="#ffd23f"/><circle cx="40" cy="30" r="4" fill="#ffd23f"/><path d="M24 27v6M40 27v6" stroke="#10241c" stroke-width="2"/><circle cx="28" cy="46" r="1.5" fill="#10241c"/><circle cx="36" cy="46" r="1.5" fill="#10241c"/>`,
    astro: () => `<rect width="64" height="64" fill="#0b1a3a"/><circle cx="10" cy="12" r="1" fill="#fff"/><circle cx="54" cy="18" r="1.3" fill="#fff"/><circle cx="48" cy="52" r="1" fill="#fff"/><rect x="18" y="46" width="28" height="18" rx="6" fill="#e9eef8"/><circle cx="32" cy="30" r="19" fill="#e9eef8"/><rect x="17" y="21" width="30" height="19" rx="9" fill="#1b2d55"/><path d="M22 26c3-3 7-3 10-3" stroke="#6ad7ff" stroke-width="3" stroke-linecap="round"/><rect x="28" y="50" width="8" height="5" fill="#ff7a1a"/>`,
    pato: () => `<rect width="64" height="64" fill="#1e88c7"/><circle cx="32" cy="34" r="20" fill="#ffd84a"/><path d="M36 38h18l-4 7H38z" fill="#ff8a1a"/><rect x="14" y="22" width="36" height="7" fill="#3a3f4b"/><circle cx="25" cy="26" r="6" fill="#9fe3ff" stroke="#3a3f4b" stroke-width="3"/><circle cx="40" cy="26" r="6" fill="#9fe3ff" stroke="#3a3f4b" stroke-width="3"/><path d="M28 10c4 0 6 3 6 6" stroke="#ffd84a" stroke-width="4" stroke-linecap="round"/>`,
    gato: () => `<rect width="64" height="64" fill="#3a7d44"/><path d="M14 22l4-14 10 10M50 22l-4-14-10 10" fill="#f29b38"/><circle cx="32" cy="36" r="19" fill="#f29b38"/><path d="M8 20h48l-6-6H14z" fill="#f3d27a"/><rect x="20" y="10" width="24" height="6" fill="#f3d27a"/><circle cx="25" cy="34" r="3" fill="#1d2a1f"/><circle cx="39" cy="34" r="3" fill="#1d2a1f"/><path d="M29 42l3 2 3-2" stroke="#1d2a1f" stroke-width="2" fill="none"/><path d="M14 40h8M42 40h8" stroke="#fff" stroke-width="1.5"/>`,
    control: () => `<rect width="64" height="64" fill="#334155"/><path d="M20 22h24a10 10 0 0 1 10 9l2 12a6 6 0 0 1-10 5l-4-5H22l-4 5a6 6 0 0 1-10-5l2-12a10 10 0 0 1 10-9z" fill="#e2e8f0"/><path d="M18 30v8M14 34h8" stroke="#334155" stroke-width="3"/><circle cx="42" cy="31" r="2.5" fill="#1a6fd8"/><circle cx="47" cy="36" r="2.5" fill="#d92a2a"/>`,
    sonrisa: () => `<rect width="64" height="64" fill="#f59e0b"/><circle cx="32" cy="32" r="21" fill="#ffe08a"/><circle cx="25" cy="28" r="3" fill="#3b2a12"/><circle cx="39" cy="28" r="3" fill="#3b2a12"/><path d="M22 37c4 7 16 7 20 0" stroke="#3b2a12" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    lentes: () => `<rect width="64" height="64" fill="#0ea5e9"/><circle cx="32" cy="34" r="21" fill="#f5c89a"/><path d="M12 27h40" stroke="#111" stroke-width="3"/><path d="M14 27h14l-2 9h-10zM36 27h14l-2 9h-10z" fill="#111"/><path d="M25 45c4 3 10 3 14 0" stroke="#7a3e1a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M14 18c8-8 28-8 36 0" stroke="#3b2a12" stroke-width="6" fill="none"/>`,
    minino: () => `<rect width="64" height="64" fill="#64748b"/><path d="M14 24l3-14 11 9M50 24l-3-14-11 9" fill="#cbd5e1"/><circle cx="32" cy="36" r="19" fill="#cbd5e1"/><path d="M22 34l6-2M42 34l-6-2" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/><path d="M29 42l3 2 3-2" stroke="#1e293b" stroke-width="2" fill="none"/><path d="M30 39h4l-2 2z" fill="#f472b6"/>`,
    zorro: () => `<rect width="64" height="64" fill="#7c2d12"/><path d="M10 12l14 12h16l14-12-6 26-16 16-16-16z" fill="#f97316"/><path d="M18 38l14 16 14-16-14 4z" fill="#fff7ed"/><circle cx="25" cy="32" r="2.5" fill="#1c1917"/><circle cx="39" cy="32" r="2.5" fill="#1c1917"/><path d="M30 46h4l-2 3z" fill="#1c1917"/>`,
    panda: () => `<rect width="64" height="64" fill="#16a34a"/><circle cx="16" cy="18" r="7" fill="#111"/><circle cx="48" cy="18" r="7" fill="#111"/><circle cx="32" cy="35" r="21" fill="#fff"/><ellipse cx="24" cy="33" rx="6" ry="7" fill="#111" transform="rotate(-20 24 33)"/><ellipse cx="40" cy="33" rx="6" ry="7" fill="#111" transform="rotate(20 40 33)"/><circle cx="25" cy="32" r="2" fill="#fff"/><circle cx="39" cy="32" r="2" fill="#fff"/><path d="M29 43h6l-3 3z" fill="#111"/>`
  };
  DT.AVATAR_NAMES = { robot: 'Robot', invasor: 'Invasor', ninja: 'Ninja', dragon: 'Dragón', astro: 'Astronauta', pato: 'Mecaquack', gato: 'Michi jardinero', control: 'Control', sonrisa: 'Sonrisa', lentes: 'Lentes', minino: 'Minino', zorro: 'Zorro', panda: 'Panda' };
  const AV_BG = { shield: '#0f766e', wrench: '#7c3aed', gamepad: '#1a6fd8' };
  DT.art = DT.art || {};
  DT.art.avatar = (id) => {
    if (AV[id]) return svg('0 0 64 64', AV[id](), 'art av');
    const key = DT.icon[id] ? id : 'gamepad';
    return svg('0 0 64 64', `<rect width="64" height="64" fill="${AV_BG[key] || '#475569'}"/>${glyph(key, 14, 14, 36, '#fff', 2)}`, 'art av');
  };

  /* ---------- Stickers para reseñas (48×48) ---------- */
  const stk = (bg, key, fg) => `<path d="M24 2l6 4 7-1 3 6 6 4-1 7 3 6-5 5-1 7-7 1-4 6-7-2-7 2-4-6-7-1-1-7-5-5 3-6-1-7 6-4 3-6 7 1z" fill="#fff"/><circle cx="24" cy="24" r="17" fill="${bg}"/>${glyph(key, 12, 12, 24, fg || '#fff', 2.4)}`;
  const STK = {
    gg: () => `<path d="M24 2l6 4 7-1 3 6 6 4-1 7 3 6-5 5-1 7-7 1-4 6-7-2-7 2-4-6-7-1-1-7-5-5 3-6-1-7 6-4 3-6 7 1z" fill="#fff"/><rect x="7" y="13" width="34" height="22" rx="4" fill="#7c3aed" transform="rotate(-6 24 24)"/><text x="24" y="30" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="15" fill="#fff" transform="rotate(-6 24 24)">GG</text>`,
    fuego: () => stk('#f97316', 'flame'), corona: () => stk('#eab308', 'crown'), calavera: () => stk('#334155', 'skull'),
    cohete: () => stk('#0ea5e9', 'rocket'), trofeo: () => stk('#ca8a04', 'trophy'), puno: () => stk('#dc2626', 'fist'),
    pulgar: () => stk('#16a34a', 'thumbUp'), nopulgar: () => stk('#64748b', 'thumbDown'), risa: () => stk('#f59e0b', 'joy'),
    sorpresa: () => stk('#8b5cf6', 'wow'), corazon: () => stk('#e11d48', 'heart')
  };
  DT.STICKER_NAMES = { gg: 'GG', fuego: 'En llamas', corona: 'Corona', calavera: 'Game over', cohete: 'Cohete', trofeo: 'Trofeo', puno: 'Remate', pulgar: 'Me gusta', nopulgar: 'No me gusta', risa: 'Risa', sorpresa: 'Sorpresa', corazon: 'Corazón' };
  const stkBody = (id) => (STK[id] ? STK[id]() : DT.icon[id] ? stk('#1a6fd8', id) : STK.gg());
  DT.art.sticker = (id) => svg('0 0 48 48', stkBody(id), 'art stk');
  /* Reemplaza :id: por el sticker (el texto ya viene escapado) */
  DT.stickerize = (html) => String(html).replace(/:([a-zA-Z]+):/g, (m, id) => (STK[id] || DT.icon[id] ? `<span class="stk-inline" title="${DT.STICKER_NAMES[id] || ''}">${DT.art.sticker(id)}</span>` : m));

  /* ---------- Insignias de recompensas (64×64) ---------- */
  const THEME_SW = { arcade: ['#ff3ea5', '#ffe14d', '#1a0f2e'], cyber: ['#00e5ff', '#ff2bd6', '#0a1a2f'], gameboy: ['#9bbc0f', '#306230', '#0f380f'], kombat: ['#d92a2a', '#ffb321', '#1a0a14'], space: ['#8f5bff', '#ff9be0', '#1b0b3a'], lava: ['#ff5a1f', '#ffc23d', '#2a0a05'], light: ['#1a6fd8', '#e8eef7', '#ffffff'], dark: ['#4d8dff', '#1b2533', '#0f1722'] };
  const FRAME_ST = { gold: ['#f7d774', '#b8860b'], neon: ['#00e5ff', '#0891b2'], pixel: ['#306230', '#9bbc0f'], fire: ['#ff7a1a', '#d92a2a'], ice: ['#bae6fd', '#38bdf8'] };
  DT.art.badge = (r) => {
    if (!r) return '';
    const rar = (DT.RARITY && DT.RARITY[r.rarity]) || { color: '#8a9bb0' };
    const c = rar.color, id = uid();
    let body;
    if (r.type === 'theme') {
      const sw = THEME_SW[r.data] || ['#1a6fd8', '#ffd23f', '#0f1722'];
      body = `<clipPath id="${id}"><path d="M32 3l25 14v30L32 61 7 47V17z"/></clipPath><g clip-path="url(#${id})"><rect width="64" height="64" fill="${sw[2]}"/><path d="M0 44L64 12v18L0 62z" fill="${sw[0]}"/><path d="M0 30L64 0v8L0 40z" fill="${sw[1]}"/></g><path d="M32 3l25 14v30L32 61 7 47V17z" fill="none" stroke="${c}" stroke-width="3"/>`;
    } else if (r.type === 'frame') {
      const f = FRAME_ST[r.data] || [c, c];
      body = `<circle cx="32" cy="32" r="28" fill="none" stroke="${f[1]}" stroke-width="8"/><circle cx="32" cy="32" r="28" fill="none" stroke="${f[0]}" stroke-width="4" ${r.data === 'pixel' ? 'stroke-dasharray="6 3"' : r.data === 'fire' ? 'stroke-dasharray="10 4"' : ''}/><circle cx="32" cy="32" r="20" fill="#1e293b"/>${glyph('smile', 20, 20, 24, '#cbd5e1', 2)}`;
    } else if (r.type === 'avatar') {
      body = `<clipPath id="${id}"><rect x="4" y="4" width="56" height="56" rx="6"/></clipPath><g clip-path="url(#${id})" transform="translate(4 4) scale(.875)">${(AV[r.data] || (() => ''))()}</g><rect x="4" y="4" width="56" height="56" rx="6" fill="none" stroke="${c}" stroke-width="3"/>`;
    } else if (r.type === 'effect') {
      const R = rng(hash(r.data));
      const dots = Array.from({ length: 9 }, () => [8 + R() * 48, 8 + R() * 48, 1.5 + R() * 3]);
      const shape = { sparkle: (x, y, s) => `<path d="M${x} ${y - s * 2}l${s * .6} ${s * 1.4} ${s * 1.4} ${s * .6}-${s * 1.4} ${s * .6}-${s * .6} ${s * 1.4}-${s * .6}-${s * 1.4}-${s * 1.4}-${s * .6} ${s * 1.4}-${s * .6}z" fill="#ffd23f"/>`,
        pixels: (x, y, s) => `<rect x="${x}" y="${y}" width="${s * 2}" height="${s * 2}" fill="${['#1a6fd8', '#ff3ea5', '#7cff6b', '#ffd23f'][Math.floor(x) % 4]}"/>`,
        stars: (x, y, s) => `<circle cx="${x}" cy="${y}" r="${s}" fill="#fff"/><path d="M${x} ${y}l-${s * 5} ${s * 2}" stroke="#fff8" stroke-width="1"/>`,
        fire: (x, y, s) => `<circle cx="${x}" cy="${y}" r="${s}" fill="${s > 3 ? '#ff7a1a' : '#ffc23d'}"/>` }[r.data] || ((x, y, s) => `<circle cx="${x}" cy="${y}" r="${s}" fill="#fff"/>`);
      body = `<circle cx="32" cy="32" r="29" fill="#111827" stroke="${c}" stroke-width="3"/>${dots.map(([x, y, s]) => shape(x, y, s)).join('')}`;
    } else if (r.type === 'emoji') {
      body = `<g transform="translate(2 2) scale(1.25)">${stkBody(r.data)}</g>`;
    } else { // insignia (y recompensas personalizadas)
      body = `<path d="M32 3l24 8v20c0 16-12 25-24 30C20 56 8 47 8 31V11z" fill="${c}"/><path d="M32 8l19 6v17c0 13-9 20-19 25-10-5-19-12-19-25V14z" fill="#0f172a33"/>${glyph(r.glyph, 18, 16, 28, '#fff', 2.2)}`;
    }
    return svg('0 0 64 64', body, 'art badge');
  };

  /* ---------- Portadas ilustradas (320×180) ---------- */
  const stars = (n, seed, h) => { const R = rng(seed); return Array.from({ length: n }, () => `<circle cx="${(R() * 320).toFixed(1)}" cy="${(R() * (h || 120)).toFixed(1)}" r="${(R() * 1.3 + .3).toFixed(2)}" fill="#fff" opacity="${(R() * .6 + .4).toFixed(2)}"/>`).join(''); };
  const lg = (id, a, b, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const COVERS = {
    astro: (u) => `<defs>${lg(u + 'a', '#090826', '#3b1d6e', 1)}</defs><rect width="320" height="180" fill="url(#${u}a)"/>${stars(46, 7)}
      <circle cx="252" cy="50" r="27" fill="#ff8a3d"/><path d="M226 44c16 4 34 4 52 0" stroke="#e0662a" stroke-width="6"/><ellipse cx="252" cy="50" rx="48" ry="9" fill="none" stroke="#ffd0a0" stroke-width="4" transform="rotate(-18 252 50)"/>
      <path d="M0 148Q160 112 320 150V180H0z" fill="#5b5f94"/><ellipse cx="70" cy="150" rx="18" ry="4" fill="#474a7a"/><ellipse cx="250" cy="160" rx="24" ry="5" fill="#474a7a"/>
      <g class="art-run"><path d="M52 92h40M40 102h44M58 112h30" stroke="#35e0ff" stroke-width="3" opacity=".7" stroke-linecap="round"/>
      <path d="M121 116l-10 13-9-2M133 116l10 8 8-6" stroke="#eef3ff" stroke-width="7" stroke-linecap="round" fill="none"/>
      <rect x="112" y="98" width="8" height="16" rx="2" fill="#c9d3ee"/><rect x="118" y="96" width="19" height="22" rx="5" fill="#eef3ff"/>
      <path d="M121 102l-10 8M135 101l11-7" stroke="#eef3ff" stroke-width="6" stroke-linecap="round"/>
      <circle cx="129" cy="86" r="12" fill="#eef3ff"/><ellipse cx="133" cy="86" rx="7.5" ry="5.5" fill="#1ec8ff"/><path d="M129 83c2-1 4-1 6 0" stroke="#fff" stroke-width="1.5"/></g>
      <path d="M150 96q40-40 80 0" stroke="#ffd23f" stroke-width="2" stroke-dasharray="3 5" fill="none"/>`,
    garden: (u) => { let px = ''; const f = (x, y, c) => { px += `<rect x="${x}" y="${y}" width="8" height="8" fill="${c}"/>`; };
      for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { const x = 36 + i * 44, y = 118 + j * 26; px += `<rect x="${x - 6}" y="${y + 10}" width="36" height="12" fill="#6b3f23"/>`; f(x + 8, y + 2, '#3fa34d'); f(x + 8, y - 6, '#3fa34d'); const col = ['#ff4d8d', '#ffd23f', '#8b5cf6', '#ff7a1a'][(i + j) % 4]; f(x + 8, y - 14, col); f(x, y - 14, col); f(x + 16, y - 14, col); f(x + 8, y - 22, col); }
      return `<rect width="320" height="180" fill="#8fd3ff"/>${[[250, 18], [258, 18], [266, 18], [242, 26], [250, 26], [258, 26], [266, 26], [274, 26], [250, 34], [258, 34], [266, 34]].map(([x, y]) => `<rect x="${x}" y="${y}" width="8" height="8" fill="#ffd23f"/>`).join('')}
        <path d="M30 40h40v8h16v8H14v-8h16z" fill="#fff" opacity=".85"/><rect y="96" width="320" height="84" fill="#7cc36b"/><rect y="96" width="320" height="6" fill="#5aa84f"/>${px}
        ${[[276, 80, '#f29b38'], [284, 80, '#f29b38'], [268, 88, '#f29b38'], [276, 88, '#f29b38'], [284, 88, '#f29b38'], [292, 88, '#f29b38'], [268, 72, '#f29b38'], [292, 72, '#f29b38'], [276, 88, '#1d2a1f']].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="8" height="8" fill="${c}"/>`).join('')}`; },
    neon: (u) => `<defs>${lg(u + 'a', '#12002a', '#5b0a6e', 1)}${lg(u + 's', '#ffe14d', '#ff2bd6', 1)}</defs><rect width="320" height="180" fill="url(#${u}a)"/>${stars(20, 3, 80)}
      <circle cx="160" cy="92" r="46" fill="url(#${u}s)"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="110" y="${80 + i * 6}" width="100" height="${1.5 + i * .8}" fill="#3a0850"/>`).join('')}
      <path d="M0 110L60 78l40 22 30-14M320 110l-60-32-40 22-30-14" stroke="#ff2bd6" stroke-width="2" fill="none"/>
      <rect y="110" width="320" height="70" fill="#14002b"/>${[-160, -110, -70, -35, 0, 35, 70, 110, 160].map((d) => `<path d="M160 110L${160 + d * 3} 180" stroke="#22d3ee" stroke-width="1.5"/>`).join('')}${[114, 120, 130, 144, 162].map((y) => `<path d="M0 ${y}h320" stroke="#22d3ee" stroke-width="1.5"/>`).join('')}
      <g class="art-car"><path d="M118 160l14-20h58l14 20z" fill="#ff2bd6"/><path d="M134 142l10-12h34l10 12z" fill="#2a0845"/><rect x="118" y="156" width="86" height="8" fill="#b0128f"/><rect x="122" y="152" width="16" height="4" fill="#ff3b3b"/><rect x="184" y="152" width="16" height="4" fill="#ff3b3b"/></g>`,
    quantum: (u) => `<rect width="320" height="180" fill="#0b0f2a"/>${Array.from({ length: 60 }, (_, i) => `<circle cx="${(i % 12) * 28 + 6}" cy="${Math.floor(i / 12) * 36 + 12}" r="1" fill="#3b4a8a"/>`).join('')}
      <g class="art-spin" style="transform-origin:160px 90px"><ellipse cx="160" cy="90" rx="70" ry="22" fill="none" stroke="#6d7cff" stroke-width="2"/><ellipse cx="160" cy="90" rx="70" ry="22" fill="none" stroke="#b86dff" stroke-width="2" transform="rotate(60 160 90)"/><ellipse cx="160" cy="90" rx="70" ry="22" fill="none" stroke="#22d3ee" stroke-width="2" transform="rotate(120 160 90)"/></g>
      <circle cx="160" cy="90" r="10" fill="#ff4fd8"/><circle cx="160" cy="90" r="18" fill="#ff4fd8" opacity=".2"/>
      <path d="M40 150c20-20 40 20 60 0s40 20 60 0 40 20 60 0 40 20 60 0" stroke="#22d3ee" stroke-width="2" fill="none" opacity=".7"/><circle cx="40" cy="150" r="7" fill="#22d3ee"/><circle cx="280" cy="150" r="7" fill="#ff4fd8"/>`,
    aerodron: (u) => `<defs>${lg(u + 'a', '#60c2f5', '#e0f2fe', 1)}</defs><rect width="320" height="180" fill="url(#${u}a)"/><path d="M40 40h30v6H26zM220 28h40v6h-54z" fill="#fff" opacity=".8"/>
      <path d="M0 120c60-40 110-30 160-10s110 10 160-20V180H0z" fill="#4caf50"/><path d="M0 150c80-30 160-10 320-30V180H0z" fill="#2e7d32"/>
      <path d="M270 120V70M270 70l-14-16M270 70l18-6M270 70l-2 20" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      ${[[70, 110, 26], [120, 96, 20], [160, 86, 15]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r * .45}" ry="${r}" fill="none" stroke="#ff7a1a" stroke-width="5"/>`).join('')}
      <g class="art-hover"><path d="M196 58l-22-12M244 58l22-12M196 78l-22 12M244 78l22 12" stroke="#1f2937" stroke-width="4"/><rect x="204" y="56" width="32" height="24" rx="5" fill="#1f2937"/><rect x="212" y="62" width="16" height="8" rx="2" fill="#22d3ee"/>
      ${[[170, 44], [270, 44], [170, 92], [270, 92]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="16" ry="4" fill="#94a3b8" opacity=".6"/>`).join('')}</g>`,
    furia: (u) => `<defs><radialGradient id="${u}a" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="#8f1428"/><stop offset="1" stop-color="#16060d"/></radialGradient></defs><rect width="320" height="180" fill="url(#${u}a)"/>
      <path d="M20 180V60h14v120zM286 180V60h14v120z" fill="#2a0f16"/><path d="M27 58c-8-8-2-18 0-24 4 8 10 12 0 24zM293 58c-8-8-2-18 0-24 4 8 10 12 0 24z" fill="#ff9a1a"/>
      <path class="art-pulse" d="M172 10l-34 74h22l-18 86 52-100h-24l20-60z" fill="#ffb321"/>
      <g><path d="M60 44l12 18M112 44l-12 18" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/><circle cx="86" cy="86" r="36" fill="#f1f5f9"/><circle cx="72" cy="80" r="12" fill="#ffd23f"/><circle cx="100" cy="80" r="12" fill="#ffd23f"/><circle cx="74" cy="80" r="5" fill="#111"/><circle cx="102" cy="80" r="5" fill="#111"/><path d="M86 90l-6 10h12z" fill="#ff8a1a"/><path d="M58 124h56l-6 24H64z" fill="#1e40af"/></g>
      <g><path d="M234 42l14-4 12 8 14 2 4 14 10 10-4 14 6 12-10 10-2 14-14 4-10 10-14-6-14 6-10-10-14-4-2-14-10-10 6-12-4-14 10-10 4-14 14-2z" fill="#8a4a14"/><circle cx="234" cy="88" r="28" fill="#e8a64a"/><circle cx="224" cy="82" r="4.5" fill="#111"/><circle cx="244" cy="82" r="4.5" fill="#111"/><path d="M228 96h12l-6 6z" fill="#3a1a0a"/><path d="M206 128h56l-6 22h-44z" fill="#991b1b"/></g>`
  };
  const MOTIF = { 'Acción': 'fist', 'Arcade': 'joystick', 'Aventura': 'compass', 'Carreras': 'raceflag', 'Deportes': 'ball', 'Educativo': 'cap', 'Estrategia': 'castle', 'Puzle': 'puzzle', 'RPG': 'sword', 'Sandbox': 'cube', 'Simulación': 'gear', 'Terror': 'ghost' };
  DT.COVER_MOTIFS = ['gamepad', 'joystick', 'fist', 'sword', 'compass', 'raceflag', 'ball', 'cap', 'castle', 'puzzle', 'cube', 'gear', 'ghost', 'rocket', 'planet', 'drone', 'leaf', 'chip', 'atom', 'crown', 'flame', 'star', 'heart', 'paw', 'fish', 'car'];
  DT.COVER_PATTERNS = { tri: 'Triángulos', lines: 'Franjas', dots: 'Puntos', hex: 'Hexágonos' };
  const pattern = (kind, R, col) => {
    if (kind === 'lines') return Array.from({ length: 14 }, (_, i) => `<path d="M${i * 30 - 60} 180L${i * 30 + 40} 0" stroke="${col}" stroke-width="${6 + (i % 3) * 4}" opacity=".12"/>`).join('');
    if (kind === 'dots') return Array.from({ length: 96 }, (_, i) => `<circle cx="${(i % 16) * 21 + 6}" cy="${Math.floor(i / 16) * 32 + 12}" r="${1.5 + R() * 3}" fill="${col}" opacity=".18"/>`).join('');
    if (kind === 'hex') return Array.from({ length: 40 }, (_, i) => { const x = (i % 8) * 44 + (Math.floor(i / 8) % 2) * 22, y = Math.floor(i / 8) * 38; return `<path d="M${x} ${y - 20}l18 10v20l-18 10-18-10v-20z" fill="none" stroke="${col}" stroke-width="2" opacity=".14"/>`; }).join('');
    return Array.from({ length: 16 }, () => { const x = R() * 320, y = R() * 180, s = 20 + R() * 60; return `<path d="M${x} ${y}l${s} ${s * .4}-${s * .7} ${s * .8}z" fill="${col}" opacity="${(.05 + R() * .12).toFixed(2)}"/>`; }).join('');
  };
  /* Portada generativa: gradiente del estudio + patrón angular + motivo grande */
  DT.art.generative = (g) => {
    const c = g.cover || {}, u = uid(), R = rng(hash(g.id || g.title));
    const motif = c.motif || MOTIF[g.genre] || 'gamepad';
    const kind = c.pattern || ['tri', 'lines', 'dots', 'hex'][hash(g.title) % 4];
    return `<defs><linearGradient id="${u}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.c1 || '#1a6fd8'}"/><stop offset="1" stop-color="${c.c2 || '#0b2a55'}"/></linearGradient></defs>
      <rect width="320" height="180" fill="url(#${u}g)"/>${pattern(kind, R, '#fff')}
      <path d="M0 132L320 64v26L0 158z" fill="#fff" opacity=".1"/><circle cx="226" cy="84" r="58" fill="#fff" opacity=".08"/>
      ${glyph(motif, 178, 36, 96, '#fff', 1.8)}`;
  };
  DT.art.cover = (g) => {
    const c = g.cover || {};
    const body = c.art && COVERS[c.art] ? COVERS[c.art](uid()) : DT.art.generative(g);
    return svg('0 0 320 180', body, 'art cover-art');
  };
  /* Estrellas de calificación (1–5) */
  DT.starsHTML = (n) => `<span class="stars" aria-label="${n} de 5 estrellas">${[1, 2, 3, 4, 5].map((i) => `<svg viewBox="0 0 24 24" class="${i <= n ? 'on' : ''}"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>`).join('')}</span>`;
  DT.art.hasIllustration = (g) => !!(g.cover && COVERS[g.cover.art]);
})(window.DT);
