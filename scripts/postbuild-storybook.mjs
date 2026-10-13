import { access, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prepareStorybookHtml } from "./lib/storybook.mjs";

// Passi dopo `storybook build -o build/client/storybook`:
// 1. CSP dedicata e verifica di noindex e risorse esterne in index.html e iframe.html;
// 2. rimozione di project.json, che Storybook genera per la telemetria e il sito
//    non usa: elencherebbe pubblicamente le dipendenze di sviluppo.
// La CSP del sito non cambia: postbuild.mjs esclude la cartella storybook.

const dir = resolve(fileURLToPath(new URL("..", import.meta.url)), "build/client/storybook");

await Promise.all(
  ["index.html", "iframe.html"].map(async (name) => {
    const file = join(dir, name);
    await writeFile(file, prepareStorybookHtml(await readFile(file, "utf8"), name));
    console.log(`CSP Storybook: ${name}`);
  }),
);

const projectJson = join(dir, "project.json");
const hasProjectJson = await access(projectJson).then(
  () => true,
  () => false,
);
if (hasProjectJson) await rm(projectJson);
