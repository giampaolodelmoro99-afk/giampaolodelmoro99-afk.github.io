import { existsSync, readFileSync } from "node:fs";

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
  },
  {
    name: "CSS iniziale della home (gzip)",
    path: stylesheets,
    limit: "12 kB",
    gzip: true,
  },
  {
    name: "Font in preload della home (woff2)",
    path: fontPreloads,
    limit: "25 kB",
    gzip: false,
    brotli: false,
  },
];
