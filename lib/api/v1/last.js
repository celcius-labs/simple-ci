var results = require('../../models/results');

function last (request, reply) {
  var count = request.query.count || 25;

  results.findAll({ limit: count, order: 'ended DESC'}).done(function (rows) {
    var ret = [ ];
    for (var i = 0; i < rows.length; i++) {
      var row = {
        id: rows[i].id,
        init_error: rows[i].init_error,
        setup_error: rows[i].setup_error,
        setup_stdout: rows[i].setup_stdout,
        setup_stderr: rows[i].setup_stderr,
        build_error: rows[i].build_error,
        build_stdout: rows[i].build_stdout,
        build_stderr: rows[i].build_stderr,
        test_error: rows[i].test_error,
        test_stdout: rows[i].test_stdout,
        test_stderr: rows[i].test_stderr,
        platform: rows[i].platform,
        error: rows[i].error,
        started: rows[i].started,
        ended: rows[i].ended,
        started_epoch: Date.parse(rows[i].started),
        ended_epoch: Date.parse(rows[i].ended)
      };

      // this is really gross, needs to be refactored and cached
      function addRow (result, row, current, length) {
        result.getProject().done(function (project) {
          row.project = {
            name: project.name,
            repo: project.repo
          };

          ret[current] = row;

          if (current === length - 1) {
            reply({ "status": "ok", "rows": ret });
          }
        });
      }

      addRow(rows[i], row, i, rows.length);
    }
  });
}

var route = {
  method: 'GET',
  path: '/api/v1/last',
  handler: last,
  parameters: {
    optional: [
      {
        name: 'count',
        description: 'Number of entries to return'
      }
    ]
  }
};

module.exports = exports = route;
