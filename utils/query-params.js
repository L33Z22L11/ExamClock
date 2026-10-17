export function readQueryParams() {
  const params = Object.fromEntries(new URLSearchParams(location.search));
  const debug = Number(params.debug);
  const tos = Number(params.tos);
  return {
    ...params,
    debug: Number.isFinite(debug) && debug > 0 ? debug : 0,
    tos: Number.isFinite(tos) ? tos : 0,
  };
}

export const queryParams = readQueryParams();

export function setRouteParam(name, value, { replace = false } = {}) {
  const url = new URL(location.href);
  if (value == null || value === "") url.searchParams.delete(name);
  else url.searchParams.set(name, value);
  history[replace ? "replaceState" : "pushState"](null, "", url);
  Object.assign(queryParams, readQueryParams());
}
