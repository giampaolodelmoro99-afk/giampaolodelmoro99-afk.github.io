import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { describe, expect, it } from "vitest";
import { it as italian } from "../i18n/it";
import { en } from "../i18n/en";
import { useUiStrings } from "./useUiStrings";

const withLocale =
  (locale: string) =>
  ({ children }: { children: ReactNode }) => (
    <I18nProvider locale={locale}>{children}</I18nProvider>
  );

describe("useUiStrings", () => {
  it("sceglie i testi dalla lingua di React Aria", () => {
    expect(renderHook(useUiStrings, { wrapper: withLocale("en-US") }).result.current).toBe(en.ui);
    expect(renderHook(useUiStrings, { wrapper: withLocale("it-IT") }).result.current).toBe(
      italian.ui,
    );
  });

  it("usa l'italiano per le lingue non previste", () => {
    expect(renderHook(useUiStrings, { wrapper: withLocale("fr-FR") }).result.current).toBe(
      italian.ui,
    );
  });
});
