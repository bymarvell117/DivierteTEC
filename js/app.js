/* DivertiTEC — arranque de la aplicación. */
(function (DT) {
  'use strict';

  DT.load();
  DT.applyTheme();

  // Vistas con formularios o animaciones que no deben redibujarse solas
  const QUIET = ['landing', 'editor', 'devGame'];
  DT.on((what) => {
    DT.renderTopbar();
    if (what === 'user' || !QUIET.includes(DT.route().name)) DT.render(true);
  });

  DT.render();
  DT.rewards.checkPlatform();
})(window.DT);
