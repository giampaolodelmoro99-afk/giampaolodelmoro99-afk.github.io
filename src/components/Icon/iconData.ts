// File generato da scripts/icons.mjs a partire da src/assets/icons: non modificarlo a mano.

export const iconSizes = {
  about: [16, 32],
  contacts: [16, 32],
  controlpanel: [16, 32],
  cv: [16, 32],
  error: [32],
  gdm: [16, 32],
  info: [32],
  makingof: [16, 32],
  minefield: [16, 32],
  privacy: [16, 32],
  projects: [16, 32],
  run: [16, 32],
  simpleview: [16, 32],
  skills: [16, 32],
  terminal: [16, 32],
  timeline: [16, 32],
  trash: [16, 32],
  warning: [32],
} as const;

export type IconName = keyof typeof iconSizes;

export type IconSize<Name extends IconName> = (typeof iconSizes)[Name][number];

export type PixelRole =
  | "pixelOutline"
  | "pixelBlack"
  | "pixelWhite"
  | "pixelSilver"
  | "pixelGray"
  | "pixelNavy"
  | "pixelBlue"
  | "pixelTeal"
  | "pixelCyan"
  | "pixelYellow"
  | "pixelOlive"
  | "pixelRed"
  | "pixelMaroon"
  | "pixelGreen"
  | "pixelLime"
  | "pixelPurple"
  | "pixelOrange"
  | "pixelSkin";

export type IconData = { size: number; paths: ReadonlyArray<readonly [PixelRole, string]> };

export type IconTable = {
  readonly [Name in IconName]: Readonly<Record<IconSize<Name>, IconData>>;
};

export const icons: IconTable = {
  about: {
    16: {
      size: 16,
      paths: [
        [
          "pixelOutline",
          "M6 1h4v1h-4zM6 2h1v1h-1zM9 2h1v1h-1zM0 3h7v1h-7zM9 3h7v1h-7zM0 4h1v1h-1zM6 4h4v1h-4zM15 4h1v1h-1zM0 5h1v1h-1zM15 5h1v1h-1zM0 6h1v1h-1zM15 6h1v1h-1zM0 7h1v1h-1zM2 7h5v1h-5zM15 7h1v1h-1zM0 8h1v1h-1zM2 8h1v1h-1zM6 8h1v1h-1zM15 8h1v1h-1zM0 9h1v1h-1zM2 9h1v1h-1zM6 9h1v1h-1zM15 9h1v1h-1zM0 10h1v1h-1zM2 10h1v1h-1zM6 10h1v1h-1zM15 10h1v1h-1zM0 11h1v1h-1zM2 11h1v1h-1zM6 11h1v1h-1zM15 11h1v1h-1zM0 12h1v1h-1zM2 12h5v1h-5zM15 12h1v1h-1zM0 13h1v1h-1zM15 13h1v1h-1zM0 14h16v1h-16z",
        ],
        ["pixelSilver", "M7 2h2v1h-2zM7 3h2v1h-2z"],
        ["pixelNavy", "M1 4h1v1h-1zM10 4h5v1h-5zM1 5h14v1h-14zM8 8h6v1h-6z"],
        [
          "pixelWhite",
          "M2 4h4v1h-4zM1 6h14v1h-14zM1 7h1v1h-1zM7 7h8v1h-8zM1 8h1v1h-1zM7 8h1v1h-1zM14 8h1v1h-1zM1 9h1v1h-1zM7 9h8v1h-8zM1 10h1v1h-1zM7 10h1v1h-1zM13 10h2v1h-2zM1 11h1v1h-1zM7 11h8v1h-8zM1 12h1v1h-1zM7 12h1v1h-1zM14 12h1v1h-1zM1 13h14v1h-14z",
        ],
        ["pixelSkin", "M3 8h3v1h-3zM4 9h1v1h-1z"],
        ["pixelCyan", "M3 9h1v1h-1zM5 9h1v1h-1zM3 10h1v1h-1zM5 10h1v1h-1z"],
        ["pixelTeal", "M4 10h1v1h-1zM3 11h3v1h-3z"],
        ["pixelGray", "M8 10h5v1h-5zM8 12h6v1h-6z"],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M13 4h6v1h-6zM13 5h1v1h-1zM18 5h1v1h-1zM13 6h1v1h-1zM18 6h1v1h-1zM13 7h1v1h-1zM18 7h1v1h-1zM2 8h12v1h-12zM18 8h12v1h-12zM2 9h1v1h-1zM13 9h6v1h-6zM29 9h1v1h-1zM2 10h1v1h-1zM29 10h1v1h-1zM2 11h1v1h-1zM29 11h1v1h-1zM2 12h1v1h-1zM29 12h1v1h-1zM2 13h1v1h-1zM29 13h1v1h-1zM2 14h1v1h-1zM5 14h9v1h-9zM29 14h1v1h-1zM2 15h1v1h-1zM5 15h1v1h-1zM13 15h1v1h-1zM29 15h1v1h-1zM2 16h1v1h-1zM5 16h1v1h-1zM13 16h1v1h-1zM29 16h1v1h-1zM2 17h1v1h-1zM5 17h1v1h-1zM13 17h1v1h-1zM29 17h1v1h-1zM2 18h1v1h-1zM5 18h1v1h-1zM13 18h1v1h-1zM29 18h1v1h-1zM2 19h1v1h-1zM5 19h1v1h-1zM13 19h1v1h-1zM29 19h1v1h-1zM2 20h1v1h-1zM5 20h1v1h-1zM13 20h1v1h-1zM29 20h1v1h-1zM2 21h1v1h-1zM5 21h1v1h-1zM13 21h1v1h-1zM29 21h1v1h-1zM2 22h1v1h-1zM5 22h1v1h-1zM13 22h1v1h-1zM29 22h1v1h-1zM2 23h1v1h-1zM5 23h1v1h-1zM13 23h1v1h-1zM29 23h1v1h-1zM2 24h1v1h-1zM5 24h9v1h-9zM29 24h1v1h-1zM2 25h1v1h-1zM29 25h1v1h-1zM2 26h1v1h-1zM29 26h1v1h-1zM2 27h28v1h-28z",
        ],
        [
          "pixelSilver",
          "M14 5h4v1h-4zM14 6h1v1h-1zM17 6h1v1h-1zM14 7h1v1h-1zM17 7h1v1h-1zM14 8h4v1h-4zM28 13h1v1h-1zM28 14h1v1h-1zM28 15h1v1h-1zM28 16h1v1h-1zM28 17h1v1h-1zM28 18h1v1h-1zM28 19h1v1h-1zM28 20h1v1h-1zM28 21h1v1h-1zM28 22h1v1h-1zM28 23h1v1h-1zM28 24h1v1h-1zM28 25h1v1h-1zM3 26h26v1h-26z",
        ],
        ["pixelGray", "M15 6h2v1h-2zM15 7h2v1h-2zM16 19h9v1h-9zM16 21h11v1h-11zM16 23h7v1h-7z"],
        [
          "pixelNavy",
          "M3 9h10v1h-10zM19 9h10v1h-10zM3 10h2v1h-2zM13 10h16v1h-16zM3 11h2v1h-2zM10 11h19v1h-19zM3 12h26v1h-26zM16 15h11v1h-11zM16 16h11v1h-11z",
        ],
        [
          "pixelWhite",
          "M5 10h8v1h-8zM3 13h25v1h-25zM3 14h2v1h-2zM14 14h14v1h-14zM3 15h2v1h-2zM14 15h2v1h-2zM27 15h1v1h-1zM3 16h2v1h-2zM14 16h2v1h-2zM27 16h1v1h-1zM3 17h2v1h-2zM14 17h14v1h-14zM3 18h2v1h-2zM14 18h14v1h-14zM3 19h2v1h-2zM14 19h2v1h-2zM25 19h3v1h-3zM3 20h2v1h-2zM14 20h14v1h-14zM3 21h2v1h-2zM14 21h2v1h-2zM27 21h1v1h-1zM3 22h2v1h-2zM14 22h14v1h-14zM3 23h2v1h-2zM14 23h2v1h-2zM23 23h5v1h-5zM3 24h2v1h-2zM14 24h14v1h-14zM3 25h25v1h-25z",
        ],
        [
          "pixelCyan",
          "M5 11h5v1h-5zM6 15h3v1h-3zM10 15h3v1h-3zM6 16h2v1h-2zM11 16h2v1h-2zM6 17h1v1h-1zM12 17h1v1h-1zM6 18h1v1h-1zM12 18h1v1h-1zM6 19h2v1h-2zM11 19h2v1h-2zM6 20h7v1h-7zM6 21h1v1h-1zM12 21h1v1h-1zM6 22h1v1h-1zM12 22h1v1h-1z",
        ],
        ["pixelSkin", "M9 15h1v1h-1zM8 16h3v1h-3zM7 17h5v1h-5zM7 18h5v1h-5zM8 19h3v1h-3z"],
        ["pixelTeal", "M7 21h5v1h-5zM7 22h5v1h-5zM6 23h7v1h-7z"],
      ],
    },
  },
  contacts: {
    16: {
      size: 16,
      paths: [
        [
          "pixelOutline",
          "M0 3h16v1h-16zM0 4h1v1h-1zM15 4h1v1h-1zM0 5h1v1h-1zM15 5h1v1h-1zM0 6h1v1h-1zM15 6h1v1h-1zM0 7h1v1h-1zM15 7h1v1h-1zM0 8h1v1h-1zM15 8h1v1h-1zM0 9h1v1h-1zM15 9h1v1h-1zM0 10h1v1h-1zM15 10h1v1h-1zM0 11h1v1h-1zM15 11h1v1h-1zM0 12h1v1h-1zM15 12h1v1h-1zM0 13h16v1h-16z",
        ],
        [
          "pixelGray",
          "M1 4h1v1h-1zM14 4h1v1h-1zM2 5h1v1h-1zM13 5h1v1h-1zM3 6h2v1h-2zM11 6h2v1h-2zM5 7h1v1h-1zM10 7h1v1h-1z",
        ],
        [
          "pixelWhite",
          "M2 4h12v1h-12zM1 5h1v1h-1zM3 5h10v1h-10zM14 5h1v1h-1zM1 6h2v1h-2zM5 6h6v1h-6zM13 6h2v1h-2zM1 7h4v1h-4zM6 7h4v1h-4zM11 7h4v1h-4zM1 8h5v1h-5zM10 8h5v1h-5zM1 9h5v1h-5zM10 9h5v1h-5zM1 10h5v1h-5zM10 10h5v1h-5zM1 11h14v1h-14z",
        ],
        ["pixelMaroon", "M6 8h1v1h-1zM9 10h1v1h-1z"],
        ["pixelOrange", "M7 8h1v1h-1z"],
        ["pixelRed", "M8 8h2v1h-2zM6 9h4v1h-4zM6 10h3v1h-3z"],
        ["pixelSilver", "M1 12h14v1h-14z"],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M1 7h30v1h-30zM1 8h1v1h-1zM30 8h1v1h-1zM1 9h1v1h-1zM30 9h1v1h-1zM1 10h1v1h-1zM30 10h1v1h-1zM1 11h1v1h-1zM30 11h1v1h-1zM1 12h1v1h-1zM30 12h1v1h-1zM1 13h1v1h-1zM30 13h1v1h-1zM1 14h1v1h-1zM30 14h1v1h-1zM1 15h1v1h-1zM30 15h1v1h-1zM1 16h1v1h-1zM30 16h1v1h-1zM1 17h1v1h-1zM30 17h1v1h-1zM1 18h1v1h-1zM30 18h1v1h-1zM1 19h1v1h-1zM30 19h1v1h-1zM1 20h1v1h-1zM30 20h1v1h-1zM1 21h1v1h-1zM30 21h1v1h-1zM1 22h1v1h-1zM30 22h1v1h-1zM1 23h1v1h-1zM30 23h1v1h-1zM1 24h1v1h-1zM30 24h1v1h-1zM1 25h1v1h-1zM30 25h1v1h-1zM1 26h30v1h-30z",
        ],
        [
          "pixelGray",
          "M2 8h1v1h-1zM29 8h1v1h-1zM3 9h1v1h-1zM28 9h1v1h-1zM4 10h2v1h-2zM26 10h2v1h-2zM6 11h1v1h-1zM25 11h1v1h-1zM7 12h1v1h-1zM24 12h1v1h-1zM8 13h2v1h-2zM22 13h2v1h-2zM10 14h1v1h-1zM21 14h1v1h-1zM11 15h1v1h-1zM20 15h1v1h-1zM12 16h2v1h-2zM18 16h2v1h-2z",
        ],
        [
          "pixelWhite",
          "M3 8h26v1h-26zM2 9h1v1h-1zM4 9h24v1h-24zM2 10h2v1h-2zM6 10h20v1h-20zM28 10h1v1h-1zM2 11h4v1h-4zM7 11h18v1h-18zM26 11h3v1h-3zM2 12h5v1h-5zM8 12h16v1h-16zM25 12h4v1h-4zM2 13h6v1h-6zM10 13h12v1h-12zM24 13h5v1h-5zM2 14h8v1h-8zM11 14h10v1h-10zM22 14h7v1h-7zM2 15h9v1h-9zM12 15h7v1h-7zM21 15h8v1h-8zM2 16h10v1h-10zM20 16h9v1h-9zM2 17h11v1h-11zM19 17h10v1h-10zM2 18h9v1h-9zM12 18h1v1h-1zM19 18h1v1h-1zM21 18h8v1h-8zM2 19h8v1h-8zM11 19h2v1h-2zM19 19h2v1h-2zM22 19h7v1h-7zM2 20h6v1h-6zM10 20h2v1h-2zM19 20h3v1h-3zM24 20h5v1h-5zM2 21h5v1h-5zM8 21h6v1h-6zM18 21h6v1h-6zM25 21h4v1h-4zM2 22h4v1h-4zM7 22h10v1h-10zM18 22h7v1h-7zM26 22h3v1h-3zM2 23h2v1h-2zM6 23h20v1h-20zM28 23h1v1h-1zM2 24h1v1h-1zM4 24h24v1h-24z",
        ],
        [
          "pixelSilver",
          "M29 9h1v1h-1zM29 10h1v1h-1zM29 11h1v1h-1zM29 12h1v1h-1zM29 13h1v1h-1zM29 14h1v1h-1zM19 15h1v1h-1zM29 15h1v1h-1zM29 16h1v1h-1zM29 17h1v1h-1zM11 18h1v1h-1zM20 18h1v1h-1zM29 18h1v1h-1zM10 19h1v1h-1zM21 19h1v1h-1zM29 19h1v1h-1zM8 20h2v1h-2zM22 20h2v1h-2zM29 20h1v1h-1zM7 21h1v1h-1zM24 21h1v1h-1zM29 21h1v1h-1zM6 22h1v1h-1zM25 22h1v1h-1zM29 22h1v1h-1zM4 23h2v1h-2zM26 23h2v1h-2zM29 23h1v1h-1zM3 24h1v1h-1zM28 24h2v1h-2zM2 25h28v1h-28z",
        ],
        [
          "pixelMaroon",
          "M14 16h4v1h-4zM13 17h1v1h-1zM18 17h1v1h-1zM13 18h1v1h-1zM18 18h1v1h-1zM13 19h1v1h-1zM18 19h1v1h-1zM12 20h2v1h-2zM18 20h1v1h-1zM14 21h4v1h-4zM17 22h1v1h-1z",
        ],
        ["pixelOrange", "M14 17h2v1h-2z"],
        ["pixelRed", "M16 17h2v1h-2zM14 18h4v1h-4zM14 19h4v1h-4zM14 20h4v1h-4z"],
      ],
    },
  },
  controlpanel: {
    16: {
      size: 16,
      paths: [
        [
          "pixelOutline",
          "M0 1h16v1h-16zM0 2h1v1h-1zM15 2h1v1h-1zM0 3h1v1h-1zM7 3h3v1h-3zM15 3h1v1h-1zM0 4h1v1h-1zM7 4h1v1h-1zM9 4h1v1h-1zM15 4h1v1h-1zM0 5h1v1h-1zM7 5h3v1h-3zM15 5h1v1h-1zM0 6h1v1h-1zM3 6h3v1h-3zM15 6h1v1h-1zM0 7h1v1h-1zM3 7h1v1h-1zM5 7h1v1h-1zM15 7h1v1h-1zM0 8h1v1h-1zM3 8h3v1h-3zM11 8h3v1h-3zM15 8h1v1h-1zM0 9h1v1h-1zM11 9h1v1h-1zM13 9h1v1h-1zM15 9h1v1h-1zM0 10h1v1h-1zM11 10h3v1h-3zM15 10h1v1h-1zM0 11h1v1h-1zM15 11h1v1h-1zM0 12h1v1h-1zM15 12h1v1h-1zM0 13h1v1h-1zM15 13h1v1h-1zM0 14h16v1h-16z",
        ],
        [
          "pixelWhite",
          "M1 2h13v1h-13zM1 3h1v1h-1zM1 4h1v1h-1zM1 5h1v1h-1zM1 6h1v1h-1zM1 7h1v1h-1zM1 8h1v1h-1zM1 9h1v1h-1zM1 10h1v1h-1zM1 11h1v1h-1zM1 12h1v1h-1z",
        ],
        [
          "pixelGray",
          "M14 2h1v1h-1zM14 3h1v1h-1zM14 4h1v1h-1zM14 5h1v1h-1zM14 6h1v1h-1zM14 7h1v1h-1zM14 8h1v1h-1zM14 9h1v1h-1zM14 10h1v1h-1zM14 11h1v1h-1zM14 12h1v1h-1zM1 13h14v1h-14z",
        ],
        [
          "pixelSilver",
          "M2 3h5v1h-5zM10 3h3v1h-3zM2 4h2v1h-2zM5 4h2v1h-2zM10 4h2v1h-2zM13 4h1v1h-1zM2 5h2v1h-2zM5 5h2v1h-2zM10 5h2v1h-2zM13 5h1v1h-1zM2 6h1v1h-1zM6 6h2v1h-2zM9 6h3v1h-3zM13 6h1v1h-1zM2 7h1v1h-1zM6 7h2v1h-2zM9 7h3v1h-3zM13 7h1v1h-1zM2 8h1v1h-1zM6 8h2v1h-2zM9 8h2v1h-2zM2 9h2v1h-2zM5 9h3v1h-3zM9 9h2v1h-2zM2 10h2v1h-2zM5 10h3v1h-3zM9 10h2v1h-2zM2 11h2v1h-2zM5 11h3v1h-3zM9 11h3v1h-3zM13 11h1v1h-1zM2 12h12v1h-12z",
        ],
        ["pixelLime", "M13 3h1v1h-1z"],
        [
          "pixelBlack",
          "M4 4h1v1h-1zM12 4h1v1h-1zM4 5h1v1h-1zM12 5h1v1h-1zM8 6h1v1h-1zM12 6h1v1h-1zM8 7h1v1h-1zM12 7h1v1h-1zM8 8h1v1h-1zM4 9h1v1h-1zM8 9h1v1h-1zM4 10h1v1h-1zM8 10h1v1h-1zM4 11h1v1h-1zM8 11h1v1h-1zM12 11h1v1h-1z",
        ],
        ["pixelYellow", "M8 4h1v1h-1z"],
        ["pixelRed", "M4 7h1v1h-1z"],
        ["pixelTeal", "M12 9h1v1h-1z"],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M2 3h28v1h-28zM2 4h1v1h-1zM29 4h1v1h-1zM2 5h1v1h-1zM29 5h1v1h-1zM2 6h1v1h-1zM29 6h1v1h-1zM2 7h1v1h-1zM29 7h1v1h-1zM2 8h1v1h-1zM13 8h7v1h-7zM29 8h1v1h-1zM2 9h1v1h-1zM13 9h1v1h-1zM19 9h1v1h-1zM29 9h1v1h-1zM2 10h1v1h-1zM13 10h1v1h-1zM19 10h1v1h-1zM29 10h1v1h-1zM2 11h1v1h-1zM13 11h1v1h-1zM19 11h1v1h-1zM29 11h1v1h-1zM2 12h1v1h-1zM13 12h7v1h-7zM29 12h1v1h-1zM2 13h1v1h-1zM29 13h1v1h-1zM2 14h1v1h-1zM6 14h7v1h-7zM29 14h1v1h-1zM2 15h1v1h-1zM6 15h1v1h-1zM12 15h1v1h-1zM29 15h1v1h-1zM2 16h1v1h-1zM6 16h1v1h-1zM12 16h1v1h-1zM29 16h1v1h-1zM2 17h1v1h-1zM6 17h1v1h-1zM12 17h1v1h-1zM29 17h1v1h-1zM2 18h1v1h-1zM6 18h7v1h-7zM20 18h7v1h-7zM29 18h1v1h-1zM2 19h1v1h-1zM20 19h1v1h-1zM26 19h1v1h-1zM29 19h1v1h-1zM2 20h1v1h-1zM20 20h1v1h-1zM26 20h1v1h-1zM29 20h1v1h-1zM2 21h1v1h-1zM20 21h1v1h-1zM26 21h1v1h-1zM29 21h1v1h-1zM2 22h1v1h-1zM20 22h7v1h-7zM29 22h1v1h-1zM2 23h1v1h-1zM29 23h1v1h-1zM2 24h1v1h-1zM29 24h1v1h-1zM2 25h1v1h-1zM29 25h1v1h-1zM2 26h1v1h-1zM29 26h1v1h-1zM2 27h1v1h-1zM29 27h1v1h-1zM2 28h28v1h-28z",
        ],
        [
          "pixelWhite",
          "M3 4h25v1h-25zM3 5h1v1h-1zM3 6h1v1h-1zM3 7h1v1h-1zM3 8h1v1h-1zM10 8h1v1h-1zM24 8h1v1h-1zM3 9h1v1h-1zM10 9h1v1h-1zM14 9h5v1h-5zM24 9h1v1h-1zM3 10h1v1h-1zM10 10h1v1h-1zM24 10h1v1h-1zM3 11h1v1h-1zM10 11h1v1h-1zM24 11h1v1h-1zM3 12h1v1h-1zM10 12h1v1h-1zM24 12h1v1h-1zM3 13h1v1h-1zM10 13h1v1h-1zM17 13h1v1h-1zM24 13h1v1h-1zM3 14h1v1h-1zM17 14h1v1h-1zM24 14h1v1h-1zM3 15h1v1h-1zM7 15h5v1h-5zM17 15h1v1h-1zM24 15h1v1h-1zM3 16h1v1h-1zM17 16h1v1h-1zM24 16h1v1h-1zM3 17h1v1h-1zM17 17h1v1h-1zM24 17h1v1h-1zM3 18h1v1h-1zM17 18h1v1h-1zM3 19h1v1h-1zM10 19h1v1h-1zM17 19h1v1h-1zM21 19h5v1h-5zM3 20h1v1h-1zM10 20h1v1h-1zM17 20h1v1h-1zM3 21h1v1h-1zM10 21h1v1h-1zM17 21h1v1h-1zM3 22h1v1h-1zM10 22h1v1h-1zM17 22h1v1h-1zM3 23h1v1h-1zM10 23h1v1h-1zM17 23h1v1h-1zM24 23h1v1h-1zM3 24h1v1h-1zM10 24h1v1h-1zM17 24h1v1h-1zM24 24h1v1h-1zM3 25h1v1h-1zM3 26h1v1h-1z",
        ],
        [
          "pixelGray",
          "M28 4h1v1h-1zM28 5h1v1h-1zM28 6h1v1h-1zM28 7h1v1h-1zM8 8h1v1h-1zM22 8h1v1h-1zM28 8h1v1h-1zM8 9h1v1h-1zM22 9h1v1h-1zM28 9h1v1h-1zM8 10h1v1h-1zM22 10h1v1h-1zM28 10h1v1h-1zM8 11h1v1h-1zM22 11h1v1h-1zM28 11h1v1h-1zM8 12h1v1h-1zM22 12h1v1h-1zM28 12h1v1h-1zM8 13h1v1h-1zM15 13h1v1h-1zM22 13h1v1h-1zM28 13h1v1h-1zM15 14h1v1h-1zM22 14h1v1h-1zM28 14h1v1h-1zM15 15h1v1h-1zM22 15h1v1h-1zM28 15h1v1h-1zM15 16h1v1h-1zM22 16h1v1h-1zM28 16h1v1h-1zM15 17h1v1h-1zM22 17h1v1h-1zM28 17h1v1h-1zM15 18h1v1h-1zM28 18h1v1h-1zM8 19h1v1h-1zM15 19h1v1h-1zM28 19h1v1h-1zM8 20h1v1h-1zM15 20h1v1h-1zM28 20h1v1h-1zM8 21h1v1h-1zM15 21h1v1h-1zM28 21h1v1h-1zM8 22h1v1h-1zM15 22h1v1h-1zM28 22h1v1h-1zM8 23h1v1h-1zM15 23h1v1h-1zM22 23h1v1h-1zM28 23h1v1h-1zM8 24h1v1h-1zM15 24h1v1h-1zM22 24h1v1h-1zM28 24h1v1h-1zM6 25h1v1h-1zM8 25h1v1h-1zM10 25h1v1h-1zM12 25h1v1h-1zM14 25h1v1h-1zM16 25h1v1h-1zM18 25h1v1h-1zM20 25h1v1h-1zM22 25h1v1h-1zM28 25h1v1h-1zM28 26h1v1h-1zM3 27h26v1h-26z",
        ],
        [
          "pixelSilver",
          "M4 5h24v1h-24zM4 6h20v1h-20zM27 6h1v1h-1zM4 7h24v1h-24zM4 8h4v1h-4zM11 8h2v1h-2zM20 8h2v1h-2zM25 8h3v1h-3zM4 9h4v1h-4zM11 9h2v1h-2zM20 9h2v1h-2zM25 9h3v1h-3zM4 10h4v1h-4zM11 10h2v1h-2zM20 10h2v1h-2zM25 10h3v1h-3zM4 11h4v1h-4zM11 11h2v1h-2zM20 11h2v1h-2zM25 11h3v1h-3zM4 12h4v1h-4zM11 12h2v1h-2zM20 12h2v1h-2zM25 12h3v1h-3zM4 13h4v1h-4zM11 13h4v1h-4zM18 13h4v1h-4zM25 13h3v1h-3zM4 14h2v1h-2zM13 14h2v1h-2zM18 14h4v1h-4zM25 14h3v1h-3zM4 15h2v1h-2zM13 15h2v1h-2zM18 15h4v1h-4zM25 15h3v1h-3zM4 16h2v1h-2zM13 16h2v1h-2zM18 16h4v1h-4zM25 16h3v1h-3zM4 17h2v1h-2zM13 17h2v1h-2zM18 17h4v1h-4zM25 17h3v1h-3zM4 18h2v1h-2zM13 18h2v1h-2zM18 18h2v1h-2zM27 18h1v1h-1zM4 19h4v1h-4zM11 19h4v1h-4zM18 19h2v1h-2zM27 19h1v1h-1zM4 20h4v1h-4zM11 20h4v1h-4zM18 20h2v1h-2zM27 20h1v1h-1zM4 21h4v1h-4zM11 21h4v1h-4zM18 21h2v1h-2zM27 21h1v1h-1zM4 22h4v1h-4zM11 22h4v1h-4zM18 22h2v1h-2zM27 22h1v1h-1zM4 23h4v1h-4zM11 23h4v1h-4zM18 23h4v1h-4zM25 23h3v1h-3zM4 24h4v1h-4zM11 24h4v1h-4zM18 24h4v1h-4zM25 24h3v1h-3zM4 25h2v1h-2zM7 25h1v1h-1zM9 25h1v1h-1zM11 25h1v1h-1zM13 25h1v1h-1zM15 25h1v1h-1zM17 25h1v1h-1zM19 25h1v1h-1zM21 25h1v1h-1zM23 25h5v1h-5zM4 26h24v1h-24z",
        ],
        ["pixelGreen", "M24 6h1v1h-1z"],
        ["pixelLime", "M25 6h2v1h-2z"],
        [
          "pixelBlack",
          "M9 8h1v1h-1zM23 8h1v1h-1zM9 9h1v1h-1zM23 9h1v1h-1zM9 10h1v1h-1zM23 10h1v1h-1zM9 11h1v1h-1zM23 11h1v1h-1zM9 12h1v1h-1zM23 12h1v1h-1zM9 13h1v1h-1zM16 13h1v1h-1zM23 13h1v1h-1zM16 14h1v1h-1zM23 14h1v1h-1zM16 15h1v1h-1zM23 15h1v1h-1zM16 16h1v1h-1zM23 16h1v1h-1zM7 17h5v1h-5zM16 17h1v1h-1zM23 17h1v1h-1zM16 18h1v1h-1zM9 19h1v1h-1zM16 19h1v1h-1zM9 20h1v1h-1zM16 20h1v1h-1zM9 21h1v1h-1zM16 21h1v1h-1zM21 21h5v1h-5zM9 22h1v1h-1zM16 22h1v1h-1zM9 23h1v1h-1zM16 23h1v1h-1zM23 23h1v1h-1zM9 24h1v1h-1zM16 24h1v1h-1zM23 24h1v1h-1z",
        ],
        ["pixelYellow", "M14 10h5v1h-5z"],
        ["pixelOlive", "M14 11h5v1h-5z"],
        ["pixelRed", "M7 16h5v1h-5z"],
        ["pixelTeal", "M21 20h5v1h-5z"],
      ],
    },
  },
  cv: {
    16: {
      size: 16,
      paths: [
        [
          "pixelOutline",
          "M2 0h8v1h-8zM2 1h1v1h-1zM10 1h1v1h-1zM2 2h1v1h-1zM4 2h5v1h-5zM10 2h2v1h-2zM2 3h1v1h-1zM4 3h1v1h-1zM8 3h1v1h-1zM10 3h1v1h-1zM12 3h1v1h-1zM2 4h1v1h-1zM4 4h1v1h-1zM8 4h1v1h-1zM10 4h4v1h-4zM2 5h1v1h-1zM4 5h1v1h-1zM8 5h1v1h-1zM13 5h1v1h-1zM2 6h1v1h-1zM4 6h5v1h-5zM13 6h1v1h-1zM2 7h1v1h-1zM13 7h1v1h-1zM2 8h1v1h-1zM13 8h1v1h-1zM2 9h1v1h-1zM13 9h1v1h-1zM2 10h1v1h-1zM13 10h1v1h-1zM2 11h1v1h-1zM13 11h1v1h-1zM2 12h1v1h-1zM13 12h1v1h-1zM2 13h1v1h-1zM13 13h1v1h-1zM2 14h1v1h-1zM13 14h1v1h-1zM2 15h12v1h-12z",
        ],
        [
          "pixelWhite",
          "M3 1h7v1h-7zM3 2h1v1h-1zM9 2h1v1h-1zM3 3h1v1h-1zM9 3h1v1h-1zM3 4h1v1h-1zM9 4h1v1h-1zM3 5h1v1h-1zM9 5h4v1h-4zM3 6h1v1h-1zM9 6h4v1h-4zM3 7h10v1h-10zM3 8h1v1h-1zM7 8h6v1h-6zM3 9h10v1h-10zM3 10h1v1h-1zM12 10h1v1h-1zM3 11h10v1h-10zM3 12h1v1h-1zM7 12h6v1h-6zM3 13h10v1h-10zM3 14h1v1h-1zM12 14h1v1h-1z",
        ],
        ["pixelCyan", "M5 3h1v1h-1zM7 3h1v1h-1zM5 4h3v1h-3z"],
        ["pixelSkin", "M6 3h1v1h-1z"],
        ["pixelSilver", "M11 3h1v1h-1z"],
        ["pixelTeal", "M5 5h3v1h-3z"],
        ["pixelRed", "M4 8h3v1h-3zM4 12h3v1h-3z"],
        ["pixelGray", "M4 10h8v1h-8zM4 14h8v1h-8z"],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M5 1h16v1h-16zM5 2h1v1h-1zM20 2h2v1h-2zM5 3h1v1h-1zM20 3h3v1h-3zM5 4h1v1h-1zM20 4h1v1h-1zM22 4h2v1h-2zM5 5h1v1h-1zM8 5h8v1h-8zM20 5h1v1h-1zM23 5h2v1h-2zM5 6h1v1h-1zM8 6h1v1h-1zM15 6h1v1h-1zM20 6h1v1h-1zM24 6h2v1h-2zM5 7h1v1h-1zM8 7h1v1h-1zM15 7h1v1h-1zM20 7h1v1h-1zM25 7h2v1h-2zM5 8h1v1h-1zM8 8h1v1h-1zM15 8h1v1h-1zM20 8h7v1h-7zM5 9h1v1h-1zM8 9h1v1h-1zM15 9h1v1h-1zM26 9h1v1h-1zM5 10h1v1h-1zM8 10h1v1h-1zM15 10h1v1h-1zM26 10h1v1h-1zM5 11h1v1h-1zM8 11h1v1h-1zM15 11h1v1h-1zM26 11h1v1h-1zM5 12h1v1h-1zM8 12h1v1h-1zM15 12h1v1h-1zM26 12h1v1h-1zM5 13h1v1h-1zM8 13h8v1h-8zM26 13h1v1h-1zM5 14h1v1h-1zM26 14h1v1h-1zM5 15h1v1h-1zM26 15h1v1h-1zM5 16h1v1h-1zM26 16h1v1h-1zM5 17h1v1h-1zM26 17h1v1h-1zM5 18h1v1h-1zM26 18h1v1h-1zM5 19h1v1h-1zM26 19h1v1h-1zM5 20h1v1h-1zM26 20h1v1h-1zM5 21h1v1h-1zM26 21h1v1h-1zM5 22h1v1h-1zM26 22h1v1h-1zM5 23h1v1h-1zM26 23h1v1h-1zM5 24h1v1h-1zM26 24h1v1h-1zM5 25h1v1h-1zM26 25h1v1h-1zM5 26h1v1h-1zM26 26h1v1h-1zM5 27h1v1h-1zM26 27h1v1h-1zM5 28h1v1h-1zM26 28h1v1h-1zM5 29h1v1h-1zM26 29h1v1h-1zM5 30h22v1h-22z",
        ],
        [
          "pixelWhite",
          "M6 2h14v1h-14zM6 3h14v1h-14zM6 4h14v1h-14zM6 5h2v1h-2zM16 5h4v1h-4zM6 6h2v1h-2zM16 6h4v1h-4zM6 7h2v1h-2zM16 7h4v1h-4zM6 8h2v1h-2zM16 8h4v1h-4zM6 9h2v1h-2zM16 9h10v1h-10zM6 10h2v1h-2zM16 10h1v1h-1zM25 10h1v1h-1zM6 11h2v1h-2zM16 11h1v1h-1zM25 11h1v1h-1zM6 12h2v1h-2zM16 12h10v1h-10zM6 13h2v1h-2zM16 13h1v1h-1zM23 13h3v1h-3zM6 14h20v1h-20zM6 15h20v1h-20zM6 16h2v1h-2zM12 16h14v1h-14zM6 17h2v1h-2zM12 17h14v1h-14zM6 18h20v1h-20zM6 19h2v1h-2zM25 19h1v1h-1zM6 20h20v1h-20zM6 21h2v1h-2zM22 21h4v1h-4zM6 22h20v1h-20zM6 23h20v1h-20zM6 24h2v1h-2zM12 24h14v1h-14zM6 25h2v1h-2zM12 25h14v1h-14zM6 26h20v1h-20zM6 27h2v1h-2zM25 27h1v1h-1zM6 28h20v1h-20zM6 29h2v1h-2zM20 29h6v1h-6z",
        ],
        ["pixelSilver", "M21 4h1v1h-1zM21 5h2v1h-2zM21 6h3v1h-3zM21 7h4v1h-4z"],
        [
          "pixelCyan",
          "M9 6h6v1h-6zM9 7h2v1h-2zM13 7h2v1h-2zM9 8h1v1h-1zM14 8h1v1h-1zM9 9h2v1h-2zM13 9h2v1h-2zM9 10h1v1h-1zM14 10h1v1h-1zM9 11h1v1h-1zM14 11h1v1h-1z",
        ],
        ["pixelSkin", "M11 7h2v1h-2zM10 8h4v1h-4zM11 9h2v1h-2z"],
        ["pixelTeal", "M10 10h4v1h-4zM10 11h4v1h-4zM9 12h6v1h-6z"],
        ["pixelNavy", "M17 10h8v1h-8zM17 11h8v1h-8z"],
        ["pixelGray", "M17 13h6v1h-6zM8 19h17v1h-17zM8 21h14v1h-14zM8 27h17v1h-17zM8 29h12v1h-12z"],
        ["pixelRed", "M8 16h4v1h-4zM8 17h4v1h-4zM8 24h4v1h-4zM8 25h4v1h-4z"],
      ],
    },
  },
  error: {
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M9 1h13v1h-13zM8 2h1v1h-1zM22 2h1v1h-1zM7 3h1v1h-1zM23 3h1v1h-1zM6 4h1v1h-1zM24 4h1v1h-1zM5 5h1v1h-1zM25 5h1v1h-1zM4 6h1v1h-1zM26 6h1v1h-1zM3 7h1v1h-1zM27 7h1v1h-1zM2 8h1v1h-1zM28 8h1v1h-1zM1 9h1v1h-1zM29 9h1v1h-1zM1 10h1v1h-1zM30 10h1v1h-1zM1 11h1v1h-1zM30 11h1v1h-1zM1 12h1v1h-1zM30 12h1v1h-1zM1 13h1v1h-1zM30 13h1v1h-1zM1 14h1v1h-1zM30 14h1v1h-1zM1 15h1v1h-1zM30 15h1v1h-1zM1 16h1v1h-1zM30 16h1v1h-1zM1 17h1v1h-1zM30 17h1v1h-1zM1 18h1v1h-1zM30 18h1v1h-1zM1 19h1v1h-1zM30 19h1v1h-1zM1 20h1v1h-1zM30 20h1v1h-1zM1 21h1v1h-1zM30 21h1v1h-1zM1 22h1v1h-1zM29 22h1v1h-1zM2 23h1v1h-1zM28 23h1v1h-1zM3 24h1v1h-1zM27 24h1v1h-1zM4 25h1v1h-1zM26 25h1v1h-1zM5 26h1v1h-1zM25 26h1v1h-1zM6 27h1v1h-1zM24 27h1v1h-1zM7 28h1v1h-1zM23 28h1v1h-1zM8 29h1v1h-1zM22 29h1v1h-1zM9 30h13v1h-13z",
        ],
        [
          "pixelRed",
          "M9 2h13v1h-13zM8 3h15v1h-15zM7 4h17v1h-17zM6 5h17v1h-17zM24 5h1v1h-1zM5 6h18v1h-18zM25 6h1v1h-1zM4 7h20v1h-20zM26 7h1v1h-1zM3 8h21v1h-21zM27 8h1v1h-1zM2 9h7v1h-7zM11 9h10v1h-10zM23 9h2v1h-2zM28 9h1v1h-1zM2 10h8v1h-8zM12 10h8v1h-8zM22 10h3v1h-3zM29 10h1v1h-1zM2 11h9v1h-9zM13 11h6v1h-6zM21 11h4v1h-4zM29 11h1v1h-1zM2 12h10v1h-10zM14 12h4v1h-4zM20 12h5v1h-5zM29 12h1v1h-1zM2 13h11v1h-11zM15 13h2v1h-2zM19 13h6v1h-6zM29 13h1v1h-1zM2 14h12v1h-12zM18 14h6v1h-6zM29 14h1v1h-1zM2 15h13v1h-13zM17 15h7v1h-7zM29 15h1v1h-1zM2 16h12v1h-12zM18 16h6v1h-6zM29 16h1v1h-1zM2 17h11v1h-11zM15 17h2v1h-2zM19 17h5v1h-5zM29 17h1v1h-1zM2 18h10v1h-10zM14 18h4v1h-4zM20 18h3v1h-3zM29 18h1v1h-1zM2 19h9v1h-9zM13 19h6v1h-6zM21 19h1v1h-1zM29 19h1v1h-1zM2 20h8v1h-8zM12 20h8v1h-8zM29 20h1v1h-1zM2 21h7v1h-7zM11 21h9v1h-9zM29 21h1v1h-1zM2 22h17v1h-17zM28 22h1v1h-1zM3 23h15v1h-15zM27 23h1v1h-1zM4 24h13v1h-13zM26 24h1v1h-1zM5 25h11v1h-11zM25 25h1v1h-1zM6 26h8v1h-8zM24 26h1v1h-1zM7 27h6v1h-6zM23 27h1v1h-1zM8 28h3v1h-3zM22 28h1v1h-1zM9 29h13v1h-13z",
        ],
        [
          "pixelMaroon",
          "M23 5h1v1h-1zM23 6h2v1h-2zM24 7h2v1h-2zM24 8h3v1h-3zM25 9h3v1h-3zM25 10h4v1h-4zM25 11h4v1h-4zM25 12h4v1h-4zM25 13h4v1h-4zM24 14h5v1h-5zM24 15h5v1h-5zM24 16h5v1h-5zM24 17h5v1h-5zM23 18h6v1h-6zM22 19h7v1h-7zM22 20h7v1h-7zM20 21h1v1h-1zM23 21h6v1h-6zM19 22h9v1h-9zM18 23h9v1h-9zM17 24h9v1h-9zM16 25h9v1h-9zM14 26h10v1h-10zM13 27h10v1h-10zM11 28h11v1h-11z",
        ],
        [
          "pixelWhite",
          "M9 9h2v1h-2zM21 9h2v1h-2zM10 10h2v1h-2zM20 10h2v1h-2zM11 11h2v1h-2zM19 11h2v1h-2zM12 12h2v1h-2zM18 12h2v1h-2zM13 13h2v1h-2zM17 13h2v1h-2zM14 14h4v1h-4zM15 15h2v1h-2zM14 16h4v1h-4zM13 17h2v1h-2zM17 17h2v1h-2zM12 18h2v1h-2zM18 18h2v1h-2zM11 19h2v1h-2zM19 19h2v1h-2zM10 20h2v1h-2zM20 20h2v1h-2zM9 21h2v1h-2zM21 21h2v1h-2z",
        ],
      ],
    },
  },
  gdm: {
    16: {
      size: 16,
      paths: [
        [
          "pixelNavy",
          "M0 2h16v1h-16zM0 3h1v1h-1zM15 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h3v1h-3zM10 4h1v1h-1zM14 4h2v1h-2zM0 5h2v1h-2zM6 5h1v1h-1zM9 5h3v1h-3zM13 5h3v1h-3zM0 6h2v1h-2zM3 6h2v1h-2zM6 6h1v1h-1zM9 6h2v1h-2zM12 6h1v1h-1zM14 6h2v1h-2zM0 7h2v1h-2zM4 7h1v1h-1zM6 7h1v1h-1zM9 7h2v1h-2zM14 7h2v1h-2zM0 8h2v1h-2zM4 8h1v1h-1zM6 8h1v1h-1zM9 8h2v1h-2zM14 8h2v1h-2zM0 9h1v1h-1zM2 9h3v1h-3zM6 9h3v1h-3zM10 9h1v1h-1zM14 9h2v1h-2zM0 10h1v1h-1zM15 10h1v1h-1zM0 11h1v1h-1zM15 11h1v1h-1zM0 12h1v1h-1zM15 12h1v1h-1zM0 13h16v1h-16z",
        ],
        [
          "pixelSilver",
          "M1 3h14v1h-14zM1 4h1v1h-1zM5 4h1v1h-1zM9 4h1v1h-1zM11 4h3v1h-3zM2 5h4v1h-4zM7 5h2v1h-2zM12 5h1v1h-1zM2 6h1v1h-1zM5 6h1v1h-1zM7 6h2v1h-2zM11 6h1v1h-1zM13 6h1v1h-1zM2 7h2v1h-2zM5 7h1v1h-1zM7 7h2v1h-2zM11 7h3v1h-3zM2 8h2v1h-2zM5 8h1v1h-1zM7 8h2v1h-2zM11 8h3v1h-3zM1 9h1v1h-1zM5 9h1v1h-1zM9 9h1v1h-1zM11 9h3v1h-3zM1 10h14v1h-14zM1 12h14v1h-14z",
        ],
        ["pixelYellow", "M1 11h14v1h-14z"],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelNavy",
          "M0 4h32v1h-32zM0 5h1v1h-1zM31 5h1v1h-1zM0 6h1v1h-1zM31 6h1v1h-1zM0 7h1v1h-1zM31 7h1v1h-1zM0 8h1v1h-1zM31 8h1v1h-1zM0 9h1v1h-1zM31 9h1v1h-1zM0 10h1v1h-1zM4 10h6v1h-6zM12 10h6v1h-6zM21 10h2v1h-2zM28 10h2v1h-2zM31 10h1v1h-1zM0 11h1v1h-1zM3 11h8v1h-8zM12 11h7v1h-7zM21 11h3v1h-3zM27 11h3v1h-3zM31 11h1v1h-1zM0 12h1v1h-1zM3 12h2v1h-2zM9 12h2v1h-2zM12 12h2v1h-2zM17 12h3v1h-3zM21 12h4v1h-4zM26 12h4v1h-4zM31 12h1v1h-1zM0 13h1v1h-1zM3 13h2v1h-2zM12 13h2v1h-2zM18 13h2v1h-2zM21 13h2v1h-2zM24 13h3v1h-3zM28 13h2v1h-2zM31 13h1v1h-1zM0 14h1v1h-1zM3 14h2v1h-2zM12 14h2v1h-2zM18 14h2v1h-2zM21 14h2v1h-2zM25 14h1v1h-1zM28 14h2v1h-2zM31 14h1v1h-1zM0 15h1v1h-1zM3 15h2v1h-2zM7 15h4v1h-4zM12 15h2v1h-2zM18 15h2v1h-2zM21 15h2v1h-2zM28 15h2v1h-2zM31 15h1v1h-1zM0 16h1v1h-1zM3 16h2v1h-2zM7 16h4v1h-4zM12 16h2v1h-2zM18 16h2v1h-2zM21 16h2v1h-2zM28 16h2v1h-2zM31 16h1v1h-1zM0 17h1v1h-1zM3 17h2v1h-2zM9 17h2v1h-2zM12 17h2v1h-2zM18 17h2v1h-2zM21 17h2v1h-2zM28 17h2v1h-2zM31 17h1v1h-1zM0 18h1v1h-1zM3 18h2v1h-2zM9 18h2v1h-2zM12 18h2v1h-2zM18 18h2v1h-2zM21 18h2v1h-2zM28 18h2v1h-2zM31 18h1v1h-1zM0 19h1v1h-1zM3 19h2v1h-2zM9 19h2v1h-2zM12 19h2v1h-2zM17 19h3v1h-3zM21 19h2v1h-2zM28 19h2v1h-2zM31 19h1v1h-1zM0 20h1v1h-1zM3 20h8v1h-8zM12 20h7v1h-7zM21 20h2v1h-2zM28 20h2v1h-2zM31 20h1v1h-1zM0 21h1v1h-1zM4 21h6v1h-6zM12 21h6v1h-6zM21 21h2v1h-2zM28 21h2v1h-2zM31 21h1v1h-1zM0 22h1v1h-1zM31 22h1v1h-1zM0 23h1v1h-1zM31 23h1v1h-1zM0 24h1v1h-1zM31 24h1v1h-1zM0 25h1v1h-1zM31 25h1v1h-1zM0 26h1v1h-1zM31 26h1v1h-1zM0 27h32v1h-32z",
        ],
        [
          "pixelWhite",
          "M1 5h29v1h-29zM1 6h1v1h-1zM1 7h1v1h-1zM1 8h1v1h-1zM1 9h1v1h-1zM1 10h1v1h-1zM1 11h1v1h-1zM1 12h1v1h-1zM1 13h1v1h-1zM1 14h1v1h-1zM1 15h1v1h-1zM1 16h1v1h-1zM1 17h1v1h-1zM1 18h1v1h-1zM1 19h1v1h-1zM1 20h1v1h-1zM1 21h1v1h-1zM1 22h1v1h-1zM1 23h1v1h-1zM1 24h1v1h-1zM1 25h1v1h-1z",
        ],
        [
          "pixelGray",
          "M30 5h1v1h-1zM30 6h1v1h-1zM30 7h1v1h-1zM30 8h1v1h-1zM30 9h1v1h-1zM30 10h1v1h-1zM30 23h1v1h-1zM30 24h1v1h-1zM30 25h1v1h-1zM1 26h30v1h-30z",
        ],
        [
          "pixelSilver",
          "M2 6h28v1h-28zM2 7h28v1h-28zM2 8h28v1h-28zM2 9h28v1h-28zM2 10h2v1h-2zM10 10h2v1h-2zM18 10h3v1h-3zM23 10h5v1h-5zM2 11h1v1h-1zM11 11h1v1h-1zM19 11h2v1h-2zM24 11h3v1h-3zM2 12h1v1h-1zM20 12h1v1h-1zM25 12h1v1h-1zM2 13h1v1h-1zM6 13h4v1h-4zM15 13h3v1h-3zM2 14h1v1h-1zM6 14h6v1h-6zM15 14h3v1h-3zM24 14h1v1h-1zM2 15h1v1h-1zM6 15h1v1h-1zM11 15h1v1h-1zM15 15h3v1h-3zM24 15h2v1h-2zM27 15h1v1h-1zM2 16h1v1h-1zM6 16h1v1h-1zM15 16h3v1h-3zM24 16h4v1h-4zM2 17h1v1h-1zM6 17h2v1h-2zM15 17h3v1h-3zM24 17h4v1h-4zM2 18h1v1h-1zM6 18h3v1h-3zM15 18h3v1h-3zM24 18h4v1h-4zM2 19h1v1h-1zM6 19h3v1h-3zM15 19h2v1h-2zM24 19h4v1h-4zM2 20h1v1h-1zM24 20h4v1h-4zM2 21h2v1h-2zM20 21h1v1h-1zM24 21h4v1h-4zM2 22h3v1h-3zM11 22h2v1h-2zM19 22h3v1h-3zM24 22h5v1h-5zM2 23h28v1h-28zM2 24h1v1h-1zM29 24h1v1h-1zM2 25h28v1h-28z",
        ],
        [
          "pixelTeal",
          "M30 11h1v1h-1zM5 12h4v1h-4zM11 12h1v1h-1zM14 12h3v1h-3zM30 12h1v1h-1zM5 13h1v1h-1zM10 13h2v1h-2zM14 13h1v1h-1zM20 13h1v1h-1zM23 13h1v1h-1zM27 13h1v1h-1zM30 13h1v1h-1zM5 14h1v1h-1zM14 14h1v1h-1zM20 14h1v1h-1zM23 14h1v1h-1zM26 14h2v1h-2zM30 14h1v1h-1zM5 15h1v1h-1zM14 15h1v1h-1zM20 15h1v1h-1zM23 15h1v1h-1zM26 15h1v1h-1zM30 15h1v1h-1zM5 16h1v1h-1zM11 16h1v1h-1zM14 16h1v1h-1zM20 16h1v1h-1zM23 16h1v1h-1zM30 16h1v1h-1zM5 17h1v1h-1zM8 17h1v1h-1zM11 17h1v1h-1zM14 17h1v1h-1zM20 17h1v1h-1zM23 17h1v1h-1zM30 17h1v1h-1zM5 18h1v1h-1zM11 18h1v1h-1zM14 18h1v1h-1zM20 18h1v1h-1zM23 18h1v1h-1zM30 18h1v1h-1zM5 19h1v1h-1zM11 19h1v1h-1zM14 19h1v1h-1zM20 19h1v1h-1zM23 19h1v1h-1zM30 19h1v1h-1zM11 20h1v1h-1zM19 20h2v1h-2zM23 20h1v1h-1zM30 20h1v1h-1zM10 21h2v1h-2zM18 21h2v1h-2zM23 21h1v1h-1zM30 21h1v1h-1zM5 22h6v1h-6zM13 22h6v1h-6zM22 22h2v1h-2zM29 22h2v1h-2z",
        ],
        ["pixelYellow", "M3 24h26v1h-26z"],
      ],
    },
  },
  info: {
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M3 3h26v1h-26zM3 4h1v1h-1zM28 4h1v1h-1zM3 5h1v1h-1zM28 5h1v1h-1zM3 6h1v1h-1zM28 6h1v1h-1zM3 7h1v1h-1zM28 7h1v1h-1zM3 8h1v1h-1zM28 8h1v1h-1zM3 9h1v1h-1zM28 9h1v1h-1zM3 10h1v1h-1zM28 10h1v1h-1zM3 11h1v1h-1zM28 11h1v1h-1zM3 12h1v1h-1zM28 12h1v1h-1zM3 13h1v1h-1zM28 13h1v1h-1zM3 14h1v1h-1zM28 14h1v1h-1zM3 15h1v1h-1zM28 15h1v1h-1zM3 16h1v1h-1zM28 16h1v1h-1zM3 17h1v1h-1zM28 17h1v1h-1zM3 18h1v1h-1zM28 18h1v1h-1zM3 19h1v1h-1zM28 19h1v1h-1zM3 20h1v1h-1zM28 20h1v1h-1zM3 21h1v1h-1zM28 21h1v1h-1zM3 22h1v1h-1zM28 22h1v1h-1zM3 23h1v1h-1zM28 23h1v1h-1zM3 24h1v1h-1zM28 24h1v1h-1zM3 25h1v1h-1zM28 25h1v1h-1zM3 26h1v1h-1zM28 26h1v1h-1zM3 27h1v1h-1zM28 27h1v1h-1zM3 28h26v1h-26z",
        ],
        [
          "pixelBlue",
          "M4 4h24v1h-24zM4 5h1v1h-1zM4 6h1v1h-1zM4 7h1v1h-1zM4 8h1v1h-1zM4 9h1v1h-1zM4 10h1v1h-1zM4 11h1v1h-1zM4 12h1v1h-1zM4 13h1v1h-1zM4 14h1v1h-1zM4 15h1v1h-1zM4 16h1v1h-1zM4 17h1v1h-1zM4 18h1v1h-1zM4 19h1v1h-1zM4 20h1v1h-1zM4 21h1v1h-1zM4 22h1v1h-1zM4 23h1v1h-1zM4 24h1v1h-1zM4 25h1v1h-1zM4 26h1v1h-1zM4 27h1v1h-1z",
        ],
        [
          "pixelNavy",
          "M5 5h23v1h-23zM5 6h23v1h-23zM5 7h23v1h-23zM5 8h9v1h-9zM18 8h10v1h-10zM5 9h9v1h-9zM18 9h10v1h-10zM5 10h9v1h-9zM18 10h10v1h-10zM5 11h9v1h-9zM18 11h10v1h-10zM5 12h23v1h-23zM5 13h23v1h-23zM5 14h7v1h-7zM18 14h10v1h-10zM5 15h7v1h-7zM18 15h10v1h-10zM5 16h9v1h-9zM18 16h10v1h-10zM5 17h9v1h-9zM18 17h10v1h-10zM5 18h9v1h-9zM18 18h10v1h-10zM5 19h9v1h-9zM18 19h10v1h-10zM5 20h9v1h-9zM18 20h10v1h-10zM5 21h9v1h-9zM18 21h10v1h-10zM5 22h7v1h-7zM20 22h8v1h-8zM5 23h7v1h-7zM20 23h8v1h-8zM5 24h23v1h-23zM5 25h23v1h-23zM5 26h23v1h-23zM5 27h23v1h-23z",
        ],
        [
          "pixelWhite",
          "M14 8h4v1h-4zM14 9h4v1h-4zM14 10h4v1h-4zM14 11h4v1h-4zM12 14h6v1h-6zM12 15h6v1h-6zM14 16h4v1h-4zM14 17h4v1h-4zM14 18h4v1h-4zM14 19h4v1h-4zM14 20h4v1h-4zM14 21h4v1h-4zM12 22h8v1h-8zM12 23h8v1h-8z",
        ],
      ],
    },
  },
  makingof: {
    16: {
      size: 16,
      paths: [
        [
          "pixelOutline",
          "M12 0h2v1h-2zM9 1h3v1h-3zM14 1h1v1h-1zM6 2h3v1h-3zM15 2h1v1h-1zM3 3h3v1h-3zM14 3h1v1h-1zM1 4h2v1h-2zM11 4h3v1h-3zM0 5h3v1h-3zM8 5h3v1h-3zM0 6h1v1h-1zM2 6h1v1h-1zM5 6h3v1h-3zM0 7h15v1h-15zM0 8h1v1h-1zM15 8h1v1h-1zM0 9h1v1h-1zM15 9h1v1h-1zM0 10h1v1h-1zM15 10h1v1h-1zM0 11h1v1h-1zM15 11h1v1h-1zM0 12h1v1h-1zM15 12h1v1h-1zM0 13h1v1h-1zM15 13h1v1h-1zM0 14h1v1h-1zM15 14h1v1h-1zM1 15h14v1h-14z",
        ],
        [
          "pixelBlack",
          "M12 1h1v1h-1zM10 2h2v1h-2zM14 2h1v1h-1zM6 3h2v1h-2zM10 3h2v1h-2zM13 3h1v1h-1zM3 4h1v1h-1zM6 4h2v1h-2zM9 4h2v1h-2zM3 5h1v1h-1zM5 5h2v1h-2zM1 8h2v1h-2zM5 8h2v1h-2zM9 8h2v1h-2zM13 8h2v1h-2zM1 10h14v1h-14zM1 11h2v1h-2zM7 11h1v1h-1zM13 11h2v1h-2zM1 12h14v1h-14zM1 13h2v1h-2zM11 13h4v1h-4zM1 14h14v1h-14z",
        ],
        [
          "pixelWhite",
          "M13 1h1v1h-1zM9 2h1v1h-1zM12 2h2v1h-2zM8 3h2v1h-2zM12 3h1v1h-1zM4 4h2v1h-2zM8 4h1v1h-1zM4 5h1v1h-1zM7 5h1v1h-1zM3 6h2v1h-2zM3 8h2v1h-2zM7 8h2v1h-2zM11 8h2v1h-2zM3 11h4v1h-4zM8 11h5v1h-5z",
        ],
        ["pixelSilver", "M1 6h1v1h-1z"],
        ["pixelGray", "M1 9h14v1h-14zM3 13h8v1h-8z"],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M26 1h2v1h-2zM23 2h3v1h-3zM28 2h1v1h-1zM19 3h4v1h-4zM28 3h1v1h-1zM16 4h3v1h-3zM29 4h1v1h-1zM13 5h3v1h-3zM29 5h1v1h-1zM10 6h3v1h-3zM28 6h1v1h-1zM7 7h3v1h-3zM25 7h3v1h-3zM4 8h3v1h-3zM22 8h3v1h-3zM3 9h1v1h-1zM19 9h3v1h-3zM2 10h1v1h-1zM16 10h3v1h-3zM2 11h4v1h-4zM13 11h3v1h-3zM2 12h1v1h-1zM5 12h1v1h-1zM9 12h4v1h-4zM2 13h1v1h-1zM5 13h4v1h-4zM2 14h27v1h-27zM2 15h1v1h-1zM29 15h1v1h-1zM2 16h1v1h-1zM29 16h1v1h-1zM2 17h1v1h-1zM29 17h1v1h-1zM2 18h1v1h-1zM29 18h1v1h-1zM2 19h1v1h-1zM29 19h1v1h-1zM2 20h1v1h-1zM29 20h1v1h-1zM2 21h1v1h-1zM29 21h1v1h-1zM2 22h1v1h-1zM29 22h1v1h-1zM2 23h1v1h-1zM29 23h1v1h-1zM2 24h1v1h-1zM29 24h1v1h-1zM2 25h1v1h-1zM29 25h1v1h-1zM2 26h1v1h-1zM29 26h1v1h-1zM2 27h1v1h-1zM29 27h1v1h-1zM2 28h1v1h-1zM29 28h1v1h-1zM2 29h1v1h-1zM29 29h1v1h-1zM3 30h26v1h-26z",
        ],
        [
          "pixelWhite",
          "M26 2h1v1h-1zM24 3h3v1h-3zM19 4h1v1h-1zM23 4h3v1h-3zM16 5h3v1h-3zM23 5h3v1h-3zM16 6h3v1h-3zM22 6h4v1h-4zM10 7h2v1h-2zM15 7h4v1h-4zM22 7h3v1h-3zM8 8h4v1h-4zM15 8h3v1h-3zM21 8h1v1h-1zM4 9h1v1h-1zM8 9h3v1h-3zM14 9h4v1h-4zM3 10h1v1h-1zM7 10h4v1h-4zM14 10h2v1h-2zM7 11h3v1h-3zM7 12h2v1h-2zM7 15h4v1h-4zM15 15h4v1h-4zM23 15h4v1h-4zM7 16h4v1h-4zM15 16h4v1h-4zM23 16h4v1h-4zM7 17h4v1h-4zM15 17h4v1h-4zM23 17h4v1h-4zM7 18h4v1h-4zM15 18h4v1h-4zM23 18h4v1h-4zM6 22h8v1h-8zM17 22h9v1h-9zM6 27h6v1h-6zM14 27h6v1h-6z",
        ],
        [
          "pixelBlack",
          "M27 2h1v1h-1zM23 3h1v1h-1zM27 3h1v1h-1zM20 4h3v1h-3zM26 4h3v1h-3zM19 5h4v1h-4zM26 5h3v1h-3zM13 6h3v1h-3zM19 6h3v1h-3zM26 6h2v1h-2zM12 7h3v1h-3zM19 7h3v1h-3zM7 8h1v1h-1zM12 8h3v1h-3zM18 8h3v1h-3zM5 9h3v1h-3zM11 9h3v1h-3zM18 9h1v1h-1zM4 10h3v1h-3zM11 10h3v1h-3zM6 11h1v1h-1zM10 11h3v1h-3zM6 12h1v1h-1zM3 15h4v1h-4zM11 15h4v1h-4zM19 15h4v1h-4zM27 15h2v1h-2zM3 16h4v1h-4zM11 16h4v1h-4zM19 16h4v1h-4zM27 16h2v1h-2zM3 17h4v1h-4zM11 17h4v1h-4zM19 17h4v1h-4zM27 17h2v1h-2zM3 18h4v1h-4zM11 18h4v1h-4zM19 18h4v1h-4zM27 18h2v1h-2zM3 20h26v1h-26zM3 21h26v1h-26zM3 22h3v1h-3zM14 22h3v1h-3zM26 22h3v1h-3zM3 23h26v1h-26zM3 24h26v1h-26zM3 25h3v1h-3zM25 25h4v1h-4zM3 26h26v1h-26zM3 27h3v1h-3zM12 27h2v1h-2zM20 27h9v1h-9zM3 28h26v1h-26zM3 29h26v1h-26z",
        ],
        ["pixelSilver", "M3 12h2v1h-2zM3 13h2v1h-2z"],
        ["pixelGray", "M3 19h26v1h-26zM6 25h19v1h-19z"],
      ],
    },
  },
  minefield: {
    16: {
      size: 16,
      paths: [
        [
          "pixelOutline",
          "M0 0h16v1h-16zM0 1h1v1h-1zM8 1h1v1h-1zM15 1h1v1h-1zM0 2h1v1h-1zM8 2h1v1h-1zM15 2h1v1h-1zM0 3h1v1h-1zM8 3h1v1h-1zM15 3h1v1h-1zM0 4h1v1h-1zM8 4h1v1h-1zM15 4h1v1h-1zM0 5h1v1h-1zM8 5h1v1h-1zM15 5h1v1h-1zM0 6h1v1h-1zM8 6h1v1h-1zM15 6h1v1h-1zM0 7h1v1h-1zM8 7h8v1h-8zM0 8h16v1h-16zM0 9h1v1h-1zM8 9h1v1h-1zM15 9h1v1h-1zM0 10h1v1h-1zM8 10h1v1h-1zM15 10h1v1h-1zM0 11h1v1h-1zM8 11h1v1h-1zM15 11h1v1h-1zM0 12h1v1h-1zM8 12h1v1h-1zM15 12h1v1h-1zM0 13h1v1h-1zM8 13h1v1h-1zM15 13h1v1h-1zM0 14h1v1h-1zM8 14h1v1h-1zM15 14h1v1h-1zM0 15h1v1h-1zM8 15h8v1h-8z",
        ],
        [
          "pixelLime",
          "M1 1h6v1h-6zM1 2h1v1h-1zM1 3h1v1h-1zM1 4h1v1h-1zM1 5h1v1h-1zM1 6h1v1h-1zM9 9h5v1h-5zM9 10h1v1h-1zM9 11h1v1h-1zM9 12h1v1h-1zM9 13h1v1h-1z",
        ],
        [
          "pixelTeal",
          "M7 1h1v1h-1zM7 2h1v1h-1zM7 3h1v1h-1zM7 4h1v1h-1zM7 5h1v1h-1zM7 6h1v1h-1zM1 7h7v1h-7zM14 9h1v1h-1zM14 10h1v1h-1zM14 11h1v1h-1zM14 12h1v1h-1zM14 13h1v1h-1zM9 14h6v1h-6z",
        ],
        [
          "pixelGray",
          "M9 1h6v1h-6zM9 2h1v1h-1zM9 3h1v1h-1zM9 4h1v1h-1zM9 5h1v1h-1zM9 6h1v1h-1zM1 9h7v1h-7zM1 10h1v1h-1zM1 11h1v1h-1zM1 12h1v1h-1zM1 13h1v1h-1zM1 14h1v1h-1zM1 15h1v1h-1z",
        ],
        [
          "pixelGreen",
          "M2 2h5v1h-5zM2 3h2v1h-2zM5 3h2v1h-2zM2 4h1v1h-1zM6 4h1v1h-1zM2 5h2v1h-2zM5 5h2v1h-2zM2 6h5v1h-5zM10 10h1v1h-1zM10 11h1v1h-1zM10 12h1v1h-1zM12 12h2v1h-2zM10 13h1v1h-1zM12 13h2v1h-2z",
        ],
        [
          "pixelSilver",
          "M10 2h2v1h-2zM13 2h2v1h-2zM10 3h1v1h-1zM13 3h2v1h-2zM10 4h2v1h-2zM13 4h2v1h-2zM10 5h2v1h-2zM13 5h2v1h-2zM10 6h1v1h-1zM14 6h1v1h-1zM2 10h6v1h-6zM2 11h6v1h-6zM2 12h6v1h-6zM2 13h6v1h-6zM2 14h6v1h-6zM2 15h6v1h-6z",
        ],
        ["pixelBlue", "M12 2h1v1h-1zM11 3h2v1h-2zM12 4h1v1h-1zM12 5h1v1h-1zM11 6h3v1h-3z"],
        [
          "pixelRed",
          "M4 3h1v1h-1zM3 4h1v1h-1zM5 4h1v1h-1zM4 5h1v1h-1zM12 10h2v1h-2zM12 11h2v1h-2z",
        ],
        ["pixelYellow", "M4 4h1v1h-1z"],
        ["pixelBlack", "M11 10h1v1h-1zM11 11h1v1h-1zM11 12h1v1h-1zM11 13h1v1h-1z"],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M0 0h32v1h-32zM0 1h1v1h-1zM10 1h1v1h-1zM20 1h1v1h-1zM30 1h2v1h-2zM0 2h1v1h-1zM10 2h1v1h-1zM20 2h1v1h-1zM30 2h2v1h-2zM0 3h1v1h-1zM10 3h1v1h-1zM20 3h1v1h-1zM30 3h2v1h-2zM0 4h1v1h-1zM10 4h1v1h-1zM20 4h1v1h-1zM30 4h2v1h-2zM0 5h1v1h-1zM10 5h1v1h-1zM20 5h1v1h-1zM30 5h2v1h-2zM0 6h1v1h-1zM10 6h1v1h-1zM20 6h1v1h-1zM30 6h2v1h-2zM0 7h1v1h-1zM10 7h1v1h-1zM20 7h1v1h-1zM30 7h2v1h-2zM0 8h1v1h-1zM10 8h1v1h-1zM20 8h1v1h-1zM30 8h2v1h-2zM0 9h1v1h-1zM10 9h1v1h-1zM20 9h1v1h-1zM30 9h2v1h-2zM0 10h32v1h-32zM0 11h1v1h-1zM10 11h1v1h-1zM20 11h1v1h-1zM30 11h2v1h-2zM0 12h1v1h-1zM10 12h1v1h-1zM20 12h1v1h-1zM30 12h2v1h-2zM0 13h1v1h-1zM10 13h1v1h-1zM20 13h1v1h-1zM30 13h2v1h-2zM0 14h1v1h-1zM10 14h1v1h-1zM20 14h1v1h-1zM30 14h2v1h-2zM0 15h1v1h-1zM10 15h1v1h-1zM20 15h1v1h-1zM30 15h2v1h-2zM0 16h1v1h-1zM10 16h1v1h-1zM20 16h1v1h-1zM30 16h2v1h-2zM0 17h1v1h-1zM10 17h1v1h-1zM20 17h1v1h-1zM30 17h2v1h-2zM0 18h1v1h-1zM10 18h1v1h-1zM20 18h1v1h-1zM30 18h2v1h-2zM0 19h1v1h-1zM10 19h1v1h-1zM20 19h1v1h-1zM30 19h2v1h-2zM0 20h32v1h-32zM0 21h1v1h-1zM10 21h1v1h-1zM20 21h1v1h-1zM30 21h2v1h-2zM0 22h1v1h-1zM10 22h1v1h-1zM20 22h1v1h-1zM30 22h2v1h-2zM0 23h1v1h-1zM10 23h1v1h-1zM20 23h1v1h-1zM30 23h2v1h-2zM0 24h1v1h-1zM10 24h1v1h-1zM20 24h1v1h-1zM30 24h2v1h-2zM0 25h1v1h-1zM10 25h1v1h-1zM20 25h1v1h-1zM30 25h2v1h-2zM0 26h1v1h-1zM10 26h1v1h-1zM20 26h1v1h-1zM30 26h2v1h-2zM0 27h1v1h-1zM10 27h1v1h-1zM20 27h1v1h-1zM30 27h2v1h-2zM0 28h1v1h-1zM10 28h1v1h-1zM20 28h1v1h-1zM30 28h2v1h-2zM0 29h1v1h-1zM10 29h1v1h-1zM20 29h1v1h-1zM30 29h2v1h-2zM0 30h32v1h-32zM0 31h32v1h-32z",
        ],
        [
          "pixelLime",
          "M1 1h8v1h-8zM11 1h8v1h-8zM21 1h8v1h-8zM1 2h1v1h-1zM11 2h1v1h-1zM21 2h1v1h-1zM1 3h1v1h-1zM11 3h1v1h-1zM21 3h1v1h-1zM1 4h1v1h-1zM11 4h1v1h-1zM21 4h1v1h-1zM1 5h1v1h-1zM11 5h1v1h-1zM21 5h1v1h-1zM1 6h1v1h-1zM11 6h1v1h-1zM21 6h1v1h-1zM1 7h1v1h-1zM11 7h1v1h-1zM21 7h1v1h-1zM1 8h1v1h-1zM11 8h1v1h-1zM21 8h1v1h-1zM21 11h8v1h-8zM21 12h1v1h-1zM21 13h1v1h-1zM21 14h1v1h-1zM21 15h1v1h-1zM21 16h1v1h-1zM21 17h1v1h-1zM21 18h1v1h-1zM21 21h8v1h-8zM21 22h1v1h-1zM21 23h1v1h-1zM21 24h1v1h-1zM21 25h1v1h-1zM21 26h1v1h-1zM21 27h1v1h-1zM21 28h1v1h-1z",
        ],
        [
          "pixelTeal",
          "M9 1h1v1h-1zM19 1h1v1h-1zM29 1h1v1h-1zM9 2h1v1h-1zM19 2h1v1h-1zM29 2h1v1h-1zM9 3h1v1h-1zM19 3h1v1h-1zM29 3h1v1h-1zM9 4h1v1h-1zM19 4h1v1h-1zM29 4h1v1h-1zM9 5h1v1h-1zM19 5h1v1h-1zM29 5h1v1h-1zM9 6h1v1h-1zM19 6h1v1h-1zM29 6h1v1h-1zM9 7h1v1h-1zM19 7h1v1h-1zM29 7h1v1h-1zM9 8h1v1h-1zM19 8h1v1h-1zM29 8h1v1h-1zM1 9h9v1h-9zM11 9h9v1h-9zM21 9h9v1h-9zM29 11h1v1h-1zM29 12h1v1h-1zM29 13h1v1h-1zM29 14h1v1h-1zM29 15h1v1h-1zM29 16h1v1h-1zM29 17h1v1h-1zM29 18h1v1h-1zM21 19h9v1h-9zM29 21h1v1h-1zM29 22h1v1h-1zM29 23h1v1h-1zM29 24h1v1h-1zM29 25h1v1h-1zM29 26h1v1h-1zM29 27h1v1h-1zM25 28h1v1h-1zM29 28h1v1h-1zM21 29h9v1h-9z",
        ],
        [
          "pixelGreen",
          "M2 2h7v1h-7zM12 2h7v1h-7zM22 2h7v1h-7zM2 3h7v1h-7zM12 3h7v1h-7zM22 3h2v1h-2zM28 3h1v1h-1zM2 4h7v1h-7zM12 4h7v1h-7zM22 4h2v1h-2zM28 4h1v1h-1zM2 5h7v1h-7zM12 5h7v1h-7zM22 5h2v1h-2zM26 5h3v1h-3zM2 6h7v1h-7zM12 6h7v1h-7zM22 6h2v1h-2zM25 6h4v1h-4zM2 7h7v1h-7zM12 7h7v1h-7zM22 7h2v1h-2zM25 7h4v1h-4zM2 8h7v1h-7zM12 8h7v1h-7zM22 8h1v1h-1zM27 8h2v1h-2zM22 12h7v1h-7zM14 13h2v1h-2zM22 13h7v1h-7zM16 14h1v1h-1zM22 14h7v1h-7zM15 15h1v1h-1zM22 15h7v1h-7zM14 16h1v1h-1zM22 16h7v1h-7zM14 17h3v1h-3zM22 17h7v1h-7zM22 18h7v1h-7zM22 22h7v1h-7zM22 23h2v1h-2zM27 23h2v1h-2zM22 24h1v1h-1zM28 24h1v1h-1zM22 25h1v1h-1zM28 25h1v1h-1zM22 26h1v1h-1zM28 26h1v1h-1zM22 27h2v1h-2zM27 27h2v1h-2zM22 28h3v1h-3zM26 28h3v1h-3z",
        ],
        [
          "pixelBlack",
          "M24 3h1v1h-1zM24 4h1v1h-1zM24 5h1v1h-1zM24 6h1v1h-1zM24 7h1v1h-1zM23 8h4v1h-4z",
        ],
        [
          "pixelRed",
          "M25 3h3v1h-3zM25 4h3v1h-3zM25 5h1v1h-1zM24 23h3v1h-3zM23 24h1v1h-1zM27 24h1v1h-1zM23 25h1v1h-1zM27 25h1v1h-1zM23 26h1v1h-1zM27 26h1v1h-1zM24 27h3v1h-3z",
        ],
        [
          "pixelGray",
          "M1 11h9v1h-9zM11 11h9v1h-9zM1 12h1v1h-1zM11 12h1v1h-1zM1 13h1v1h-1zM11 13h1v1h-1zM1 14h1v1h-1zM11 14h1v1h-1zM1 15h1v1h-1zM11 15h1v1h-1zM1 16h1v1h-1zM11 16h1v1h-1zM1 17h1v1h-1zM11 17h1v1h-1zM1 18h1v1h-1zM11 18h1v1h-1zM1 19h1v1h-1zM11 19h1v1h-1zM1 21h9v1h-9zM11 21h9v1h-9zM1 22h1v1h-1zM11 22h1v1h-1zM1 23h1v1h-1zM11 23h1v1h-1zM1 24h1v1h-1zM11 24h1v1h-1zM1 25h1v1h-1zM11 25h1v1h-1zM1 26h1v1h-1zM11 26h1v1h-1zM1 27h1v1h-1zM11 27h1v1h-1zM1 28h1v1h-1zM11 28h1v1h-1zM1 29h1v1h-1zM11 29h1v1h-1z",
        ],
        [
          "pixelSilver",
          "M2 12h8v1h-8zM12 12h8v1h-8zM2 13h3v1h-3zM6 13h4v1h-4zM12 13h2v1h-2zM16 13h4v1h-4zM2 14h2v1h-2zM6 14h4v1h-4zM12 14h4v1h-4zM17 14h3v1h-3zM2 15h3v1h-3zM6 15h4v1h-4zM12 15h3v1h-3zM16 15h4v1h-4zM2 16h3v1h-3zM6 16h4v1h-4zM12 16h2v1h-2zM15 16h5v1h-5zM2 17h2v1h-2zM7 17h3v1h-3zM12 17h2v1h-2zM17 17h3v1h-3zM2 18h8v1h-8zM12 18h8v1h-8zM2 19h8v1h-8zM12 19h8v1h-8zM2 22h8v1h-8zM12 22h8v1h-8zM2 23h8v1h-8zM12 23h3v1h-3zM16 23h4v1h-4zM2 24h8v1h-8zM12 24h2v1h-2zM16 24h4v1h-4zM2 25h8v1h-8zM12 25h3v1h-3zM16 25h4v1h-4zM2 26h8v1h-8zM12 26h3v1h-3zM16 26h4v1h-4zM2 27h8v1h-8zM12 27h2v1h-2zM17 27h3v1h-3zM2 28h8v1h-8zM12 28h8v1h-8zM2 29h8v1h-8zM12 29h8v1h-8z",
        ],
        [
          "pixelBlue",
          "M5 13h1v1h-1zM4 14h2v1h-2zM5 15h1v1h-1zM5 16h1v1h-1zM4 17h3v1h-3zM15 23h1v1h-1zM14 24h2v1h-2zM15 25h1v1h-1zM15 26h1v1h-1zM14 27h3v1h-3z",
        ],
        ["pixelYellow", "M24 24h3v1h-3zM24 25h1v1h-1zM26 25h1v1h-1zM24 26h3v1h-3z"],
        ["pixelOrange", "M25 25h1v1h-1z"],
      ],
    },
  },
  privacy: {
    16: {
      size: 16,
      paths: [
        [
          "pixelOutline",
          "M6 0h4v1h-4zM5 1h1v1h-1zM10 1h1v1h-1zM4 2h1v1h-1zM11 2h1v1h-1zM3 3h1v1h-1zM7 3h2v1h-2zM12 3h1v1h-1zM3 4h1v1h-1zM6 4h1v1h-1zM9 4h1v1h-1zM12 4h1v1h-1zM3 5h1v1h-1zM6 5h1v1h-1zM9 5h1v1h-1zM12 5h1v1h-1zM3 6h1v1h-1zM6 6h1v1h-1zM9 6h1v1h-1zM12 6h1v1h-1zM2 7h12v1h-12zM2 8h1v1h-1zM13 8h1v1h-1zM2 9h1v1h-1zM13 9h1v1h-1zM2 10h1v1h-1zM13 10h1v1h-1zM2 11h1v1h-1zM13 11h1v1h-1zM2 12h1v1h-1zM13 12h1v1h-1zM2 13h1v1h-1zM13 13h1v1h-1zM2 14h1v1h-1zM13 14h1v1h-1zM2 15h12v1h-12z",
        ],
        [
          "pixelSilver",
          "M6 1h4v1h-4zM5 2h6v1h-6zM4 3h3v1h-3zM9 3h3v1h-3zM4 4h2v1h-2zM10 4h2v1h-2zM4 5h2v1h-2zM10 5h2v1h-2zM4 6h2v1h-2zM10 6h2v1h-2z",
        ],
        ["pixelWhite", "M3 8h10v1h-10z"],
        [
          "pixelYellow",
          "M3 9h9v1h-9zM3 10h4v1h-4zM9 10h3v1h-3zM3 11h4v1h-4zM9 11h3v1h-3zM3 12h4v1h-4zM9 12h3v1h-3zM3 13h9v1h-9z",
        ],
        [
          "pixelOlive",
          "M12 9h1v1h-1zM12 10h1v1h-1zM12 11h1v1h-1zM12 12h1v1h-1zM12 13h1v1h-1zM3 14h10v1h-10z",
        ],
        ["pixelBlack", "M7 10h2v1h-2zM7 11h2v1h-2zM7 12h2v1h-2z"],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M12 3h8v1h-8zM11 4h1v1h-1zM20 4h1v1h-1zM10 5h1v1h-1zM21 5h1v1h-1zM9 6h1v1h-1zM22 6h1v1h-1zM8 7h1v1h-1zM13 7h6v1h-6zM23 7h1v1h-1zM8 8h1v1h-1zM12 8h1v1h-1zM19 8h1v1h-1zM23 8h1v1h-1zM8 9h1v1h-1zM12 9h1v1h-1zM19 9h1v1h-1zM23 9h1v1h-1zM8 10h1v1h-1zM12 10h1v1h-1zM19 10h1v1h-1zM23 10h1v1h-1zM7 11h1v1h-1zM12 11h1v1h-1zM19 11h1v1h-1zM24 11h1v1h-1zM7 12h1v1h-1zM12 12h1v1h-1zM19 12h1v1h-1zM24 12h1v1h-1zM7 13h1v1h-1zM12 13h1v1h-1zM19 13h1v1h-1zM24 13h1v1h-1zM5 14h22v1h-22zM5 15h1v1h-1zM26 15h1v1h-1zM5 16h1v1h-1zM26 16h1v1h-1zM5 17h1v1h-1zM26 17h1v1h-1zM5 18h1v1h-1zM26 18h1v1h-1zM5 19h1v1h-1zM26 19h1v1h-1zM5 20h1v1h-1zM26 20h1v1h-1zM5 21h1v1h-1zM26 21h1v1h-1zM5 22h1v1h-1zM26 22h1v1h-1zM5 23h1v1h-1zM26 23h1v1h-1zM5 24h1v1h-1zM26 24h1v1h-1zM5 25h1v1h-1zM26 25h1v1h-1zM5 26h1v1h-1zM26 26h1v1h-1zM5 27h1v1h-1zM26 27h1v1h-1zM5 28h1v1h-1zM26 28h1v1h-1zM5 29h22v1h-22z",
        ],
        [
          "pixelWhite",
          "M12 4h1v1h-1zM11 5h1v1h-1zM10 6h1v1h-1zM9 7h1v1h-1zM9 8h1v1h-1zM9 9h1v1h-1zM9 10h1v1h-1zM8 11h1v1h-1zM8 12h1v1h-1zM8 13h1v1h-1zM6 15h20v1h-20zM6 16h1v1h-1zM6 17h1v1h-1zM6 18h1v1h-1zM6 19h1v1h-1zM6 20h1v1h-1zM6 21h1v1h-1zM6 22h1v1h-1zM6 23h1v1h-1zM6 24h1v1h-1zM6 25h1v1h-1zM6 26h1v1h-1zM6 27h1v1h-1z",
        ],
        [
          "pixelSilver",
          "M13 4h6v1h-6zM12 5h8v1h-8zM11 6h10v1h-10zM10 7h3v1h-3zM19 7h3v1h-3zM10 8h2v1h-2zM20 8h2v1h-2zM10 9h2v1h-2zM20 9h2v1h-2zM10 10h2v1h-2zM20 10h2v1h-2zM9 11h3v1h-3zM20 11h3v1h-3zM9 12h3v1h-3zM20 12h3v1h-3zM9 13h3v1h-3zM20 13h3v1h-3z",
        ],
        [
          "pixelGray",
          "M19 4h1v1h-1zM20 5h1v1h-1zM21 6h1v1h-1zM22 7h1v1h-1zM22 8h1v1h-1zM22 9h1v1h-1zM22 10h1v1h-1zM23 11h1v1h-1zM23 12h1v1h-1zM23 13h1v1h-1z",
        ],
        [
          "pixelYellow",
          "M7 16h18v1h-18zM7 17h18v1h-18zM7 18h8v1h-8zM17 18h8v1h-8zM7 19h7v1h-7zM18 19h7v1h-7zM7 20h7v1h-7zM18 20h7v1h-7zM7 21h7v1h-7zM18 21h7v1h-7zM7 22h8v1h-8zM17 22h8v1h-8zM7 23h8v1h-8zM17 23h8v1h-8zM7 24h8v1h-8zM17 24h8v1h-8zM7 25h8v1h-8zM17 25h8v1h-8zM7 26h18v1h-18zM7 27h18v1h-18z",
        ],
        [
          "pixelOlive",
          "M25 16h1v1h-1zM25 17h1v1h-1zM25 18h1v1h-1zM25 19h1v1h-1zM25 20h1v1h-1zM25 21h1v1h-1zM25 22h1v1h-1zM25 23h1v1h-1zM25 24h1v1h-1zM25 25h1v1h-1zM25 26h1v1h-1zM25 27h1v1h-1zM6 28h20v1h-20z",
        ],
        [
          "pixelBlack",
          "M15 18h2v1h-2zM14 19h4v1h-4zM14 20h4v1h-4zM14 21h4v1h-4zM15 22h2v1h-2zM15 23h2v1h-2zM15 24h2v1h-2zM15 25h2v1h-2z",
        ],
      ],
    },
  },
  projects: {
    16: {
      size: 16,
      paths: [
        [
          "pixelOutline",
          "M2 0h12v1h-12zM2 1h1v1h-1zM5 1h1v1h-1zM13 1h2v1h-2zM2 2h1v1h-1zM5 2h1v1h-1zM13 2h2v1h-2zM5 3h1v1h-1zM7 3h5v1h-5zM13 3h2v1h-2zM2 4h1v1h-1zM5 4h1v1h-1zM7 4h1v1h-1zM11 4h1v1h-1zM13 4h2v1h-2zM2 5h1v1h-1zM5 5h1v1h-1zM7 5h1v1h-1zM11 5h1v1h-1zM13 5h2v1h-2zM2 6h1v1h-1zM5 6h1v1h-1zM7 6h5v1h-5zM13 6h2v1h-2zM5 7h1v1h-1zM13 7h2v1h-2zM2 8h1v1h-1zM5 8h1v1h-1zM13 8h3v1h-3zM2 9h1v1h-1zM5 9h1v1h-1zM13 9h1v1h-1zM15 9h1v1h-1zM2 10h1v1h-1zM5 10h1v1h-1zM13 10h1v1h-1zM15 10h1v1h-1zM5 11h1v1h-1zM13 11h3v1h-3zM2 12h1v1h-1zM5 12h1v1h-1zM13 12h2v1h-2zM2 13h1v1h-1zM5 13h1v1h-1zM13 13h2v1h-2zM2 14h13v1h-13zM5 15h10v1h-10z",
        ],
        [
          "pixelNavy",
          "M3 1h2v1h-2zM3 2h2v1h-2zM3 3h2v1h-2zM3 4h2v1h-2zM8 4h3v1h-3zM3 5h2v1h-2zM3 6h2v1h-2zM3 7h2v1h-2zM3 8h2v1h-2zM3 9h2v1h-2zM3 10h2v1h-2zM3 11h2v1h-2zM3 12h2v1h-2zM3 13h2v1h-2z",
        ],
        ["pixelCyan", "M6 1h7v1h-7z"],
        [
          "pixelBlue",
          "M6 2h7v1h-7zM6 3h1v1h-1zM12 3h1v1h-1zM6 4h1v1h-1zM12 4h1v1h-1zM6 5h1v1h-1zM12 5h1v1h-1zM6 6h1v1h-1zM12 6h1v1h-1zM6 7h7v1h-7zM6 8h7v1h-7zM6 9h7v1h-7zM6 10h7v1h-7zM6 11h7v1h-7zM6 12h7v1h-7zM6 13h7v1h-7z",
        ],
        ["pixelSilver", "M2 3h1v1h-1zM2 7h1v1h-1zM2 11h1v1h-1z"],
        ["pixelWhite", "M8 5h3v1h-3z"],
        ["pixelYellow", "M14 9h1v1h-1zM14 10h1v1h-1z"],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M5 2h22v1h-22zM5 3h1v1h-1zM10 3h1v1h-1zM26 3h3v1h-3zM5 4h1v1h-1zM10 4h1v1h-1zM26 4h1v1h-1zM28 4h1v1h-1zM5 5h1v1h-1zM10 5h1v1h-1zM26 5h1v1h-1zM28 5h1v1h-1zM4 6h5v1h-5zM10 6h1v1h-1zM26 6h1v1h-1zM28 6h1v1h-1zM4 7h1v1h-1zM8 7h1v1h-1zM10 7h1v1h-1zM26 7h1v1h-1zM28 7h1v1h-1zM4 8h5v1h-5zM10 8h1v1h-1zM14 8h10v1h-10zM26 8h1v1h-1zM28 8h1v1h-1zM5 9h1v1h-1zM10 9h1v1h-1zM14 9h1v1h-1zM23 9h1v1h-1zM26 9h1v1h-1zM28 9h1v1h-1zM5 10h1v1h-1zM10 10h1v1h-1zM14 10h1v1h-1zM23 10h1v1h-1zM26 10h1v1h-1zM28 10h1v1h-1zM5 11h1v1h-1zM10 11h1v1h-1zM14 11h1v1h-1zM23 11h1v1h-1zM26 11h1v1h-1zM28 11h1v1h-1zM5 12h1v1h-1zM10 12h1v1h-1zM14 12h1v1h-1zM23 12h1v1h-1zM26 12h1v1h-1zM28 12h1v1h-1zM5 13h1v1h-1zM10 13h1v1h-1zM14 13h1v1h-1zM23 13h1v1h-1zM26 13h1v1h-1zM28 13h1v1h-1zM4 14h5v1h-5zM10 14h1v1h-1zM14 14h10v1h-10zM26 14h1v1h-1zM28 14h1v1h-1zM4 15h1v1h-1zM8 15h1v1h-1zM10 15h1v1h-1zM26 15h1v1h-1zM28 15h1v1h-1zM4 16h5v1h-5zM10 16h1v1h-1zM26 16h1v1h-1zM28 16h1v1h-1zM5 17h1v1h-1zM10 17h1v1h-1zM26 17h5v1h-5zM5 18h1v1h-1zM10 18h1v1h-1zM26 18h2v1h-2zM30 18h1v1h-1zM5 19h1v1h-1zM10 19h1v1h-1zM26 19h2v1h-2zM30 19h1v1h-1zM5 20h1v1h-1zM10 20h1v1h-1zM26 20h2v1h-2zM30 20h1v1h-1zM5 21h1v1h-1zM10 21h1v1h-1zM26 21h5v1h-5zM4 22h5v1h-5zM10 22h1v1h-1zM26 22h1v1h-1zM28 22h1v1h-1zM4 23h1v1h-1zM8 23h1v1h-1zM10 23h1v1h-1zM26 23h1v1h-1zM28 23h1v1h-1zM4 24h5v1h-5zM10 24h1v1h-1zM26 24h1v1h-1zM28 24h1v1h-1zM5 25h1v1h-1zM10 25h1v1h-1zM26 25h1v1h-1zM28 25h1v1h-1zM5 26h1v1h-1zM10 26h1v1h-1zM26 26h1v1h-1zM28 26h1v1h-1zM5 27h1v1h-1zM10 27h1v1h-1zM26 27h1v1h-1zM28 27h1v1h-1zM5 28h22v1h-22zM28 28h1v1h-1zM9 29h20v1h-20z",
        ],
        [
          "pixelNavy",
          "M6 3h4v1h-4zM6 4h4v1h-4zM25 4h1v1h-1zM6 5h4v1h-4zM25 5h1v1h-1zM9 6h1v1h-1zM25 6h1v1h-1zM9 7h1v1h-1zM25 7h1v1h-1zM9 8h1v1h-1zM25 8h1v1h-1zM6 9h4v1h-4zM25 9h1v1h-1zM6 10h4v1h-4zM16 10h6v1h-6zM25 10h1v1h-1zM6 11h4v1h-4zM25 11h1v1h-1zM6 12h4v1h-4zM25 12h1v1h-1zM6 13h4v1h-4zM25 13h1v1h-1zM9 14h1v1h-1zM25 14h1v1h-1zM9 15h1v1h-1zM25 15h1v1h-1zM9 16h1v1h-1zM25 16h1v1h-1zM6 17h4v1h-4zM25 17h1v1h-1zM6 18h4v1h-4zM25 18h1v1h-1zM6 19h4v1h-4zM25 19h1v1h-1zM6 20h4v1h-4zM25 20h1v1h-1zM6 21h4v1h-4zM25 21h1v1h-1zM9 22h1v1h-1zM25 22h1v1h-1zM9 23h1v1h-1zM25 23h1v1h-1zM9 24h1v1h-1zM25 24h1v1h-1zM6 25h4v1h-4zM25 25h1v1h-1zM6 26h4v1h-4zM25 26h1v1h-1zM6 27h4v1h-4zM11 27h15v1h-15z",
        ],
        [
          "pixelCyan",
          "M11 3h15v1h-15zM11 4h1v1h-1zM11 5h1v1h-1zM11 6h1v1h-1zM11 7h1v1h-1zM11 8h1v1h-1zM11 9h1v1h-1zM11 10h1v1h-1zM11 11h1v1h-1zM11 12h1v1h-1zM11 13h1v1h-1zM11 14h1v1h-1zM11 15h1v1h-1zM11 16h1v1h-1zM11 17h1v1h-1zM11 18h1v1h-1zM11 19h1v1h-1zM11 20h1v1h-1zM11 21h1v1h-1zM11 22h1v1h-1zM11 23h1v1h-1zM11 24h1v1h-1zM11 25h1v1h-1zM11 26h1v1h-1z",
        ],
        [
          "pixelBlue",
          "M12 4h13v1h-13zM12 5h13v1h-13zM12 6h13v1h-13zM12 7h13v1h-13zM12 8h2v1h-2zM24 8h1v1h-1zM12 9h2v1h-2zM24 9h1v1h-1zM12 10h2v1h-2zM24 10h1v1h-1zM12 11h2v1h-2zM24 11h1v1h-1zM12 12h2v1h-2zM24 12h1v1h-1zM12 13h2v1h-2zM24 13h1v1h-1zM12 14h2v1h-2zM24 14h1v1h-1zM12 15h13v1h-13zM12 16h13v1h-13zM12 17h13v1h-13zM12 18h13v1h-13zM12 19h13v1h-13zM12 20h13v1h-13zM12 21h13v1h-13zM12 22h13v1h-13zM12 23h13v1h-13zM12 24h13v1h-13zM12 25h13v1h-13zM12 26h13v1h-13z",
        ],
        [
          "pixelWhite",
          "M27 4h1v1h-1zM27 6h1v1h-1zM5 7h1v1h-1zM27 8h1v1h-1zM15 9h8v1h-8zM15 10h1v1h-1zM22 10h1v1h-1zM27 10h1v1h-1zM15 11h8v1h-8zM15 12h1v1h-1zM21 12h2v1h-2zM27 12h1v1h-1zM15 13h8v1h-8zM27 14h1v1h-1zM5 15h1v1h-1zM27 16h1v1h-1zM27 22h1v1h-1zM5 23h1v1h-1zM27 24h1v1h-1zM27 26h1v1h-1zM27 28h1v1h-1z",
        ],
        [
          "pixelSilver",
          "M27 5h1v1h-1zM6 7h2v1h-2zM27 7h1v1h-1zM27 9h1v1h-1zM27 11h1v1h-1zM27 13h1v1h-1zM6 15h2v1h-2zM27 15h1v1h-1zM6 23h2v1h-2zM27 23h1v1h-1zM27 25h1v1h-1zM27 27h1v1h-1z",
        ],
        ["pixelGray", "M16 12h5v1h-5z"],
        ["pixelYellow", "M28 18h1v1h-1zM28 19h1v1h-1zM28 20h1v1h-1z"],
        ["pixelOlive", "M29 18h1v1h-1zM29 19h1v1h-1zM29 20h1v1h-1z"],
      ],
    },
  },
  run: {
    16: {
      size: 16,
      paths: [
        [
          "pixelOutline",
          "M0 1h12v1h-12zM0 2h1v1h-1zM11 2h1v1h-1zM0 3h1v1h-1zM11 3h1v1h-1zM0 4h1v1h-1zM11 4h1v1h-1zM0 5h1v1h-1zM11 5h1v1h-1zM0 6h1v1h-1zM11 6h1v1h-1zM0 7h1v1h-1zM11 7h1v1h-1zM0 8h1v1h-1zM12 8h2v1h-2zM0 9h1v1h-1zM14 9h1v1h-1zM0 10h1v1h-1zM15 10h1v1h-1zM0 11h1v1h-1zM14 11h1v1h-1zM0 12h6v1h-6zM12 12h2v1h-2zM5 13h1v1h-1zM10 13h2v1h-2zM5 14h1v1h-1zM9 14h1v1h-1zM5 15h1v1h-1zM7 15h2v1h-2z",
        ],
        ["pixelNavy", "M1 2h10v1h-10zM1 3h10v1h-10z"],
        [
          "pixelGray",
          "M1 4h10v1h-10zM1 5h1v1h-1zM10 5h1v1h-1zM1 6h1v1h-1zM10 6h1v1h-1zM1 7h1v1h-1zM10 7h1v1h-1zM1 8h1v1h-1zM1 9h1v1h-1zM1 10h1v1h-1zM1 11h5v1h-5z",
        ],
        [
          "pixelWhite",
          "M2 5h4v1h-4zM7 5h3v1h-3zM2 6h4v1h-4zM9 6h1v1h-1zM2 7h4v1h-4zM2 8h4v1h-4zM2 9h4v1h-4zM2 10h4v1h-4z",
        ],
        ["pixelLime", "M6 5h1v1h-1zM6 6h3v1h-3zM6 7h4v1h-4zM6 8h6v1h-6zM6 9h8v1h-8zM6 10h9v1h-9z"],
        ["pixelGreen", "M6 11h8v1h-8zM6 12h6v1h-6zM6 13h4v1h-4zM6 14h3v1h-3zM6 15h1v1h-1z"],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M1 4h22v1h-22zM1 5h1v1h-1zM22 5h1v1h-1zM1 6h1v1h-1zM22 6h1v1h-1zM1 7h1v1h-1zM22 7h1v1h-1zM1 8h1v1h-1zM22 8h1v1h-1zM1 9h1v1h-1zM22 9h1v1h-1zM1 10h1v1h-1zM22 10h1v1h-1zM1 11h1v1h-1zM22 11h1v1h-1zM1 12h1v1h-1zM22 12h1v1h-1zM1 13h1v1h-1zM22 13h1v1h-1zM1 14h1v1h-1zM22 14h1v1h-1zM1 15h1v1h-1zM22 15h1v1h-1zM1 16h1v1h-1zM23 16h2v1h-2zM1 17h1v1h-1zM25 17h2v1h-2zM1 18h1v1h-1zM27 18h2v1h-2zM1 19h1v1h-1zM29 19h1v1h-1zM1 20h1v1h-1zM30 20h1v1h-1zM1 21h1v1h-1zM29 21h1v1h-1zM1 22h1v1h-1zM27 22h2v1h-2zM1 23h1v1h-1zM25 23h2v1h-2zM1 24h1v1h-1zM23 24h2v1h-2zM1 25h1v1h-1zM22 25h1v1h-1zM1 26h12v1h-12zM19 26h4v1h-4zM12 27h1v1h-1zM18 27h1v1h-1zM12 28h1v1h-1zM16 28h2v1h-2zM12 29h1v1h-1zM14 29h2v1h-2zM13 30h1v1h-1z",
        ],
        [
          "pixelWhite",
          "M2 5h19v1h-19zM2 6h1v1h-1zM2 7h1v1h-1zM4 7h7v1h-7zM2 8h1v1h-1zM2 9h1v1h-1zM2 10h1v1h-1zM2 11h1v1h-1zM2 12h1v1h-1zM4 12h9v1h-9zM16 12h4v1h-4zM2 13h1v1h-1zM4 13h9v1h-9zM14 13h1v1h-1zM18 13h2v1h-2zM2 14h1v1h-1zM4 14h1v1h-1zM15 14h2v1h-2zM19 14h1v1h-1zM2 15h1v1h-1zM4 15h9v1h-9zM17 15h2v1h-2zM2 16h1v1h-1zM4 16h9v1h-9zM19 16h2v1h-2zM2 17h1v1h-1zM4 17h1v1h-1zM11 17h2v1h-2zM21 17h2v1h-2zM2 18h1v1h-1zM4 18h9v1h-9zM23 18h2v1h-2zM2 19h1v1h-1zM4 19h9v1h-9zM25 19h1v1h-1zM2 20h1v1h-1zM4 20h9v1h-9zM2 21h1v1h-1zM4 21h9v1h-9zM2 22h1v1h-1zM4 22h9v1h-9zM2 23h1v1h-1zM4 23h9v1h-9zM2 24h1v1h-1z",
        ],
        [
          "pixelGray",
          "M21 5h1v1h-1zM21 6h1v1h-1zM21 7h1v1h-1zM21 8h1v1h-1zM21 9h1v1h-1zM21 10h1v1h-1zM3 11h10v1h-10zM14 11h8v1h-8zM3 12h1v1h-1zM20 12h2v1h-2zM3 13h1v1h-1zM20 13h2v1h-2zM3 14h1v1h-1zM5 14h8v1h-8zM20 14h2v1h-2zM3 15h1v1h-1zM21 15h1v1h-1zM3 16h1v1h-1zM3 17h1v1h-1zM5 17h6v1h-6zM3 18h1v1h-1zM3 19h1v1h-1zM3 20h1v1h-1zM3 21h1v1h-1zM3 22h1v1h-1zM3 23h1v1h-1zM3 24h10v1h-10zM2 25h11v1h-11zM21 25h1v1h-1z",
        ],
        ["pixelNavy", "M3 6h18v1h-18zM3 7h1v1h-1zM11 7h10v1h-10zM3 8h18v1h-18zM3 9h18v1h-18z"],
        ["pixelSilver", "M3 10h18v1h-18z"],
        [
          "pixelLime",
          "M13 11h1v1h-1zM13 12h3v1h-3zM13 13h1v1h-1zM15 13h3v1h-3zM13 14h2v1h-2zM17 14h2v1h-2zM13 15h4v1h-4zM19 15h2v1h-2zM13 16h6v1h-6zM21 16h2v1h-2zM13 17h8v1h-8zM23 17h2v1h-2zM13 18h10v1h-10zM25 18h2v1h-2zM13 19h12v1h-12zM26 19h3v1h-3zM13 20h17v1h-17zM13 21h6v1h-6z",
        ],
        [
          "pixelGreen",
          "M19 21h10v1h-10zM13 22h14v1h-14zM13 23h12v1h-12zM13 24h10v1h-10zM13 25h8v1h-8zM13 26h6v1h-6zM13 27h5v1h-5zM13 28h3v1h-3zM13 29h1v1h-1z",
        ],
      ],
    },
  },
  simpleview: {
    16: {
      size: 16,
      paths: [
        [
          "pixelOutline",
          "M2 0h12v1h-12zM2 1h1v1h-1zM13 1h1v1h-1zM2 2h1v1h-1zM13 2h1v1h-1zM2 3h1v1h-1zM13 3h1v1h-1zM2 4h1v1h-1zM13 4h1v1h-1zM2 5h1v1h-1zM13 5h1v1h-1zM2 6h1v1h-1zM13 6h1v1h-1zM2 7h1v1h-1zM13 7h1v1h-1zM1 8h6v1h-6zM9 8h6v1h-6zM0 9h2v1h-2zM6 9h4v1h-4zM14 9h2v1h-2zM1 10h1v1h-1zM6 10h1v1h-1zM9 10h1v1h-1zM14 10h1v1h-1zM1 11h1v1h-1zM6 11h1v1h-1zM9 11h1v1h-1zM14 11h1v1h-1zM1 12h6v1h-6zM9 12h6v1h-6zM2 13h1v1h-1zM13 13h1v1h-1zM2 14h1v1h-1zM13 14h1v1h-1zM2 15h12v1h-12z",
        ],
        [
          "pixelWhite",
          "M3 1h10v1h-10zM3 2h1v1h-1zM10 2h3v1h-3zM3 3h10v1h-10zM3 4h1v1h-1zM12 4h1v1h-1zM3 5h10v1h-10zM3 6h1v1h-1zM11 6h2v1h-2zM3 7h10v1h-10zM7 8h2v1h-2zM2 9h1v1h-1zM10 9h1v1h-1zM7 10h2v1h-2zM7 11h2v1h-2zM7 12h2v1h-2zM3 13h10v1h-10zM3 14h1v1h-1zM12 14h1v1h-1z",
        ],
        ["pixelNavy", "M4 2h6v1h-6z"],
        ["pixelGray", "M4 4h8v1h-8zM4 6h7v1h-7zM4 14h8v1h-8z"],
        [
          "pixelCyan",
          "M3 9h3v1h-3zM11 9h3v1h-3zM2 10h4v1h-4zM10 10h4v1h-4zM2 11h4v1h-4zM10 11h4v1h-4z",
        ],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M5 1h22v1h-22zM5 2h1v1h-1zM26 2h1v1h-1zM5 3h1v1h-1zM26 3h1v1h-1zM5 4h1v1h-1zM26 4h1v1h-1zM5 5h1v1h-1zM26 5h1v1h-1zM5 6h1v1h-1zM26 6h1v1h-1zM5 7h1v1h-1zM26 7h1v1h-1zM5 8h1v1h-1zM26 8h1v1h-1zM5 9h1v1h-1zM26 9h1v1h-1zM5 10h1v1h-1zM26 10h1v1h-1zM5 11h1v1h-1zM26 11h1v1h-1zM5 12h1v1h-1zM26 12h1v1h-1zM5 13h1v1h-1zM26 13h1v1h-1zM5 14h1v1h-1zM26 14h1v1h-1zM5 15h1v1h-1zM26 15h1v1h-1zM5 16h1v1h-1zM7 16h6v1h-6zM20 16h7v1h-7zM5 17h3v1h-3zM12 17h2v1h-2zM19 17h2v1h-2zM25 17h2v1h-2zM0 18h7v1h-7zM13 18h7v1h-7zM26 18h6v1h-6zM5 19h1v1h-1zM14 19h5v1h-5zM27 19h1v1h-1zM5 20h1v1h-1zM14 20h1v1h-1zM18 20h1v1h-1zM27 20h1v1h-1zM5 21h1v1h-1zM14 21h1v1h-1zM18 21h1v1h-1zM27 21h1v1h-1zM5 22h1v1h-1zM14 22h1v1h-1zM18 22h1v1h-1zM27 22h1v1h-1zM5 23h2v1h-2zM13 23h2v1h-2zM18 23h2v1h-2zM26 23h2v1h-2zM5 24h3v1h-3zM12 24h2v1h-2zM19 24h2v1h-2zM25 24h2v1h-2zM5 25h1v1h-1zM7 25h6v1h-6zM20 25h7v1h-7zM5 26h1v1h-1zM26 26h1v1h-1zM5 27h1v1h-1zM26 27h1v1h-1zM5 28h1v1h-1zM26 28h1v1h-1zM5 29h1v1h-1zM26 29h1v1h-1zM5 30h22v1h-22z",
        ],
        [
          "pixelWhite",
          "M6 2h20v1h-20zM6 3h20v1h-20zM6 4h2v1h-2zM21 4h5v1h-5zM6 5h2v1h-2zM21 5h5v1h-5zM6 6h20v1h-20zM6 7h20v1h-20zM6 8h2v1h-2zM22 8h4v1h-4zM6 9h20v1h-20zM6 10h20v1h-20zM6 11h2v1h-2zM24 11h2v1h-2zM6 12h20v1h-20zM6 13h20v1h-20zM6 14h2v1h-2zM22 14h4v1h-4zM6 15h20v1h-20zM6 16h1v1h-1zM13 16h7v1h-7zM8 17h1v1h-1zM14 17h5v1h-5zM21 17h1v1h-1zM7 18h1v1h-1zM20 18h1v1h-1zM15 20h3v1h-3zM15 21h3v1h-3zM15 22h3v1h-3zM15 23h3v1h-3zM14 24h5v1h-5zM6 25h1v1h-1zM13 25h7v1h-7zM6 26h2v1h-2zM22 26h4v1h-4zM6 27h20v1h-20zM6 28h2v1h-2zM22 28h4v1h-4zM6 29h20v1h-20z",
        ],
        ["pixelNavy", "M8 4h13v1h-13zM8 5h13v1h-13z"],
        ["pixelGray", "M8 8h14v1h-14zM8 11h16v1h-16zM8 14h14v1h-14zM8 26h14v1h-14zM8 28h14v1h-14z"],
        [
          "pixelCyan",
          "M9 17h3v1h-3zM22 17h3v1h-3zM8 18h5v1h-5zM21 18h5v1h-5zM6 19h8v1h-8zM19 19h8v1h-8zM6 20h8v1h-8zM19 20h8v1h-8zM6 21h8v1h-8zM19 21h8v1h-8zM6 22h8v1h-8zM19 22h8v1h-8zM7 23h6v1h-6zM20 23h6v1h-6zM8 24h4v1h-4zM21 24h4v1h-4z",
        ],
      ],
    },
  },
  skills: {
    16: {
      size: 16,
      paths: [
        [
          "pixelOutline",
          "M5 1h6v1h-6zM4 2h1v1h-1zM11 2h1v1h-1zM4 3h1v1h-1zM11 3h1v1h-1zM4 4h1v1h-1zM11 4h1v1h-1zM0 5h16v1h-16zM0 6h1v1h-1zM15 6h1v1h-1zM0 7h1v1h-1zM6 7h4v1h-4zM15 7h1v1h-1zM0 8h7v1h-7zM9 8h7v1h-7zM0 9h1v1h-1zM6 9h1v1h-1zM9 9h1v1h-1zM15 9h1v1h-1zM0 10h1v1h-1zM6 10h4v1h-4zM15 10h1v1h-1zM0 11h1v1h-1zM15 11h1v1h-1zM0 12h1v1h-1zM15 12h1v1h-1zM0 13h1v1h-1zM15 13h1v1h-1zM0 14h16v1h-16z",
        ],
        ["pixelSilver", "M5 2h6v1h-6z"],
        ["pixelOrange", "M1 6h13v1h-13z"],
        [
          "pixelMaroon",
          "M14 6h1v1h-1zM14 7h1v1h-1zM14 9h1v1h-1zM14 10h1v1h-1zM14 11h1v1h-1zM14 12h1v1h-1zM1 13h14v1h-14z",
        ],
        [
          "pixelRed",
          "M1 7h5v1h-5zM10 7h4v1h-4zM1 9h5v1h-5zM10 9h4v1h-4zM1 10h5v1h-5zM10 10h4v1h-4zM1 11h13v1h-13zM1 12h13v1h-13z",
        ],
        ["pixelYellow", "M7 8h2v1h-2zM7 9h2v1h-2z"],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M10 4h12v1h-12zM10 5h1v1h-1zM21 5h1v1h-1zM10 6h1v1h-1zM21 6h1v1h-1zM10 7h1v1h-1zM12 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM10 8h1v1h-1zM12 8h1v1h-1zM19 8h1v1h-1zM21 8h1v1h-1zM10 9h1v1h-1zM12 9h1v1h-1zM19 9h1v1h-1zM21 9h1v1h-1zM10 10h1v1h-1zM12 10h1v1h-1zM19 10h1v1h-1zM21 10h1v1h-1zM2 11h28v1h-28zM2 12h1v1h-1zM29 12h1v1h-1zM2 13h1v1h-1zM29 13h1v1h-1zM2 14h1v1h-1zM13 14h6v1h-6zM29 14h1v1h-1zM2 15h1v1h-1zM13 15h1v1h-1zM18 15h1v1h-1zM29 15h1v1h-1zM2 16h12v1h-12zM18 16h12v1h-12zM2 17h1v1h-1zM13 17h1v1h-1zM18 17h1v1h-1zM29 17h1v1h-1zM2 18h1v1h-1zM13 18h1v1h-1zM18 18h1v1h-1zM29 18h1v1h-1zM2 19h1v1h-1zM13 19h6v1h-6zM29 19h1v1h-1zM2 20h1v1h-1zM29 20h1v1h-1zM2 21h1v1h-1zM5 21h5v1h-5zM22 21h5v1h-5zM29 21h1v1h-1zM2 22h1v1h-1zM5 22h1v1h-1zM9 22h1v1h-1zM22 22h1v1h-1zM26 22h1v1h-1zM29 22h1v1h-1zM2 23h1v1h-1zM5 23h1v1h-1zM9 23h1v1h-1zM22 23h1v1h-1zM26 23h1v1h-1zM29 23h1v1h-1zM2 24h1v1h-1zM5 24h5v1h-5zM22 24h5v1h-5zM29 24h1v1h-1zM2 25h1v1h-1zM29 25h1v1h-1zM2 26h1v1h-1zM29 26h1v1h-1zM2 27h1v1h-1zM29 27h1v1h-1zM2 28h28v1h-28z",
        ],
        ["pixelWhite", "M11 5h10v1h-10z"],
        [
          "pixelSilver",
          "M11 6h10v1h-10zM11 7h1v1h-1zM20 7h1v1h-1zM11 8h1v1h-1zM20 8h1v1h-1zM11 9h1v1h-1zM20 9h1v1h-1zM11 10h1v1h-1zM20 10h1v1h-1zM6 22h3v1h-3zM23 22h3v1h-3zM6 23h3v1h-3zM23 23h3v1h-3z",
        ],
        [
          "pixelOrange",
          "M3 12h25v1h-25zM3 13h1v1h-1zM3 14h1v1h-1zM3 15h1v1h-1zM3 17h1v1h-1zM3 18h1v1h-1zM3 19h1v1h-1zM3 20h1v1h-1zM3 21h1v1h-1zM3 22h1v1h-1zM3 23h1v1h-1zM3 24h1v1h-1zM3 25h1v1h-1zM3 26h1v1h-1z",
        ],
        [
          "pixelMaroon",
          "M28 12h1v1h-1zM28 13h1v1h-1zM28 14h1v1h-1zM28 15h1v1h-1zM4 17h9v1h-9zM19 17h10v1h-10zM28 18h1v1h-1zM28 19h1v1h-1zM28 20h1v1h-1zM28 21h1v1h-1zM28 22h1v1h-1zM28 23h1v1h-1zM28 24h1v1h-1zM28 25h1v1h-1zM28 26h1v1h-1zM3 27h26v1h-26z",
        ],
        [
          "pixelRed",
          "M4 13h24v1h-24zM4 14h9v1h-9zM19 14h9v1h-9zM4 15h9v1h-9zM19 15h9v1h-9zM4 18h9v1h-9zM19 18h9v1h-9zM4 19h9v1h-9zM19 19h9v1h-9zM4 20h24v1h-24zM4 21h1v1h-1zM10 21h12v1h-12zM27 21h1v1h-1zM4 22h1v1h-1zM10 22h12v1h-12zM27 22h1v1h-1zM4 23h1v1h-1zM10 23h12v1h-12zM27 23h1v1h-1zM4 24h1v1h-1zM10 24h12v1h-12zM27 24h1v1h-1zM4 25h24v1h-24zM4 26h24v1h-24z",
        ],
        ["pixelYellow", "M14 15h4v1h-4zM14 16h3v1h-3zM14 17h4v1h-4z"],
        ["pixelOlive", "M17 16h1v1h-1zM14 18h4v1h-4z"],
      ],
    },
  },
  terminal: {
    16: {
      size: 16,
      paths: [
        [
          "pixelOutline",
          "M0 1h16v1h-16zM0 2h1v1h-1zM15 2h1v1h-1zM0 3h1v1h-1zM15 3h1v1h-1zM0 4h1v1h-1zM15 4h1v1h-1zM0 5h1v1h-1zM15 5h1v1h-1zM0 6h1v1h-1zM15 6h1v1h-1zM0 7h1v1h-1zM15 7h1v1h-1zM0 8h1v1h-1zM15 8h1v1h-1zM0 9h1v1h-1zM15 9h1v1h-1zM0 10h1v1h-1zM15 10h1v1h-1zM0 11h1v1h-1zM15 11h1v1h-1zM0 12h1v1h-1zM15 12h1v1h-1zM0 13h1v1h-1zM15 13h1v1h-1zM0 14h16v1h-16z",
        ],
        ["pixelNavy", "M1 2h14v1h-14zM1 3h1v1h-1zM7 3h8v1h-8zM1 4h14v1h-14z"],
        ["pixelWhite", "M2 3h5v1h-5zM6 9h3v1h-3zM6 10h3v1h-3z"],
        [
          "pixelGray",
          "M1 5h14v1h-14zM1 6h1v1h-1zM14 6h1v1h-1zM1 7h1v1h-1zM14 7h1v1h-1zM1 8h1v1h-1zM14 8h1v1h-1zM1 9h1v1h-1zM14 9h1v1h-1zM1 10h1v1h-1zM14 10h1v1h-1zM1 11h1v1h-1zM14 11h1v1h-1zM1 12h1v1h-1zM14 12h1v1h-1zM1 13h14v1h-14z",
        ],
        [
          "pixelBlack",
          "M2 6h12v1h-12zM2 7h1v1h-1zM4 7h10v1h-10zM2 8h2v1h-2zM5 8h9v1h-9zM2 9h1v1h-1zM4 9h2v1h-2zM9 9h5v1h-5zM2 10h4v1h-4zM9 10h5v1h-5zM2 11h12v1h-12zM2 12h12v1h-12z",
        ],
        ["pixelSilver", "M3 7h1v1h-1zM4 8h1v1h-1zM3 9h1v1h-1z"],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M1 3h30v1h-30zM1 4h1v1h-1zM30 4h1v1h-1zM1 5h1v1h-1zM25 5h4v1h-4zM30 5h1v1h-1zM1 6h1v1h-1zM25 6h1v1h-1zM28 6h1v1h-1zM30 6h1v1h-1zM1 7h1v1h-1zM25 7h1v1h-1zM28 7h1v1h-1zM30 7h1v1h-1zM1 8h1v1h-1zM25 8h4v1h-4zM30 8h1v1h-1zM1 9h1v1h-1zM30 9h1v1h-1zM1 10h1v1h-1zM30 10h1v1h-1zM1 11h1v1h-1zM30 11h1v1h-1zM1 12h1v1h-1zM30 12h1v1h-1zM1 13h1v1h-1zM30 13h1v1h-1zM1 14h1v1h-1zM30 14h1v1h-1zM1 15h1v1h-1zM30 15h1v1h-1zM1 16h1v1h-1zM30 16h1v1h-1zM1 17h1v1h-1zM30 17h1v1h-1zM1 18h1v1h-1zM30 18h1v1h-1zM1 19h1v1h-1zM30 19h1v1h-1zM1 20h1v1h-1zM30 20h1v1h-1zM1 21h1v1h-1zM30 21h1v1h-1zM1 22h1v1h-1zM30 22h1v1h-1zM1 23h1v1h-1zM30 23h1v1h-1zM1 24h1v1h-1zM30 24h1v1h-1zM1 25h1v1h-1zM30 25h1v1h-1zM1 26h1v1h-1zM30 26h1v1h-1zM1 27h1v1h-1zM30 27h1v1h-1zM1 28h30v1h-30z",
        ],
        [
          "pixelWhite",
          "M2 4h27v1h-27zM2 5h1v1h-1zM2 6h1v1h-1zM4 6h9v1h-9zM2 7h1v1h-1zM2 8h1v1h-1zM2 9h1v1h-1zM2 10h1v1h-1zM2 11h1v1h-1zM2 12h1v1h-1zM2 13h1v1h-1zM2 14h1v1h-1zM2 15h1v1h-1zM2 16h1v1h-1zM2 17h1v1h-1zM11 17h5v1h-5zM2 18h1v1h-1zM11 18h5v1h-5zM2 19h1v1h-1zM2 20h1v1h-1zM2 21h1v1h-1zM2 22h1v1h-1zM2 23h1v1h-1zM2 24h1v1h-1zM2 25h1v1h-1zM2 26h1v1h-1z",
        ],
        [
          "pixelGray",
          "M29 4h1v1h-1zM29 5h1v1h-1zM29 6h1v1h-1zM29 7h1v1h-1zM29 8h1v1h-1zM29 9h1v1h-1zM3 10h27v1h-27zM3 11h1v1h-1zM28 11h2v1h-2zM3 12h1v1h-1zM28 12h2v1h-2zM3 13h1v1h-1zM28 13h2v1h-2zM3 14h1v1h-1zM28 14h2v1h-2zM3 15h1v1h-1zM28 15h2v1h-2zM3 16h1v1h-1zM28 16h2v1h-2zM3 17h1v1h-1zM28 17h2v1h-2zM3 18h1v1h-1zM28 18h2v1h-2zM3 19h1v1h-1zM28 19h2v1h-2zM3 20h1v1h-1zM28 20h2v1h-2zM3 21h1v1h-1zM6 21h8v1h-8zM15 21h5v1h-5zM28 21h2v1h-2zM3 22h1v1h-1zM28 22h2v1h-2zM3 23h1v1h-1zM6 23h5v1h-5zM28 23h2v1h-2zM3 24h1v1h-1zM28 24h2v1h-2zM3 25h1v1h-1zM28 25h2v1h-2zM3 26h27v1h-27zM2 27h28v1h-28z",
        ],
        [
          "pixelNavy",
          "M3 5h22v1h-22zM3 6h1v1h-1zM13 6h12v1h-12zM3 7h1v1h-1zM10 7h15v1h-15zM3 8h22v1h-22z",
        ],
        [
          "pixelSilver",
          "M26 6h2v1h-2zM26 7h2v1h-2zM3 9h26v1h-26zM6 13h2v1h-2zM7 14h2v1h-2zM8 15h2v1h-2zM7 16h2v1h-2zM6 17h2v1h-2z",
        ],
        ["pixelCyan", "M4 7h6v1h-6z"],
        [
          "pixelBlack",
          "M4 11h24v1h-24zM4 12h24v1h-24zM4 13h2v1h-2zM8 13h20v1h-20zM4 14h3v1h-3zM9 14h19v1h-19zM4 15h4v1h-4zM10 15h18v1h-18zM4 16h3v1h-3zM9 16h19v1h-19zM4 17h2v1h-2zM8 17h3v1h-3zM16 17h12v1h-12zM4 18h7v1h-7zM16 18h12v1h-12zM4 19h24v1h-24zM4 20h24v1h-24zM4 21h2v1h-2zM14 21h1v1h-1zM20 21h8v1h-8zM4 22h24v1h-24zM4 23h2v1h-2zM11 23h17v1h-17zM4 24h24v1h-24zM4 25h24v1h-24z",
        ],
      ],
    },
  },
  timeline: {
    16: {
      size: 16,
      paths: [
        [
          "pixelOutline",
          "M4 0h1v1h-1zM11 0h1v1h-1zM4 1h1v1h-1zM11 1h1v1h-1zM1 2h14v1h-14zM1 3h1v1h-1zM4 3h1v1h-1zM11 3h1v1h-1zM14 3h1v1h-1zM1 4h1v1h-1zM14 4h1v1h-1zM1 5h1v1h-1zM14 5h1v1h-1zM1 6h14v1h-14zM1 7h1v1h-1zM14 7h1v1h-1zM1 8h1v1h-1zM14 8h1v1h-1zM1 9h1v1h-1zM14 9h1v1h-1zM1 10h1v1h-1zM14 10h1v1h-1zM1 11h1v1h-1zM14 11h1v1h-1zM1 12h1v1h-1zM14 12h1v1h-1zM1 13h1v1h-1zM14 13h1v1h-1zM1 14h1v1h-1zM14 14h1v1h-1zM1 15h14v1h-14z",
        ],
        ["pixelRed", "M2 3h2v1h-2zM5 3h6v1h-6zM12 3h2v1h-2zM2 4h12v1h-12zM2 5h12v1h-12z"],
        [
          "pixelWhite",
          "M2 7h12v1h-12zM2 8h1v1h-1zM4 8h1v1h-1zM6 8h1v1h-1zM8 8h1v1h-1zM10 8h1v1h-1zM12 8h2v1h-2zM2 9h4v1h-4zM9 9h5v1h-5zM2 10h1v1h-1zM4 10h1v1h-1zM7 10h1v1h-1zM10 10h1v1h-1zM12 10h2v1h-2zM2 11h4v1h-4zM9 11h5v1h-5zM2 12h1v1h-1zM4 12h1v1h-1zM6 12h1v1h-1zM8 12h1v1h-1zM10 12h1v1h-1zM12 12h2v1h-2zM2 13h12v1h-12zM2 14h12v1h-12z",
        ],
        [
          "pixelGray",
          "M3 8h1v1h-1zM5 8h1v1h-1zM7 8h1v1h-1zM9 8h1v1h-1zM11 8h1v1h-1zM3 10h1v1h-1zM5 10h1v1h-1zM9 10h1v1h-1zM11 10h1v1h-1zM3 12h1v1h-1zM5 12h1v1h-1zM7 12h1v1h-1zM9 12h1v1h-1zM11 12h1v1h-1z",
        ],
        ["pixelNavy", "M6 9h3v1h-3zM6 10h1v1h-1zM8 10h1v1h-1zM6 11h3v1h-3z"],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M8 2h3v1h-3zM22 2h3v1h-3zM8 3h1v1h-1zM10 3h1v1h-1zM22 3h1v1h-1zM24 3h1v1h-1zM8 4h1v1h-1zM10 4h1v1h-1zM22 4h1v1h-1zM24 4h1v1h-1zM3 5h6v1h-6zM10 5h13v1h-13zM24 5h5v1h-5zM3 6h1v1h-1zM8 6h1v1h-1zM10 6h1v1h-1zM22 6h1v1h-1zM24 6h1v1h-1zM28 6h1v1h-1zM3 7h1v1h-1zM8 7h1v1h-1zM10 7h1v1h-1zM22 7h1v1h-1zM24 7h1v1h-1zM28 7h1v1h-1zM3 8h1v1h-1zM8 8h3v1h-3zM22 8h3v1h-3zM28 8h1v1h-1zM3 9h1v1h-1zM28 9h1v1h-1zM3 10h1v1h-1zM28 10h1v1h-1zM3 11h1v1h-1zM28 11h1v1h-1zM3 12h26v1h-26zM3 13h1v1h-1zM28 13h1v1h-1zM3 14h1v1h-1zM28 14h1v1h-1zM3 15h1v1h-1zM28 15h1v1h-1zM3 16h1v1h-1zM28 16h1v1h-1zM3 17h1v1h-1zM28 17h1v1h-1zM3 18h1v1h-1zM28 18h1v1h-1zM3 19h1v1h-1zM28 19h1v1h-1zM3 20h1v1h-1zM28 20h1v1h-1zM3 21h1v1h-1zM28 21h1v1h-1zM3 22h1v1h-1zM28 22h1v1h-1zM3 23h1v1h-1zM28 23h1v1h-1zM3 24h1v1h-1zM28 24h1v1h-1zM3 25h1v1h-1zM28 25h1v1h-1zM3 26h1v1h-1zM28 26h1v1h-1zM3 27h1v1h-1zM28 27h1v1h-1zM3 28h1v1h-1zM28 28h1v1h-1zM3 29h26v1h-26z",
        ],
        [
          "pixelWhite",
          "M9 3h1v1h-1zM23 3h1v1h-1zM9 4h1v1h-1zM23 4h1v1h-1zM9 5h1v1h-1zM23 5h1v1h-1zM9 6h1v1h-1zM23 6h1v1h-1zM9 7h1v1h-1zM23 7h1v1h-1zM4 13h23v1h-23zM4 14h23v1h-23zM4 15h2v1h-2zM8 15h2v1h-2zM12 15h2v1h-2zM16 15h2v1h-2zM20 15h2v1h-2zM24 15h3v1h-3zM4 16h2v1h-2zM8 16h2v1h-2zM12 16h2v1h-2zM16 16h2v1h-2zM20 16h2v1h-2zM24 16h3v1h-3zM4 17h9v1h-9zM18 17h9v1h-9zM4 18h2v1h-2zM8 18h2v1h-2zM12 18h1v1h-1zM16 18h1v1h-1zM20 18h2v1h-2zM24 18h3v1h-3zM4 19h2v1h-2zM8 19h2v1h-2zM12 19h1v1h-1zM16 19h1v1h-1zM20 19h2v1h-2zM24 19h3v1h-3zM4 20h9v1h-9zM14 20h3v1h-3zM18 20h9v1h-9zM4 21h2v1h-2zM8 21h2v1h-2zM12 21h1v1h-1zM20 21h2v1h-2zM24 21h3v1h-3zM4 22h2v1h-2zM8 22h2v1h-2zM12 22h2v1h-2zM16 22h2v1h-2zM20 22h2v1h-2zM24 22h3v1h-3zM4 23h23v1h-23zM4 24h2v1h-2zM8 24h2v1h-2zM12 24h2v1h-2zM16 24h2v1h-2zM20 24h2v1h-2zM24 24h3v1h-3zM4 25h2v1h-2zM8 25h2v1h-2zM12 25h2v1h-2zM16 25h2v1h-2zM20 25h2v1h-2zM24 25h3v1h-3zM4 26h23v1h-23zM4 27h23v1h-23z",
        ],
        ["pixelOrange", "M4 6h4v1h-4zM11 6h11v1h-11zM25 6h3v1h-3z"],
        [
          "pixelRed",
          "M4 7h4v1h-4zM11 7h11v1h-11zM25 7h3v1h-3zM4 8h4v1h-4zM11 8h11v1h-11zM25 8h3v1h-3zM4 9h24v1h-24zM4 10h24v1h-24z",
        ],
        ["pixelMaroon", "M4 11h24v1h-24z"],
        [
          "pixelSilver",
          "M27 13h1v1h-1zM27 14h1v1h-1zM27 15h1v1h-1zM27 16h1v1h-1zM27 17h1v1h-1zM27 18h1v1h-1zM27 19h1v1h-1zM27 20h1v1h-1zM27 21h1v1h-1zM27 22h1v1h-1zM27 23h1v1h-1zM27 24h1v1h-1zM27 25h1v1h-1zM27 26h1v1h-1zM27 27h1v1h-1zM4 28h24v1h-24z",
        ],
        [
          "pixelGray",
          "M6 15h2v1h-2zM10 15h2v1h-2zM14 15h2v1h-2zM18 15h2v1h-2zM22 15h2v1h-2zM6 16h2v1h-2zM10 16h2v1h-2zM14 16h2v1h-2zM18 16h2v1h-2zM22 16h2v1h-2zM6 18h2v1h-2zM10 18h2v1h-2zM18 18h2v1h-2zM22 18h2v1h-2zM6 19h2v1h-2zM10 19h2v1h-2zM18 19h2v1h-2zM22 19h2v1h-2zM6 21h2v1h-2zM10 21h2v1h-2zM18 21h2v1h-2zM22 21h2v1h-2zM6 22h2v1h-2zM10 22h2v1h-2zM14 22h2v1h-2zM18 22h2v1h-2zM22 22h2v1h-2zM6 24h2v1h-2zM10 24h2v1h-2zM14 24h2v1h-2zM18 24h2v1h-2zM22 24h2v1h-2zM6 25h2v1h-2zM10 25h2v1h-2zM14 25h2v1h-2zM18 25h2v1h-2zM22 25h2v1h-2z",
        ],
        [
          "pixelNavy",
          "M13 17h5v1h-5zM13 18h3v1h-3zM17 18h1v1h-1zM13 19h3v1h-3zM17 19h1v1h-1zM13 20h1v1h-1zM17 20h1v1h-1zM13 21h5v1h-5z",
        ],
      ],
    },
  },
  trash: {
    16: {
      size: 16,
      paths: [
        [
          "pixelOutline",
          "M6 1h4v1h-4zM5 2h1v1h-1zM10 2h1v1h-1zM2 3h4v1h-4zM10 3h4v1h-4zM1 4h1v1h-1zM14 4h1v1h-1zM1 5h1v1h-1zM14 5h1v1h-1zM2 6h12v1h-12zM3 7h1v1h-1zM12 7h1v1h-1zM3 8h1v1h-1zM12 8h1v1h-1zM3 9h1v1h-1zM12 9h1v1h-1zM3 10h1v1h-1zM12 10h1v1h-1zM3 11h1v1h-1zM12 11h1v1h-1zM3 12h1v1h-1zM12 12h1v1h-1zM3 13h1v1h-1zM12 13h1v1h-1zM4 14h2v1h-2zM10 14h2v1h-2zM6 15h4v1h-4z",
        ],
        ["pixelWhite", "M6 2h4v1h-4zM3 4h10v1h-10z"],
        [
          "pixelSilver",
          "M6 3h4v1h-4zM2 4h1v1h-1zM13 4h1v1h-1zM2 5h12v1h-12zM4 10h8v1h-8zM6 14h4v1h-4z",
        ],
        [
          "pixelCyan",
          "M4 7h1v1h-1zM4 8h1v1h-1zM4 9h1v1h-1zM4 11h1v1h-1zM4 12h1v1h-1zM4 13h1v1h-1z",
        ],
        [
          "pixelBlue",
          "M5 7h6v1h-6zM5 8h6v1h-6zM5 9h6v1h-6zM5 11h6v1h-6zM5 12h6v1h-6zM5 13h6v1h-6z",
        ],
        [
          "pixelNavy",
          "M11 7h1v1h-1zM11 8h1v1h-1zM11 9h1v1h-1zM11 11h1v1h-1zM11 12h1v1h-1zM11 13h1v1h-1z",
        ],
      ],
    },
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M14 2h4v1h-4zM13 3h1v1h-1zM18 3h1v1h-1zM13 4h1v1h-1zM18 4h1v1h-1zM9 5h5v1h-5zM18 5h5v1h-5zM8 6h1v1h-1zM23 6h1v1h-1zM5 7h4v1h-4zM23 7h4v1h-4zM4 8h1v1h-1zM27 8h1v1h-1zM4 9h1v1h-1zM27 9h1v1h-1zM4 10h1v1h-1zM27 10h1v1h-1zM4 11h1v1h-1zM27 11h1v1h-1zM5 12h22v1h-22zM7 13h1v1h-1zM24 13h1v1h-1zM7 14h1v1h-1zM24 14h1v1h-1zM7 15h1v1h-1zM24 15h1v1h-1zM7 16h1v1h-1zM24 16h1v1h-1zM7 17h1v1h-1zM24 17h1v1h-1zM7 18h1v1h-1zM24 18h1v1h-1zM7 19h1v1h-1zM24 19h1v1h-1zM7 20h1v1h-1zM24 20h1v1h-1zM7 21h1v1h-1zM24 21h1v1h-1zM7 22h1v1h-1zM24 22h1v1h-1zM7 23h1v1h-1zM24 23h1v1h-1zM7 24h1v1h-1zM24 24h1v1h-1zM7 25h1v1h-1zM24 25h1v1h-1zM7 26h1v1h-1zM24 26h1v1h-1zM7 27h1v1h-1zM24 27h1v1h-1zM7 28h1v1h-1zM24 28h1v1h-1zM8 29h4v1h-4zM20 29h4v1h-4zM11 30h1v1h-1zM20 30h1v1h-1zM12 31h8v1h-8z",
        ],
        [
          "pixelGray",
          "M14 3h1v1h-1zM17 3h1v1h-1zM14 4h4v1h-4zM14 5h4v1h-4zM26 9h1v1h-1zM26 10h1v1h-1zM6 11h21v1h-21zM8 17h16v1h-16zM8 26h16v1h-16zM12 30h8v1h-8z",
        ],
        [
          "pixelSilver",
          "M15 3h2v1h-2zM9 7h14v1h-14zM26 8h1v1h-1zM6 9h20v1h-20zM6 10h20v1h-20zM8 16h16v1h-16zM8 25h16v1h-16z",
        ],
        [
          "pixelWhite",
          "M9 6h14v1h-14zM5 8h21v1h-21zM5 9h1v1h-1zM5 10h1v1h-1zM5 11h1v1h-1zM12 29h8v1h-8z",
        ],
        [
          "pixelBlue",
          "M8 13h1v1h-1zM11 13h11v1h-11zM8 14h1v1h-1zM11 14h11v1h-11zM8 15h1v1h-1zM11 15h11v1h-11zM8 18h1v1h-1zM11 18h11v1h-11zM8 19h1v1h-1zM11 19h11v1h-11zM8 20h1v1h-1zM11 20h11v1h-11zM8 21h1v1h-1zM11 21h11v1h-11zM8 22h1v1h-1zM11 22h11v1h-11zM8 23h1v1h-1zM11 23h11v1h-11zM8 24h1v1h-1zM11 24h11v1h-11zM8 27h1v1h-1zM11 27h11v1h-11zM8 28h14v1h-14z",
        ],
        [
          "pixelCyan",
          "M9 13h2v1h-2zM9 14h2v1h-2zM9 15h2v1h-2zM9 18h2v1h-2zM9 19h2v1h-2zM9 20h2v1h-2zM9 21h2v1h-2zM9 22h2v1h-2zM9 23h2v1h-2zM9 24h2v1h-2zM9 27h2v1h-2z",
        ],
        [
          "pixelNavy",
          "M22 13h2v1h-2zM22 14h2v1h-2zM22 15h2v1h-2zM22 18h2v1h-2zM22 19h2v1h-2zM22 20h2v1h-2zM22 21h2v1h-2zM22 22h2v1h-2zM22 23h2v1h-2zM22 24h2v1h-2zM22 27h2v1h-2zM22 28h2v1h-2z",
        ],
      ],
    },
  },
  warning: {
    32: {
      size: 32,
      paths: [
        [
          "pixelOutline",
          "M15 1h2v1h-2zM14 2h1v1h-1zM17 2h1v1h-1zM14 3h1v1h-1zM17 3h1v1h-1zM13 4h1v1h-1zM18 4h1v1h-1zM13 5h1v1h-1zM18 5h1v1h-1zM12 6h1v1h-1zM19 6h1v1h-1zM12 7h1v1h-1zM19 7h1v1h-1zM11 8h1v1h-1zM20 8h1v1h-1zM11 9h1v1h-1zM20 9h1v1h-1zM10 10h1v1h-1zM21 10h1v1h-1zM9 11h1v1h-1zM22 11h1v1h-1zM9 12h1v1h-1zM22 12h1v1h-1zM8 13h1v1h-1zM23 13h1v1h-1zM8 14h1v1h-1zM23 14h1v1h-1zM7 15h1v1h-1zM24 15h1v1h-1zM7 16h1v1h-1zM24 16h1v1h-1zM6 17h1v1h-1zM25 17h1v1h-1zM6 18h1v1h-1zM25 18h1v1h-1zM5 19h1v1h-1zM26 19h1v1h-1zM5 20h1v1h-1zM26 20h1v1h-1zM4 21h1v1h-1zM27 21h1v1h-1zM4 22h1v1h-1zM27 22h1v1h-1zM3 23h1v1h-1zM28 23h1v1h-1zM3 24h1v1h-1zM28 24h1v1h-1zM2 25h1v1h-1zM29 25h1v1h-1zM2 26h1v1h-1zM29 26h1v1h-1zM1 27h1v1h-1zM30 27h1v1h-1zM1 28h1v1h-1zM30 28h1v1h-1zM2 29h28v1h-28z",
        ],
        [
          "pixelYellow",
          "M15 2h2v1h-2zM15 3h2v1h-2zM14 4h4v1h-4zM14 5h4v1h-4zM13 6h6v1h-6zM13 7h6v1h-6zM12 8h8v1h-8zM12 9h8v1h-8zM11 10h4v1h-4zM17 10h4v1h-4zM10 11h5v1h-5zM17 11h5v1h-5zM10 12h5v1h-5zM17 12h5v1h-5zM9 13h6v1h-6zM17 13h6v1h-6zM9 14h6v1h-6zM17 14h6v1h-6zM8 15h7v1h-7zM17 15h7v1h-7zM8 16h7v1h-7zM17 16h7v1h-7zM7 17h8v1h-8zM17 17h8v1h-8zM7 18h8v1h-8zM17 18h8v1h-8zM6 19h9v1h-9zM17 19h9v1h-9zM6 20h9v1h-9zM17 20h9v1h-9zM5 21h10v1h-10zM17 21h10v1h-10zM5 22h22v1h-22zM4 23h24v1h-24zM4 24h11v1h-11zM17 24h11v1h-11zM3 25h12v1h-12zM17 25h12v1h-12zM3 26h10v1h-10zM27 26h2v1h-2zM2 27h6v1h-6zM28 27h2v1h-2zM2 28h28v1h-28z",
        ],
        [
          "pixelBlack",
          "M15 10h2v1h-2zM15 11h2v1h-2zM15 12h2v1h-2zM15 13h2v1h-2zM15 14h2v1h-2zM15 15h2v1h-2zM15 16h2v1h-2zM15 17h2v1h-2zM15 18h2v1h-2zM15 19h2v1h-2zM15 20h2v1h-2zM15 21h2v1h-2zM15 24h2v1h-2zM15 25h2v1h-2z",
        ],
        ["pixelOlive", "M13 26h14v1h-14zM8 27h20v1h-20z"],
      ],
    },
  },
};
