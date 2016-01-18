var project = require('../models/project');
var db = require('../db');
var gm = require('gm');

function badge (request, reply) {
  var dir = __dirname + "/../../img/";

  project.findOne({
    where: {
      username: request.params.username,
      repository: request.params.repository
    }
  }).then(function (row) {
    if (row) {
      var query = "SELECT r.project_id, r.platform, r.error, i.created FROM results r INNER JOIN (SELECT project_id, platform, MAX(created) AS created FROM results GROUP BY project_id, platform) AS i ON r.project_id = i.project_id AND r.platform = i.platform AND r.created = i.created WHERE i.project_id = $1 ORDER BY platform";

      db.query(query, [ row.id ], function (err, result) {
        if (err) {
          return reply().code(404);
        }

        var passing = true;
        var platforms = [ ];

        for (var i = 0; i < result.rows.length; i++) {
          if (result.rows[i].error) {
            platforms.push(result.rows[i].platform + '-failing.png');
            passing = false;
          } else {
            platforms.push(result.rows[i].platform + '-passing.png');
          }
        }

        if (!passing) {
          platforms.unshift('build-failing.png');
        } else {
          platforms.unshift('build-passing.png');
        }

        var imgs = platforms.map(function (img) {
          return dir + '/' + img;
        });

        var status = gm(imgs[0]);

        for (var j = 1; j < platforms.length; j++) {
          status.append(imgs[j]);
        }

        status.append();
        status.toBuffer('PNG', function (err, buffer) {
          if (err) {
            return reply().code(404);
          }

          reply(buffer).type('image/png');
        });
      });
    } else {
      reply().code(404);
    }
  });
}

var route = {
  method: 'GET',
  path: '/repo/{username}/{repository}/badge.png',
  handler: badge
};

module.exports = exports = route;
