import { createHash } from "node:crypto";

const executableTypes = new Set(["", "module", "text/javascript", "application/javascript"]);

/** @param {string} html */
export function inlineScriptHashes(html) {
  const hashes = new Set();
  for (const match of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    const attributes = match[1] ?? "";
    if (/\ssrc=/.test(attributes)) continue;
    const type = /\stype="([^"]*)"/.exec(attributes)?.[1] ?? "";
    if (!executableTypes.has(type)) continue;
    const digest = createHash("sha256")
      .update(match[2] ?? "", "utf8")
      .digest("base64");
    hashes.add(`'sha256-${digest}'`);
  }
  return [...hashes];
}

/** @param {string[]} hashes */
export function buildCsp(hashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(" ")}`.trim(),
    "style-src 'self'",
    "font-src 'self'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    "frame-src 'none'",
  ].join("; ");
}
