var results = require('../../models/results');
var project = require('../../models/project');

var cache = { };

function retrieve_rows (reply, clause) {
  results.findAll(clause).done(function (rows) {
    var ret = [ ];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i].json_data || { };
      row.id = rows[i].id;
      row.project_id = rows[i].project_id;

      var started = rows[i].json_data.started ? rows[i].json_data.started : rows[i].started;
      var ended = rows[i].json_data.ended ? rows[i].json_data.ended : rows[i].ended;
      row.started_epoch = Date.parse(started);
      row.ended_epoch = Date.parse(ended);
      row.started = started;
      row.ended = ended;

      // this is really gross, needs to be refactored and cached
      function addRow (result, row, current, length) {
        var now = +new Date();

        if (cache[row.project_id] && now < cache[row.project_id].expires) {
          row.project = cache[row.project_id];
          ret[current] = row;

          if (current === length - 1) {
            reply({ "status": "ok", "rows": ret });
          }
        } else {
          result.getProject().done(function (project) {
            cache[row.project_id] = row.project = {
              name: project.name,
              repo: project.repo,
              href: project.href,
              expires: (+new Date() + 30000)
            };


            ret[current] = row;

            if (current === length - 1) {
              reply({ "status": "ok", "rows": ret });
            }
          });
        }
      }

      addRow(rows[i], row, i, rows.length);
    }
  });
}

function last (request, reply) {
  var count = request.query.count || 25;

  var clause = { limit: count, order: 'created DESC' };

  if (request.query.username) {
    project.findOne({ where: { username: request.query.username, repository: request.query.repository } }).then(function (row) {
      if (row) {
        clause.where = { project_id: row.id };
        retrieve_rows(reply, clause);
      } else {
        reply().code(404);
      }
    });
  } else {
    retrieve_rows(reply, clause);
  }
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
