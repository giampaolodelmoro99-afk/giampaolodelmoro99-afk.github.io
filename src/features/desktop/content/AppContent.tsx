import { Link } from "react-router";
import { githubUrl, personName } from "../../../config/site";
import { useLocale, useT } from "../../../i18n";
import { type AppId, routeMap } from "../../../routes/routeMap";
import styles from "./AppContent.module.css";

export type HeadingLevel = 1 | 2;

export type AppContentProps = {
  app: AppId;
  headingLevel: HeadingLevel;
};

const headings = { 1: ["h1", "h2"], 2: ["h2", "h3"] } as const;

export function AppContent({ app, headingLevel }: AppContentProps) {
  const t = useT();
  const locale = useLocale();
  const [Heading, Subheading] = headings[headingLevel];

  if (app !== "about") {
    return (
      <>
        <Heading className={styles.heading}>{t.apps[app]}</Heading>
        <p className={styles.placeholder}>{t.desktop.placeholder}</p>
      </>
    );
  }

  const next = [
    { label: t.about.links.projects, to: routeMap.projects[locale] },
    { label: t.about.links.cv, to: routeMap.cv[locale] },
    { label: t.about.links.contacts, to: routeMap.contacts[locale] },
  ];

  return (
    <>
      <Heading className={styles.heading}>{personName}</Heading>
      <p className={styles.subtitle}>{t.person.jobTitle}</p>
      <p>{t.about.bio}</p>
      <Subheading className={styles.subheading}>{t.about.nextHeading}</Subheading>
      <ul className={styles.links} aria-label={t.about.nextLabel}>
        {next.map(({ label, to }) => (
          <li key={to}>
            <Link to={to}>{label}</Link>
          </li>
        ))}
        <li>
          <a href={githubUrl} rel="me noopener">
            {t.about.links.github}
          </a>
        </li>
      </ul>
    </>
  );
}
