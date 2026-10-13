import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { networkInterfaces } from "node:os";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Server statico che imita GitHub Pages: file esistente → 200,
// cartella senza slash finale → 301, cartella con index.html → 200,
// tutto il resto → 404.html con status 404.
// Ascolta solo in loopback (127.0.0.1 e, se disponibile, ::1, perché "localhost"
// può risolvere su entrambi); con `npm run preview -- --host` ascolta su tutte
// le interfacce, per provare il sito da un telefono sulla stessa rete Wi-Fi.

const root = resolve(fileURLToPath(new URL("..", import.meta.url)), "build/client");
const port = Number(process.env.PORT ?? 4173);
const lan = process.argv.includes("--host");
const host = lan ? "0.0.0.0" : "127.0.0.1";

/** @type {Record<string, string>} */
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".data": "text/x-script",
};

/** @param {string} path */
async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

/** @param {string} path */
async function isDirectory(path) {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

/**
 * @param {import("node:http").ServerResponse} res
 * @param {string} file
 * @param {number} status
 */
function send(res, file, status) {
  res.writeHead(status, {
    "Content-Type": types[extname(file)] ?? "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  createReadStream(file).pipe(res);
}

/** @type {import("node:http").RequestListener} */
const handler = async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const pathname = decodeURIComponent(url.pathname);
  const target = normalize(join(root, pathname));

  if (!target.startsWith(root)) {
    res.writeHead(400).end();
    return;
  }

  if (await isFile(target)) {
    send(res, target, 200);
    return;
  }

  if (await isDirectory(target)) {
    if (!pathname.endsWith("/")) {
      res.writeHead(301, { Location: `${pathname}/${url.search}` }).end();
      return;
    }
    const index = join(target, "index.html");
    if (await isFile(index)) {
      send(res, index, 200);
      return;
    }
  }

  if (await isFile(`${target}.html`)) {
    send(res, `${target}.html`, 200);
    return;
  }

  send(res, join(root, "404.html"), 404);
};

createServer(handler).listen(port, host, () => {
  console.log(`Preview su http://localhost:${port}`);
  if (!lan) return;
  const addresses = Object.values(networkInterfaces())
    .flat()
    .filter((address) => address?.family === "IPv4" && !address.internal);
  for (const address of addresses) {
    console.log(`In rete locale: http://${address?.address}:${port}`);
  }
});

if (!lan) {
  createServer(handler)
    .on("error", () => {})
    .listen(port, "::1");
}
