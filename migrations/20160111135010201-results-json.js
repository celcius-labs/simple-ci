var db = require('../lib/db');
var fs = require('fs');

var sql = fs.readFileSync(__dirname + '/functions/results_to_json.sql', 'utf8');
exports.up = function(next){
  db.query(sql, function ( ) {
    db.query('ALTER TABLE results ADD json_data JSON', function ( ) {
      db.query('UPDATE results SET json_data = results_to_json(init_error, setup_error, setup_stdout, setup_stderr, build_error, build_stdout, build_stderr, test_error, test_stdout, test_stderr, started, ended, error, platform)', next);
    });
  });
};

exports.down = function(next){
  db.query('ALTER TABLE results DROP run_results', next);
};
