var results = require('../../models/results');

function result (request, reply) {
  var id = request.query.id;

  results.findById(id).done(function (row) {
    if (row === undefined || row === null) {
      return reply({ "status": "ok" });
    }

    var ret = {
      id: row.id,
      init_error: row.init_error,
      setup_error: row.setup_error,
      setup_stdout: row.setup_stdout,
      setup_stderr: row.setup_stderr,
      build_error: row.build_error,
      build_stdout: row.build_stdout,
      build_stderr: row.build_stderr,
      test_error: row.test_error,
      test_stdout: row.test_stdout,
      test_stderr: row.test_stderr,
      platform: row.platform,
      error: row.error,
      started: row.started,
      ended: row.ended,
      started_epoch: Date.parse(row.started),
      ended_epoch: Date.parse(row.ended)
    };

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
