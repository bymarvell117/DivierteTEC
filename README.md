# DivertiTEC

Plataforma de publicación de videojuegos para **InnovaTec · Hackatec regional 2026**.
Una tienda y biblioteca estilo Steam donde los estudiantes publican juegos HTML5,
C++ o ejecutables; los juegos HTML se juegan directamente en el navegador.

## Cómo abrirla

Haz **doble clic en `index.html`**. No necesita servidor, instalación ni internet:
todo (usuarios, juegos subidos, logros, recompensas) se guarda en el navegador
(localStorage + IndexedDB). Probado en Chrome/Edge.

Para la demostración, el menú de usuario (arriba a la derecha) permite cambiar de rol:

| Cuenta            | Rol            | Qué puedes mostrar                                        |
|-------------------|----------------|-----------------------------------------------------------|
| MARVELL117        | Usuario        | Tienda, biblioteca, jugar, reseñas, perfil y recompensas  |
| PixelForge Studio | Desarrollador  | Subir juegos, logros, editor de páginas, estadísticas     |
| Admin TEC         | Administrador  | Revisión de juegos, reportes, moderación, usuarios         |

**Restablecer demo** (mismo menú) borra todo y vuelve a los datos de ejemplo.

## Flujo para la presentación

1. **Bienvenida** (`#/`): animación de entrada y revelado al hacer scroll.
2. Cambia a **PixelForge Studio** → *Desarrollador* → **Mi juego Hackatec** → *Archivos del juego*
   → sube el `.html` o la carpeta del juego (o usa *HTML de prueba del SDK*).
3. *Logros y recompensas*: ajusta los logros y copia el código del SDK.
4. **Probar**: el juego corre en modo prueba con consola.
5. *Páginas* → **Editar**: arrastra imágenes/GIFs/videos, cambia formas (triángulo,
   hexágono, estrella, polígono personalizado…), capas, bordes y textos.
6. **Enviar a revisión** → cambia a **Admin TEC** → *Revisión de juegos* → **Aprobar**.
7. Cambia a **MARVELL117** → la tienda muestra el juego → *Agregar* → **Jugar**.
   Los logros entregan recompensas que se equipan en el **perfil** (temas, marcos, avatares…).

## Estructura

```
index.html               Shell de la aplicación
css/base.css             Paleta (blanco/gris/azul), modo oscuro y temas desbloqueables
css/components.css       Componentes y vistas
css/landing.css          Bienvenida animada
js/core.js               Utilidades, iconos, modales, avisos
js/catalog.js            Recompensas, logros de plataforma y datos de ejemplo
js/store.js              Estado (localStorage) y archivos (IndexedDB)
js/theme.js              Temas y efectos de partículas
js/rewards.js            Motor de logros → recompensas
js/sdk/divertitec-sdk.js SDK para juegos + cargador del iframe
js/runner.js             Ejecución segura de juegos HTML y descargas
js/layout.js             Motor de páginas personalizables (formas, capas)
js/views/*.js            Bienvenida, tienda, biblioteca, comunidad, perfil, dev, editor, admin
sdk/divertitec-sdk.js    SDK independiente para probar juegos fuera de la plataforma
docs/SDK-LOGROS.md       Guía paso a paso de logros y recompensas
```

## Cómo se ejecutan los juegos HTML

El juego se carga en un `<iframe sandbox="allow-scripts">` sin `allow-same-origin`,
así que no puede tocar los datos de la plataforma. Un cargador dentro del iframe
recibe los archivos por `postMessage`, crea URLs `blob:` propias, reescribe las rutas
relativas del HTML/CSS/JS e intercepta `fetch`, `XMLHttpRequest`, `Image` y `Audio`.
`localStorage` se simula y se guarda por jugador, así las partidas persisten.

Ver [docs/SDK-LOGROS.md](docs/SDK-LOGROS.md) para conectar logros.
