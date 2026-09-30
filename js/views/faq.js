/* DivierteTEC — Preguntas frecuentes.
   Las cifras (comisiones, precio del Pase, Semilla TEC) se leen de la configuración
   actual de la economía, así la respuesta siempre coincide con lo que hace la plataforma. */
(function (DT) {
  'use strict';

  const pct = (n) => Math.round(n * 100) + ' %';
  const FAQ = () => {
    const e = DT.econ();
    const tec = DT.state().users.filter(DT.isTecnmDev).length;
    return [
      { q: '¿De qué manera se puede enlazar con los TecNM?', icon: 'cap', a: `
        <p>DivierteTEC da <b>trato preferente a los estudios formados por estudiantes del TecNM</b>, de cualquier campus. Un estudio verificado como TecNM obtiene:</p>
        <ul>
          <li><b>Semilla TEC:</b> sus primeros ${DT.money(e.seedAllowance)} en ventas no pagan comisión; después paga ${pct(e.rateStudent)} en lugar del ${pct(e.rateExternal)} de un estudio externo.</li>
          <li>Sello <b>Hecho en el TecNM</b> con su campus en la tienda y en la página del juego, y un filtro propio en la tienda para descubrir sus juegos.</li>
          <li><b>Prioridad en la cola de revisión</b>: sus juegos aparecen primero para la administración.</li>
        </ul>
        <p>En esta demostración la verificación la hace la administración (<i>Admin → Desarrolladores y usuarios</i>). En la versión en línea se haría con el <b>correo institucional</b> del campus. Hoy ${tec === 1 ? 'hay 1 estudio TecNM verificado' : `hay ${tec} estudios TecNM verificados`} en la plataforma.</p>
        <p class="muted">Propuesta para la siguiente etapa, aún no implementada: convenios con cada campus para usar la plataforma como vitrina de proyectos de materias, residencias y hackatones, con torneos entre Tecnológicos.</p>` },
      { q: '¿Existe alguna limitante sobre qué juegos puedo jugar y/o crear?', icon: 'shield', a: `
        <p><b>Para jugar:</b> ves los juegos aprobados por la administración. Los gratuitos usan <b>Paga lo que quieras</b>: puedes pagar desde $0. Algunos tienen precio o vienen incluidos en el Pase. Cada juego declara su <b>edad recomendada</b>.</p>
        <p><b>Para crear:</b> puedes publicar juegos <b>HTML5</b> (se juegan al instante en el navegador), proyectos <b>C++</b> y <b>ejecutables</b> descargables. Antes de publicarse, cada juego pasa por los <b>criterios de aprobación</b>:</p>
        <ul>
          <li>Tipo de violencia declarado y acorde a la edad recomendada.</li>
          <li>Sin violencia gráfica extrema ni glorificar guerras, atentados o tragedias reales.</li>
          <li>Sin odio ni discriminación, contenido sexual explícito, apuestas con dinero real ni promoción de drogas.</li>
          <li>Créditos de los recursos usados y sin código malicioso.</li>
        </ul>` },
      { q: '¿La página web es demandante en cuestión del rendimiento?', icon: 'bolt', a: `
        <p><b>La plataforma no lo es.</b> Está hecha con HTML, CSS y JavaScript sin librerías ni servidor: se abre con doble clic y funciona <b>sin internet</b>. Los datos se guardan en el propio navegador. Las animaciones se desactivan solas si el sistema tiene activado <i>reducir movimiento</i>.</p>
        <p><b>Cada juego tiene su propia exigencia.</b> Los 2D (Astro Runner, Pixel Garden, Neón Drift, Quantum Puzzle, Mecaquack) son ligeros. Aerodron 3D y Furia TEC dibujan en 3D con WebGL, así que conviene una computadora con gráficos integrados recientes. Los juegos corren en un marco aislado, así que uno pesado no afecta al resto de la página.</p>` },
      { q: '¿Está enfocado únicamente en los juegos o también puede funcionar como medio de aprendizaje?', icon: 'book', a: `
        <p><b>También sirve para aprender, de dos formas:</b></p>
        <ul>
          <li><b>Jugando.</b> Hay juegos educativos. En <b>Mecaquack</b> se avanza resolviendo retos de física, como circuitos en serie con la Ley de Ohm. <b>Quantum Puzzle</b> es un rompecabezas inspirado en el entrelazamiento.</li>
          <li><b>Creando.</b> Publicar un juego es practicar el ciclo real de la industria: integrar logros con el SDK, diseñar la página de la tienda, pasar una revisión de contenido, definir precios y leer reseñas y estadísticas.</li>
        </ul>` },
      { q: '¿Con qué fin se creó DivierteTEC?', icon: 'rocket', a: `
        <p>Para <b>impulsar la industria mexicana del entretenimiento desde las aulas</b>:</p>
        <ul>
          <li>Que los estudiantes del TecNM tengan dónde publicar, probar y cobrar por sus juegos.</li>
          <li>Que los jugadores tengan un lugar para descubrirlos y apoyarlos.</li>
        </ul>
        <p>La creó el <b>Equipo Maravilla</b> del Instituto Tecnológico Superior de Irapuato para InnovaTec · Hackatec regional 2026.</p>` },
      { q: '¿Los juegos creados qué tan complejos pueden ser?', icon: 'cube', a: `
        <p><b>Desde un solo archivo .html hasta proyectos completos:</b></p>
        <ul>
          <li><b>HTML5:</b> carpetas enteras con imágenes, audio y scripts, en 2D (Canvas) o 3D (WebGL).</li>
          <li><b>C++ y ejecutables:</b> proyectos de escritorio que se publican como descarga.</li>
        </ul>
        <p>Como ejemplo, <b>Furia TEC</b> es una pelea 3D hecha con WebGL puro, con modo cooperativo por oleadas, modo 1 vs 1, combos, 5 escenarios y soporte para mandos con vibración. Cualquier juego puede entregar logros y estadísticas a la plataforma con una línea del SDK.</p>` },
      { q: '¿Cuál es el porcentaje de ganancia que se queda la página web?', icon: 'coin', a: `
        <table class="faq-table">
          <tr><th>Fuente</th><th>DivierteTEC</th><th>Estudio</th></tr>
          <tr><td>Ventas de estudios TecNM (Semilla TEC, primeros ${DT.money(e.seedAllowance)})</td><td>0 %</td><td>100 %</td></tr>
          <tr><td>Ventas de estudios TecNM después de la Semilla</td><td>${pct(e.rateStudent)}</td><td>${pct(1 - e.rateStudent)}</td></tr>
          <tr><td>Ventas de estudios externos</td><td>${pct(e.rateExternal)}</td><td>${pct(1 - e.rateExternal)}</td></tr>
          <tr><td>Pase DivierteTEC (${DT.money(e.passPrice)} al mes)</td><td>${pct(1 - e.passDevShare)}</td><td>${pct(e.passDevShare)}, repartido por tiempo jugado</td></tr>
          <tr><td>Propinas</td><td>0 %</td><td>100 %</td></tr>
          <tr><td>Destacado patrocinado</td><td colspan="2">${DT.money(e.promoPrice)} por ${e.promoDays} días</td></tr>
        </table>
        <p class="muted">Los pagos de <i>Paga lo que quieras</i> siguen la misma tabla que las ventas. La administración puede ajustar las tasas en <i>Admin → Finanzas</i> y esta tabla se actualiza sola. En la demostración todo el dinero es simulado.</p>` },
      { q: '¿Pueden ser cooperativos (co-op) los juegos?', icon: 'gamepad', a: `
        <p><b>Sí, en cooperativo local.</b> <b>Furia TEC</b> se juega entre 2 personas en la misma computadora, con teclado o mandos de Xbox, e incluye ataques combinados y revivir al compañero. Cualquier estudio puede hacer juegos para varias personas en el mismo equipo.</p>
        <p class="muted">El multijugador en línea no forma parte de esta versión, que funciona sin internet. Un juego que lo necesite tendría que usar sus propios servidores.</p>` },
      { q: '¿Cómo cumple DivierteTEC los ejes transversales?', icon: 'sparkle', a: `
        <ul>
          <li><b>Inclusión y equidad.</b> El proyecto busca incluir a toda la comunidad tecnológica sin excepción: cualquier alumno puede dar a conocer sus proyectos independientes de entretenimiento (videojuegos). Publicar es gratis y los juegos gratuitos se juegan desde $0, incluso sin internet.</li>
          <li><b>Impacto social.</b> Impulsa el desarrollo de habilidades tecnológicas y del entretenimiento, con un apoyo económico para los desarrolladores: Semilla TEC, reparto del Pase y propinas.</li>
          <li><b>Sustentabilidad y sostenibilidad.</b> La distribución es 100 % digital, sin discos, empaques ni envíos. En esta versión no necesita servidores, porque todo corre en el navegador. Los juegos son ligeros y corren en las computadoras de la escuela sin exigir equipo nuevo. Económicamente, se sostiene con comisiones bajas y el Pase, y la mayor parte del dinero va a los estudios. El SDK y el motor 3D se reutilizan entre juegos.</li>
          <li><b>Tecnologías emergentes.</b> Gráficos 3D en tiempo real con WebGL directo en el navegador, sin instalar nada. Mandos con vibración (Gamepad API). Funcionamiento sin conexión con almacenamiento local (IndexedDB). Juegos aislados por seguridad, un SDK de logros y pruebas automatizadas en el navegador.</li>
        </ul>` },
      { q: '¿Beneficia a los estudiantes, y en qué sentido?', icon: 'medal', a: `
        <p><b>Como creadores:</b></p>
        <ul>
          <li><b>Portafolio publicado</b>, con página propia, reseñas y estadísticas reales de juego.</li>
          <li><b>Ingresos con comisión preferente</b>: la Semilla TEC y el ${pct(e.rateStudent)} después de ella, además del reparto del Pase y las propinas.</li>
          <li><b>Retroalimentación útil</b>: solo se puede reseñar después de 2 horas de juego.</li>
          <li><b>Experiencia real de publicación</b>: revisión de contenido, precios y promoción.</li>
        </ul>
        <p><b>Como jugadores:</b> juegos hechos por compañeros, accesibles con <i>Paga lo que quieras</i>, con logros y recompensas para personalizar su perfil.</p>` }
    ];
  };

  DT.views.faq = (app) => {
    const list = FAQ();
    app.innerHTML = `
      <section class="page faq">
        <div class="page-head"><div><h1>Preguntas frecuentes</h1><p>Lo que más nos preguntan sobre DivierteTEC, los Tecnológicos y los estudios.</p></div></div>
        <div class="faq-list">
          ${list.map((x, i) => `<details class="card faq-item" ${i === 0 ? 'open' : ''}><summary>${DT.ic(x.icon)}<span>${x.q}</span>${DT.icon.chevDown}</summary><div class="faq-a">${x.a}</div></details>`).join('')}
        </div>
      </section>`;
  };
})(window.DT);
