var Hapi = require('hapi');
var HapiRouter = require('hapi-router');
var HapiSwagger = require('hapi-swagger');
var pkg = require('./package');
var log = require('winston');
var server;

server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 4000
});

require('./server/common/methods').init(server);  // Register server methods ## http://hapijs.com/tutorials/server-methods
require('./server/common/auth').init(server);     // Register server auth schemes

// ## Register routes
server.register({
  register: HapiRouter,
  options: {
    // routesDir: __dirname + '/server/routes/'
    routesDir: 'server/routes/'
  }
}, function (err) { if (err) { throw err; } });

// ## Register swagger API docs generator
server.register({
  register: HapiSwagger,
  options: {
    basePath: '',
    apiVersion: pkg.version
  }
}, function (err) { if (err) { throw err; } });

// ## Start the server if this script not loaded from some other script (tests)
if (!module.parent) {
  server.start(function () {
    log.info('---------------------------------------------');
    log.info(':: Server started at:', server.info.uri);
    log.info('::', (new Date()).toString());
    log.info('---------------------------------------------');
  });
}

module.exports = server;