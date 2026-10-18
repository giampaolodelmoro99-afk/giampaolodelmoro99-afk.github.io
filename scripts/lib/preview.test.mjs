import { describe, expect, it } from "vitest";
import { shouldGzip } from "./preview.mjs";

describe("shouldGzip", () => {
  it("comprime i tipi testuali se il client accetta gzip", () => {
    for (const type of [
      "text/html; charset=utf-8",
      "text/css; charset=utf-8",
      "text/javascript; charset=utf-8",
      "application/json; charset=utf-8",
      "image/svg+xml",
    ]) {
      expect(shouldGzip(type, "gzip, deflate, br")).toBe(true);
    }
  });

  it("non comprime font, immagini e PDF", () => {
    for (const type of ["font/woff2", "image/png", "image/webp", "application/pdf"]) {
      expect(shouldGzip(type, "gzip")).toBe(false);
    }
  });

  it("non comprime se il client non accetta gzip", () => {
    expect(shouldGzip("text/html; charset=utf-8", undefined)).toBe(false);
    expect(shouldGzip("text/html; charset=utf-8", "br, deflate")).toBe(false);
    expect(shouldGzip("text/html; charset=utf-8", "gzip;q=1.0, br")).toBe(true);
  });
});
