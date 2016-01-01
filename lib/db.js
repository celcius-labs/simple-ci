var config = require('../config.json');
var pg = require('pg');

var conString = 'postgres://' + config.database.postgres.username + ':' + config.database.postgres.password + '@' + config.database.postgres.hostname + '/' + config.database.postgres.database;
var client;

function query ( ) {
  var args = Array.prototype.slice.call(arguments);
  var callback = args.pop();

  if (typeof callback !== 'function') {
    args.push(callback);
    callback = null;
  }

  pg.connect(conString, function(err, cl, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    args.push(function (err, results) {
      if (callback) {
        callback(err, results);
      }
      done();
    });

    cl.query.apply(cl, args);
  });
}

exports.query = query;
