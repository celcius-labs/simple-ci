var redis = require('redis');
var project = require('../../models/project');
var config = require('../../../config.json');

var client = redis.createClient(config.database.redis.port, config.database.redis.hostname);

function ghwebhook (request, reply) {
  var repo;
  if (request.payload && request.payload.repository && request.payload.repository.html_url) {
    repo = request.payload.repository.html_url;
  }

  // reply and close the connection
  reply({ "status": "ok" });

  project.findOne({ where: { href: repo } }).done(function (row) {
    if (!row) {
      console.log("Unknown repo " + repo);
    } else {
      for (var i = 0; i < row.architectures.length; i++) {
        client.lpush(row.architectures[i], row.id);
      }
    }
  });
}

var route = {
  method: 'POST',
  path: '/api/v1/ghwebhook',
  handler: ghwebhook,
};

module.exports = exports = route;
