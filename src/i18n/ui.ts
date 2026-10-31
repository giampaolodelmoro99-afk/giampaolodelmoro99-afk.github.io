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
  windowMenu: {
    label: "Menu della finestra",
    restore: "Ripristina",
    move: "Sposta",
    resize: "Ridimensiona",
    minimize: "Riduci a icona",
    maximize: "Ingrandisci",
    close: "Chiudi",
  },
  moveControls: {
    label: "Spostamento e ridimensionamento",
    up: "Su",
    down: "Giù",
    left: "Sinistra",
    right: "Destra",
    confirm: "OK",
    cancel: "Annulla",
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
  windowMenu: {
    label: "Window menu",
    restore: "Restore",
    move: "Move",
    resize: "Size",
    minimize: "Minimize",
    maximize: "Maximize",
    close: "Close",
  },
  moveControls: {
    label: "Move and resize",
    up: "Up",
    down: "Down",
    left: "Left",
    right: "Right",
    confirm: "OK",
    cancel: "Cancel",
  },
};

export const uiStrings: Record<Locale, UiStrings> = { it, en };
