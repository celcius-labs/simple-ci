var model = require('../model');
var Sequelize = require('sequelize');

var Project = model.define('project', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: Sequelize.STRING,
  repo: Sequelize.STRING,
  href: Sequelize.STRING,
  created: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  updated: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
},
{ freezeTableName: true, timestamps: false, underscored: true });

module.exports = exports = Project;
