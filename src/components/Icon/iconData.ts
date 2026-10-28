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
  power: [16, 32],
  privacy: [16, 32],
  projects: [16, 32],
  run: [16, 32],
  simpleview: [16, 32],
  skills: [16, 32],
  terminal: [16, 32],
  timeline: [16, 32],
  trash: [16, 32],
  warning: [32],
  windows: [16, 32],
} as const;

export type IconName = keyof typeof iconSizes;

export type IconSize<Name extends IconName> = (typeof iconSizes)[Name][number];

export const iconNames: readonly IconName[] = [
  "about",
  "contacts",
  "controlpanel",
  "cv",
  "error",
  "gdm",
  "info",
  "makingof",
  "minefield",
  "power",
  "privacy",
  "projects",
  "run",
  "simpleview",
  "skills",
  "terminal",
  "timeline",
  "trash",
  "warning",
  "windows",
];
