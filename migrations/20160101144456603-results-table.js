var db = require('../lib/db');

exports.up = function(next){
  db.query('CREATE TABLE results (id SERIAL, project_id INTEGER references project(id), init_error TEXT, setup_error TEXT, setup_stdout TEXT, setup_stderr TEXT, build_error TEXT, build_stdout TEXT, build_stderr TEXT, test_error TEXT, test_stdout TEXT, test_stderr TEXT, started TIMESTAMP WITH TIME ZONE, ended TIMESTAMP WITH TIME ZONE, error BOOL, platform TEXT, created TIMESTAMP WITH TIME ZONE, updated TIMESTAMP WITH TIME ZONE)', next);
};

exports.down = function(next){
  db.query('DROP TABLE IF EXISTS results', next);
};
