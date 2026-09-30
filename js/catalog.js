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
    emoji: 'Sticker',
    badge: 'Insignia'
  };

  /* Recompensas: el campo `data` se interpreta según el tipo (ver theme.js). */
  DT.REWARDS = {
    // Temas temáticos (la paleta reglamentaria y el modo oscuro siempre están disponibles)
    theme_arcade: { type: 'theme', name: 'Retro Arcade', rarity: 'raro', glyph: 'joystick', desc: 'Neones rosas y amarillos de salón recreativo.', data: 'arcade' },
    theme_cyber: { type: 'theme', name: 'Neón Cyberpunk', rarity: 'epico', glyph: 'palette', desc: 'Cian eléctrico sobre la noche de la ciudad.', data: 'cyber' },
    theme_gameboy: { type: 'theme', name: 'Pixel Boy', rarity: 'raro', glyph: 'joystick', desc: 'Los cuatro verdes de la portátil clásica.', data: 'gameboy' },
    theme_kombat: { type: 'theme', name: 'Kombate', rarity: 'legendario', glyph: 'fist', desc: 'Carmesí y oro de la arena de Furia TEC.', data: 'kombat' },
    theme_space: { type: 'theme', name: 'Galaxia', rarity: 'epico', glyph: 'planet', desc: 'Violetas profundos y polvo de estrellas.', data: 'space' },
    theme_lava: { type: 'theme', name: 'Volcán', rarity: 'legendario', glyph: 'flame', desc: 'Magma, brasas y obsidiana.', data: 'lava' },
    // Marcos
    frame_gold: { type: 'frame', name: 'Marco Dorado', rarity: 'raro', glyph: 'medal', desc: 'Anillo de oro pulido.', data: 'gold' },
    frame_neon: { type: 'frame', name: 'Marco Neón', rarity: 'epico', glyph: 'sparkle', desc: 'Pulso de neón animado.', data: 'neon' },
    frame_pixel: { type: 'frame', name: 'Marco Pixel', rarity: 'comun', glyph: 'cube', desc: 'Borde escalonado de 8 bits.', data: 'pixel' },
    frame_fire: { type: 'frame', name: 'Marco de Fuego', rarity: 'legendario', glyph: 'flame', desc: 'Llamas que giran sin parar.', data: 'fire' },
    frame_ice: { type: 'frame', name: 'Marco de Hielo', rarity: 'raro', glyph: 'snow', desc: 'Cristal frío y brillante.', data: 'ice' },
    // Avatares
    av_robot: { type: 'avatar', name: 'Robot', rarity: 'comun', glyph: 'frame', desc: 'Tu primer compañero.', data: 'robot' },
    av_alien: { type: 'avatar', name: 'Invasor', rarity: 'raro', glyph: 'frame', desc: 'Directo desde los arcades.', data: 'invasor' },
    av_ninja: { type: 'avatar', name: 'Ninja', rarity: 'epico', glyph: 'frame', desc: 'Silencioso y letal.', data: 'ninja' },
    av_dragon: { type: 'avatar', name: 'Dragón', rarity: 'legendario', glyph: 'frame', desc: 'Solo para los más persistentes.', data: 'dragon' },
    av_astro: { type: 'avatar', name: 'Astronauta', rarity: 'raro', glyph: 'frame', desc: 'Explorador de mundos.', data: 'astro' },
    av_pato: { type: 'avatar', name: 'Mecaquack', rarity: 'legendario', glyph: 'frame', desc: 'El pato ingeniero que salvó el archipiélago.', data: 'pato' },
    av_gato: { type: 'avatar', name: 'Michi jardinero', rarity: 'epico', glyph: 'frame', desc: 'El gato que cuida Pixel Garden.', data: 'gato' },
    // Efectos (partículas que siguen al cursor)
    fx_sparkle: { type: 'effect', name: 'Destellos', rarity: 'raro', glyph: 'sparkle', desc: 'Chispas doradas al mover el cursor.', data: 'sparkle' },
    fx_pixels: { type: 'effect', name: 'Píxeles', rarity: 'comun', glyph: 'cube', desc: 'Una estela de píxeles de colores.', data: 'pixels' },
    fx_stars: { type: 'effect', name: 'Estrellas', rarity: 'epico', glyph: 'star', desc: 'Estrellas fugaces tras tu cursor.', data: 'stars' },
    fx_fire: { type: 'effect', name: 'Brasas', rarity: 'legendario', glyph: 'flame', desc: 'Brasas ardientes que suben.', data: 'fire' },
    // Emojis (se usan en reseñas y comunidad)
    em_gg: { type: 'emoji', name: 'GG', rarity: 'comun', glyph: 'smile', desc: 'Buena partida.', data: 'gg' },
    em_fire: { type: 'emoji', name: 'En llamas', rarity: 'comun', glyph: 'smile', desc: 'Está que arde.', data: 'fuego' },
    em_crown: { type: 'emoji', name: 'Corona', rarity: 'raro', glyph: 'smile', desc: 'Para el rey de la partida.', data: 'corona' },
    em_skull: { type: 'emoji', name: 'Calavera', rarity: 'raro', glyph: 'smile', desc: 'Game over.', data: 'calavera' },
    em_rocket: { type: 'emoji', name: 'Cohete', rarity: 'epico', glyph: 'smile', desc: 'Al infinito.', data: 'cohete' },
    em_trophy: { type: 'emoji', name: 'Trofeo', rarity: 'epico', glyph: 'smile', desc: 'Campeón.', data: 'trofeo' },
    em_punch: { type: 'emoji', name: 'Remate', rarity: 'epico', glyph: 'smile', desc: 'Para quien cierra con FATALITY.', data: 'puno' },
    // Insignias
    badge_pioneer: { type: 'badge', name: 'Pionero', rarity: 'raro', glyph: 'flag', desc: 'Estuvo en DivierteTEC desde el principio.', data: 'flag' },
    badge_critic: { type: 'badge', name: 'Crítico', rarity: 'comun', glyph: 'note', desc: 'Escribió reseñas para la comunidad.', data: 'note' },
    badge_guard: { type: 'badge', name: 'Guardián', rarity: 'raro', glyph: 'shield', desc: 'Ayudó a mantener segura la comunidad.', data: 'shield' },
    badge_creator: { type: 'badge', name: 'Creador', rarity: 'epico', glyph: 'wrench', desc: 'Publicó un juego en DivierteTEC.', data: 'wrench' },
    badge_torre: { type: 'badge', name: 'Campeón de la Torre', rarity: 'legendario', glyph: 'castle', desc: 'Conquistó la Torre Kombate de Furia TEC.', data: 'castle' },
    badge_pase: { type: 'badge', name: 'Miembro del Pase', rarity: 'epico', glyph: 'ticket', desc: 'Apoya a los creadores con el Pase DivierteTEC.', data: 'ticket' },
    badge_hackatec: { type: 'badge', name: 'Hackatec 2026', rarity: 'legendario', glyph: 'medal', desc: 'Edición regional InnovaTec 2026.', data: 'medal' },
    badge_tecnm: { type: 'badge', name: 'Comunidad TecNM', rarity: 'epico', glyph: 'cap', desc: 'Cuenta verificada del Tecnológico Nacional de México.', data: 'cap' }
  };

  /* Avatares y stickers gratuitos para todos (ilustraciones en js/art.js) */
  DT.FREE_AVATARS = ['control', 'sonrisa', 'lentes', 'minino', 'zorro', 'panda'];
  DT.FREE_STICKERS = ['pulgar', 'nopulgar', 'risa', 'sorpresa', 'corazon'];

  /* Logros de plataforma: se evalúan con `check` sobre el estado del usuario. */
  DT.PLATFORM_ACH = [
    { id: 'p_welcome', name: 'Bienvenido a DivierteTEC', desc: 'Entra por primera vez a la plataforma.', icon: 'hand', reward: ['av_robot', 'badge_pioneer'],
      check: (s) => true },
    { id: 'p_first_play', name: 'Primera partida', desc: 'Juega cualquier juego en el navegador.', icon: 'gamepad', reward: ['theme_arcade'],
      check: (s) => s.sessions >= 1 },
    { id: 'p_collector', name: 'Coleccionista', desc: 'Ten 3 juegos en tu biblioteca.', icon: 'book', reward: ['frame_gold'],
      check: (s) => s.owned >= 3 },
    { id: 'p_explorer', name: 'Explorador', desc: 'Visita 5 páginas de tienda distintas.', icon: 'compass', reward: ['frame_pixel', 'fx_pixels'],
      check: (s) => s.visited >= 5 },
    { id: 'p_critic', name: 'Crítico', desc: 'Publica tu primera reseña.', icon: 'note', reward: ['badge_critic', 'em_gg'],
      check: (s) => s.reviews >= 1 },
    { id: 'p_marathon', name: 'Maratón', desc: 'Acumula 30 minutos de juego.', icon: 'stopwatch', reward: ['theme_cyber'],
      check: (s) => s.playtime >= 1800 },
    { id: 'p_hunter', name: 'Cazador de logros', desc: 'Desbloquea 5 logros dentro de juegos.', icon: 'target', reward: ['theme_space', 'fx_stars'],
      check: (s) => s.gameAch >= 5 },
    { id: 'p_guard', name: 'Guardián', desc: 'Envía un reporte para mantener sana la comunidad.', icon: 'shield', reward: ['badge_guard'],
      check: (s) => s.reports >= 1 },
    { id: 'p_creator', name: 'Creador', desc: 'Publica un juego aprobado por la administración.', icon: 'wrench', reward: ['badge_creator', 'theme_gameboy'],
      check: (s) => s.published >= 1 }
  ];

  /* ---------- Criterios de aprobación (contenido) ----------
     Lista ligera: lo técnico se revisa solo y la persona que revisa confirma el contenido.
     auto(g): se evalúa solo; los demás los confirma la administración. */
  DT.CRITERIA_REF = 'Lista de referencia de la plataforma, inspirada en las clasificaciones por edad de videojuegos (tipo de violencia, lenguaje, temas sensibles). No sustituye una clasificación oficial.';
  DT.AGES = ['Todo público', '+10', '+13', '+16', '+18'];
  DT.VIOLENCE = [['ninguna', 'Sin violencia'], ['caricatura', 'Caricaturesca o de fantasía, sin sangre'], ['combate', 'Combate, armas o guerra sin sangre'], ['realista', 'Realista o con sangre']];
  DT.VIOLENCE_MIN_AGE = { ninguna: 0, caricatura: 0, combate: 2, realista: 3 }; // índice mínimo en DT.AGES
  DT.APPROVAL_CRITERIA = [
    { group: 'Técnico', icon: 'gear', items: [
      { id: 't_files', text: 'Archivos del juego o descargable válidos', auto: (g) => (g.format === 'html' ? !!(g.files || (DT.BUILTIN && DT.BUILTIN[g.id])) : !!g.download) },
      { id: 't_desc', text: 'Ficha completa y sin palabras bloqueadas', auto: (g) => !!(g.short && g.description) && !DT.hasBanned([g.title, g.short, g.description, (g.tags || []).join(' ')].join(' ')) },
      { id: 't_run', text: 'Se juega sin errores bloqueantes en el modo de prueba' }
    ] },
    { group: 'Violencia y contenido bélico', icon: 'shield', items: [
      { id: 'v_decl', text: 'Tipo de violencia declarado y acorde a la edad recomendada', auto: (g) => { const c = g.compliance || {}; return !!c.age && !!c.violence && DT.AGES.indexOf(c.age) >= (DT.VIOLENCE_MIN_AGE[c.violence] || 0); } },
      { id: 'v_grafica', text: 'Sin violencia gráfica extrema: tortura, mutilación o sangre gratuita' },
      { id: 'v_real', text: 'Sin glorificar guerras, atentados o tragedias reales, ni propaganda de grupos armados o extremistas' }
    ] },
    { group: 'Otros temas sensibles', icon: 'heart', items: [
      { id: 's_odio', text: 'Sin discursos de odio, discriminación ni acoso' },
      { id: 's_adulto', text: 'Sin contenido sexual explícito, apuestas con dinero real ni promoción de drogas' }
    ] },
    { group: 'Derechos y seguridad', icon: 'note', items: [
      { id: 'p_creditos', text: 'Créditos y licencias de los recursos declarados', auto: (g) => !!(g.compliance && (g.compliance.credits || '').trim()) },
      { id: 'd_seguro', text: 'Sin código malicioso ni recolección de datos personales sin aviso' }
    ] }
  ];
  /* Estado de cada criterio: auto → calculado; manual → marcado por el admin */
  DT.criteriaStatus = (g) => {
    const checks = (g.review && g.review.checks) || {};
    const out = [];
    DT.APPROVAL_CRITERIA.forEach((grp) => grp.items.forEach((c) => out.push({ c, grp, auto: !!c.auto, ok: c.auto ? !!c.auto(g) : !!checks[c.id] })));
    return out;
  };

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
  const byId0 = (list, id) => list.find((g) => g.id === id) || {};
  DT.seedState = () => {
    const now = Date.now();
    const games = [
      { id: 'g_astro', title: 'Astro Runner', devId: 'u_maravilla', format: 'html', genre: 'Arcade', tags: ['Plataformas', 'Espacio', 'Un jugador'],
        short: 'Corre, salta y esquiva meteoritos en la superficie de una luna con baja gravedad.', description: 'Runner infinito en HTML5 Canvas: doble salto con mochila propulsora, meteoritos rodantes y voladores, estrellas coleccionables y velocidad que no deja de subir. Controles: Espacio, flecha arriba o tocar la pantalla.',
        cover: { c1: '#1a6fd8', c2: '#0a1a3a', art: 'astro', angle: 160 }, featured: true, createdAt: now,
        pricing: { mode: 'pwyw', price: 25, min: 0 },
        achievements: [
          { id: 'astro_despegue', name: 'Despegue', desc: 'Empieza tu primera carrera.', icon: 'rocket', goal: 0, reward: 'em_gg' },
          { id: 'astro_1000', name: 'Mil metros', desc: 'Recorre 1000 m en una carrera.', icon: 'ruler', goal: 1000, reward: 'fx_sparkle' },
          { id: 'astro_estrellas', name: 'Coleccionista estelar', desc: 'Recoge 50 estrellas en total.', icon: 'star', goal: 50, reward: 'av_alien' },
          { id: 'astro_intocable', name: 'Intocable', desc: 'Sobrevive 60 segundos en una carrera.', icon: 'shield', goal: 0, reward: 'frame_neon' },
          { id: 'astro_agujero', name: 'Horizonte de sucesos', desc: 'Llega a 5000 m sin chocar.', icon: 'planet', goal: 0, hidden: true, reward: 'em_rocket' }
        ] },
      { id: 'g_garden', title: 'Pixel Garden', devId: 'u_maravilla', format: 'html', genre: 'Simulación', tags: ['Relajante', 'Pixel art', 'Granja'],
        short: 'Cultiva un jardín pixelado que crece incluso cuando no juegas.', description: 'Juego idle de jardinería con estética de consola portátil: planta zanahorias, girasoles, calabazas y cactus estelares, cosecha monedas, desbloquea semillas y adopta a Michi, el gato que cosecha por ti. Las plantas crecen en tiempo real, aunque cierres el juego.',
        cover: { c1: '#5bd16b', c2: '#1d4d2a', art: 'garden' }, createdAt: now,
        pricing: { mode: 'pwyw', price: 20, min: 0, inPass: true },
        achievements: [
          { id: 'garden_cosecha', name: 'Primera cosecha', desc: 'Cosecha tu primera planta.', icon: 'sprout', goal: 0, reward: 'em_fire' },
          { id: 'garden_100', name: 'Buen año', desc: 'Gana 100 monedas en total.', icon: 'coin', goal: 100, reward: 'frame_pixel' },
          { id: 'garden_botanico', name: 'Botánico', desc: 'Desbloquea las 4 semillas.', icon: 'leaf', goal: 0, reward: 'fx_pixels' },
          { id: 'garden_gato', name: 'Michi', desc: 'Adopta al gato jardinero.', icon: 'paw', goal: 0, reward: 'av_gato' },
          { id: 'garden_dorada', name: 'Flor dorada', desc: 'Encuentra una flor dorada al cosechar (2 %).', icon: 'sprout', goal: 0, hidden: true, reward: 'em_crown' }
        ] },
      { id: 'g_neon', title: 'Neón Drift', devId: 'u_maravilla', format: 'html', genre: 'Carreras', tags: ['Carreras', 'Synthwave', 'Arcade'],
        short: 'Carreras arcade en una autopista synthwave infinita.', description: 'Autopista pseudo-3D de neón: cambia de carril, esquiva el tráfico, pasa rozando para ganar bonus de "casi choque" y usa el turbo para duplicar puntos. Controles: ← → y Espacio, o toques en móvil.',
        cover: { c1: '#ff2a6d', c2: '#05070f', art: 'neon' }, featured: true, createdAt: now,
        pricing: { mode: 'paid', price: 35, inPass: true },
        achievements: [
          { id: 'drift_primera', name: 'Luz verde', desc: 'Corre tu primera carrera.', icon: 'raceflag', goal: 0, reward: 'em_gg' },
          { id: 'drift_2000', name: 'Velocidad de crucero', desc: 'Consigue 2000 puntos en una carrera.', icon: 'raceflag', goal: 2000, reward: 'frame_ice' },
          { id: 'drift_casi', name: 'Por un pelo', desc: 'Logra 20 casi choques en total.', icon: 'burst', goal: 20, reward: 'em_skull' },
          { id: 'drift_turbo', name: 'Nitro', desc: 'Usa el turbo 10 veces.', icon: 'flame', goal: 10, reward: 'fx_fire' },
          { id: 'drift_leyenda', name: 'Leyenda de la autopista', desc: 'Sobrevive 3 minutos en una carrera.', icon: 'trophy', goal: 0, hidden: true, reward: 'em_trophy' }
        ] },
      { id: 'g_quantum', title: 'Quantum Puzzle', devId: 'u_maravilla', format: 'html', genre: 'Puzle', tags: ['Puzle', 'Ciencia'],
        short: 'Colapsa partículas entrelazadas a su estado base.', description: 'Rompecabezas tipo "luces fuera" con física cuántica de mentira: al tocar una partícula cambian ella, sus vecinas y su pareja entrelazada. 10 niveles diseñados de 3×3 a 5×5, contador de movimientos, "par" por nivel y deshacer.',
        cover: { c1: '#00d2ff', c2: '#3a0ca3', art: 'quantum' }, createdAt: now,
        pricing: { mode: 'pwyw', price: 20, min: 0 },
        achievements: [
          { id: 'quantum_1', name: 'Primera observación', desc: 'Resuelve tu primer nivel.', icon: 'eye', goal: 0, reward: 'em_gg' },
          { id: 'quantum_5', name: 'Superposición', desc: 'Resuelve 5 niveles.', icon: 'atom', goal: 5, reward: 'frame_gold' },
          { id: 'quantum_optimo', name: 'Eficiencia cuántica', desc: 'Resuelve un nivel en el par de movimientos o menos.', icon: 'bolt', goal: 0, reward: 'fx_sparkle' },
          { id: 'quantum_todo', name: 'Colapso total', desc: 'Resuelve los 10 niveles.', icon: 'atom', goal: 0, reward: 'theme_space' },
          { id: 'quantum_sin_deshacer', name: 'Sin mirar atrás', desc: 'Resuelve 3 niveles seguidos sin deshacer.', icon: 'astro', goal: 0, hidden: true, reward: 'av_astro' }
        ] },
      { id: 'g_mecaquack', title: 'Mecaquack', devId: 'u_maravilla', format: 'html', genre: 'Aventura', tags: ['Aventura', 'Educativo', 'Ingeniería', 'Pixel art', 'Hackatec 2026'],
        short: 'Un pato ingeniero recorre un archipiélago resolviendo retos de física y derrotando a los Tiburones de Tierra.', description: 'Los Tiburones de Tierra arrasaron el archipiélago y dispersaron a la parvada. Mecaquack, un pato ingeniero, recorre 10 islas resolviendo 19 retos de física, química y materiales (en fácil, normal o difícil), ensambla un dron-mochila para cruzar el océano, desbloquea 5 tecnologías y se enfrenta a Bombón, el chihuahua de agua salada. Juego de la fase local de InnovaTec Hackatec, hecho por el Equipo Maravilla del Instituto Tecnológico Superior de Irapuato.',
        cover: { asset: 'g_mecaquack:img/cinematica4.png', c1: '#5b4fb3', c2: '#f39c12', motif: 'gamepad', pos: '60% 40%' }, featured: true, createdAt: now,
        pricing: { mode: 'pwyw', price: 25, min: 0 },
        achievements: [
          { id: 'meca_primer_reto', name: 'Primer invento', desc: 'Completa tu primer reto de ingeniería.', icon: 'gear', goal: 0, reward: 'em_fire' },
          { id: 'meca_dron', name: 'Ingeniero aéreo', desc: 'Ensambla el dron-mochila.', icon: 'drone', goal: 0, reward: 'frame_neon' },
          { id: 'meca_tiburones', name: 'Cazatiburones', desc: 'Derrota 25 Tiburones de Tierra.', icon: 'fish', goal: 25, reward: 'fx_fire' },
          { id: 'meca_dificil', name: 'Mente brillante', desc: 'Completa 5 retos en dificultad DIFÍCIL.', icon: 'skull', goal: 5, reward: 'frame_gold' },
          { id: 'meca_estrellas', name: 'Constelación', desc: 'Gana 100 estrellas en total.', icon: 'star', goal: 100, reward: 'fx_stars' },
          { id: 'meca_islas', name: 'Explorador del archipiélago', desc: 'Visita las 10 islas.', icon: 'map', goal: 0, reward: 'frame_ice' },
          { id: 'meca_retos', name: 'Archipiélago completo', desc: 'Completa los 19 retos.', icon: 'island', goal: 0, reward: 'theme_lava' },
          { id: 'meca_bombon', name: 'Adiós, Bombón', desc: 'Derrota al jefe final en su guarida de Selvarrón.', icon: 'paw', goal: 0, reward: 'av_pato' },
          { id: 'meca_perfecto', name: 'Sin un rasguño', desc: 'Vence a Bombón sin perder vida.', icon: 'shield', goal: 0, hidden: true, reward: 'badge_hackatec' },
          { id: 'meca_moda', name: 'Pato a la moda', desc: 'Equipa sombrero, skin y estela al mismo tiempo.', icon: 'hat', goal: 0, hidden: true, reward: 'em_crown' }
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
        ] }, },
      { id: 'g_aerodron', title: 'Aerodron 3D', devId: 'u_maravilla', format: 'html', genre: 'Carreras', tags: ['3D', 'WebGL', 'Vuelo', 'Contrarreloj'],
        short: 'Rally de drones en 3D: cruza 20 anillos sobre un archipiélago low-poly antes de quedarte sin batería.', description: 'Juego 3D hecho con WebGL puro, sin librerías: terreno generado con ruido, agua animada, aerogeneradores, nubes y cielo de atardecer. Pilota tu dron por un circuito de 20 anillos, recoge baterías, usa el turbo con cuidado y bate tu récord de vuelta. Controles: ← → girar, ↑ ↓ subir y bajar, Espacio turbo; joystick en pantallas táctiles.',
        cover: { c1: '#ff9a6a', c2: '#1b2a5a', art: 'aerodron', angle: 170 }, featured: true, createdAt: now,
        pricing: { mode: 'pwyw', price: 25, min: 0 },
        achievements: [
          { id: 'dron_despegue', name: 'Despegue', desc: 'Cruza tu primer anillo.', icon: 'drone', goal: 0, reward: 'em_gg' },
          { id: 'dron_10', name: 'Piloto', desc: 'Cruza 10 anillos en un mismo vuelo.', icon: 'target', goal: 10, reward: 'frame_ice' },
          { id: 'dron_circuito', name: 'Circuito completo', desc: 'Completa los 20 anillos del circuito.', icon: 'raceflag', goal: 0, reward: 'fx_sparkle' },
          { id: 'dron_record', name: 'Contrarreloj', desc: 'Completa el circuito en menos de 150 segundos.', icon: 'stopwatch', goal: 0, reward: 'theme_cyber' },
          { id: 'dron_baterias', name: 'Recargado', desc: 'Recoge 30 baterías en total.', icon: 'battery', goal: 30, reward: 'av_alien' },
          { id: 'dron_rasante', name: 'Vuelo rasante', desc: 'Vuela 5 segundos a menos de 3 m del agua.', icon: 'wave', goal: 0, hidden: true, reward: 'em_rocket' }
        ], },
      { id: 'g_furia', title: 'Furia TEC', devId: 'u_maravilla', format: 'html', genre: 'Acción', tags: ['3D', 'Pelea', 'Cooperativo local', 'Compatible con mando', 'Tecnológicos de Guanajuato'],
        short: 'Pelea cooperativa 3D con las mascotas de los Tecnológicos de Guanajuato contra las Sombras.', description: 'Elige a tu mascota —Búho Blanco (Irapuato), Lince (Celaya), León (León), Carnero (Roque), Halcón (Uriangato), Jaguar (Abasolo), Gato Negro Brujo (Purísima del Rincón), Coyote (San Miguel de Allende) o Puma (Salvatierra)— cada una con su especial y habilidad propia. Modo cooperativo por oleadas con ataque combinado y revivir al compañero, jefe final con FINAL TEC, y modo Kombate 1 vs 1 frenético estilo arcade (contragolpes, congelado de impacto, ¡ACÁBALO! y una FATALITY caricaturesca por mascota) con la Torre contra la CPU. Ataques ligeros, medios, pesados, barridos, aéreos y combos encadenados en 5 escenarios. Hasta 2 jugadores en teclado o con mandos de Xbox con vibración.',
        cover: { c1: '#d92a2a', c2: '#1a0a14', art: 'furia', angle: 150 }, featured: true, createdAt: now,
        pricing: { mode: 'pwyw', price: 25, min: 0 },
        achievements: [
          { id: 'kombat_ola1', name: 'Primera ronda', desc: 'Supera la oleada 1.', icon: 'fist', goal: 0, reward: 'em_fire' },
          { id: 'kombat_combo', name: 'Combo x10', desc: 'Encadena 10 golpes seguidos.', icon: 'burst', goal: 0, reward: 'fx_sparkle' },
          { id: 'kombat_coop', name: 'Juntos somos más', desc: 'Lanza un ataque combinado con tu compañero.', icon: 'hand', goal: 0, reward: 'em_gg' },
          { id: 'kombat_revive', name: 'No te dejo atrás', desc: 'Revive a tu compañero caído.', icon: 'heart', goal: 0, reward: 'frame_ice' },
          { id: 'kombat_jefe', name: 'Rey caído', desc: 'Derrota al Rey Sombra.', icon: 'crown', goal: 0, reward: 'frame_fire' },
          { id: 'kombat_final', name: 'Final TEC', desc: 'Remata al Rey Sombra con el FINAL TEC.', icon: 'bolt', goal: 0, reward: 'theme_kombat' },
          { id: 'kombat_versus', name: 'Retador', desc: 'Gana una partida de Kombate 1 vs 1.', icon: 'fist', goal: 0, reward: 'av_ninja' },
          { id: 'kombat_remate', name: 'Fatality TEC', desc: 'Termina una pelea 1 vs 1 con la FATALITY de tu mascota.', icon: 'fist', goal: 0, reward: 'em_punch' },
          { id: 'kombat_impecable', name: 'Victoria impecable', desc: 'Gana un round 1 vs 1 sin recibir daño.', icon: 'star', goal: 0, reward: 'fx_stars' },
          { id: 'kombat_brutal', name: 'Combo Brutal', desc: 'Conecta el COMBO BRUTAL: ligero, ligero, medio, pesado.', icon: 'burst', goal: 0, reward: 'em_crown' },
          { id: 'kombat_torre', name: 'Campeón de la Torre', desc: 'Conquista la Torre Kombate: 5 mascotas y el Rey Sombra.', icon: 'castle', goal: 0, reward: 'badge_torre' },
          { id: 'kombat_mando', name: 'Control total', desc: 'Juega con un mando.', icon: 'gamepad', goal: 0, reward: 'em_trophy' },
          { id: 'kombat_perfecto', name: 'Impecable', desc: 'Supera una oleada sin recibir daño.', icon: 'sparkle', goal: 0, hidden: true, reward: 'av_dragon' }
        ], },
      { id: 'g_leyendas', title: 'Choque de Leyendas', devId: 'u_player', ownerId: 'u_player', private: true, format: 'html', genre: 'Pelea', tags: ['3D', 'Pelea de plataformas', 'Hasta 4 jugadores', 'Compatible con mando', 'Personal'],
        short: 'Pelea de plataformas 3D para hasta 4 leyendas. Proyecto personal de homenaje, sin fines comerciales.', description: 'Juego personal de MARVELL117, sin fines comerciales y fuera de la tienda: solo aparece en su biblioteca. Pelea de plataformas en 3D (WebGL puro) con porcentaje de daño, empuje que crece con el daño y el peso, vidas, orillas, escudo, esquivas y la Esfera Legendaria que activa el Ataque Definitivo. Incluye 9 personajes con modelos de bloques originales, animaciones y 4 especiales propios cada uno: Master Chief, Doomguy, Steve, Bob Esponja, Ben 10, Jonesy, Sonic, Kratos y Pac-Man. Tiene 6 escenarios, CPU en 3 niveles y hasta 4 jugadores con teclado o mandos con vibración. Los personajes pertenecen a sus respectivos dueños; no se usan arte, logotipos ni audio de las franquicias.',
        cover: { c1: '#3b6bff', c2: '#0b1030', motif: 'burst', angle: 150 }, createdAt: now,
        pricing: { mode: 'personal', price: 0, min: 0 },
        achievements: [
          { id: 'ley_victoria', name: 'Primera leyenda', desc: 'Gana una partida.', icon: 'trophy', goal: 0, reward: 'em_crown' },
          { id: 'ley_impecable', name: 'Sin rasguños', desc: 'Gana en modo Vidas sin perder ninguna.', icon: 'shield', goal: 0, reward: 'frame_gold' },
          { id: 'ley_definitivo', name: 'Definitivo', desc: 'Saca a un rival con tu Ataque Definitivo.', icon: 'burst', goal: 0, reward: 'fx_fire' },
          { id: 'ley_150', name: 'Aguantador', desc: 'Saca a un rival que tenía 150 % o más.', icon: 'fist', goal: 0, reward: 'em_punch' },
          { id: 'ley_roster', name: 'Todos los estilos', desc: 'Juega con los 9 personajes.', icon: 'star', goal: 9, reward: 'av_ninja' },
          { id: 'ley_escenarios', name: 'Trotamundos', desc: 'Gana en los 6 escenarios.', icon: 'map', goal: 6, reward: 'theme_space' },
          { id: 'ley_cuatro', name: 'Caos total', desc: 'Juega una partida de 4 peleadores.', icon: 'gamepad', goal: 0, reward: 'em_fire' },
          { id: 'ley_mando', name: 'Control en mano', desc: 'Juega con un mando.', icon: 'gamepad', goal: 0, reward: 'em_trophy' }
        ] },
    ];
    // Logros de ejemplo para los juegos de catálogo
    const genericAch = (prefix) => [
      { id: prefix + '_1', name: 'Calentando motores', desc: 'Juega tu primera partida.', icon: 'shield', goal: 0, reward: 'em_gg' },
      { id: prefix + '_2', name: 'Veterano', desc: 'Juega 10 partidas.', icon: 'medal', goal: 10, reward: 'fx_sparkle' },
      { id: prefix + '_3', name: 'Leyenda', desc: 'Completa el juego al 100%.', icon: 'trophy', goal: 0, reward: 'em_trophy' }
    ];
    games.forEach((g) => {
      g.status = g.status || 'approved';
      g.achievements = g.achievements || genericAch(g.id.slice(2, 6));
      g.files = null;
      g.pricing = Object.assign({ mode: 'pwyw', price: 20, min: 0, discount: 0, inPass: false }, g.pricing);
      g.reviews = g.reviews || [];
      g.news = g.news || [];
      g.plays = 0; // solo se cuentan partidas reales
      g.storeLayout = g.storeLayout || DT.defaultStoreLayout(g);
      g.libraryLayout = g.libraryLayout || DT.defaultLibraryLayout(g);
      g.reviewNote = '';
      g.compliance = g.compliance || { age: 'Todo público', violence: 'ninguna', credits: 'Arte, sonido y código originales del Equipo Maravilla.' };
    });
    byId0(games, 'g_furia').compliance = { age: '+10', violence: 'caricatura', credits: 'Mascotas de los Tecnológicos de Guanajuato representadas como homenaje, sin logotipos. Motor WebGL, modelos y arte originales del Equipo Maravilla.' };
    byId0(games, 'g_leyendas').compliance = { age: '+13', violence: 'combate', credits: 'Proyecto personal de homenaje, sin fines comerciales ni publicación en la tienda. Los personajes pertenecen a sus respectivos dueños. Modelos de bloques, animaciones y sonidos originales.' };
    byId0(games, 'g_mecaquack').compliance = { age: 'Todo público', violence: 'caricatura', credits: 'Arte y código originales del Equipo Maravilla (ITESI).' };

    return {
      version: 10,
      currentUserId: 'u_player',
      users: [
        { id: 'u_player', name: 'MARVELL117', role: 'user', bio: 'Jugador de InnovaTec 2026.', status: 'active', createdAt: now },
        { id: 'u_maravilla', name: 'Equipo Maravilla', role: 'dev', bio: 'Instituto Tecnológico Superior de Irapuato · creadores de Mecaquack · InnovaTec Hackatec 2026.', status: 'active', verified: true, student: true, campus: 'ITESI · Irapuato', tecnm: { verified: true, campus: 'ITESI · Irapuato', since: now }, createdAt: now },
        { id: 'u_admin', name: 'Admin TEC', role: 'admin', bio: 'Cuenta de administración para la demostración.', status: 'active', createdAt: now }
      ],
      games,
      library: { u_player: { g_leyendas: { added: now, playtime: 0, lastPlayed: 0, source: 'personal' } } },
      achievements: {},   // userId -> gameId -> achId -> {unlockedAt, progress}
      platformAch: {},    // userId -> achId -> unlockedAt
      stats: {},          // userId -> gameId -> {key: value}
      counters: {},       // userId -> {sessions, visited:[], reports}
      inventory: {},      // userId -> [rewardId]
      equipped: {},       // userId -> {theme, dark, frame, avatar, effect, badge}
      customRewards: {},  // recompensas creadas por desarrolladores
      reports: [],
      bannedWords: ['idiota', 'basura', 'estúpido'],
      /* ---- Economía (ver js/economy.js y docs/MODELO-DE-NEGOCIO.md) ---- */
      economy: { rateStudent: 0.12, rateExternal: 0.18, seedDays: 21, passPrice: 59, passDevShare: 0.7, passDiscount: 0.1, promoPrice: 150, promoDays: 7, passTecnmDiscount: 0.3, causeRate: 0.05 },
      wallets: { u_maravilla: 0, u_player: 0, u_admin: 0 }, // saldo simulado: se recarga con el botón de demostración
      purchases: {},
      passes: {},
      promos: [],
      ledger: [],
      devRequests: [],    // solicitudes para ser desarrollador (js/verify.js)
      tecnmRequests: [],  // solicitudes de verificación TecNM
      log: []
    };
  };
})(window.DT);
