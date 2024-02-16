importScripts('assets/sw-toolbox.js');

var handler = toolbox.cacheFirst;
var options = {
  debug: true,
  cache: {
    name: 'jsoneditoronline',
    maxAgeSeconds: 24 * 60 * 60 // one day
  }
};

toolbox.router.get('index.html', handler, options);
toolbox.router.get('favicon.ico', handler, options);
toolbox.router.get('app.min.js', handler, options);
toolbox.router.get('app.min.css', handler, options);
toolbox.router.get('img/*', handler, options);
toolbox.router.get('doc/*', handler, options);
