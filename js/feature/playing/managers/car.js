(function(window, opspark, _) {
  // create a namespace for the car manager //
  _.set(opspark, 'playa.car',
    /**
     * Creates and returns the car manager.
     */
    function(assets, controls, messenger, projectile, emitter, level, keyMap) {
      // default key map //
      keyMap = keyMap || {
        UP: controls.KEYS.UP,
        LEFT: controls.KEYS.LEFT,
        RIGHT: controls.KEYS.RIGHT,
        FIRE: controls.KEYS.SPACE,
      };
      
      let 
        car, 
        fire;
        
      setRateOfFire(level.rateOfFire);

      function explode() {
        let i, id;

        car.alpha = 0;

        // show the player explosion for a short period of time //
        i = 0;
        id = setInterval(function() {
          car.explosion.emit({ x: car.x, y: car.y });
          if (i > 60) {
            window.clearInterval(id);
            car.explosion.stop();
            emitter.destroy();
            messenger.dispatch({ type: 'DESPAWN', bodies: [car], source: 'car' });
          }
          i++;
        }, 17);
      }
      
      function setRateOfFire(value) {
        fire = _.throttle(player => projectile.fire(player), value, { 'trailing': false });
      }
      
      function handleCollisioncar(impact) {
        if (this.integrity > 0) {
          this.integrity -= impact;
          messenger.dispatch({ type: 'DAMAGE', source: 'car', target: this });
          if (this.integrity <= 0) {
            explode();
            messenger.dispatch({ type: 'EXPLOSION', source: 'car', target: this });
          }
        }
      }

      // return the car manager api //
      return {
        spawn(color = '#4286f4') {
          if(car) throw new Error('Player is already spawned!');
          // only one car is managed by the module //
          car = assets.makecar(color);
          car.handleCollision = handleCollisioncar;
          messenger.dispatch({ type: 'SPAWN', bodies: [car], source: 'car' });
          return this;
        },
        setRateOfFire,
        setKeyMap(map) {
          keyMap = map;
          return this;
        },
        update(event) {
          // left and right arrows cannot be pressed at the same time //
          if (controls.isActive(keyMap.LEFT)) {
            car.rotationalVelocity = -5;
          } else if (controls.isActive(keyMap.RIGHT)) {
            car.rotationalVelocity = 5;
          } else {
            car.rotationalVelocity = 0;
          }

          // up arrow can be pressed in combo with other keys //
          if (controls.isActive(keyMap.UP)) {
            emitter.emit(car.getExhaustPoint());
            car.propulsion = 0.1;
          } else {
            emitter.stop();
            car.propulsion = 0;
          }
          
          /*
           * Space key can be pressed in combo with other keys.
           * Throttle the rateOfFire using _.throttle based on
           * level.rateOfFire.
           */
          if (controls.isActive(keyMap.FIRE)) {
            fire(car);
          }
        },
      };
    });
}(window, window.opspark, window._));
