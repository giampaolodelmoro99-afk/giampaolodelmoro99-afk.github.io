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
  windowSwitcher: {
    label: "Finestre aperte",
  },
  shutdownDialog: {
    title: "Spegni",
    question: "Cosa vuoi fare?",
    shutdown: "Spegni",
    restart: "Riavvia",
    simpleView: "Passa alla Vista semplice",
    ok: "OK",
    cancel: "Annulla",
  },
  runDialog: {
    title: "Esegui",
    help: "Scrivi il nome di un'app e si aprirà in una finestra.",
    label: "Apri",
    suggestions: "Suggerimenti",
    ok: "OK",
    cancel: "Annulla",
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
  windowSwitcher: {
    label: "Open windows",
  },
  shutdownDialog: {
    title: "Shut down",
    question: "What do you want to do?",
    shutdown: "Shut down",
    restart: "Restart",
    simpleView: "Switch to Simple view",
    ok: "OK",
    cancel: "Cancel",
  },
  runDialog: {
    title: "Run",
    help: "Type the name of an app and it will open in a window.",
    label: "Open",
    suggestions: "Suggestions",
    ok: "OK",
    cancel: "Cancel",
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
