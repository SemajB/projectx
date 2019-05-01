(function(window, opspark, _) {
  //Create a nampsace for the Player
  _.set(opspark, 'playa.player',
    function(assets, controls, messenger, dj, level, keyMap) {

      //Key Map
      keyMap = keyMap || {
        UP: controls.KEYS.UP,
        DOWN: controls.KEYS.DOWN,
        LEFT: controls.KEYS.LEFT,
        RIGHT: controls.KEYS.RIGHT,
        ATTACK: controls.KEYS.SPACE,
      };

      let
        player,
        attack;

      //square.item  = null;

      //Handle collision
      function handleCollisionPlayer(body) {
        switch (body.type) {
          case 'monster':
            break;

          case 'key':
            break;

          case 'sword':
            break;
        }
      }

      // return the square manager api //
      return {
        spawn(color = '#4286f4') {
          if (player) throw new Error('Player is already spawned!');
          // only one square is managed by the module //
          player = assets.makePlayer(color);
          player.handleCollision = handleCollisionPlayer;
          messenger.dispatch({ type: 'SPAWN', bodies: [player], source: 'player' });
          return this;
        },
        setKeyMap(map) {
          keyMap = map;
          return this;
        },
        update(event) {
          // left and right arrows cannot be pressed at the same time //
          if (controls.isActive(keyMap.LEFT)) {
            player.velocityX = -3;
            // player.rotationalVelocity = -5;
          } else if (controls.isActive(keyMap.RIGHT)) {
            player.velocityX = 3;
            // player.rotationalVelocity = 5;
          } else {
            player.velocityX = 0;
          }

          // up arrow can be pressed in combo with other keys //
          if (controls.isActive(keyMap.UP)) {
            player.velocityY = -3;
            // emitter.emit(square.getExhaustPoint());
          } else if (controls.isActive(keyMap.DOWN)) {
            player.velocityY = 3;
            // emitter.emit(square.getExhaustPoint());
            // player.propulsion = 0.1;
          } else {
            // emitter.stop();
            player.velocityY = 0;
          }

          /*
           * Space key can be pressed in combo with other keys.
           * Throttle the rateOfFire using _.throttle based on
           * level.rateOfFire.
           */
          if (controls.isActive(keyMap.FIRE)) {
            attack(player);
          }
        },
      };
    });

}(window, window.opspark, window._));
