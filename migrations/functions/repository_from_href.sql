CREATE OR REPLACE FUNCTION repository_from_href(href TEXT) RETURNS
TEXT AS $$
  var parts = href.split("/");

  if (parts.length < 1) {
    return NULL;
  }

  return parts[parts.length - 1];
$$ LANGUAGE plv8;
