var db = require('../lib/db');

exports.up = function(next){
  db.query('CREATE TABLE results (id SERIAL, project_id INTEGER references project(id), init_error TEXT, setup_error TEXT, setup_stdout TEXT, setup_stderr TEXT, build_error TEXT, build_stdout TEXT, build_stderr TEXT, test_error TEXT, test_stdout TEXT, test_stderr TEXT, started TIMESTAMP, ended TIMESTAMP, error BOOL, platform TEXT, created TIMESTAMP, updated TIMESTAMP)', next);
};

exports.down = function(next){
  db.query('DROP TABLE IF EXISTS results', next);
};
