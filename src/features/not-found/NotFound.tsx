import { Link } from "react-router";
import { getDictionary } from "../../i18n";
import { routeMap } from "../../routes/routeMap";
import styles from "../desktop/Desktop.module.css";

export function NotFound() {
  const it = getDictionary("it");
  const en = getDictionary("en");

  return (
    <main className={styles.desktop}>
      <h1 className={styles.heading}>{it.notFound.heading}</h1>
      <p className={styles.tagline}>{it.notFound.message}</p>
      <p className={styles.tagline} lang="en">
        {en.notFound.message}
      </p>
      <nav aria-label={`${it.desktop.languageNavLabel} / ${en.desktop.languageNavLabel}`}>
        <Link className={styles.languageLink} to={routeMap.desktop.it}>
          {it.notFound.home}
        </Link>
        <Link className={styles.languageLink} to={routeMap.desktop.en} hrefLang="en" lang="en">
          {en.notFound.home}
        </Link>
      </nav>
    </main>
  );
}
