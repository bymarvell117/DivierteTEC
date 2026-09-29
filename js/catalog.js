/* DivierteTEC — catálogo global de recompensas, logros de plataforma y datos semilla. */
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
    theme_kombat: { type: 'theme', name: 'Kombate', rarity: 'legendario', glyph: '🥋', desc: 'Carmesí y oro de la arena de Furia TEC.', data: 'kombat' },
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
    av_pato: { type: 'avatar', name: 'Mecaquack', rarity: 'legendario', glyph: '🦆', desc: 'El pato ingeniero que salvó el archipiélago.', data: '🦆' },
    av_gato: { type: 'avatar', name: 'Michi jardinero', rarity: 'epico', glyph: '🐈', desc: 'El gato que cuida Pixel Garden.', data: '🐈' },
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
    badge_pioneer: { type: 'badge', name: 'Pionero', rarity: 'raro', glyph: '🚩', desc: 'Estuvo en DivierteTEC desde el principio.', data: '🚩' },
    badge_critic: { type: 'badge', name: 'Crítico', rarity: 'comun', glyph: '📝', desc: 'Escribió reseñas para la comunidad.', data: '📝' },
    badge_guard: { type: 'badge', name: 'Guardián', rarity: 'raro', glyph: '🛡️', desc: 'Ayudó a mantener segura la comunidad.', data: '🛡️' },
    badge_creator: { type: 'badge', name: 'Creador', rarity: 'epico', glyph: '🛠️', desc: 'Publicó un juego en DivierteTEC.', data: '🛠️' },
    badge_pase: { type: 'badge', name: 'Miembro del Pase', rarity: 'epico', glyph: '🎟️', desc: 'Apoya a los creadores con el Pase DivierteTEC.', data: '🎟️' },
    badge_hackatec: { type: 'badge', name: 'Hackatec 2026', rarity: 'legendario', glyph: '🏅', desc: 'Edición regional InnovaTec 2026.', data: '🏅' }
  };

  /* Avatares y emojis gratuitos para todos */
  DT.FREE_AVATARS = ['🎮', '🙂', '😎', '🐱', '🦊', '🐼'];
  DT.FREE_EMOJIS = ['👍', '👎', '😂', '😮', '❤️'];

  /* Logros de plataforma: se evalúan con `check` sobre el estado del usuario. */
  DT.PLATFORM_ACH = [
    { id: 'p_welcome', name: 'Bienvenido a DivierteTEC', desc: 'Entra por primera vez a la plataforma.', icon: '👋', reward: ['av_robot', 'badge_pioneer'],
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
      { id: 'b1', type: 'cover', x: 0, y: 0, w: 620, h: 350, z: 1, shape: 'slant', shadow: true },
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
        short: 'Corre, salta y esquiva meteoritos en la superficie de una luna con baja gravedad.', description: 'Runner infinito en HTML5 Canvas: doble salto con mochila propulsora, meteoritos rodantes y voladores, estrellas coleccionables y velocidad que no deja de subir. Controles: Espacio, flecha arriba o tocar la pantalla.',
        cover: { c1: '#1a6fd8', c2: '#0a1a3a', glyph: '🚀', angle: 160 }, featured: true, createdAt: now - 3 * DAY,
        pricing: { mode: 'free' },
        achievements: [
          { id: 'astro_despegue', name: 'Despegue', desc: 'Empieza tu primera carrera.', icon: '🚀', goal: 0, reward: 'em_gg' },
          { id: 'astro_1000', name: 'Mil metros', desc: 'Recorre 1000 m en una carrera.', icon: '📏', goal: 1000, reward: 'fx_sparkle' },
          { id: 'astro_estrellas', name: 'Coleccionista estelar', desc: 'Recoge 50 estrellas en total.', icon: '⭐', goal: 50, reward: 'av_alien' },
          { id: 'astro_intocable', name: 'Intocable', desc: 'Sobrevive 60 segundos en una carrera.', icon: '🛡️', goal: 0, reward: 'frame_neon' },
          { id: 'astro_agujero', name: 'Horizonte de sucesos', desc: 'Llega a 5000 m sin chocar.', icon: '🕳️', goal: 0, hidden: true, reward: 'em_rocket' }
        ] },
      { id: 'g_cronicas', title: 'Crónicas de Tecnia', devId: 'u_dev', format: 'exe', genre: 'RPG', tags: ['Rol', 'Fantasía', 'Historia'],
        short: 'Un RPG por turnos ambientado en un tecnológico encantado.', description: 'Explora el campus de Tecnia, recluta compañeros de cada carrera y derrota al Rector Sombrío. Instalador para Windows.',
        cover: { c1: '#7a3cff', c2: '#1b0f3a', glyph: '🗡️' }, featured: true, pricing: { mode: 'paid', price: 129 }, createdAt: now - 12 * DAY, download: { name: 'CronicasDeTecnia-Setup.exe', size: 184549376, platform: 'Windows 10/11 · 64 bits' } },
      { id: 'g_circuit', title: 'Circuit Clash', devId: 'u_dev2', format: 'cpp', genre: 'Estrategia', tags: ['Estrategia', 'Electrónica', 'PvP'],
        short: 'Estrategia en tiempo real donde construyes circuitos para ganar.', description: 'Compilado en C++ con SDL2. Conecta compuertas lógicas para alimentar tus torres y cortar la energía del rival.',
        cover: { c1: '#00b894', c2: '#003d33', glyph: '⚡' }, createdAt: now - 20 * DAY, download: { name: 'CircuitClash-linux-win.zip', size: 52428800, platform: 'Windows · Linux' } },
      { id: 'g_garden', title: 'Pixel Garden', devId: 'u_dev', format: 'html', genre: 'Simulación', tags: ['Relajante', 'Pixel art', 'Granja'],
        short: 'Cultiva un jardín pixelado que crece incluso cuando no juegas.', description: 'Juego idle de jardinería con estética de consola portátil: planta zanahorias, girasoles, calabazas y cactus estelares, cosecha monedas, desbloquea semillas y adopta a Michi, el gato que cosecha por ti. Las plantas crecen en tiempo real, aunque cierres el juego.',
        cover: { c1: '#5bd16b', c2: '#1d4d2a', glyph: '🌱' }, createdAt: now - 6 * DAY,
        pricing: { mode: 'pwyw', price: 20, min: 0, inPass: true },
        achievements: [
          { id: 'garden_cosecha', name: 'Primera cosecha', desc: 'Cosecha tu primera planta.', icon: '🥕', goal: 0, reward: 'em_fire' },
          { id: 'garden_100', name: 'Buen año', desc: 'Gana 100 monedas en total.', icon: '🪙', goal: 100, reward: 'frame_pixel' },
          { id: 'garden_botanico', name: 'Botánico', desc: 'Desbloquea las 4 semillas.', icon: '🌵', goal: 0, reward: 'fx_pixels' },
          { id: 'garden_gato', name: 'Michi', desc: 'Adopta al gato jardinero.', icon: '🐈', goal: 0, reward: 'av_gato' },
          { id: 'garden_dorada', name: 'Flor dorada', desc: 'Encuentra una flor dorada al cosechar (2 %).', icon: '🌼', goal: 0, hidden: true, reward: 'em_crown' }
        ] },
      { id: 'g_neon', title: 'Neón Drift', devId: 'u_dev2', format: 'html', genre: 'Carreras', tags: ['Carreras', 'Synthwave', 'Arcade'],
        short: 'Carreras arcade en una autopista synthwave infinita.', description: 'Autopista pseudo-3D de neón: cambia de carril, esquiva el tráfico, pasa rozando para ganar bonus de "casi choque" y usa el turbo para duplicar puntos. Controles: ← → y Espacio, o toques en móvil.',
        cover: { c1: '#ff2a6d', c2: '#05070f', glyph: '🏎️' }, featured: true, createdAt: now - 1 * DAY,
        pricing: { mode: 'paid', price: 49, discount: 30, inPass: true },
        achievements: [
          { id: 'drift_primera', name: 'Luz verde', desc: 'Corre tu primera carrera.', icon: '🚦', goal: 0, reward: 'em_gg' },
          { id: 'drift_2000', name: 'Velocidad de crucero', desc: 'Consigue 2000 puntos en una carrera.', icon: '🏁', goal: 2000, reward: 'frame_ice' },
          { id: 'drift_casi', name: 'Por un pelo', desc: 'Logra 20 casi choques en total.', icon: '😬', goal: 20, reward: 'em_skull' },
          { id: 'drift_turbo', name: 'Nitro', desc: 'Usa el turbo 10 veces.', icon: '🔥', goal: 10, reward: 'fx_fire' },
          { id: 'drift_leyenda', name: 'Leyenda de la autopista', desc: 'Sobrevive 3 minutos en una carrera.', icon: '🏆', goal: 0, hidden: true, reward: 'em_trophy' }
        ] },
      { id: 'g_guardianes', title: 'Guardianes del Campus', devId: 'u_dev', format: 'exe', genre: 'Acción', tags: ['Acción', 'Cooperativo', 'Torre'],
        short: 'Defiende tu tecnológico de una invasión de bugs.', description: 'Tower defense cooperativo para 4 jugadores. Instalable en Windows y macOS.',
        cover: { c1: '#ffb321', c2: '#5a2e00', glyph: '🛡️' }, createdAt: now - 30 * DAY, pricing: { mode: 'paid', price: 89 }, download: { name: 'Guardianes-Setup.exe', size: 314572800, platform: 'Windows · macOS' } },
      { id: 'g_quantum', title: 'Quantum Puzzle', devId: 'u_dev2', format: 'html', genre: 'Puzle', tags: ['Puzle', 'Ciencia'],
        short: 'Colapsa partículas entrelazadas a su estado base.', description: 'Rompecabezas tipo "luces fuera" con física cuántica de mentira: al tocar una partícula cambian ella, sus vecinas y su pareja entrelazada. 10 niveles diseñados de 3×3 a 5×5, contador de movimientos, "par" por nivel y deshacer.',
        cover: { c1: '#00d2ff', c2: '#3a0ca3', glyph: '⚛️' }, createdAt: now - 2 * 3600000, status: 'pending', submittedAt: now - 2 * 3600000,
        pricing: { mode: 'paid', price: 25 },
        achievements: [
          { id: 'quantum_1', name: 'Primera observación', desc: 'Resuelve tu primer nivel.', icon: '👁️', goal: 0, reward: 'em_gg' },
          { id: 'quantum_5', name: 'Superposición', desc: 'Resuelve 5 niveles.', icon: '🌀', goal: 5, reward: 'frame_gold' },
          { id: 'quantum_optimo', name: 'Eficiencia cuántica', desc: 'Resuelve un nivel en el par de movimientos o menos.', icon: '⚡', goal: 0, reward: 'fx_sparkle' },
          { id: 'quantum_todo', name: 'Colapso total', desc: 'Resuelve los 10 niveles.', icon: '⚛️', goal: 0, reward: 'theme_space' },
          { id: 'quantum_sin_deshacer', name: 'Sin mirar atrás', desc: 'Resuelve 3 niveles seguidos sin deshacer.', icon: '🧑‍🚀', goal: 0, hidden: true, reward: 'av_astro' }
        ] },
      { id: 'g_mecaquack', title: 'Mecaquack', devId: 'u_maravilla', format: 'html', genre: 'Aventura', tags: ['Aventura', 'Educativo', 'Ingeniería', 'Pixel art', 'Hackatec 2026'],
        short: 'Un pato ingeniero recorre un archipiélago resolviendo retos de física y derrotando a los Tiburones de Tierra.', description: 'Los Tiburones de Tierra arrasaron el archipiélago y dispersaron a la parvada. Mecaquack, un pato ingeniero, recorre 10 islas resolviendo 19 retos de física, química y materiales (en fácil, normal o difícil), ensambla un dron-mochila para cruzar el océano, desbloquea 5 tecnologías y se enfrenta a Bombón, el chihuahua de agua salada. Juego de la fase local de InnovaTec Hackatec, hecho por el Equipo Maravilla del Instituto Tecnológico Superior de Irapuato.',
        cover: { asset: 'g_mecaquack:img/cinematica4.png', c1: '#5b4fb3', c2: '#f39c12', glyph: '🦆', pos: '60% 40%' }, featured: true, createdAt: now - 2 * 3600000,
        pricing: { mode: 'free' },
        achievements: [
          { id: 'meca_primer_reto', name: 'Primer invento', desc: 'Completa tu primer reto de ingeniería.', icon: '⚙️', goal: 0, reward: 'em_fire' },
          { id: 'meca_dron', name: 'Ingeniero aéreo', desc: 'Ensambla el dron-mochila.', icon: '🚁', goal: 0, reward: 'frame_neon' },
          { id: 'meca_tiburones', name: 'Cazatiburones', desc: 'Derrota 25 Tiburones de Tierra.', icon: '🦈', goal: 25, reward: 'fx_fire' },
          { id: 'meca_dificil', name: 'Mente brillante', desc: 'Completa 5 retos en dificultad DIFÍCIL.', icon: '💀', goal: 5, reward: 'frame_gold' },
          { id: 'meca_estrellas', name: 'Constelación', desc: 'Gana 100 estrellas en total.', icon: '⭐', goal: 100, reward: 'fx_stars' },
          { id: 'meca_islas', name: 'Explorador del archipiélago', desc: 'Visita las 10 islas.', icon: '🗺️', goal: 0, reward: 'frame_ice' },
          { id: 'meca_retos', name: 'Archipiélago completo', desc: 'Completa los 19 retos.', icon: '🏝️', goal: 0, reward: 'theme_lava' },
          { id: 'meca_bombon', name: 'Adiós, Bombón', desc: 'Derrota al jefe final en su guarida de Selvarrón.', icon: '🐶', goal: 0, reward: 'av_pato' },
          { id: 'meca_perfecto', name: 'Sin un rasguño', desc: 'Vence a Bombón sin perder vida.', icon: '🛡️', goal: 0, hidden: true, reward: 'badge_hackatec' },
          { id: 'meca_moda', name: 'Pato a la moda', desc: 'Equipa sombrero, skin y estela al mismo tiempo.', icon: '🎩', goal: 0, hidden: true, reward: 'em_crown' }
        ],
        storeLayout: { height: 1620, bg: 'linear-gradient(160deg, #1b1340, #0d1b3d 55%, #2a1030)', blocks: [
          { id: 'm1', type: 'media', asset: 'g_mecaquack:img/cinematica1.png', x: 0, y: 0, w: 1000, h: 430, z: 1, shape: 'slant', fit: 'cover' },
          { id: 'm2', type: 'text', x: 40, y: 36, w: 600, h: 190, z: 3, html: '<h1 style="font-size:64px;letter-spacing:4px">MECAQUACK</h1><p style="font-size:20px">Una aventura de ingeniería en un archipiélago pixelado</p>', color: '#ffffff' },
          { id: 'm3', type: 'play', x: 40, y: 250, w: 460, h: 70, z: 4 },
          { id: 'm4', type: 'media', asset: 'g_mecaquack:img/pato.png', x: 840, y: 250, w: 118, h: 150, z: 4, shape: 'rect', fit: 'contain', rot: -8 },
          { id: 'm5', type: 'shape', x: 0, y: 452, w: 420, h: 12, z: 2, shape: 'parallelogram', color: '#f39c12' },
          { id: 'm6', type: 'text', x: 40, y: 484, w: 520, h: 250, z: 2, color: '#ece8ff', html: '<h2>La historia</h2><p>Sin previo aviso, los temidos Tiburones de Tierra emergieron de las profundidades y dispersaron a la parvada. Mecaquack, el pato ingeniero, toma su llave inglesa y el mapa del archipiélago: con la ingeniería como escudo, emprende la misión de rescatar a todos.</p>' },
          { id: 'm7', type: 'media', asset: 'g_mecaquack:img/cinematica3.png', x: 590, y: 470, w: 390, h: 230, z: 2, shape: 'parallelogram', fit: 'cover', borderW: 3, borderC: '#f39c12', shadow: true },
          { id: 'm8', type: 'media', asset: 'g_mecaquack:img/bombon.png', x: 690, y: 740, w: 280, h: 260, z: 2, shape: 'hexagon', fit: 'contain', bg: '#ffffff', borderW: 4, borderC: '#e74c3c', shadow: true },
          { id: 'm9', type: 'text', x: 40, y: 760, w: 620, h: 230, z: 2, color: '#ece8ff', html: '<h2 style="color:#ff8a80">Jefe final: Bombón</h2><p>El chihuahua de agua salada custodia el archipiélago. Completa 10 retos para abrir su guarida en Selvarrón y derrótalo respondiendo 7 preguntas de ingeniería: cada acierto le quita vida, cada error te la quita a ti.</p>' },
          { id: 'm10', type: 'text', x: 40, y: 1010, w: 540, h: 200, z: 2, color: '#ece8ff', html: '<h3>Qué te espera</h3><p>10 islas · 19 retos de física, química y materiales en 3 dificultades · dron-mochila para cruzar el océano · 5 tecnologías (escudo, flama, armadura, trampa y turbina) · tienda de skins, sombreros y estelas.</p>' },
          { id: 'm11', type: 'text', x: 40, y: 1210, w: 540, h: 130, z: 2, color: '#c9c3ef', html: '<h3>Controles</h3><p>WASD mover · ESPACIO espada · E interactuar · B dron · V guardarropa · Q/F/G/H/T tecnologías · Esc pausa. En celular: joystick y botones en pantalla.</p>' },
          { id: 'm12', type: 'media', asset: 'g_mecaquack:img/cinematica2.png', x: 40, y: 1360, w: 540, h: 230, z: 2, shape: 'slant', fit: 'cover', borderW: 3, borderC: '#6fb1ff' },
          { id: 'm13', type: 'achievements', x: 620, y: 1030, w: 360, h: 560, z: 2 }
        ] },
        libraryLayout: { height: 330, bg: '', blocks: [
          { id: 'ml1', type: 'media', asset: 'g_mecaquack:img/cinematica4.png', x: 0, y: 0, w: 1000, h: 330, z: 1, shape: 'slant', fit: 'cover' },
          { id: 'ml2', type: 'text', x: 40, y: 190, w: 560, h: 110, z: 2, color: '#ffffff', html: '<h1 style="text-shadow:3px 3px 0 #000;letter-spacing:3px">MECAQUACK</h1>' }
        ] },
        news: [{ id: 'nm1', title: '¡Mecaquack llega a DivierteTEC!', body: 'Ahora con guardado de partida, guarida del jefe en Selvarrón, controles táctiles y 10 logros con recompensas.', date: now - 2 * 3600000 }] },
      { id: 'g_aerodron', title: 'Aerodron 3D', devId: 'u_dev2', format: 'html', genre: 'Carreras', tags: ['3D', 'WebGL', 'Vuelo', 'Contrarreloj'],
        short: 'Rally de drones en 3D: cruza 20 anillos sobre un archipiélago low-poly antes de quedarte sin batería.', description: 'Juego 3D hecho con WebGL puro, sin librerías: terreno generado con ruido, agua animada, aerogeneradores, nubes y cielo de atardecer. Pilota tu dron por un circuito de 20 anillos, recoge baterías, usa el turbo con cuidado y bate tu récord de vuelta. Controles: ← → girar, ↑ ↓ subir y bajar, Espacio turbo; joystick en pantallas táctiles.',
        cover: { c1: '#ff9a6a', c2: '#1b2a5a', glyph: '🚁', angle: 170 }, featured: true, createdAt: now - 30 * 60000,
        pricing: { mode: 'free' },
        achievements: [
          { id: 'dron_despegue', name: 'Despegue', desc: 'Cruza tu primer anillo.', icon: '🚁', goal: 0, reward: 'em_gg' },
          { id: 'dron_10', name: 'Piloto', desc: 'Cruza 10 anillos en un mismo vuelo.', icon: '🎯', goal: 10, reward: 'frame_ice' },
          { id: 'dron_circuito', name: 'Circuito completo', desc: 'Completa los 20 anillos del circuito.', icon: '🏁', goal: 0, reward: 'fx_sparkle' },
          { id: 'dron_record', name: 'Contrarreloj', desc: 'Completa el circuito en menos de 150 segundos.', icon: '⏱️', goal: 0, reward: 'theme_cyber' },
          { id: 'dron_baterias', name: 'Recargado', desc: 'Recoge 30 baterías en total.', icon: '🔋', goal: 30, reward: 'av_alien' },
          { id: 'dron_rasante', name: 'Vuelo rasante', desc: 'Vuela 5 segundos a menos de 3 m del agua.', icon: '🌊', goal: 0, hidden: true, reward: 'em_rocket' }
        ],
        news: [{ id: 'na1', title: 'Aerodron 3D: el primer juego 3D de DivierteTEC', body: 'Mundo 3D en WebGL que corre directo en tu navegador, sin instalar nada.', date: now - 30 * 60000 }] },
      { id: 'g_furia', title: 'Furia TEC', devId: 'u_dev', format: 'html', genre: 'Acción', tags: ['3D', 'Pelea', 'Cooperativo local', 'Compatible con mando', 'Tecnológicos de Guanajuato'],
        short: 'Pelea cooperativa 3D con las mascotas de los Tecnológicos de Guanajuato contra las Sombras.', description: 'Elige a tu mascota —Búho Blanco (Irapuato), Lince (Celaya), León (León), Carnero (Roque), Halcón (Uriangato), Jaguar (Abasolo), Gato Negro Brujo (Purísima del Rincón), Coyote (San Miguel de Allende) o Puma (Salvatierra)— cada una con su especial y habilidad propia. Modo cooperativo por oleadas con ataque combinado y revivir al compañero, jefe final con FINAL TEC, y modo Versus. Hasta 2 jugadores en teclado o con mandos de Xbox con vibración.',
        cover: { c1: '#d92a2a', c2: '#1a0a14', glyph: '🥋', angle: 150 }, featured: true, createdAt: now - 10 * 60000,
        pricing: { mode: 'free' },
        achievements: [
          { id: 'kombat_ola1', name: 'Primera ronda', desc: 'Supera la oleada 1.', icon: '🥊', goal: 0, reward: 'em_fire' },
          { id: 'kombat_combo', name: 'Combo x10', desc: 'Encadena 10 golpes seguidos.', icon: '💥', goal: 0, reward: 'fx_sparkle' },
          { id: 'kombat_coop', name: 'Juntos somos más', desc: 'Lanza un ataque combinado con tu compañero.', icon: '🤝', goal: 0, reward: 'em_gg' },
          { id: 'kombat_revive', name: 'No te dejo atrás', desc: 'Revive a tu compañero caído.', icon: '💚', goal: 0, reward: 'frame_ice' },
          { id: 'kombat_jefe', name: 'Rey caído', desc: 'Derrota al Rey Sombra.', icon: '👑', goal: 0, reward: 'frame_fire' },
          { id: 'kombat_final', name: 'Final TEC', desc: 'Remata al Rey Sombra con el FINAL TEC.', icon: '⚡', goal: 0, reward: 'theme_kombat' },
          { id: 'kombat_versus', name: 'Retador', desc: 'Gana una partida Versus.', icon: '🥋', goal: 0, reward: 'av_ninja' },
          { id: 'kombat_mando', name: 'Control total', desc: 'Juega con un mando.', icon: '🎮', goal: 0, reward: 'em_trophy' },
          { id: 'kombat_perfecto', name: 'Impecable', desc: 'Supera una oleada sin recibir daño.', icon: '✨', goal: 0, hidden: true, reward: 'av_dragon' }
        ],
        news: [{ id: 'nf1', title: 'Furia TEC: ¡las mascotas de los Tecnológicos entran a la arena!', body: 'Pelea en cooperativo o versus, con teclado o mandos de Xbox con vibración.', date: now - 10 * 60000 }] },
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
      g.pricing = Object.assign({ mode: 'free', price: 0, min: 0, discount: 0, inPass: false }, g.pricing);
      g.reviews = g.reviews || [];
      g.news = g.news || [];
      g.plays = g.status === 'approved' ? Math.floor(Math.random() * 900 + 100) : 0;
      g.storeLayout = g.storeLayout || DT.defaultStoreLayout(g);
      g.libraryLayout = g.libraryLayout || DT.defaultLibraryLayout(g);
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
      version: 7,
      currentUserId: 'u_player',
      users: [
        { id: 'u_player', name: 'MARVELL117', role: 'user', bio: 'Jugador de InnovaTec 2026.', status: 'active', createdAt: now - 40 * DAY },
        { id: 'u_luna', name: 'luna_gamer', role: 'user', bio: 'Speedrunner casual.', status: 'active', createdAt: now - 90 * DAY },
        { id: 'u_troll', name: 'xX_troll_Xx', role: 'user', bio: '', status: 'active', createdAt: now - 3 * DAY },
        { id: 'u_dev', name: 'PixelForge Studio', role: 'dev', bio: 'Equipo estudiantil de videojuegos. Hackatec 2026.', status: 'active', verified: true, student: true, createdAt: now - 60 * DAY },
        { id: 'u_maravilla', name: 'Equipo Maravilla', role: 'dev', bio: 'Instituto Tecnológico Superior de Irapuato · creadores de Mecaquack · InnovaTec Hackatec 2026.', status: 'active', verified: true, student: true, createdAt: now - 30 * DAY },
        { id: 'u_dev2', name: 'Nébula Games', role: 'dev', bio: 'Estudio independiente externo: arcades y puzles para el navegador.', status: 'active', verified: false, student: false, createdAt: now - 25 * DAY },
        { id: 'u_admin', name: 'Admin TEC', role: 'admin', bio: 'Moderación de DivierteTEC.', status: 'active', createdAt: now - 120 * DAY }
      ],
      games,
      library: {
        u_player: {
          g_astro: { added: now - 10 * DAY, playtime: 0, lastPlayed: 0 },
          g_cronicas: { added: now - 8 * DAY, playtime: 0, lastPlayed: 0 }
        },
        u_maravilla: { g_mecaquack: { added: now, playtime: 0, lastPlayed: 0 } }
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
      /* ---- Economía (ver js/economy.js y docs/MODELO-DE-NEGOCIO.md) ---- */
      economy: { rateStudent: 0.12, rateExternal: 0.18, seedAllowance: 2000, passPrice: 59, passDevShare: 0.7, passDiscount: 0.1, promoPrice: 150, promoDays: 7 },
      wallets: { u_maravilla: 0, u_player: 300, u_luna: 120, u_troll: 0, u_dev: 258, u_dev2: 48.13, u_admin: 0 },
      purchases: { u_player: { g_cronicas: { date: now - 10 * DAY, paid: 129 } }, u_luna: { g_cronicas: { date: now - 6 * DAY, paid: 129 }, g_neon: { date: now - 2 * DAY, paid: 34.3 } } },
      passes: { u_luna: { since: now - 10 * DAY, until: now + 20 * DAY } },
      promos: [],
      ledger: [
        { id: 'l1', type: 'sale', date: now - 10 * DAY, from: 'u_player', to: 'u_dev', gameId: 'g_cronicas', gross: 129, commission: 0, net: 129, note: 'Semilla TEC (0 %)' },
        { id: 'l2', type: 'sale', date: now - 6 * DAY, from: 'u_luna', to: 'u_dev', gameId: 'g_cronicas', gross: 129, commission: 0, net: 129, note: 'Semilla TEC (0 %)' },
        { id: 'l3', type: 'pass', date: now - 10 * DAY, from: 'u_luna', to: 'platform', gross: 59, commission: 17.7, net: 41.3, note: 'Pase DivierteTEC · 1 mes' },
        { id: 'l4', type: 'sale', date: now - 2 * DAY, from: 'u_luna', to: 'u_dev2', gameId: 'g_neon', gross: 34.3, commission: 6.17, net: 28.13, note: 'Estudio externo (18 %)' },
        { id: 'l5', type: 'tip', date: now - 1 * DAY, from: 'u_luna', to: 'u_dev2', gameId: 'g_astro', gross: 20, commission: 0, net: 20, note: 'Propina' }
      ],
      devRequests: [],
      log: [{ date: now - DAY, actor: 'u_admin', text: 'Aprobó «Neón Drift».' }]
    };
  };
})(window.DT);
