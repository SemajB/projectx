(function(window, createjs, opspark, _) {
  const
    // TODO: Decide what phyz library you're using //
    draw = opspark.draw,
    phyz = opspark.racket.physikz;

  /**
   * Takes a body and centers its x and y on the canvas.
   * @param {Object} asset: A body with an x and y property.
   * @param {Canvas} canvas: The HTML canvas element.
   */
  function centerOnStage(asset, canvas, level) {
    if (asset.type === 'circular' || asset.radius) {
      asset.x = canvas.width / 2;
      asset.y = canvas.height / 2;
    }
    else {
      const bounds = asset.getBounds();
      asset.x = (canvas.width - bounds.width) / 2;
      asset.y = (canvas.height - bounds.width) / 2;
    }
  }


  /**
   * Creates an API at opspark.assets to 
   * build and work with visual assets.
   * 
   * @param {Object} canvas: The canvas on which the 
   * game is drawn, used for incept positioning of assets.
   */
  // TODO: Decide what modules are necessary for building your assets //
  _.set(opspark, 'playa.assets',
    function(canvas, dj, level) {
      // ASSET BEHAVIORS //
      function updatePlayer() {
        // phyz.updateVelocity(this, this.propulsion, this.propulsion);
        if (reboundInRoom(this, { height: canvas.height - 20, width: canvas.width - 20, x: 20, y: 20 })) dj.play('bump-2', { volume: 0.09 });
      }

      function reboundInRoom(body, area) {
        const
          radius = body.radius,
          top = area.y,
          left = area.x,
          right = area.width,
          bottom = area.height;

        let rebounded = false;

        // check for hit on either side of area //
        if (body.x + radius > right) {
          body.x = right - radius;
          body.velocityX *= -1;
          rebounded = true;
        }
        else if (body.x - radius < left) {
          body.x = left + radius;
          body.velocityX *= -1;
          rebounded = true;
        }

        // check for hit on top or bottom //
        if (body.y - radius < top) {
          body.y = top + radius;
          body.velocityY *= -1;
          rebounded = true;
        }
        else if (body.y + radius > bottom) {
          body.y = bottom - radius;
          body.velocityY *= -1;
          rebounded = true;
        }

        return rebounded;
      }

      /**
       * Each method draws and assembles the asset in a 
       * default state, assigning its update method.
       */
      return {
        drawTop() {
          const asset = draw.rect(canvas.width, 20, '#FFF');
          asset.x = 0;
          asset.y = 0;
          return asset;
        },
        drawBottom() {
          const asset = draw.rect(canvas.width, 20, '#FFF');
          asset.x = 0;
          asset.y = canvas.height - asset.getBounds().height;
          return asset;
        },
        drawLeft() {
          const asset = draw.rect(20, canvas.height, '#FFF');
          asset.x = 0;
          asset.y = 0;
          return asset;
        },
        drawRight() {
          const asset = draw.rect(20, canvas.height, '#FFF');
          asset.x = canvas.width - asset.getBounds().width;
          asset.y = 0;
          return asset;
        },
        drawExit(exit, type) {
          const 
            container = new createjs.Container(),
            rect = draw.rect(exit.width, exit.height, exit.color);
            
          container.type = 'exit';
          container.addChild(rect);
          
          const numHitZones = exit.width / exit.height;
          
          const hitZones = [];
          for(let i = 0; i < numHitZones; i++) {
            const hitZone = Object.assign(draw.circle(exit.height / 2, '#FFF'), phyz.makeBody('hitzone-exit'));
            // set alpha to 1 to make hitzones visible //
            hitZone.alpha = 0;
            // give the hitzone the exit data //
            hitZone.exit = exit;
            
            hitZone.y = hitZone.radius;
            hitZone.x = hitZone.width * (i + 1) - hitZone.radius;
            hitZones.push(hitZone);
          }
          container.hitZones = hitZones
          container.addChild(...hitZones);
          
          // based on w/h of exit, draw as many hitzones that will fit //
          
          container.x = exit.position.x;
          container.y = exit.position.y;

          return container;
        },
        makePlayer(color, radius = 10) {
          const asset = _.extend(draw.circle(radius, color), phyz.makeBody('player'));

          asset.update = updatePlayer;

          // init position // 
          asset.x = canvas.width / 2;
          asset.y = canvas.height / 2;

          asset.propulsion = 0;

          return asset;
        },
        centerOnStage,
      };
    });
}(window, window.createjs, window.opspark, window._));
