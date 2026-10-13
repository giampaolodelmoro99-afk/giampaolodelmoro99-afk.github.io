// File generato da scripts/icons.mjs a partire da src/components/Icon/glyphs.json: non modificarlo a mano.

export const glyphNames = [
  "check",
  "close",
  "dash",
  "down",
  "left",
  "maximize",
  "minimize",
  "restore",
  "right",
  "up",
] as const;

export type GlyphName = (typeof glyphNames)[number];

export const glyphs: Readonly<Record<GlyphName, { width: number; height: number; path: string }>> =
  {
    check: {
      width: 7,
      height: 7,
      path: "M6 0h1v1h-1zM5 1h2v1h-2zM0 2h1v1h-1zM4 2h3v1h-3zM0 3h2v1h-2zM3 3h3v1h-3zM0 4h5v1h-5zM1 5h3v1h-3zM2 6h1v1h-1z",
    },
    close: {
      width: 8,
      height: 7,
      path: "M0 0h2v1h-2zM6 0h2v1h-2zM1 1h2v1h-2zM5 1h2v1h-2zM2 2h4v1h-4zM3 3h2v1h-2zM2 4h4v1h-4zM1 5h2v1h-2zM5 5h2v1h-2zM0 6h2v1h-2zM6 6h2v1h-2z",
    },
    dash: { width: 7, height: 7, path: "M0 3h7v1h-7zM0 4h7v1h-7z" },
    down: { width: 5, height: 3, path: "M0 0h5v1h-5zM1 1h3v1h-3zM2 2h1v1h-1z" },
    left: {
      width: 3,
      height: 5,
      path: "M2 0h1v1h-1zM1 1h2v1h-2zM0 2h3v1h-3zM1 3h2v1h-2zM2 4h1v1h-1z",
    },
    maximize: {
      width: 9,
      height: 8,
      path: "M0 0h9v1h-9zM0 1h9v1h-9zM0 2h1v1h-1zM8 2h1v1h-1zM0 3h1v1h-1zM8 3h1v1h-1zM0 4h1v1h-1zM8 4h1v1h-1zM0 5h1v1h-1zM8 5h1v1h-1zM0 6h1v1h-1zM8 6h1v1h-1zM0 7h9v1h-9z",
    },
    minimize: { width: 8, height: 7, path: "M0 5h6v1h-6zM0 6h6v1h-6z" },
    restore: {
      width: 8,
      height: 8,
      path: "M2 0h6v1h-6zM2 1h6v1h-6zM2 2h1v1h-1zM7 2h1v1h-1zM0 3h6v1h-6zM7 3h1v1h-1zM0 4h6v1h-6zM7 4h1v1h-1zM0 5h1v1h-1zM5 5h3v1h-3zM0 6h1v1h-1zM5 6h1v1h-1zM0 7h6v1h-6z",
    },
    right: {
      width: 3,
      height: 5,
      path: "M0 0h1v1h-1zM0 1h2v1h-2zM0 2h3v1h-3zM0 3h2v1h-2zM0 4h1v1h-1z",
    },
    up: { width: 5, height: 3, path: "M2 0h1v1h-1zM1 1h3v1h-3zM0 2h5v1h-5z" },
  };

export const radioCircle = {
  size: 10,
  parts: {
    shadow:
      "M3 0h4v1h-4zM1 1h2v1h-2zM7 1h1v1h-1zM1 2h1v1h-1zM0 3h1v1h-1zM0 4h1v1h-1zM0 5h1v1h-1zM0 6h1v1h-1zM1 7h1v1h-1zM1 8h1v1h-1z",
    shadowDark:
      "M3 1h4v1h-4zM2 2h1v1h-1zM1 3h1v1h-1zM1 4h1v1h-1zM1 5h1v1h-1zM1 6h1v1h-1zM2 7h1v1h-1z",
    highlight:
      "M8 1h1v1h-1zM8 2h1v1h-1zM9 3h1v1h-1zM9 4h1v1h-1zM9 5h1v1h-1zM9 6h1v1h-1zM8 7h1v1h-1zM2 8h1v1h-1zM7 8h2v1h-2zM3 9h4v1h-4z",
    surfaceLight:
      "M7 2h1v1h-1zM8 3h1v1h-1zM8 4h1v1h-1zM8 5h1v1h-1zM8 6h1v1h-1zM7 7h1v1h-1zM3 8h4v1h-4z",
    field:
      "M3 2h4v1h-4zM2 3h2v1h-2zM6 3h2v1h-2zM2 4h1v1h-1zM7 4h1v1h-1zM2 5h1v1h-1zM7 5h1v1h-1zM2 6h2v1h-2zM6 6h2v1h-2zM3 7h4v1h-4z",
    dot: "M4 3h2v1h-2zM3 4h4v1h-4zM3 5h4v1h-4zM4 6h2v1h-2z",
  },
} as const;
