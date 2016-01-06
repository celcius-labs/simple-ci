var Hapi = require('hapi');
var Inert = require('inert');

var config = require('../config.json');

var server = new Hapi.Server();

server.connection({
  port: config.webserver.port,
  routes: { cors: true }
});

server.register(Inert, function () { });

var routes = [
  require('./api/v1/last'),
  require('./api/v1/result')
];

routes.forEach(function (route) {
  server.route({
    method: route.method,
    path: route.path,
    config: route.config,
    handler: route.handler
  });
});

// default file route
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: __dirname + "/../web",
      redirectToSlash: true,
      index: true
    }
  }
});

module.exports = exports = server;
