(function(window, opspark, _) {
  const
    draw = opspark.draw;
  // physikz = window.opspark.racket.physikz;

  // create a namespace for the orbManager //
  _.set(opspark, 'playa.orbManager',
    /**
     * Creates and returns the orb manager.
     * @param {Object} game: The gamey app.
     * @param {Array} [space]: An optional Array used by 
     * a physics engine in the calculation of collision.
     */
    function(game, view, space) {
      const 
        canvas = game.canvas,
        active = [],
        objects = [],
        pool = {
          active,
          objects,
  
          get: function() {
            if (objects.length > 0) {
              return objects.pop();
            }
            return makeObject();
          },
  
          recycle: function(object) {
            // remove object from the active Array //
            const i = active.indexOf(object);
            if (i > -1) {
              active.splice(i, 1);
            }
            
            // remove object from the space Array, if exists //
            if(Array.isArray(space)) {
              const k = space.indexOf(object);
              if (k > -1) {
                space.splice(k, 1);
              }
            }
            
            object.x = -(object.width);
            object.alpha = 1;
            object.scaleX = object.scaleY = 1;
            objects.push(object);
          }
        };

      function makeObject() {
        const orb = draw.randomCircleInArea(canvas, false, true, '#999', 2);
        _.assign(orb, {
          velocityX: 0,
          velocityY: 0,
          rotationalVelocity: 0,
        });
        addRandomVelocity(orb, canvas);
        return orb;
      }
      
      // return orb manager api //
      return {
        addOrbs(numberOfOrbs) {
          let i = 0;
          while (i < numberOfOrbs) {
            const orb =  pool.get();
            active.push(orb);
            if(Array.isArray(space)) space.push(orb);
            view.addChild(orb);
            i++;
          }
          return this;
        },
        // makes the orb manager an updateable object //
        update(event) {
          let i = 0;
          while (i < active.length) {
            const orb =  active[i];
            orb.x += orb.velocityX;
            orb.y += orb.velocityY;
            orb.rotation += orb.rotationalVelocity;
            
            var radius = orb.radius;
            var areaWidth = canvas.width + radius;
            var areaHeight = canvas.height + radius;
            
            if (orb.x > areaWidth) {
              orb.x = -orb.radius;
            }
            else if (orb.x < -orb.radius) {
              orb.x = areaWidth;
            }
            
            if (orb.y > areaHeight) {
              orb.y = -orb.radius;
            }
            else if (orb.y < -orb.radius) {
              orb.y = areaHeight;
            }
            
            i++;
          }
        }
      };
    }
  );

  function addRandomVelocity(body, area, multiplierX, multiplierY) {
    multiplierX = (multiplierX) ? multiplierX : .6;
    multiplierY = (multiplierY) ? multiplierY : .5;

    var tx = randomIntBetween(0, area.width);
    var ty = randomIntBetween(0, area.height);
    var dx = Math.abs(tx - body.x);
    var dy = Math.abs(ty - body.y);
    var radians = Math.atan2(dy, dx);
    body.rotation = radiansToDegrees(radians);

    var rotationalDirection = (Math.round(Math.random()) === 1) ? 1 : -1;
    body.rotationalVelocity = randomIntBetween(1, 3) * rotationalDirection;
    var forceX = Math.cos(radians) * (Math.random() * multiplierX);
    var forceY = Math.sin(radians) * (Math.random() * multiplierY);

    body.velocityX = (tx > body.x) ? forceX : -forceX;
    body.velocityY = (ty > body.y) ? forceY : -forceY;
  }
  
  // degrees = radians * 180 / Math.PI //
  function radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
  }
  
  function randomIntBetween(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  function updatePosition(body) {
    body.x += body.velocityX;
    body.y += body.velocityY;
    body.rotation += body.rotationalVelocity;
  }

}(window, window.opspark, window._));
