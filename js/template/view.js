(function(opspark, createjs, draw, _) {
  // component factories: delete if not used //
  const
    button = opspark.factory.component.button,
    layout = opspark.factory.component.layout;

  // create a namespace for your view view //
  _.set(opspark, 'playa.myView',
    /**
     * Creates and returns the view.
     */
    function(game) {
      const
        canvas = game.canvas,

        /*
         * asset is the parent Container for this view. Use
         * asset.addChild() to add child components to the view.
         */
        asset = new createjs.Container();

      // create view components here //


      // add all view components to the view container //
      asset.addChild( /* add components created above */ );


      /**
       * Called when the asset is added to the stage.
       * Use render() to config and position components.
       */
      function render() {
        //   canvas.style.backgroundColor = '#BBB';

        // provide default positions here //

      }

      // called on screen resize //
      function liquify() {
        // If necessary, tween components into position relative to canvas here //
      }

      // setup a one-time added-to-parent listener //
      asset.on('added', onAdded);

      function onAdded() {
        if (game.getDebug()) console.log('end view added to stage');
        asset.off('added', onAdded);
        render();
      }

      /*
       * Return the view API: It MUST expose the asset, the render method, and 
       * the liquify method. However, any other child components or API needed 
       * to control this view can be exposed.
       */
      return {
        asset,
        render,
        liquify,
        // expose any other components or API here //
        
      };
    }
  );
}(window.opspark, window.createjs, window.opspark.draw, window._));
