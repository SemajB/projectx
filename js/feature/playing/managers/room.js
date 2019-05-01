(function(window, opspark, _) {
  const
    draw = opspark.draw;

  opspark.room = function(assets, view, level, messenger) {
    let roomAssets;
    
    messenger.on('EXIT', onExit);

    function onExit(event) {
      console.log(event.exit);
      // blow away all room assets
      // lookup next room by exit-to
      // re-render new room //
    }
    
    function clear(roomAssets) {
      const all = _.reduce(_.values(roomAssets), (all, arr) => all.concat(arr), []);
      messenger.dispatch({ type: 'DESPAWN', bodies: all });
    }

    function render(room) {
      roomAssets = _.reduce(room.walls, function(roomAssets, wall, type) {
        let border;
        switch (type) {
          case 'top':
            border = assets.drawTop();
            break;
          case 'bottom':
            border = assets.drawBottom();
            break;
          case 'left':
            border = assets.drawLeft();
            break;
          case 'right':
            border = assets.drawRight();
            break;
        }
        roomAssets.borders.push(border);
        const exitAssets = _.map(wall.exits, function(exit) {
          return assets.drawExit(exit);
        });
        roomAssets.exits.push(...exitAssets);
        return roomAssets;
      }, { borders: [], exits: [] });
      view.addChild(...roomAssets.borders);

      messenger.dispatch({ type: "SPAWN", source: "room", bodies: roomAssets.exits });

      //console.log(e)

      return this;
    }

    return {
      render,
    };
  };
}(window, window.opspark, window._));



/*
            {
            "id": "abc",
            "label": "Library",
            "walls": {
                "top": {
                    "exits": [
                        { "position": { "x": 10, "y": 0 } }
                    ]

                },
                "bottom": {},
                "left": {},
                "right": {}
            }
        }
*/
