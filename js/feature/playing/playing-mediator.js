(function(opspark, _) {
  // create a namespace for the playingMediator //
  _.set(opspark, 'playa.playingMediator', 
  /**
   * Creates and returns the playing mediator.
   */
  function(view, game, data) {
    const
        dj = opspark.util.dj,
        level = data.levels[data.currentLevel],
        canvas = game.canvas,
        controls = opspark.controlFreak(),
        messenger = opspark.factory.dispatcher(),
        viewManager = opspark.playa.viewManager(view.container, messenger).activate(),
        space = opspark.playa.space(messenger, level),
         //fx = opspark.playa.fx(game, view.container),
        assets = opspark.playa.assets(canvas, dj, level),
        room = opspark.room(assets, view.container, level, messenger).render(level.rooms[0]),
        // hud = opspark.playa.hud(game, messenger).activate(),
        
        player = opspark.playa.player(assets, controls, messenger, dj, level)
          .spawn();
          
          
      game.view.addChild(view.container);
      //room


    // handle pause key stroke //
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && (String.fromCharCode(event.which).toLowerCase() === 'p')) {
        event.preventDefault();
        event.stopPropagation();
        window.removeEventListener('keydown', onKeyDown);
        game.pause();
      }
    }

    /*
     * Return the mediator API: Each mediator must expose its view,
     * a liquify() method used for repositioning components on screen 
     * resize, a destroy() method used to clean up any references, and 
     * methods enter(), exit(), which must return a Promise that 
     * resolves when the enter or exit sequence is complete.
     */
    return {
      view,
      liquify() {
        return view.liquify();
      },
      enter() {
        return new Promise(function(resove, reject) {
          window.addEventListener('keydown', onKeyDown);
          
          view.open();
          controls.activate();
          game.addUpdateable(space, player);
          
          resove();
        });
      },
      exit() {
        return new Promise(function(resove, reject) {
          view.close();
          game.removeUpdateable(space, player);
          resove();
        });
      },
      destroy() {
        window.removeEventListener('keydown', onKeyDown);
        game.view.removeChild(view.asset);
        messenger.clearHandlers();
        controls.deactivate();
        viewManager.deactivate();
      }
    };
  });
}(window.opspark, window._));
