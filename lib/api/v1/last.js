var results = require('../../models/results');

function last (request, reply) {
  var count = request.query.count || 25;

  results.findAll({ limit: count, order: 'ended DESC'}).done(function (rows) {
    var ret = [ ];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i].json_data || { };
      row.id = rows[i].id;
      row.started_epoch = Date.parse(rows[i].started);
      row.ended_epoch = Date.parse(rows[i].ended);
      row.started = rows[i].started;
      row.ended = rows[i].ended;

      // this is really gross, needs to be refactored and cached
      function addRow (result, row, current, length) {
        result.getProject().done(function (project) {
          row.project = {
            name: project.name,
            repo: project.repo,
            href: project.href
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
