# DivierteTEC

Plataforma de publicación de videojuegos para **InnovaTec · Hackatec regional 2026**.
Una tienda y biblioteca estilo Steam donde los estudiantes publican juegos HTML5,
C++ o ejecutables; los juegos HTML se juegan directamente en el navegador.

## Juegos incluidos (se juegan al instante, sin descargar)

| Juego | Género | Precio en la demo | Controles |
|---|---|---|---|
| **Mecaquack** · Equipo Maravilla | Aventura educativa de ingeniería | Gratis · destacado | WASD, Espacio, E, B, V · táctil en celular |
| **Aerodron 3D** | Rally de drones en 3D (WebGL puro, sin librerías) | Gratis · destacado | ← → girar · ↑ ↓ altura · Espacio turbo · joystick táctil |
| **Furia TEC** | Pelea 3D con las mascotas de los Tecnológicos de Guanajuato: cooperativo y Kombate 1 vs 1 | Gratis · destacado | J1: A/D, W salta, S, F/G/H ligero·medio·pesado, T especial · J2: flechas, J/K/L, I · mando de Xbox con vibración |
| **Astro Runner** | Runner espacial de baja gravedad | Gratis | Espacio / ↑ / tocar = saltar (doble salto) |
| **Pixel Garden** | Jardinería idle en tiempo real | Paga lo que quieras · Pase | Clic en parcelas |
| **Neón Drift** | Carreras synthwave pseudo‑3D | $49 (−30 %) · Pase | ← → carril · Espacio turbo |
| **Quantum Puzzle** | Puzle de entrelazamiento (10 niveles) | $25 · en revisión | Clic en partículas |

Mecaquack es el juego de la fase local de Hackatec del **Equipo Maravilla** (Instituto
Tecnológico Superior de Irapuato), adaptado a la plataforma: 10 logros con recompensas,
guardado de partida, guarida del jefe final en Selvarrón (se abre con 10 retos), controles
táctiles, pausa y corrección de errores. Sus imágenes están en `games/mecaquack/img/`.
Aerodron 3D tiene 6 logros (uno oculto) y un motor 3D propio en WebGL: terreno generado con
ruido, agua animada, niebla, aerogeneradores y minimapa. **Furia TEC** tiene 9 mascotas (Búho Blanco · Irapuato, Lince · Celaya, León · León,
Carnero · Roque, Halcón · Uriangato, Jaguar · Abasolo, Gato Negro Brujo · Purísima del Rincón,
Coyote · San Miguel de Allende, Puma · Salvatierra), cada una con especial y habilidad propios;
modo cooperativo por oleadas (ataque combinado, revivir, jefe con FINAL TEC) y **Kombate 1 vs 1**
frenético: Torre contra la CPU (5 mascotas y el Rey Sombra), contragolpes, congelado de impacto,
¡ACÁBALO! y una **Fatality caricaturesca por mascota** (convertir al rival en sapo, mandarlo a la
luna, dejarlo plantado en el piso…). Movimientos: golpes ligero, medio y pesado, golpe bajo,
barrido, gancho lanzador, patada giratoria, martillo y 3 aéreos, animados con fotogramas clave;
se salta solo apuntando hacia arriba y se bloquea manteniendo atrás. Los golpes que conectan se
encadenan y hay combos con nombre (TRIPLE, ¡FURIA TEC!, COMBO BRUTAL, BARRIDA LETAL, AL AIRE,
MARTILLAZO…) con malabares en el aire. El golpe final invierte la imagen en blanco y negro con
acercamiento de cámara. 5 escenarios: Templo Nocturno, Azotea del ITESI, Laboratorio de Robótica,
Callejón de Guanajuato y Siete Luminarias. Soporta mandos (Gamepad API) con vibración. Nombres, campus, colores y estadísticas se editan en el
arreglo `FIGHTERS` al inicio de `games/furia-tec/index.html`.
Los demás juegos tienen 5 logros cada uno (uno oculto). El código fuente está en
`games/<juego>/index.html` (se puede abrir por separado). Después de editar un juego,
ejecuta `node tools/build-games.js` para regenerar `js/games/*.js`.

## Modelo de negocio

Comisión escalonada (0 % en los primeros $2,000 de estudios estudiantiles, luego 12 %;
18 % para externos), **Pase DivierteTEC** de $59/mes que reparte el 70 % entre los estudios
por tiempo jugado, destacados patrocinados y propinas. Todo con dinero simulado.
Detalles en [docs/MODELO-DE-NEGOCIO.md](docs/MODELO-DE-NEGOCIO.md).

## Cómo abrirla

Haz **doble clic en `index.html`**. No necesita servidor, instalación ni internet:
todo (usuarios, juegos subidos, logros, recompensas) se guarda en el navegador
(localStorage + IndexedDB). Probado en Chrome/Edge.

Para la demostración, el menú de usuario (arriba a la derecha) permite cambiar de rol:

| Cuenta            | Rol            | Qué puedes mostrar                                        |
|-------------------|----------------|-----------------------------------------------------------|
| MARVELL117        | Usuario        | Tienda, biblioteca, jugar, reseñas, perfil y recompensas  |
| Equipo Maravilla  | Desarrollador  | Subir juegos, logros, editor de páginas, estadísticas     |
| Admin TEC         | Administrador  | Revisión de juegos, reportes, moderación, usuarios         |

**Restablecer demo** (mismo menú) borra todo y vuelve a los datos de ejemplo.

## Flujo para la presentación

1. **Bienvenida** (`#/`): animación de entrada y revelado al hacer scroll.
2. Juega **Mecaquack** desde la tienda (se juega al instante) y desbloquea sus logros.
   Para mostrar la subida de juegos: cambia a **Equipo Maravilla** → *Desarrollador* → **Nuevo juego**
   → *Archivos del juego* → sube un `.html` o una carpeta (o usa *HTML de prueba del SDK*).
3. *Logros y recompensas*: ajusta los logros y copia el código del SDK.
4. **Probar**: el juego corre en modo prueba con consola.
5. *Páginas* → **Editar**: arrastra imágenes/GIFs/videos, cambia formas (triángulo,
   hexágono, estrella, polígono personalizado…), capas, bordes y textos.
6. **Enviar a revisión** → cambia a **Admin TEC** → *Revisión de juegos* → **Aprobar**.
7. Cambia a **MARVELL117** → la tienda muestra el juego → *Agregar* → **Jugar**.
   Los logros entregan recompensas que se equipan en el **perfil** (temas, marcos, avatares…).
8. **Tienda**: juega **Astro Runner** al instante; en **Pixel Garden** elige cuánto pagar;
   suscríbete al **Pase** (`PASE` en la barra) y juega **Neón Drift** sin comprarlo. El
   monedero (arriba a la derecha) muestra saldo y movimientos.
9. **Admin TEC → Finanzas**: ingresos por fuente, reparto del fondo del Pase y promociones.

## Estructura

```
index.html               Shell de la aplicación
css/base.css             Paleta (blanco/gris/azul), modo oscuro y temas desbloqueables
css/components.css       Componentes y vistas
css/landing.css          Bienvenida animada
css/angular.css          Capa de diseño angular (biseles, paralelogramos, franjas diagonales)
js/core.js               Utilidades, iconos, modales, avisos
js/catalog.js            Recompensas, logros de plataforma y datos de ejemplo
js/store.js              Estado (localStorage) y archivos (IndexedDB)
js/theme.js              Temas y efectos de partículas
js/rewards.js            Motor de logros → recompensas
js/economy.js            Monedero, compras, comisiones, Pase, promociones y libro de transacciones
js/games/*.js            Juegos integrados empaquetados (generados)
games/*/index.html       Código fuente de los juegos integrados
tools/build-games.js     Empaqueta games/ en js/games/
js/sdk/sdk.js            SDK para juegos + cargador del iframe
js/runner.js             Ejecución segura de juegos HTML y descargas
js/layout.js             Motor de páginas personalizables (formas, capas)
js/views/*.js            Bienvenida, tienda, biblioteca, comunidad, perfil, dev, editor, admin
sdk/divierte-tec-sdk.js  SDK independiente para probar juegos fuera de la plataforma
docs/SDK-LOGROS.md       Guía paso a paso de logros y recompensas
docs/MODELO-DE-NEGOCIO.md Propuesta de negocio, tasas y proyección
```

## Cómo se ejecutan los juegos HTML

El juego se carga en un `<iframe sandbox="allow-scripts">` sin `allow-same-origin`,
así que no puede tocar los datos de la plataforma. Un cargador dentro del iframe
recibe los archivos por `postMessage`, crea URLs `blob:` propias, reescribe las rutas
relativas del HTML/CSS/JS e intercepta `fetch`, `XMLHttpRequest`, `Image` y `Audio`.
`localStorage` se simula y se guarda por jugador, así las partidas persisten.

Ver [docs/SDK-LOGROS.md](docs/SDK-LOGROS.md) para conectar logros.
