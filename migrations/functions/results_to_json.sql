CREATE OR REPLACE FUNCTION results_to_json(init_error TEXT, setup_error TEXT, setup_stdout TEXT, setup_stderr TEXT, build_error TEXT, build_stdout TEXT, build_stderr TEXT, test_error TEXT, test_stdout TEXT, test_stderr TEXT, started TIMESTAMP WITH TIME ZONE, ended TIMESTAMP WITH TIME ZONE, error BOOL, platform TEXT) RETURNS
JSON AS $$
  var obj = {
    "init_error": init_error,
    "setup_error": setup_error,
    "setup_stdout": setup_stdout,
    "setup_stderr": setup_stderr,
    "build_error": build_error,
    "build_stdout": build_stdout,
    "build_stderr": build_stderr,
    "test_error": test_error,
    "test_stdout": test_stdout,
    "test_stderr": test_stderr,
    "started": started,
    "ended": ended,
    "error": error,
    "platform": platform
  };

  return obj;
$$ LANGUAGE plv8;
