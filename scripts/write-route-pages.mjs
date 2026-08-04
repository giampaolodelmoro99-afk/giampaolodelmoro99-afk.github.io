import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const sitemap = join(root, "public", "sitemap.xml");

const routes = [...readFileSync(sitemap, "utf8").matchAll(/<loc>\s*(\S+?)\s*<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname.replace(/\/+$/, ""))
  .filter(Boolean);

if (routes.length === 0) {
  throw new Error(`Nessuna rotta trovata in ${sitemap}`);
}

const unsafe = routes.filter((route) => !/^(\/[a-z0-9-]+)+$/.test(route));
if (unsafe.length > 0) {
  throw new Error(`Rotte non valide in ${sitemap}: ${unsafe.join(", ")}`);
}

const shell = readFileSync(join(dist, "index.html"), "utf8");

for (const route of routes) {
  const file = join(dist, route, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, shell);
  console.log(`dist${route}/index.html`);
}
