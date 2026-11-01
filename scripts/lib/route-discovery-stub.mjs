// React Router 8.5 aggiunge il runtime della "custom route discovery"
// (future.unstable_customRouteDiscovery). HydratedRouter lo referenzia dietro
// un flag letto a runtime, quindi il tree-shaking non lo toglie: 3,5 kB gzip
// nel JS iniziale per una funzione che il sito non usa (routeDiscovery:
// "initial", nessun flag). Nella build del client il modulo diventa uno stub
// che fallisce in modo esplicito se il flag venisse attivato. Se una versione
// futura cambia gli export del modulo, la build si ferma: lo stub va rivisto.

export const routeDiscoveryModule =
  /[\\/]react-router[\\/]dist[\\/]production[\\/]lib[\\/]dom[\\/]ssr[\\/]route-discovery\.js$/;

export const routeDiscoveryExports = [
  "RouteDiscoveryRuntime",
  "getCustomPatchRoutesOnNavigationFunction",
  "useCustomRouteDiscovery",
  "useRouteDiscovery",
];

/** @param {string} source */
export function exportedNames(source) {
  const lists = [...source.matchAll(/^export \{([^}]*)\};?$/gm)].map((match) => match[1] ?? "");
  return lists
    .flatMap((list) => list.split(","))
    .map((name) => name.trim())
    .filter(Boolean)
    .toSorted();
}

export const stubSource = `const disabled = () => {
  throw new Error("future.unstable_customRouteDiscovery non è incluso nella build (scripts/lib/route-discovery-stub.mjs)");
};
export class RouteDiscoveryRuntime {
  constructor() {
    disabled();
  }
}
export const getCustomPatchRoutesOnNavigationFunction = disabled;
export const useCustomRouteDiscovery = disabled;
export const useRouteDiscovery = disabled;
`;

/**
 * @param {string} code
 * @param {string} id
 */
export function stubRouteDiscovery(code, id) {
  if (!routeDiscoveryModule.test(id)) return null;
  const names = exportedNames(code);
  const expected = routeDiscoveryExports.toSorted();
  if (names.join() !== expected.join()) {
    throw new Error(
      `route-discovery.js di React Router esporta ${names.join(", ")} invece di ${expected.join(", ")}: rivedi scripts/lib/route-discovery-stub.mjs`,
    );
  }
  return stubSource;
}

export function routeDiscoveryStub() {
  return {
    name: "route-discovery-stub",
    apply: /** @type {const} */ ("build"),
    /** @param {{ name: string }} environment */
    applyToEnvironment: (environment) => environment.name === "client",
    /**
     * @param {string} code
     * @param {string} id
     */
    transform(code, id) {
      return stubRouteDiscovery(code, id);
    },
  };
}
