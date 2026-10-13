import { Link } from "react-router";
import { useLocale, useT } from "../../i18n";
import { locales, routeMap } from "../../routes/routeMap";
import styles from "./Desktop.module.css";

export function Desktop() {
  const t = useT();
  const locale = useLocale();
  const otherLocale = locales.find((candidate) => candidate !== locale) ?? locale;

  return (
    <main className={styles.desktop}>
      <h1 className={styles.heading}>{t.desktop.heading}</h1>
      <p className={styles.tagline}>{t.desktop.tagline}</p>
      <nav aria-label={t.desktop.languageNavLabel}>
        <Link
          className={styles.languageLink}
          to={routeMap.desktop[otherLocale]}
          hrefLang={otherLocale}
          lang={otherLocale}
        >
          {t.desktop.switchLanguage}
        </Link>
      </nav>
    </main>
  );
}
