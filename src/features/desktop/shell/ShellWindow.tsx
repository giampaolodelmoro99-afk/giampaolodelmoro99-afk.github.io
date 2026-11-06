import { Glyph, Icon } from "../../../components/Icon";
import { cx } from "../../../components/cx";
import windowStyles from "../../../components/Window/Window.module.css";
import windowMenuStyles from "../../../components/WindowMenu/WindowMenu.module.css";
import { useT } from "../../../i18n";
import type { AppId } from "../../../routes/routeMap";
import { appDefinition } from "../apps";
import { AppContent } from "../content/AppContent";
import styles from "../Desktop.module.css";
import { desktopIconsId, windowBodyId, windowTitleId } from "../ids";

export function ShellWindow({ app }: { app: AppId }) {
  const t = useT();
  const { icon, variant } = appDefinition(app);
  return (
    <section
      aria-labelledby={windowTitleId(app)}
      className={cx(windowStyles.root, styles.window)}
      data-active="true"
      data-variant={variant}
    >
      <header className={windowStyles.titlebar}>
        <span className={windowMenuStyles.trigger} aria-hidden="true" data-window-menu="">
          <Icon name={icon} size={16} />
        </span>
        <span id={windowTitleId(app)} className={windowStyles.title}>
          {t.apps[app]}
        </span>
        <span className={windowStyles.controls}>
          {(["minimize", "maximize"] as const).map((control) => (
            <span
              key={control}
              className={windowStyles.control}
              data-window-control={control}
              aria-hidden="true"
            >
              <Glyph name={control} />
            </span>
          ))}
          <a
            href={`#${desktopIconsId}`}
            aria-label={t.desktop.closeApp.replace("{app}", t.apps[app])}
            className={cx(windowStyles.control, windowStyles.close)}
            data-window-control="close"
          >
            <Glyph name="close" />
          </a>
        </span>
      </header>
      <div
        id={windowBodyId(app)}
        tabIndex={-1}
        data-focus-key={`body-${app}`}
        className={cx(
          windowStyles.body,
          variant === "document" && windowStyles.document,
          styles.windowBody,
        )}
      >
        <AppContent app={app} headingLevel={1} />
      </div>
    </section>
  );
}
