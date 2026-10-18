import type { Locale } from "../routes/routeMap";

const it = {
  alertDialog: {
    warning: "Avviso",
    error: "Errore",
    info: "Informazione",
  },
  progressBar: {
    inProgress: "In corso…",
  },
  startButton: {
    label: "Start",
  },
  window: {
    minimize: "Riduci a icona",
    maximize: "Ingrandisci",
    restore: "Ripristina",
    close: "Chiudi",
  },
};

export type UiStrings = typeof it;

const en: UiStrings = {
  alertDialog: {
    warning: "Warning",
    error: "Error",
    info: "Information",
  },
  progressBar: {
    inProgress: "In progress…",
  },
  startButton: {
    label: "Start",
  },
  window: {
    minimize: "Minimize",
    maximize: "Maximize",
    restore: "Restore",
    close: "Close",
  },
};

export const uiStrings: Record<Locale, UiStrings> = { it, en };
