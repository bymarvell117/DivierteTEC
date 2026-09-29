/* DivertiTEC — catálogo global de recompensas, logros de plataforma y datos semilla. */
(function (DT) {
  'use strict';

  DT.RARITY = {
    comun: { name: 'Común', color: '#8a9bb0' },
    raro: { name: 'Raro', color: '#3d8fff' },
    epico: { name: 'Épico', color: '#a35cff' },
    legendario: { name: 'Legendario', color: '#ffb321' }
  };

  DT.REWARD_TYPES = {
    theme: 'Tema de página',
    frame: 'Marco de perfil',
    avatar: 'Avatar',
    effect: 'Efecto',
    emoji: 'Emoji',
    badge: 'Insignia'
  };

  /* Recompensas: el campo `data` se interpreta según el tipo (ver theme.js). */
  DT.REWARDS = {
    // Temas temáticos (la paleta reglamentaria y el modo oscuro siempre están disponibles)
    theme_arcade: { type: 'theme', name: 'Retro Arcade', rarity: 'raro', glyph: '🕹️', desc: 'Neones rosas y amarillos de salón recreativo.', data: 'arcade' },
    theme_cyber: { type: 'theme', name: 'Neón Cyberpunk', rarity: 'epico', glyph: '🌃', desc: 'Cian eléctrico sobre la noche de la ciudad.', data: 'cyber' },
    theme_gameboy: { type: 'theme', name: 'Pixel Boy', rarity: 'raro', glyph: '👾', desc: 'Los cuatro verdes de la portátil clásica.', data: 'gameboy' },
    theme_space: { type: 'theme', name: 'Galaxia', rarity: 'epico', glyph: '🌌', desc: 'Violetas profundos y polvo de estrellas.', data: 'space' },
    theme_lava: { type: 'theme', name: 'Volcán', rarity: 'legendario', glyph: '🌋', desc: 'Magma, brasas y obsidiana.', data: 'lava' },
    // Marcos
    frame_gold: { type: 'frame', name: 'Marco Dorado', rarity: 'raro', glyph: '🥇', desc: 'Anillo de oro pulido.', data: 'gold' },
    frame_neon: { type: 'frame', name: 'Marco Neón', rarity: 'epico', glyph: '💠', desc: 'Pulso de neón animado.', data: 'neon' },
    frame_pixel: { type: 'frame', name: 'Marco Pixel', rarity: 'comun', glyph: '🟩', desc: 'Borde escalonado de 8 bits.', data: 'pixel' },
    frame_fire: { type: 'frame', name: 'Marco de Fuego', rarity: 'legendario', glyph: '🔥', desc: 'Llamas que giran sin parar.', data: 'fire' },
    frame_ice: { type: 'frame', name: 'Marco de Hielo', rarity: 'raro', glyph: '❄️', desc: 'Cristal frío y brillante.', data: 'ice' },
    // Avatares
    av_robot: { type: 'avatar', name: 'Robot', rarity: 'comun', glyph: '🤖', desc: 'Tu primer compañero.', data: '🤖' },
    av_alien: { type: 'avatar', name: 'Invasor', rarity: 'raro', glyph: '👾', desc: 'Directo desde los arcades.', data: '👾' },
    av_ninja: { type: 'avatar', name: 'Ninja', rarity: 'epico', glyph: '🥷', desc: 'Silencioso y letal.', data: '🥷' },
    av_dragon: { type: 'avatar', name: 'Dragón', rarity: 'legendario', glyph: '🐉', desc: 'Solo para los más persistentes.', data: '🐉' },
    av_astro: { type: 'avatar', name: 'Astronauta', rarity: 'raro', glyph: '🧑‍🚀', desc: 'Explorador de mundos.', data: '🧑‍🚀' },
    // Efectos (partículas que siguen al cursor)
    fx_sparkle: { type: 'effect', name: 'Destellos', rarity: 'raro', glyph: '✨', desc: 'Chispas doradas al mover el cursor.', data: 'sparkle' },
    fx_pixels: { type: 'effect', name: 'Píxeles', rarity: 'comun', glyph: '🟦', desc: 'Una estela de píxeles de colores.', data: 'pixels' },
    fx_stars: { type: 'effect', name: 'Estrellas', rarity: 'epico', glyph: '⭐', desc: 'Estrellas fugaces tras tu cursor.', data: 'stars' },
    fx_fire: { type: 'effect', name: 'Brasas', rarity: 'legendario', glyph: '🔥', desc: 'Brasas ardientes que suben.', data: 'fire' },
    // Emojis (se usan en reseñas y comunidad)
    em_gg: { type: 'emoji', name: 'GG', rarity: 'comun', glyph: '🤝', desc: 'Buena partida.', data: '🤝' },
    em_fire: { type: 'emoji', name: 'En llamas', rarity: 'comun', glyph: '🔥', desc: 'Está que arde.', data: '🔥' },
    em_crown: { type: 'emoji', name: 'Corona', rarity: 'raro', glyph: '👑', desc: 'Para el rey de la partida.', data: '👑' },
    em_skull: { type: 'emoji', name: 'Calavera', rarity: 'raro', glyph: '💀', desc: 'Game over.', data: '💀' },
    em_rocket: { type: 'emoji', name: 'Cohete', rarity: 'epico', glyph: '🚀', desc: 'Al infinito.', data: '🚀' },
    em_trophy: { type: 'emoji', name: 'Trofeo', rarity: 'epico', glyph: '🏆', desc: 'Campeón.', data: '🏆' },
    // Insignias
    badge_pioneer: { type: 'badge', name: 'Pionero', rarity: 'raro', glyph: '🚩', desc: 'Estuvo en DivertiTEC desde el principio.', data: '🚩' },
    badge_critic: { type: 'badge', name: 'Crítico', rarity: 'comun', glyph: '📝', desc: 'Escribió reseñas para la comunidad.', data: '📝' },
    badge_guard: { type: 'badge', name: 'Guardián', rarity: 'raro', glyph: '🛡️', desc: 'Ayudó a mantener segura la comunidad.', data: '🛡️' },
    badge_creator: { type: 'badge', name: 'Creador', rarity: 'epico', glyph: '🛠️', desc: 'Publicó un juego en DivertiTEC.', data: '🛠️' },
    badge_hackatec: { type: 'badge', name: 'Hackatec 2026', rarity: 'legendario', glyph: '🏅', desc: 'Edición regional InnovaTec 2026.', data: '🏅' }
  };

  /* Avatares y emojis gratuitos para todos */
  DT.FREE_AVATARS = ['🎮', '🙂', '😎', '🐱', '🦊', '🐼'];
  DT.FREE_EMOJIS = ['👍', '👎', '😂', '😮', '❤️'];

  /* Logros de plataforma: se evalúan con `check` sobre el estado del usuario. */
  DT.PLATFORM_ACH = [
    { id: 'p_welcome', name: 'Bienvenido a DivertiTEC', desc: 'Entra por primera vez a la plataforma.', icon: '👋', reward: ['av_robot', 'badge_pioneer'],
      check: (s) => true },
    { id: 'p_first_play', name: 'Primera partida', desc: 'Juega cualquier juego en el navegador.', icon: '🎮', reward: ['theme_arcade'],
      check: (s) => s.sessions >= 1 },
    { id: 'p_collector', name: 'Coleccionista', desc: 'Ten 3 juegos en tu biblioteca.', icon: '📚', reward: ['frame_gold'],
      check: (s) => s.owned >= 3 },
    { id: 'p_explorer', name: 'Explorador', desc: 'Visita 5 páginas de tienda distintas.', icon: '🧭', reward: ['frame_pixel', 'fx_pixels'],
      check: (s) => s.visited >= 5 },
    { id: 'p_critic', name: 'Crítico', desc: 'Publica tu primera reseña.', icon: '📝', reward: ['badge_critic', 'em_gg'],
      check: (s) => s.reviews >= 1 },
    { id: 'p_marathon', name: 'Maratón', desc: 'Acumula 30 minutos de juego.', icon: '⏱️', reward: ['theme_cyber'],
      check: (s) => s.playtime >= 1800 },
    { id: 'p_hunter', name: 'Cazador de logros', desc: 'Desbloquea 5 logros dentro de juegos.', icon: '🏹', reward: ['theme_space', 'fx_stars'],
      check: (s) => s.gameAch >= 5 },
    { id: 'p_guard', name: 'Guardián', desc: 'Envía un reporte para mantener sana la comunidad.', icon: '🛡️', reward: ['badge_guard'],
      check: (s) => s.reports >= 1 },
    { id: 'p_creator', name: 'Creador', desc: 'Publica un juego aprobado por la administración.', icon: '🛠️', reward: ['badge_creator', 'theme_gameboy'],
      check: (s) => s.published >= 1 }
  ];

  /* ---------- Layouts por defecto (lienzo lógico de 1000px de ancho) ---------- */
  DT.LAYOUT_W = 1000;

  DT.defaultStoreLayout = (g) => ({
    height: 760, bg: '',
    blocks: [
      { id: 'b1', type: 'cover', x: 0, y: 0, w: 620, h: 350, z: 1, shape: 'rounded', radius: 14, shadow: true },
      { id: 'b2', type: 'text', x: 650, y: 0, w: 350, h: 190, z: 2, html: `<h2>${DT.esc(g.title)}</h2><p>${DT.esc(g.short || '')}</p>` },
      { id: 'b3', type: 'play', x: 650, y: 200, w: 350, h: 70, z: 2 },
      { id: 'b4', type: 'shape', x: 650, y: 285, w: 150, h: 65, z: 1, shape: 'diamond', color: 'var(--primary)', opacity: .25 },
      { id: 'b5', type: 'text', x: 0, y: 380, w: 620, h: 360, z: 2, html: `<h3>Acerca de este juego</h3><p>${DT.esc(g.description || '')}</p>` },
      { id: 'b6', type: 'achievements', x: 650, y: 380, w: 350, h: 360, z: 2 }
    ]
  });

  DT.defaultLibraryLayout = (g) => ({
    height: 330, bg: '',
    blocks: [
      { id: 'l1', type: 'cover', x: 0, y: 0, w: 1000, h: 330, z: 1, shape: 'rect', fit: 'cover', plain: true },
      { id: 'l2', type: 'text', x: 40, y: 200, w: 560, h: 110, z: 2, html: `<h1 style="color:#fff;text-shadow:0 2px 12px #0008">${DT.esc(g.title)}</h1>` }
    ]
  });

  /* ---------- Datos semilla ---------- */
  const DAY = 86400000;
  DT.seedState = () => {
    const now = Date.now();
    const games = [
      { id: 'g_astro', title: 'Astro Runner', devId: 'u_dev2', format: 'html', genre: 'Arcade', tags: ['Plataformas', 'Espacio', 'Un jugador'],
        short: 'Corre, salta y esquiva meteoritos en un sistema solar que se desmorona.', description: 'Un endless runner espacial con física de baja gravedad, 40 niveles y jefes planetarios. Hecho en HTML5 Canvas.',
        cover: { c1: '#1a6fd8', c2: '#0a1a3a', glyph: '🚀', angle: 160 }, featured: true, createdAt: now - 3 * DAY },
      { id: 'g_cronicas', title: 'Crónicas de Tecnia', devId: 'u_dev', format: 'exe', genre: 'RPG', tags: ['Rol', 'Fantasía', 'Historia'],
        short: 'Un RPG por turnos ambientado en un tecnológico encantado.', description: 'Explora el campus de Tecnia, recluta compañeros de cada carrera y derrota al Rector Sombrío. Instalador para Windows.',
        cover: { c1: '#7a3cff', c2: '#1b0f3a', glyph: '🗡️' }, featured: true, createdAt: now - 12 * DAY, download: { name: 'CronicasDeTecnia-Setup.exe', size: 184549376, platform: 'Windows 10/11 · 64 bits' } },
      { id: 'g_circuit', title: 'Circuit Clash', devId: 'u_dev2', format: 'cpp', genre: 'Estrategia', tags: ['Estrategia', 'Electrónica', 'PvP'],
        short: 'Estrategia en tiempo real donde construyes circuitos para ganar.', description: 'Compilado en C++ con SDL2. Conecta compuertas lógicas para alimentar tus torres y cortar la energía del rival.',
        cover: { c1: '#00b894', c2: '#003d33', glyph: '⚡' }, createdAt: now - 20 * DAY, download: { name: 'CircuitClash-linux-win.zip', size: 52428800, platform: 'Windows · Linux' } },
      { id: 'g_garden', title: 'Pixel Garden', devId: 'u_dev', format: 'html', genre: 'Simulación', tags: ['Relajante', 'Pixel art', 'Granja'],
        short: 'Cultiva un jardín pixelado que crece incluso cuando no juegas.', description: 'Un idle de jardinería con 60 plantas, estaciones del año y un gato que te ayuda. Juega directo en el navegador.',
        cover: { c1: '#5bd16b', c2: '#1d4d2a', glyph: '🌱' }, createdAt: now - 6 * DAY },
      { id: 'g_neon', title: 'Neón Drift', devId: 'u_dev2', format: 'html', genre: 'Carreras', tags: ['Carreras', 'Synthwave', 'Arcade'],
        short: 'Derrapes infinitos en una autopista synthwave.', description: 'Carreras arcade con música synthwave generada y tablas de puntaje. WebGL en tu navegador.',
        cover: { c1: '#ff2a6d', c2: '#05070f', glyph: '🏎️' }, featured: true, createdAt: now - 1 * DAY },
      { id: 'g_guardianes', title: 'Guardianes del Campus', devId: 'u_dev', format: 'exe', genre: 'Acción', tags: ['Acción', 'Cooperativo', 'Torre'],
        short: 'Defiende tu tecnológico de una invasión de bugs.', description: 'Tower defense cooperativo para 4 jugadores. Instalable en Windows y macOS.',
        cover: { c1: '#ffb321', c2: '#5a2e00', glyph: '🛡️' }, createdAt: now - 30 * DAY, download: { name: 'Guardianes-Setup.exe', size: 314572800, platform: 'Windows · macOS' } },
      { id: 'g_quantum', title: 'Quantum Puzzle', devId: 'u_dev2', format: 'html', genre: 'Puzle', tags: ['Puzle', 'Ciencia'],
        short: 'Rompecabezas con partículas en superposición.', description: 'Cada pieza está en dos lugares a la vez hasta que la observas. 80 niveles.',
        cover: { c1: '#00d2ff', c2: '#3a0ca3', glyph: '⚛️' }, createdAt: now - 2 * 3600000, status: 'pending' },
      { id: 'g_hackatec', title: 'Mi juego Hackatec', devId: 'u_dev', format: 'html', genre: 'Arcade', tags: ['Hackatec 2026', 'HTML5'],
        short: 'El juego de la fase local de Hackatec. ¡Sube aquí los archivos HTML!', description: 'Borrador listo para recibir el juego de la fase local. Desde el panel de desarrollador sube el .html o la carpeta completa, prueba los logros y envíalo a revisión.',
        cover: { c1: '#1a6fd8', c2: '#ff7a18', glyph: '🏆', angle: 120 }, createdAt: now - 1 * 3600000, status: 'draft',
        achievements: [
          { id: 'primer_nivel', name: 'Primer paso', desc: 'Completa el primer nivel.', icon: '🥉', hidden: false, goal: 0, reward: 'em_fire' },
          { id: 'puntos_1000', name: 'Mil puntos', desc: 'Consigue 1000 puntos en una partida.', icon: '💯', hidden: false, goal: 1000, reward: 'av_alien' },
          { id: 'sin_danio', name: 'Intocable', desc: 'Termina un nivel sin recibir daño.', icon: '🛡️', hidden: false, goal: 0, reward: 'frame_neon' },
          { id: 'jefe_final', name: 'Jefe final', desc: 'Derrota al jefe final.', icon: '👑', hidden: false, goal: 0, reward: 'theme_lava' },
          { id: 'secreto', name: '???', desc: 'Encuentra el secreto escondido.', icon: '🔮', hidden: true, goal: 0, reward: 'badge_hackatec' }
        ] }
    ];
    // Logros de ejemplo para los juegos de catálogo
    const genericAch = (prefix) => [
      { id: prefix + '_1', name: 'Calentando motores', desc: 'Juega tu primera partida.', icon: '🔰', goal: 0, reward: 'em_gg' },
      { id: prefix + '_2', name: 'Veterano', desc: 'Juega 10 partidas.', icon: '🎖️', goal: 10, reward: 'fx_sparkle' },
      { id: prefix + '_3', name: 'Leyenda', desc: 'Completa el juego al 100%.', icon: '🏆', goal: 0, reward: 'em_trophy' }
    ];
    games.forEach((g) => {
      g.status = g.status || 'approved';
      g.achievements = g.achievements || genericAch(g.id.slice(2, 6));
      g.files = null;
      g.reviews = g.reviews || [];
      g.news = g.news || [];
      g.plays = g.status === 'approved' ? Math.floor(Math.random() * 900 + 100) : 0;
      g.storeLayout = DT.defaultStoreLayout(g);
      g.libraryLayout = DT.defaultLibraryLayout(g);
      g.reviewNote = '';
    });
    const byId = Object.fromEntries(games.map((g) => [g.id, g]));
    byId.g_astro.news.push({ id: 'n1', title: '¡Actualización 1.2 disponible!', body: 'Nuevo planeta helado y 5 niveles extra.', date: now - 7 * DAY });
    byId.g_cronicas.news.push({ id: 'n2', title: 'Diario de desarrollo #8 — El Rector Sombrío', body: 'Te contamos cómo diseñamos al jefe final.', date: now - 2 * 3600000 });
    byId.g_neon.news.push({ id: 'n3', title: '7 días para el torneo de derrapes', body: 'Prepara tus mejores tiempos.', date: now - 14 * DAY });
    byId.g_garden.news.push({ id: 'n4', title: 'Concurso: el jardín mejor decorado', body: 'Comparte tu jardín en la comunidad.', date: now - 3 * DAY });
    byId.g_astro.reviews.push({ id: 'r1', userId: 'u_luna', up: true, text: 'Súper adictivo, los jefes están geniales 🔥', date: now - 2 * DAY });
    byId.g_cronicas.reviews.push({ id: 'r2', userId: 'u_luna', up: true, text: 'La historia me atrapó desde el inicio.', date: now - 5 * DAY });
    byId.g_neon.reviews.push({ id: 'r3', userId: 'u_troll', up: false, text: 'Este juego es basura, el desarrollador es un idiota.', date: now - 1 * DAY, flagged: true });

    return {
      version: 3,
      currentUserId: 'u_player',
      users: [
        { id: 'u_player', name: 'MARVELL117', role: 'user', bio: 'Jugador de InnovaTec 2026.', status: 'active', createdAt: now - 40 * DAY },
        { id: 'u_luna', name: 'luna_gamer', role: 'user', bio: 'Speedrunner casual.', status: 'active', createdAt: now - 90 * DAY },
        { id: 'u_troll', name: 'xX_troll_Xx', role: 'user', bio: '', status: 'active', createdAt: now - 3 * DAY },
        { id: 'u_dev', name: 'PixelForge Studio', role: 'dev', bio: 'Equipo estudiantil de videojuegos. Hackatec 2026.', status: 'active', verified: true, createdAt: now - 60 * DAY },
        { id: 'u_dev2', name: 'Nébula Games', role: 'dev', bio: 'Arcades y puzles para el navegador.', status: 'active', verified: false, createdAt: now - 25 * DAY },
        { id: 'u_admin', name: 'Admin TEC', role: 'admin', bio: 'Moderación de DivertiTEC.', status: 'active', createdAt: now - 120 * DAY }
      ],
      games,
      library: {
        u_player: {
          g_astro: { added: now - 10 * DAY, playtime: 0, lastPlayed: 0 },
          g_cronicas: { added: now - 8 * DAY, playtime: 0, lastPlayed: 0 }
        },
        u_dev: { g_hackatec: { added: now, playtime: 0, lastPlayed: 0 } }
      },
      achievements: {},   // userId -> gameId -> achId -> {unlockedAt, progress}
      platformAch: {},    // userId -> achId -> unlockedAt
      stats: {},          // userId -> gameId -> {key: value}
      counters: {},       // userId -> {sessions, visited:[], reports}
      inventory: {},      // userId -> [rewardId]
      equipped: {},       // userId -> {theme, dark, frame, avatar, effect, badge}
      customRewards: {},  // recompensas creadas por desarrolladores
      reports: [
        { id: 'rep1', type: 'review', targetId: 'r3', gameId: 'g_neon', reason: 'Lenguaje ofensivo', text: 'Insulta al desarrollador.', by: 'u_luna', date: now - 20 * 3600000, status: 'open' },
        { id: 'rep2', type: 'game', targetId: 'g_circuit', reason: 'No funciona / enlace roto', text: 'El zip no abre en Linux.', by: 'u_player', date: now - 3 * DAY, status: 'open' }
      ],
      bannedWords: ['idiota', 'basura', 'estúpido'],
      devRequests: [],
      log: [{ date: now - DAY, actor: 'u_admin', text: 'Aprobó «Neón Drift».' }]
    };
  };
})(window.DT);
