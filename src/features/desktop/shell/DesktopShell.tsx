import { Link } from "react-router";
import buttonStyles from "../../../components/Button/Button.module.css";
import iconStyles from "../../../components/DesktopIcon/DesktopIcons.module.css";
import { Icon } from "../../../components/Icon";
import startStyles from "../../../components/StartButton/StartButton.module.css";
import taskbarStyles from "../../../components/TaskbarButton/TaskbarButton.module.css";
import { cx } from "../../../components/cx";
import { getDictionary, useLocale, useT } from "../../../i18n";
import { type RouteKey, locales, routeMap } from "../../../routes/routeMap";
import { uiStrings } from "../../../i18n/ui";
import { openAppFor } from "../../../stores/desktop";
import { appDefinition, desktopApps } from "../apps";
import styles from "../Desktop.module.css";
import { desktopIconsId, windowBodyId } from "../ids";
import { ShellWindow } from "./ShellWindow";

export type DesktopShellProps = {
  routeKey: RouteKey;
};

export function DesktopShell({ routeKey }: DesktopShellProps) {
  const t = useT();
  const openApp = openAppFor(routeKey);
  const locale = useLocale();
  const other = locales.find((candidate) => candidate !== locale) ?? locale;
  const skipTarget = openApp ? windowBodyId(openApp) : desktopIconsId;

  return (
    <div className={styles.screen}>
      <a
        href={`#${skipTarget}`}
        className={cx(buttonStyles.root, styles.skipLink)}
        data-focus-key="skip"
      >
        {t.desktop.skipLink}
      </a>
      <main className={styles.workspace}>
        <nav aria-label={t.desktop.iconsLabel} className={styles.iconArea}>
          <ul id={desktopIconsId} tabIndex={-1} className={cx(iconStyles.grid, styles.icons)}>
            {desktopApps.map((app) => (
              <li key={app.id} className={styles.iconCell}>
                <Link
                  to={routeMap[app.id][locale]}
                  className={iconStyles.item}
                  data-focus-key={`icon-${app.id}`}
                >
                  <span className={iconStyles.image}>
                    <Icon name={app.icon} className={cx(iconStyles.icon)} />
                  </span>
                  <span className={iconStyles.label}>{t.apps[app.id]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {openApp && <ShellWindow app={openApp} />}
      </main>
      <div className={cx(taskbarStyles.taskbar, styles.taskbar)}>
        <div className={taskbarStyles.buttons} aria-hidden="true">
          <span className={cx(startStyles.root, styles.start)}>
            <Icon name="gdm" size={16} />
            <span>{uiStrings[locale].startButton.label}</span>
          </span>
          <span className={cx(buttonStyles.root, buttonStyles.iconOnly)} data-disabled="true">
            <Icon name="windows" size={16} />
          </span>
          {openApp && (
            <span className={taskbarStyles.root} data-selected="true">
              <span className={taskbarStyles.content}>
                <Icon
                  name={appDefinition(openApp).icon}
                  size={16}
                  className={cx(taskbarStyles.icon)}
                />
                <span className={taskbarStyles.label}>{t.apps[openApp]}</span>
              </span>
            </span>
          )}
        </div>
        <div className={taskbarStyles.tray}>
          <Link
            to={routeMap[routeKey][other]}
            hrefLang={other}
            lang={other}
            aria-label={getDictionary(other).desktop.languageName}
            className={styles.language}
            data-focus-key="language"
          >
            {getDictionary(other).desktop.languageShort}
          </Link>
          <span className={styles.clock} />
        </div>
      </div>
    </div>
  );
}
