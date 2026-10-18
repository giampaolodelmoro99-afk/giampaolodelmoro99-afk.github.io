// Compressione come GitHub Pages: gzip per i tipi testuali, solo se il client
// lo accetta. Font, immagini e PDF sono già compressi e passano così come sono.

const compressible = new Set([
  "text/html",
  "text/css",
  "text/javascript",
  "application/json",
  "application/xml",
  "text/plain",
  "image/svg+xml",
]);

/**
 * @param {string} contentType
 * @param {string | undefined} acceptEncoding
 */
export function shouldGzip(contentType, acceptEncoding) {
  const type = contentType.split(";")[0]?.trim() ?? "";
  if (!compressible.has(type)) return false;
  return (acceptEncoding ?? "")
    .split(",")
    .map((token) => token.split(";")[0]?.trim().toLowerCase())
    .includes("gzip");
}
