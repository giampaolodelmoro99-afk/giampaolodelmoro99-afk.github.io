import { existsSync, readFileSync } from "node:fs";
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import { intlLocales } from "./src/routes/routeMap.ts";

const client = "build/client";
const entry = `${client}/index.html`;

if (!existsSync(entry)) {
  throw new Error(
    "build/client/index.html non trovato: esegui `npm run build` prima di `npm run size`",
  );
}

const html = readFileSync(entry, "utf8");
const boot = /<script type="text\/plain" id="rr-boot">([\s\S]*?)<\/script>/.exec(html)?.[1] ?? "";
const roots = [...boot.matchAll(/"(\/assets\/[^"]+\.js)"/g)].map((match) => match[1]);

const staticImport = /(?:from|import)\s*"\.\/([^"]+\.js)"/g;

const initialJs = new Set();
const visit = (file) => {
  if (initialJs.has(file)) return;
  initialJs.add(file);
  const source = readFileSync(`${client}${file}`, "utf8");
  for (const match of source.matchAll(staticImport)) {
    visit(`/assets/${match[1]}`);
  }
};
roots.forEach(visit);

if (initialJs.size === 0) {
  throw new Error("bootstrap di React Router non trovato in build/client/index.html");
}

const stylesheets = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(
  (match) => `${client}${match[1]}`,
);

const fontPreloads = [...html.matchAll(/<link rel="preload" href="([^"]+)" as="font"/g)].map(
  (match) => `${client}${match[1]}`,
);

if (fontPreloads.length === 0) {
  throw new Error("nessun font in preload in build/client/index.html");
}

export default [
  {
    name: "JS iniziale della home (gzip)",
    path: [...initialJs].map((file) => `${client}${file}`),
    limit: "115 kB",
    gzip: true,
    disablePlugins: ["@size-limit/esbuild"],
  },
  {
    name: "CSS iniziale della home (gzip)",
    path: stylesheets,
    limit: "12 kB",
    gzip: true,
    disablePlugins: ["@size-limit/esbuild"],
  },
  {
    name: "Font in preload della home (woff2)",
    path: fontPreloads,
    limit: "25 kB",
    gzip: false,
    brotli: false,
    disablePlugins: ["@size-limit/esbuild"],
  },
  ...componentChecks(),
];

// Peso dei componenti del design system (ADR-0012, phase-01-plan.md B.3.1).
// Stesse condizioni della build del sito: import per sottopercorso da React
// Aria, optimize-locales su it-IT ed en-US, NODE_ENV di produzione; React,
// React DOM e React Router stanno nel chunk "framework" e restano fuori.
// Senza limite fino alla chiusura della 1B, quando si fissano i budget.
function componentChecks() {
  const components = ["Icon", "Glyph"];
  const desktopShell = [];
  const framework = ["react", "react-dom", "react/jsx-runtime", "react-router", "scheduler"];

  const check = (name, names, only) => ({
    name,
    import: { "src/components/index.ts": `{ ${names.join(", ")} }` },
    ignore: framework,
    gzip: true,
    modifyEsbuildConfig: esbuildConfig(only),
  });

  return [
    check("Componenti: totale JS (gzip)", components, "js"),
    check("Componenti: totale CSS (gzip)", components, "css"),
    ...(desktopShell.length > 0
      ? [check("Componenti: guscio del desktop F2A, JS (gzip)", desktopShell, "js")]
      : []),
    ...components.map((component) =>
      check(`Componente ${component}: JS (gzip)`, [component], "js"),
    ),
  ];
}

function esbuildConfig(only) {
  return (config) => ({
    ...config,
    define: { "process.env.NODE_ENV": '"production"' },
    loader: { ...config.loader, ...(only === "js" ? { ".css": "empty" } : {}) },
    plugins: [
      ...(config.plugins ?? []),
      optimizeLocales.esbuild({ locales: Object.values(intlLocales) }),
      ...(only === "css" ? [dropOutputs(/\.js$/)] : []),
    ],
  });
}

function dropOutputs(pattern) {
  return {
    name: "drop-outputs",
    setup(build) {
      build.onEnd((result) => {
        for (const output of Object.keys(result.metafile?.outputs ?? {})) {
          if (pattern.test(output)) delete result.metafile.outputs[output];
        }
      });
    },
  };
}
