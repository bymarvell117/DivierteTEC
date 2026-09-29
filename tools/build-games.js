/* Empaqueta los juegos integrados (games/<carpeta>/) en js/games/<carpeta>.js
   para que carguen con doble clic en index.html (file://, sin fetch).
   Uso: node tools/build-games.js   — ejecútalo después de editar un juego. */
const fs = require('fs');
const path = require('path');

const GAMES = {
  'astro-runner': 'g_astro',
  'pixel-garden': 'g_garden',
  'neon-drift': 'g_neon',
  'quantum-puzzle': 'g_quantum'
};
const root = path.join(__dirname, '..');

for (const [dir, gid] of Object.entries(GAMES)) {
  const src = path.join(root, 'games', dir);
  const files = {};
  const walk = (d, rel) => fs.readdirSync(d).forEach((f) => {
    const full = path.join(d, f);
    const r = rel ? rel + '/' + f : f;
    if (fs.statSync(full).isDirectory()) return walk(full, r);
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
