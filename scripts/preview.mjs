import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Server statico che imita GitHub Pages: file esistente → 200,
// cartella senza slash finale → 301, cartella con index.html → 200,
// tutto il resto → 404.html con status 404.

const root = resolve(fileURLToPath(new URL("..", import.meta.url)), "build/client");
const port = Number(process.env.PORT ?? 4173);

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

const server = createServer(async (req, res) => {
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
});

server.listen(port, () => {
  console.log(`Preview su http://localhost:${port}`);
});
