/**
 * Wraps the CreateJS PreloadJS and SoundJS API.
 * See: https://createjs.com/docs/soundjs/modules/SoundJS.html
 */
(function(window, createjs, opspark, _) {
  let throttledSounds = new WeakMap();
  let onceSounds = {};
  
  function onThrottledSoundComplete(event, key) {
    throttledSounds.delete(key);
  }
  
  function onOnceSoundComplete(event, data) {
    // delay deleting the sound //
    setTimeout(function() {
      delete onceSounds[data.soundId];
    }, data.waitBetweenPlay || 1000);
  }
  
  _.set(opspark, 'util.dj', {
    load(manifest) {
      return new Promise(function(resolve, reject) {
        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.on('complete', onComplete);
        queue.on('error', onError);
        queue.loadManifest(manifest);
        // queue.loadFile({ id: "sound", src: "http://path/to/sound.mp3" });
        
        function onComplete(event) {
          queue.off('complete', onComplete);
          queue.off('error', onError);
          resolve(createjs.Sound);
        }
        
        function onError(error) {
          queue.off('error', onError);
          console.log(error);
          reject(error);
        }
      });
    },
    /**
     * Plays a sound by the given soundId, taking optional parameters.
     * @param {String} soundId: The id mapped to the sound in the PreloadJS manifest.
     * @param {Number} options.volume: A number between 0 and 1, defaults to 1.
     * @param {Number} options.loop: How many times the audio loops when it reaches the end of playback. The default is 0 (no loops), and -1 can be used for infinite playback.
     * @param {Number} options.delay: The amount of time to delay the start of audio playback, in milliseconds. Defaults to 0.
     * @param {Number} options.offset: The offset from the start of the audio to begin playback, in milliseconds. Defaults to 0.
     * @param {Number} options.pan: The left-right pan of the sound (if supported), between -1 (left) and 1 (right). Defaults to 0.
     */
    play(soundId, { 
      volume = 1, 
      loop = 0,
      delay = 0,
      offset = 0,
      pan = 0,
      duration,
    } = {}) {
      const props = new createjs.PlayPropsConfig()
        .set({ volume, loop, delay, offset, pan, duration });
      return createjs.Sound.play(soundId, props);
    },
    /**
     * Same as play(), but maps a sound to a key, which most ofen will be a body, 
     * and will play the sound only if any previous sound mapped to the key is 
     * complete.
     * This is useful in collision sequences, where between ticks, two bodies
     * may continue to collide, but a collision sound should only play once.
     *
     * @param {String} soundId: The id mapped to the sound in the PreloadJS manifest.
     * @param {Object} key: Used to map the sound instance in a WeakMap - this will most ofen be a body related to the playing of the sound.
     * @param {Number} options.volume: A number between 0 and 1, defaults to 1.
     * @param {Number} options.loop: How many times the audio loops when it reaches the end of playback. The default is 0 (no loops), and -1 can be used for infinite playback.
     * @param {Number} options.delay: The amount of time to delay the start of audio playback, in milliseconds. Defaults to 0.
     * @param {Number} options.offset: The offset from the start of the audio to begin playback, in milliseconds. Defaults to 0.
     * @param {Number} options.pan: The left-right pan of the sound (if supported), between -1 (left) and 1 (right). Defaults to 0.
     */
    playThrottled(soundId, key, { 
      volume = 1, 
      loop = 0,
      delay = 0,
      offset = 0,
      pan = 0,
      duration,
    } = {}) {
      if(!throttledSounds.has(key)) {
        const 
          props = new createjs.PlayPropsConfig().set({ volume, loop, delay, offset, pan, duration }),
          sound = createjs.Sound.play(soundId, props);
          
        throttledSounds.set(key, sound);
        sound.on('complete', onThrottledSoundComplete, null, true, key);
        return sound;
      }
    },
    playOnce(soundId, { 
      waitBetweenPlay = 1000,
      volume = 1, 
      loop = 0,
      delay = 0,
      offset = 0,
      pan = 0,
      duration,
    } = {}) {
      if(!onceSounds[soundId]) {
        const 
          props = new createjs.PlayPropsConfig().set({ volume, loop, delay, offset, pan, duration }),
          sound = createjs.Sound.play(soundId, props);
          
        onceSounds[soundId] = sound;
        sound.on('complete', onOnceSoundComplete, null, true, {soundId, waitBetweenPlay});
        return sound;
      }
    },
    get(soundId) {
      return createjs.Sound.createInstance(soundId);
    },
    isReady() {
      return createjs.Sound.isReady();
    },
    reset() {
      throttledSounds = new WeakMap();
      onceSounds = {};
    },
  });
}(window, window.createjs, window.opspark, window._));
