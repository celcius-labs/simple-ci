var project = require('../models/project');


function repository (request, reply) {
  project.findOne({
    where: {
      username: request.params.username,
      repository: request.params.repository
    }
  }).then(function (row) {
    if (row) {
      reply.file(__dirname + '/../../web/index.html');
    } else {
      reply().code(404);
    }
  });
}

var route = {
  method: 'GET',
  path: '/repo/{username}/{repository}',
  handler: repository
};

module.exports = exports = route;
