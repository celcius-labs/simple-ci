var db = require('../lib/db');

exports.up = function(next){
  db.query('ALTER TABLE project ADD architectures TEXT[]', next);
};

exports.down = function(next){
  db.query('ALTER TABLE project DROP architectures', next);
};
