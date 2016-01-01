var Sequelize = require('sequelize');
var config = require('../config.json');

var sequelize = new Sequelize(config.database.postgres.database,
    config.database.postgres.username,
    config.database.postgres.password,
    {
    host: config.database.postgres.hostname,
    dialect: 'postgres',

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  });

module.exports = exports = sequelize;
