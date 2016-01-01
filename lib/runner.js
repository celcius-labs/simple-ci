var tmp = require('tmp');
var exec = require('child_process').exec;
var gh = require('parse-github-url');
var project = require('./models/project');
var fs = require('fs');

function run_command (directory, command, callback) {
  process.chdir(directory);

  child = exec(command, callback);
}

function setup_environment ( ) {
  var tmpobj = tmp.dirSync();
  console.log("Dir: ", tmpobj.name);

  return tmpobj;
}

function teardown_environment (tmpobj) {
  tmpobj.removeCallback();
}

function checkout_src (directory, repo, callback) {
  var cmd = 'git clone ' + repo;

  run_command(directory, cmd, callback);
}

function run (repo_id, callback) {
  project.findById(repo_id).then(function(project) {
    var repo = project.repo;

    var paths = gh(repo);
    var directory = setup_environment();

    checkout_src(directory.name, repo, function (err, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);

      var commands = fs.readFileSync(directory.name + '/' + paths.repo + '/.simple-ci.json', 'utf8');

      console.log(commands);

      teardown_environment(directory);

    });
  }, function (error) {
    console.log(error);
    callback(error);
  });
}

exports.run = run;
