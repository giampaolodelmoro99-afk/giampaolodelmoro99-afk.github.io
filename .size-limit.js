import { existsSync, readFileSync, readdirSync } from "node:fs";
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

// Chunk caricati dopo l'idratazione (ADR-0014): gli import dinamici del JS
// iniziale, con i loro import statici che non sono già nel JS iniziale.
const dynamicImport = /import\(["`]\.\/([^"`]+\.js)["`]\)/g;
const lazyJs = new Set();
const visitLazy = (file) => {
  if (initialJs.has(file) || lazyJs.has(file)) return;
  lazyJs.add(file);
  const source = readFileSync(`${client}${file}`, "utf8");
  for (const match of source.matchAll(staticImport)) visitLazy(`/assets/${match[1]}`);
};
for (const file of initialJs) {
  const source = readFileSync(`${client}${file}`, "utf8");
  for (const match of source.matchAll(dynamicImport)) visitLazy(`/assets/${match[1]}`);
}
const desktopChunk = [...lazyJs];
if (!desktopChunk.some((file) => /\/DesktopApp-[^/]+\.js$/.test(file))) {
  throw new Error("chunk del desktop (DesktopApp) non trovato tra gli import dinamici della home");
}

const iconSprite = readdirSync(`${client}/assets`).filter((file) =>
  /^iconSprite-[\w-]+\.svg$/.test(file),
);
if (iconSprite.length !== 1)
  throw new Error("sprite delle icone non trovato in build/client/assets");

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
    limit: "124 kB",
    gzip: true,
    disablePlugins: ["@size-limit/esbuild"],
  },
  {
    name: "Chunk del desktop dopo l'idratazione, JS (gzip)",
    path: desktopChunk.map((file) => `${client}${file}`),
    limit: "80 kB",
    gzip: true,
    disablePlugins: ["@size-limit/esbuild"],
  },
  {
    name: "Sprite delle icone (gzip)",
    path: iconSprite.map((file) => `${client}/assets/${file}`),
    limit: "14 kB",
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
// Budget fissati alla chiusura della 1B (misura arrotondata per eccesso al kB):
// si alzano solo con un ADR. Le altre voci servono all'analisi e non hanno limite:
// da ADR-0019 si misurano solo con `npm run size:components` (SIZE_COMPONENTS=1),
// a fine fase o quando si aggiunge un componente; `npm run size` (anche in CI)
// controlla i totali e i chunk.
function componentChecks() {
  const folders = {
    Icon: "Icon",
    Glyph: "Icon",
    Button: "Button",
    TextField: "TextField",
    TextArea: "TextArea",
    Checkbox: "Checkbox",
    RadioGroup: "Radio",
    Radio: "Radio",
    GroupBox: "GroupBox",
    ProgressBar: "ProgressBar",
    StatusBar: "StatusBar",
    ScrollArea: "ScrollArea",
    Tooltip: "Tooltip",
    Tabs: "Tabs",
    Select: "Select",
    MenuBar: "MenuBar",
    MenuButton: "MenuBar",
    MenuItem: "MenuBar",
    MenuSeparator: "MenuBar",
    Submenu: "MenuBar",
    Window: "Window",
    Taskbar: "TaskbarButton",
    TaskbarButton: "TaskbarButton",
    StartButton: "StartButton",
    DesktopIcons: "DesktopIcon",
    AlertDialog: "AlertDialog",
    AlertDialogFrame: "AlertDialog",
  };
  const components = Object.keys(folders);
  const desktopShell = ["Window", "Taskbar", "TaskbarButton", "StartButton", "DesktopIcons"];
  const framework = ["react", "react-dom", "react/jsx-runtime", "react-router", "scheduler"];

  const check = (name, file, names, only) => ({
    name,
    import: { [file]: `{ ${names.join(", ")} }` },
    ignore: framework,
    gzip: true,
    modifyEsbuildConfig: esbuildConfig(only),
  });
  const index = "src/components/index.ts";

  const totals = [
    { ...check("Componenti: totale JS (gzip)", index, components, "js"), limit: "99 kB" },
    { ...check("Componenti: totale CSS (gzip)", index, components, "css"), limit: "7 kB" },
    {
      ...check("Componenti: guscio del desktop F2A, JS (gzip)", index, desktopShell, "js"),
      limit: "75 kB",
    },
  ];
  if (process.env["SIZE_COMPONENTS"] !== "1") return totals;

  return [
    ...totals,
    check(
      "Base React Aria: Button di React Aria da solo, JS (gzip)",
      "node_modules/react-aria-components/dist/exports/Button.mjs",
      ["Button"],
      "js",
    ),
    check("Icon importato dall'indice dei componenti, JS (gzip)", index, ["Icon"], "js"),
    ...Object.entries(folders).map(([component, folder]) =>
      check(
        `Componente ${component}: JS (gzip)`,
        `src/components/${folder}/index.ts`,
        [component],
        "js",
      ),
    ),
  ];
}

function esbuildConfig(only) {
  return (config) => ({
    ...config,
    define: { "process.env.NODE_ENV": '"production"' },
    // esbuild avvisa che con composes tra file l'ordine delle regole non è
    // garantito: vale per il suo bundle, non per Vite che costruisce il sito.
    // La misura del peso non cambia, quindi l'avviso si silenzia qui.
    logOverride: { "undefined-composes-from": "silent" },
    loader: { ...config.loader, ...(only === "js" ? { ".css": "empty" } : {}) },
    plugins: [
      ...(config.plugins ?? []),
      optimizeLocales.esbuild({ locales: Object.values(intlLocales) }),
      removedLocalesLoader,
      urlImports,
      ...(only === "css" ? [dropOutputs(/\.js$/)] : []),
    ],
  });
}

// optimize-locales 2.1.0 con unplugin 2.3: in esbuild le traduzioni escluse
// vengono risolte verso empty.js nel namespace "locales-plugin", ma il plugin non
// ha un hook load ed esbuild non sa caricarle ("Do not know how to load path").
// In Vite funziona. Qui si carica il file dal disco: la misura resta quella con
// le sole lingue it-IT ed en-US.
const removedLocalesLoader = {
  name: "removed-locales-loader",
  setup(build) {
    build.onLoad({ filter: /.*/, namespace: "locales-plugin" }, (args) => ({
      contents: readFileSync(args.path, "utf8"),
      loader: "js",
    }));
  },
};

// Gli import "?url" (lo sprite delle icone) in Vite diventano l'URL del file
// copiato tra gli asset: qui diventano una stringa, così il peso misurato è
// quello del JavaScript, senza il file.
const urlImports = {
  name: "url-imports",
  setup(build) {
    build.onResolve({ filter: /\?url$/ }, (args) => ({ path: args.path, namespace: "url-import" }));
    build.onLoad({ filter: /.*/, namespace: "url-import" }, (args) => ({
      contents: `export default ${JSON.stringify(`/assets/${args.path.replace(/\?url$/, "")}`)};`,
      loader: "js",
    }));
  },
};

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
