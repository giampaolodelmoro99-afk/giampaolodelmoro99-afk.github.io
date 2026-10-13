import { Link } from "react-aria-components/Link";
import { AriaRouterProvider } from "../../components/AriaRouterProvider";
import { cx } from "../../components/cx";
import { getDictionary } from "../../i18n";
import { routeMap } from "../../routes/routeMap";
import styles from "../desktop/Desktop.module.css";

export function NotFound() {
  const it = getDictionary("it");
  const en = getDictionary("en");

  return (
    <AriaRouterProvider>
      <main className={styles.desktop}>
        <h1 className={styles.heading}>{it.notFound.heading}</h1>
        <p className={styles.tagline}>{it.notFound.message}</p>
        <p className={styles.tagline} lang="en">
          {en.notFound.message}
        </p>
        <nav aria-label={`${it.desktop.languageNavLabel} / ${en.desktop.languageNavLabel}`}>
          <Link className={cx(styles.languageLink)} href={routeMap.desktop.it}>
            {it.notFound.home}
          </Link>
          <Link
            className={cx(styles.languageLink)}
            href={routeMap.desktop.en}
            lang="en"
            render={({ children, ...props }) =>
              "href" in props ? (
                <a {...props} hrefLang="en">
                  {children}
                </a>
              ) : (
                <span {...props}>{children}</span>
              )
            }
          >
            {en.notFound.home}
          </Link>
        </nav>
      </main>
    </AriaRouterProvider>
  );
}
