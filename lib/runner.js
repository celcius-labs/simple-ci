var tmp = require('tmp');
var exec = require('child_process').exec;
var gh = require('parse-github-url');
var project = require('./models/project');
var results = require('./models/results');
var fs = require('fs');
var config = require('../config.json');

// states
var setup_error, setup_stdout, setup_stderr;
var build_error, build_stdout, build_stderr;
var test_error, test_stdout, test_stderr;
var init_error;
var start, project_id;
var build_directory;

function cleanup_handler (err) {
  results.create({
    project_id: project_id,
    init_error: init_error,
    setup_error: setup_error,
    setup_stdout: setup_stdout,
    setup_stderr: setup_stderr,
    build_error: build_error,
    build_stdout: build_stdout,
    build_stderr: build_stderr,
    test_error: test_error,
    test_stdout: test_stdout,
    test_stderr: test_stderr,
    error: err,
    platform: config.platform,
    started: start,
    ended: new Date()
  }).then(function (p) {
    teardown_environment(build_directory);
  });
}

function run_command (directory, command, callback) {
  console.log("running " + command + " in directory " + directory);
  process.chdir(directory);

  child = exec(command, callback);
}

function run_commands (directory, commands, callback) {
  if (commands === undefined || commands.length === 0) {
    callback();
  } else if (typeof commands === 'string') {
    run_commands(directory, [ commands ], callback);
  } else {
    var count = commands.length;
    var current = 0;
    var stdouts = [ ];
    var stderrs = [ ];

    function cb (err, stdout, stderr) {
      stdouts.push('$ ' + commands[current]);
      stdouts.push(stdout.toString());
      stderrs.push(stderr.toString());
      current++;
      if (err) {
        return callback(err, stdouts, stderrs);
      } else if (current === count) {
        callback(null, stdouts, stderrs);
      } else {
        run_command(directory, commands[current], cb);
      }
    }
  }

  run_command(directory, commands[current], cb);

}

function setup_environment ( ) {
  var tmpobj = tmp.dirSync({ unsafeCleanup: true });
  console.log("Dir: ", tmpobj.name);

  build_directory = tmpobj;
  return tmpobj;
}

function teardown_environment (tmpobj) {
  tmpobj.removeCallback();
}

function checkout_src (directory, repo, callback) {
  var cmd = 'git clone ' + repo;

  run_command(directory, cmd, callback);
}

function run_setup (directory, commands, callback) {
  run_commands(directory, commands, function (err, stdout, stderr) {
    setup_stdout = stdout.join("\n");
    setup_stderr = stderr.join("\n");

    // on error, tear everything down and write the current state
    if (err) {
      setup_error = stderr.toString();
      cleanup_handler(true);
      callback(err);
    } else {
      callback();
    }
  });
}

function run_build (directory, commands, callback) {
  run_commands(directory, commands, function (err, stdout, stderr) {
    build_stdout = stdout.join("\n");
    build_stderr = stderr.join("\n");

    // on error, tear everything down and write the current state
    if (err) {
      build_error = stderr.toString();
      cleanup_handler(true);
      callback(err);
    } else {
      callback();
    }
  });
}

function run_test (directory, commands, callback) {
  run_commands(directory, commands, function (err, stdout, stderr) {
    test_stdout = stdout.join("\n");
    test_stderr = stderr.join("\n");

    // on error, tear everything down and write the current state
    if (err) {
      test_error = stderr.toString();
      cleanup_handler(true);
      callback(err);
    } else {
      callback();
    }
  });
}

function run (repo_id, callback) {
  project_id = repo_id;

  if (callback === undefined) {
    callback = function ( ) { };
  }
  var start = new Date();

  project.findById(repo_id).then(function(project) {
    var commands, parsed;

    var repo = project.repo;

    var paths = gh(repo);
    var directory = setup_environment();

    // check out the repo
    checkout_src(directory.name, repo, function (err, stdout, stderr) {
      if (err) {
        init_error = stdout.toString() + "\n\n" + stderr.toString();
        return cleanup_handler(true);
      }


      // attempt to read the .simple-ci.json file
      try {
        commands = fs.readFileSync(directory.name + '/' + paths.repo + '/.simple-ci.json', 'utf8');
      } catch (err) {
        // on error, tear everything down and write the current state
        init_error = stdout.toString() + "\n\n" + stderr.toString() + "\nUnable to read .simple-ci.json file\n";
        return cleanup_handler(true);
      }

      // attempt to parse the .simple-ci.json file
      try {
        parsed = JSON.parse(commands);
      } catch (err) {
        console.log(err);
        // on error, tear everything down and write the current state
        init_error = stdout.toString() + "\n\n" + stderr.toString() + "\nUnable to parse .simple-ci.json file\n";
        return cleanup_handler(true);
      }

      // if there is a setup command, try to run it
      if (parsed.setup) {
        run_setup(directory.name + '/' + paths.repo, parsed.setup, function (err) {
          // on error, tear everything down and write the current state
          if (err) {
            return callback();
          }

          // if there is a build command, try to run it
          if (parsed.build) {
            run_build(directory.name + '/' + paths.repo, parsed.build, function (err) {
              // on error, tear everything down and write the current state
              if (err) {
                return callback();
              }

              // if there is a test command, try to run it
              if (parsed.test) {
                run_test(directory.name + '/' + paths.repo, parsed.test, function (err) {
                  // on error, tear everything down and write the current state
                  if (err) {
                    return callback();
                  }

                  cleanup_handler(false);
                  return callback();
                });
              } else {
                cleanup_handler(false);
                return callback();
              }
            });
          } else if (parsed.test) {
            // no build, but test exists
            run_test(directory.name + '/' + paths.repo, parsed.test, function (err) {
              // on error, tear everything down and write the current state
              if (err) {
                return callback();
              }

              cleanup_handler(false);
              return callback();
            });
          } else {
            // nothing left to do
            cleanup_handler(false);
            return callback();
          }
        });
      } else if (parsed.build) {
        run_build(directory.name + '/' + paths.repo, parsed.build, function (err) {
          // on error, tear everything down and write the current state
          if (err) {
            return callback();
          }

          if (parsed.test) {
            run_setup(directory.name + '/' + paths.repo, parsed.test, function (err) {
              // on error, tear everything down and write the current state
              if (err) {
                return callback();
              }

              cleanup_handler(false);
              return callback();
            });
          }
        });
      } else if (parsed.test) {
        run_test(directory.name + '/' + paths.repo, parsed.test, function (err) {
          // on error, tear everything down and write the current state
          if (err) {
            return callback();
          }

          cleanup_handler(false);
          return callback();
        });
      } else {
        cleanup_handler(false);
        return callback();
      }
    });
  }, function (error) {
    console.log(error);
    callback(error);
  });
}

exports.run = run;
