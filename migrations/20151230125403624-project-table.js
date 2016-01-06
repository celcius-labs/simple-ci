var db = require('../lib/db');

exports.up = function(next){
  db.query('CREATE TABLE project (id SERIAL PRIMARY KEY, name TEXT, repo TEXT, created TIMESTAMP WITH TIME ZONE, updated TIMESTAMP WITH TIME ZONE)', next);
};

exports.down = function(next){
  db.query('DROP TABLE IF EXISTS project', next);
};
