import { inlineScriptHashes } from "./csp.mjs";

export const robotsMeta = '<meta name="robots" content="noindex, nofollow" />';

/**
 * CSP dei documenti di Storybook in /storybook/. È separata da quella del sito
 * (scripts/lib/csp.mjs) e vale solo per quei documenti: Storybook inserisce
 * stili a runtime, quindi qui serve 'unsafe-inline' sugli stili, e il manager
 * mostra le story in un iframe dello stesso sito.
 * @param {string[]} hashes
 */
export function storybookCsp(hashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(" ")}`.trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
  ].join("; ");
}

const externalResource =
  /<(?:script|iframe|img|source)\b[^>]*\ssrc="(?:https?:)?\/\/|<link\b[^>]*\shref="(?:https?:)?\/\//i;

/**
 * Prepara un HTML di Storybook per la pubblicazione: verifica il meta robots
 * noindex e l'assenza di risorse esterne, poi inserisce la CSP come primo
 * elemento di <head>, prima di qualsiasi script.
 * @param {string} html
 * @param {string} name
 * @returns {string}
 */
export function prepareStorybookHtml(html, name) {
  if (!html.includes(robotsMeta)) throw new Error(`${name}: meta robots noindex mancante`);
  if (externalResource.test(html)) throw new Error(`${name}: risorsa esterna nell'HTML`);
  if (html.includes('http-equiv="Content-Security-Policy"')) {
    throw new Error(`${name}: CSP già presente`);
  }
  const head = /<head>/i.exec(html);
  if (!head) throw new Error(`${name}: <head> non trovato`);
  const csp = `<meta http-equiv="Content-Security-Policy" content="${storybookCsp(inlineScriptHashes(html))}" />`;
  const at = head.index + head[0].length;
  return `${html.slice(0, at)}${csp}${html.slice(at)}`;
}
