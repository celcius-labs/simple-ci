var db = require('../lib/db');
var fs = require('fs');

var sql1 = fs.readFileSync(__dirname + '/functions/repository_from_href.sql', 'utf8');
var sql2 = fs.readFileSync(__dirname + '/functions/username_from_href.sql', 'utf8');
exports.up = function(next){
  db.query(sql1, function ( ) {
    db.query(sql2, function ( ) {
      db.query('ALTER TABLE project ADD column username TEXT, ADD column repository TEXT', function ( ) {
        db.query('UPDATE project SET username = username_from_href(href), repository = repository_from_href(href)', next);
      });
    });
  });
};

exports.down = function(next){
  db.query('ALTER TABLE project DROP column username, DROP column repository', next);
};
