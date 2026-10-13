import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

/**
 * Righe delle tabelle di docs/ASSETS.md: percorso del file e SHA-256, entrambi
 * tra backtick. Le note in elenco puntato (per esempio gli asset dismessi)
 * non sono righe di tabella e vengono ignorate.
 * @param {string} markdown
 * @returns {Map<string, string>}
 */
export function registeredAssets(markdown) {
  /** @type {Map<string, string>} */
  const assets = new Map();
  for (const line of markdown.split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").map((cell) => cell.trim());
    const file = cells.map((cell) => /^`([^`]+\.[a-z0-9]+)`$/.exec(cell)?.[1]).find(Boolean);
    const sha = cells.map((cell) => /^`([0-9a-f]{64})`$/.exec(cell)?.[1]).find(Boolean);
    if (file && sha) {
      if (assets.has(file)) throw new Error(`${file} registrato due volte in ASSETS.md`);
      assets.set(file, sha);
    }
  }
  return assets;
}

/** Estensioni dei file multimediali serviti da public/ che vanno registrati. */
export const mediaExtensions = /\.(svg|png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf|mp3|ogg|wav)$/;

/**
 * File che devono comparire in ASSETS.md: tutto ciò che sta in src/assets e
 * fonts-src, più i file multimediali di public.
 * @param {string} root
 * @returns {Promise<string[]>}
 */
export async function assetFiles(root) {
  /** @param {string} dir */
  const list = async (dir) =>
    (await readdir(join(root, dir), { withFileTypes: true, recursive: true }))
      .filter((entry) => entry.isFile())
      .map((entry) => relative(root, join(entry.parentPath, entry.name)));
  const [assets, fontSources, publicFiles] = await Promise.all([
    list("src/assets"),
    list("fonts-src"),
    list("public"),
  ]);
  return [...assets, ...fontSources, ...publicFiles.filter((file) => mediaExtensions.test(file))]
    .map((file) => file.split("\\").join("/"))
    .toSorted();
}

/** @param {Buffer} content */
export function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

/**
 * Confronta i file con il registro: non registrati, registrati ma assenti,
 * SHA-256 diverso.
 * @param {string} root
 * @param {Map<string, string>} registered
 */
export async function auditAssets(root, registered) {
  const files = await assetFiles(root);
  const hashes = await Promise.all(
    files.map(async (file) => [file, sha256(await readFile(join(root, file)))]),
  );
  return {
    unregistered: files.filter((file) => !registered.has(file)),
    missing: [...registered.keys()].filter((file) => !files.includes(file)),
    mismatched: hashes
      .filter(([file = "", hash]) => registered.has(file) && registered.get(file) !== hash)
      .map(([file]) => file),
  };
}
