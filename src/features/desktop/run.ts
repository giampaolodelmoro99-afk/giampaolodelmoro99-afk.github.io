import { getDictionary } from "../../i18n";
import { type AppId, appIds, locales, routeMap } from "../../routes/routeMap";

export function normalizeCommand(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/[^\p{Letter}\p{Number} ]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function namesOf(id: AppId): string[] {
  return locales.flatMap((locale) => {
    const slug = routeMap[id][locale].split("/").findLast((segment) => segment !== "") ?? "";
    return [getDictionary(locale).apps[id], slug, id];
  });
}

export function resolveCommand(text: string): AppId | null {
  const command = normalizeCommand(text);
  if (command === "") return null;
  return (
    appIds.find((id) => namesOf(id).some((name) => normalizeCommand(name) === command)) ?? null
  );
}
