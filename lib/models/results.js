var model = require('../model');
var Sequelize = require('sequelize');
var project = require('./project');

var Results = model.define('results', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  project_id: Sequelize.INTEGER,
  init_error: Sequelize.STRING,
  setup_error: Sequelize.STRING,
  setup_stdout: Sequelize.STRING,
  setup_stderr: Sequelize.STRING,
  build_error: Sequelize.STRING,
  build_stdout: Sequelize.STRING,
  build_stderr: Sequelize.STRING,
  test_error: Sequelize.STRING,
  test_stdout: Sequelize.STRING,
  test_stderr: Sequelize.STRING,
  started: Sequelize.DATE,
  ended: Sequelize.DATE,
  error: Sequelize.BOOLEAN,
  platform: Sequelize.STRING,
  json_data: Sequelize.JSON,
  created: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  updated: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
},
{ freezeTableName: true, timestamps: false, underscored: true });

Results.belongsTo(project, { foreignKey: "project_id" });

module.exports = exports = Results;
