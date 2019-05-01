(function(opspark, _) {
  // create a namespace for your mediator //
  _.set(opspark, 'playa.myMediator',
    /**
     * Creates and returns the mediator.
     */
    function(view, game, data) {

      // create event handlers here //


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
          // delegate liquify to the view, or implement your own //
          return view.liquify();
        },
        enter() {
          return new Promise(function(resove, reject) {
            game.view.addChild(view.asset);

            // add event handlers to view components here //

            // call any other enter/open sequence methods on the view //

            resove();
          });
        },
        exit() {
          return new Promise(function(resove, reject) {

            // call any other exit/close sequence methods on the view //

            resove();
          });
        },
        destroy() {
          // remove any event listeners here //

          game.view.removeChild(view.asset);
        }
      };

    }
  );
}(window.opspark, window._));
