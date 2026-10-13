import { type ReactNode, useLayoutEffect } from "react";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { intlLocales, locales } from "../src/routes/routeMap";

export type Settings = {
  theme: string;
  font: string;
  input: string;
  motion: string;
  textSize: string;
  locale: string;
};

function applySettings({ theme, font, input, motion, textSize, locale }: Settings) {
  const html = document.documentElement;
  html.dataset["theme"] = theme;
  for (const [name, value] of Object.entries({ font, input, motion })) {
    if (value === "auto") delete html.dataset[name];
    else html.dataset[name] = value;
  }
  html.style.setProperty("--font-size-root", textSize);
  html.lang = locale;
}

export function SettingsFrame({ settings, children }: { settings: Settings; children: ReactNode }) {
  useLayoutEffect(() => applySettings(settings));
  const locale = locales.find((candidate) => candidate === settings.locale) ?? locales[0];
  return <I18nProvider locale={intlLocales[locale]}>{children}</I18nProvider>;
}
