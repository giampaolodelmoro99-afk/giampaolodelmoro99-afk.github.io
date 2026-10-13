export const bootId = "rr-boot";

export const bootScript = `addEventListener("load",function(){setTimeout(function(){var b=document.getElementById("${bootId}"),s=document.createElement("script");s.type="module";s.textContent=b.textContent;document.body.appendChild(s)},0)},{once:true})`;

const modulePreload = /<link rel="modulepreload" href="[^"]+"\/>/g;
const bootstrap = /<script type="module" async="">([\s\S]*?)<\/script>/g;

/**
 * Rinvia il download e l'esecuzione del JavaScript di React Router a dopo
 * l'evento load: il contenuto prerenderizzato viene dipinto senza attendere
 * il bundle (vedi docs/adr/0006-spa-react-router-con-prerender.md).
 * @param {string} html
 * @returns {{ html: string, payload: string }}
 */
export function deferHydration(html) {
  const matches = [...html.matchAll(bootstrap)];
  if (matches.length !== 1) {
    throw new Error(`atteso un solo bootstrap di React Router, trovati ${matches.length}`);
  }
  const payload = matches[0]?.[1] ?? "";
  const deferred = html
    .replace(modulePreload, "")
    .replace(
      bootstrap,
      `<script type="text/plain" id="${bootId}">${payload}</script><script>${bootScript}</script>`,
    );
  return { html: deferred, payload };
}
