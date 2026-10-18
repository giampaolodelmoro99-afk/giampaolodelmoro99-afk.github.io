import { useLocale } from "react-aria-components/I18nProvider";
import { type UiStrings, uiStrings } from "../i18n/ui";
import { defaultLocale, locales } from "../routes/routeMap";

export function useUiStrings(): UiStrings {
  const { locale } = useLocale();
  const language = locales.find((candidate) => locale.split("-")[0] === candidate);
  return uiStrings[language ?? defaultLocale];
}
