import type { SmallIconName } from "../../components/Icon";
import type { AppId } from "../../routes/routeMap";

export type AppDefinition = {
  id: AppId;
  icon: SmallIconName;
  onDesktop: boolean;
  variant: "app" | "document";
};

export const apps: readonly AppDefinition[] = [
  { id: "about", icon: "about", onDesktop: true, variant: "document" },
  { id: "projects", icon: "projects", onDesktop: true, variant: "document" },
  { id: "cv", icon: "cv", onDesktop: true, variant: "document" },
  { id: "contacts", icon: "contacts", onDesktop: true, variant: "document" },
  { id: "simpleView", icon: "simpleview", onDesktop: true, variant: "document" },
  { id: "skills", icon: "skills", onDesktop: true, variant: "document" },
  { id: "timeline", icon: "timeline", onDesktop: true, variant: "document" },
  { id: "makingOf", icon: "makingof", onDesktop: true, variant: "document" },
  { id: "terminal", icon: "terminal", onDesktop: true, variant: "app" },
  { id: "minefield", icon: "minefield", onDesktop: true, variant: "app" },
  { id: "trash", icon: "trash", onDesktop: true, variant: "app" },
  { id: "controlPanel", icon: "controlpanel", onDesktop: false, variant: "app" },
  { id: "privacy", icon: "privacy", onDesktop: false, variant: "document" },
];

export const desktopApps = apps.filter((app) => app.onDesktop);

export function appDefinition(id: AppId): AppDefinition {
  const app = apps.find((candidate) => candidate.id === id);
  if (!app) throw new Error(`app sconosciuta: ${id}`);
  return app;
}

export const startMenuApps: readonly AppId[] = [
  "about",
  "projects",
  "cv",
  "contacts",
  "skills",
  "timeline",
  "makingOf",
  "terminal",
  "minefield",
  "privacy",
];

export const startMenuSystemApps: readonly AppId[] = ["controlPanel", "simpleView"];
