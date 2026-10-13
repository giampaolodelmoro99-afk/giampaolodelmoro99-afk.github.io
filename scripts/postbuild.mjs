import { access, copyFile, readFile, readdir, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { notFoundPath, prerenderPaths } from "../src/routes/routeMap.ts";
import { buildCsp, inlineScriptHashes } from "./lib/csp.mjs";

// Passi successivi a `react-router build`:
// 1. verifica che ogni route della routeMap abbia il suo HTML prerenderizzato;
// 2. crea 404.html dalla route not-found prerenderizzata (GitHub Pages lo serve con status 404);
// 3. inserisce in ogni HTML la CSP via meta tag, con lo sha256 di ogni script inline.
// GitHub Pages non permette header HTTP: il meta è l'unico posto per la CSP
// (vedi docs/adr/0000-lezioni-dalla-v1.md e docs/PERFORMANCE_SEO.md).

const client = resolve(fileURLToPath(new URL("..", import.meta.url)), "build/client");

/** @param {string} route */
function htmlFileFor(route) {
  return route === "/" ? join(client, "index.html") : join(client, route.slice(1), "index.html");
}

/** @param {string} dir @returns {Promise<string[]>} */
async function listHtml(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => join(entry.parentPath, entry.name));
}

const routes = prerenderPaths();
const present = await Promise.all(
  routes.map((route) =>
    access(htmlFileFor(route)).then(
      () => true,
      () => false,
    ),
  ),
);
const missing = routes.filter((_, index) => !present[index]);
if (missing.length > 0) {
  throw new Error(`Route senza HTML prerenderizzato: ${missing.join(", ")}`);
}

await copyFile(htmlFileFor(notFoundPath), join(client, "404.html"));

const charset = '<meta charSet="utf-8"/>';

/** @param {string} file */
async function injectCsp(file) {
  const html = await readFile(file, "utf8");
  if (!html.includes(charset)) {
    throw new Error(`${relative(client, file)}: meta charset non trovato`);
  }
  if (html.includes('http-equiv="Content-Security-Policy"')) {
    throw new Error(`${relative(client, file)}: CSP già presente`);
  }
  const hashes = inlineScriptHashes(html);
  const meta = `<meta http-equiv="Content-Security-Policy" content="${buildCsp(hashes)}"/>`;
  await writeFile(file, html.replace(charset, `${charset}${meta}`));
  console.log(`CSP: ${relative(client, file)} (${hashes.length} script inline)`);
}

await Promise.all((await listHtml(client)).map(injectCsp));
