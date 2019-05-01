(function(window, _) {
  const opspark = _.set(window, 'opspark', window.opspark || {}).opspark;

  _.set(opspark, 'util.getJSON',
    /**
     * Promisifies a XMLHttpRequest to load JSON.
     * See: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
     * 
     * @param {String} url: The url to the JSON file to load.
     * @return {Promise}: Returns the Promise that wraps the XMLHttpRequest
     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
     */
    function(url) {
      return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest;

        xhr.addEventListener('progress', function(event) {
          if (event.lengthComputable) {
            const percentComplete = event.loaded / event.total * 100;
            console.log(`JSON data ${percentComplete} loaded...`);
          }
        });
        xhr.addEventListener('error', function(event) {
          console.log(`An error occurred while loading ${url}`);
          reject(event);
        });
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          }
        };
        // bypass the cached url by adding a timestamp //
        xhr.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
        xhr.send();
      });
    });
}(window, window._));
