import { useLocation } from "react-router";
import { type Locale, localeFromPathname } from "../routes/routeMap";
import { en } from "./en";
import { type Dictionary, it } from "./it";

const dictionaries: Record<Locale, Dictionary> = { it, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function useLocale(): Locale {
  return localeFromPathname(useLocation().pathname);
}

export function useT(): Dictionary {
  return getDictionary(useLocale());
}

export type { Dictionary };
