var db = require('../lib/db');

exports.up = function(next){
  db.query('CREATE INDEX idx_results_project_id_created ON results (project_id, created)', next);
};

exports.down = function(next){
  db.query('DROP INDEX idx_results_project_id_created', next);
};
