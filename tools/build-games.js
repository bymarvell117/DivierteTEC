/* Empaqueta los juegos integrados (games/<carpeta>/) en js/games/<carpeta>.js
   para que carguen con doble clic en index.html (file://, sin fetch).
   Uso: node tools/build-games.js   — ejecútalo después de editar un juego. */
const fs = require('fs');
const path = require('path');

const GAMES = {
  'astro-runner': 'g_astro',
  'pixel-garden': 'g_garden',
  'neon-drift': 'g_neon',
  'quantum-puzzle': 'g_quantum',
  'mecaquack': 'g_mecaquack',
  'aerodron-3d': 'g_aerodron',
  'furia-tec': 'g_furia'
};
const TEXT = /\.(html?|js|css|json|txt|svg)$/i;
const MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', mp3: 'audio/mpeg', ogg: 'audio/ogg', wav: 'audio/wav' };
const root = path.join(__dirname, '..');

for (const [dir, gid] of Object.entries(GAMES)) {
  const src = path.join(root, 'games', dir);
  const files = {};
  const walk = (d, rel) => fs.readdirSync(d).forEach((f) => {
    const full = path.join(d, f);
    const r = rel ? rel + '/' + f : f;
    if (fs.statSync(full).isDirectory()) return walk(full, r);
    // Binarios (imágenes, audio) se guardan en base64
    if (!TEXT.test(f)) { files[r] = { b64: fs.readFileSync(full).toString('base64'), type: MIME[f.split('.').pop().toLowerCase()] || 'application/octet-stream' }; return; }
    let text = fs.readFileSync(full, 'utf8');
    // El SDK local solo sirve fuera de la plataforma: dentro se inyecta el real
    if (/\.html?$/.test(f)) text = text.replace(/\s*<script[^>]*data-dt-sdk[^>]*><\/script>/g, '');
    files[r] = text;
  });
  walk(src, '');
  const out = `/* Generado por tools/build-games.js a partir de games/${dir}/ — no editar a mano. */\n` +
    `DT.registerBuiltin(${JSON.stringify(gid)}, { entry: 'index.html', files: ${JSON.stringify(files)} });\n`;
  fs.writeFileSync(path.join(root, 'js', 'games', dir + '.js'), out);
  console.log('✔', dir, '→', gid, Object.keys(files).length, 'archivo(s)');
}
