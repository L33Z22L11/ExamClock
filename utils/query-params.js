export function readQueryParams() {
  try {
    return Object.fromEntries(new URLSearchParams(location.search).entries());
  }
  catch (e) {
    return {};
  }
}

export const queryParams = readQueryParams();

export function setRouteParam(name, value, { replace = false } = {}) {
  const url = new URL(location.href || "/", location.origin || "http://localhost");

  if (value == null || value === "") url.searchParams.delete(name);
  else url.searchParams.set(name, value);

  history?.[replace ? "replaceState" : "pushState"]?.(null, "", url);
  queryParams[name] = value;
}
