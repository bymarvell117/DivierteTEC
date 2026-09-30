/* Embebe las capturas de presentacion/img/*.jpg dentro de presentacion/index.html
   (bloque <script id="deck-img">), para que la presentación funcione aunque se copie
   solo el archivo HTML, sin su carpeta img/.
   Uso: node tools/embed-deck-images.js   — ejecútalo después de cambiar una captura. */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'presentacion');
const HTML = path.join(DIR, 'index.html');
const IMG = path.join(DIR, 'img');

const data = {};
fs.readdirSync(IMG).filter((f) => /\.jpe?g$/i.test(f)).sort().forEach((f) => {
  data[f.replace(/\.jpe?g$/i, '')] = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(IMG, f)).toString('base64');
});

const html = fs.readFileSync(HTML, 'utf8');
const re = /<script id="deck-img">[\s\S]*?<\/script>/;
if (!re.test(html)) { console.error('No se encontró <script id="deck-img"> en presentacion/index.html'); process.exit(1); }
const out = html.replace(re, () => `<script id="deck-img">window.DECK_IMG=${JSON.stringify(data)};</script>`);
fs.writeFileSync(HTML, out);

const used = [...html.matchAll(/data-img="([\w-]+)"/g)].map((m) => m[1]).concat((html.match(/const IMGS = \[([^\]]*)\]/) || ['', ''])[1].match(/[\w-]+/g) || []);
const missing = [...new Set(used)].filter((n) => !n.includes('$') && !data[n]);
console.log(`Embebidas ${Object.keys(data).length} capturas · ${(out.length / 1048576).toFixed(2)} MB` + (missing.length ? ` · FALTAN: ${missing.join(', ')}` : ''));
