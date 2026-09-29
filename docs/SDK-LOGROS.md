# Guía: logros y recompensas en tu juego HTML

Esta guía explica, paso a paso, cómo conectar un juego HTML con el sistema de
logros de DivierteTEC y cómo cada logro entrega una recompensa (tema de página,
marco de perfil, avatar, efecto, emoji o insignia).

## Cómo funciona

```
Tu juego (iframe)                 DivierteTEC (página principal)
─────────────────                 ─────────────────────────────
DivierteTEC.unlock('jefe_final') ─► runner.js valida que el mensaje venga de TU iframe
                                   y que 'jefe_final' exista en tu panel
                                 ─► rewards.js guarda el logro y entrega la recompensa
                                 ─► aparece el aviso animado y el inventario se actualiza
```

- El juego corre en un `<iframe sandbox="allow-scripts">`: no puede leer ni modificar
  los datos de la plataforma. La única vía de comunicación es `postMessage`.
- El SDK (`window.DivierteTEC`) se **inyecta automáticamente**; no necesitas incluir nada.
- `localStorage` funciona dentro del juego: DivierteTEC guarda la partida de cada jugador.

## Paso 1 — Define los logros en el panel

1. Cambia al rol **Desarrollador** (menú de usuario, arriba a la derecha).
2. Entra a **Desarrollador → tu juego → Logros y recompensas**.
3. Por cada logro llena:

| Campo       | Para qué sirve                                                            |
|-------------|---------------------------------------------------------------------------|
| Icono       | Emoji que se muestra en el aviso y en la lista.                            |
| ID          | Nombre que usarás en el código (`minúsculas_y_guiones_bajos`).             |
| Nombre      | Título visible para el jugador.                                            |
| Descripción | Qué hay que hacer.                                                         |
| Meta        | `0` = se desbloquea con `unlock()`. Mayor que 0 = con `progress()` al llegar. |
| Oculto      | Muestra "Logro oculto" hasta que se consiga.                                |
| Recompensa  | Tema, marco, avatar, efecto, emoji o insignia que recibe el jugador.       |

4. Si quieres algo exclusivo, usa **Crear recompensa personalizada** (emoji, avatar o insignia propia).
5. Pulsa **Guardar logros**. La sección *Código para tu juego* genera las líneas listas para copiar.

## Paso 2 — Llama al SDK desde tu código

```js
// Logro directo (meta = 0)
DivierteTEC.unlock('primer_nivel');

// Logro con meta (p. ej. meta = 1000): se desbloquea al llegar
DivierteTEC.progress('puntos_1000', puntos);

// Estadísticas libres que ve el jugador en su biblioteca
DivierteTEC.setStat('record', puntos);

// Datos del jugador y logros ya conseguidos
DivierteTEC.onReady(function (info) {
  console.log('Hola', info.user.name);
  if (DivierteTEC.isUnlocked('jefe_final')) { /* mostrar skin dorada */ }
});

// Reaccionar a un desbloqueo
DivierteTEC.on('unlock', function (id) { /* sonido de logro */ });
```

Ejemplo real dentro de un juego:

```js
function terminarNivel(nivel, danioRecibido) {
  if (nivel === 1) DivierteTEC.unlock('primer_nivel');
  if (danioRecibido === 0) DivierteTEC.unlock('sin_danio');
}
function sumarPuntos(n) {
  puntos += n;
  DivierteTEC.progress('puntos_1000', puntos);
}
```

### Probar el juego fuera de DivierteTEC

Descarga el SDK desde el panel (**Descargar SDK**) o copia `sdk/divierte-tec-sdk.js`
en la carpeta de tu juego e inclúyelo:

```html
<script src="divierte-tec-sdk.js"></script>
```

Fuera de la plataforma funciona en **modo local**: muestra el logro en pantalla y en
la consola, así el juego no falla. Dentro de DivierteTEC se usa el SDK real.

> El SDK antes se llamaba `DivertiTEC`. Ese nombre sigue funcionando como alias,
> así que los juegos ya escritos no necesitan cambios; en código nuevo usa `DivierteTEC`.

Los cuatro juegos integrados (`games/*/index.html`) son ejemplos completos de uso del SDK:
`unlock`, `progress` con metas, `setStat` y guardado con `localStorage`.

## Paso 3 — Sube y prueba

1. Pestaña **Archivos del juego**: sube el `.html` o la **carpeta completa**
   (HTML, JS, CSS, imágenes, audio, fuentes). Las rutas relativas se conectan solas,
   incluidas las que se piden con `fetch`, `new Image()`, `new Audio()` o `XMLHttpRequest`.
2. Pulsa **Probar**: el juego abre en *modo prueba* con consola. Verás cada llamada
   (`DivierteTEC.unlock(...)`), los errores de tu código y los avisos de logros,
   **sin guardar nada**. Si un ID no existe en el panel, la consola lo avisa.
3. También puedes simular cada logro con el botón ▶ de su fila.

## Paso 4 — Publica

Completa la información, diseña tus páginas de tienda y biblioteca y pulsa
**Enviar a revisión**. Cuando un administrador lo apruebe, los jugadores podrán
agregarlo, jugarlo y ganar tus recompensas.

## Logros de la plataforma

Además de los logros de cada juego, DivierteTEC tiene logros propios
(`js/catalog.js → DT.PLATFORM_ACH`), por ejemplo *Primera partida* → tema Retro Arcade,
*Maratón* (30 min) → tema Neón Cyberpunk, *Cazador de logros* (5 logros) → tema Galaxia.
Para agregar uno nuevo basta con añadir un objeto con `id`, `name`, `desc`, `icon`,
`reward` y una función `check(stats)`.
