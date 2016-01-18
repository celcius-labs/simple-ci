CREATE OR REPLACE FUNCTION username_from_href(href TEXT) RETURNS
TEXT AS $$
  var parts = href.split("/");

  if (parts.length < 2) {
    return NULL;
  }

  return parts[parts.length - 2];
$$ LANGUAGE plv8;
