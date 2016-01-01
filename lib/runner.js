var tmp = require('tmp');
var exec = require('child_process').exec;

function run_command (directory, command, callback) {
  process.chdir(directory);

  child = exec(command,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }

    callback(error, stdout, stderr);
  });
}

function setup_environment ( ) {
  var tmpobj = tmp.dirSync();
  console.log("Dir: ", tmpobj.name);

  return tmpobj;
}

function teardon_environment (tmpobj) {
  tmpobj.removeCallback();
}

function checkout_src (directory, repo, callback) {
  var cmd = 'git clone ' + repo;

  run_command(directory, cmd, callback);
}
