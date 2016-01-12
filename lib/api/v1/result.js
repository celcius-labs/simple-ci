var results = require('../../models/results');

function result (request, reply) {
  var id = request.query.id;

  results.findById(id).done(function (row) {
    if (row === undefined || row === null) {
      return reply({ "status": "ok" });
    }

    var ret = row.json_data;
    ret.id = row.id;
    var started = row.json_data.started ? row.json_data.started : row.started;
    var ended = row.json_data.ended ? row.json_data.ended : row.ended;
    ret.started_epoch = Date.parse(started);
    ret.ended_epoch = Date.parse(ended);
    ret.started = started;
    ret.ended = ended;

    row.getProject().done(function (project) {
      ret.project = {
        name: project.name,
        repo: project.repo,
        href: project.href
      };

      reply({ "status": "ok", "row": ret });
    });
  });
}

var route = {
  method: 'GET',
  path: '/api/v1/result',
  handler: result,
  parameters: {
    required: [
      {
        name: 'id',
        description: 'ID of entry to return'
      }
    ]
  }
};

module.exports = exports = route;
