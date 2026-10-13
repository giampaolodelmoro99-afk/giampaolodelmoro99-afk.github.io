import { Link } from "react-router";
import { getDictionary, useLocale, useT } from "../../i18n";
import { locales, routeMap } from "../../routes/routeMap";
import styles from "./Desktop.module.css";

export function Desktop() {
  const t = useT();
  const locale = useLocale();
  const otherLocales = locales.filter((candidate) => candidate !== locale);

  return (
    <main className={styles.desktop}>
      <h1 className={styles.heading}>{t.desktop.heading}</h1>
      <p className={styles.tagline}>{t.desktop.tagline}</p>
      <nav aria-label={t.desktop.languageNavLabel}>
        {otherLocales.map((other) => (
          <Link
            key={other}
            className={styles.languageLink}
            to={routeMap.desktop[other]}
            hrefLang={other}
            lang={other}
          >
            {getDictionary(other).desktop.languageName}
          </Link>
        ))}
      </nav>
    </main>
  );
}
