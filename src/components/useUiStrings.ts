import { useLocale } from "react-aria-components/I18nProvider";
import { type Dictionary, getDictionary } from "../i18n";
import { defaultLocale, locales } from "../routes/routeMap";

export function useUiStrings(): Dictionary["ui"] {
  const { locale } = useLocale();
  const language = locales.find((candidate) => locale.split("-")[0] === candidate);
  return getDictionary(language ?? defaultLocale).ui;
}
