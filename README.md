### Playa

A default templated gamey game.

### Setup

1. Create a repository on GitHub to hold your game, but don't create a `README.md` or `.gitignore` file.
2. Clone the playa repository into local your workspace, rename the `playa` directory to match the name of your game.
3. `cd` into the directory you just renamed, then call `git init` within the root of this directory. This will create a new local git repository.
4. Pair this new local repository with the one you created on GitHub in step 1.
5. If `bower` is not installed globally, run the command `npm install -g bower`.
6. Run the command `bower install`.

### Implement Your Game

The gamey app is configured and created in the `index.js` file.

For each game feature/state, there's a view and mediator pair within the directory `js/feature/`, one for each of `lobby`, `initializing`, `playing`, `paused`, and `end`;

You don't need to change the IOC map in the `index.js` file or the namespaces of the views and mediators unless you want to do so; the game is already wired together. The `index.js` file calls `game.lobby()`, so the game will automatically transition to the lobby state. If you want to change the namespaces of your views and mediators, make sure you change them in the view/mediator pair, and update the IOC map in `index.js`.

To implement your game, simply open up each view/mediator pair, and build your views, and update your mediators to control the views as needed. Make sure the `enter()` and `exit()` methods of your mediators continue to return a `Promise`, as is currently implemented, and make sure that `Promise` calls `reslove()` when its done with any async operations.

### Initializing

Note that the `initializing` state has no direct transition method; it is passed through from `lobby` to `playing`, whenever the `lobby-mediator` calls `game.play()`. The `initializing` state can be used for preloading assets, sound, or connecting to a server.

Within the `enter()` method of the `initializing-mediator`, the `Promise` can resolve with a data Object, which will be passed to the `playing-mediator`. This allows you to load assets asynchronously during the `initializing` state, then pass them in a map to the `playing-mediator`, if desired.

### Playing

The `playing` state/feature is generally where the most magic happens. You can create concrete game asset managers, instantiate them in the `playing-mediator`, and allow them to create and manage their specific game assets.

Managers can expose an `update()` method, used to modify game assets on `tick`. These managers can then be added to the gamey app via `game.addUpdateable(myManager);`. This will cause gamey to call `myManager.update()` on each `tick` event, generally 60 times per second.

Use `game.removeUpdateable(myManager);` to stop the manager from updating its assets. You'll want to do this, say, when transitioning to the `paused` or `end` states.

### Game Over

The `playing` state will eventually, based on your game rules, decide when it's game over by called `game.end();`