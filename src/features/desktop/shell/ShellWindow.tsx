import { Glyph, Icon } from "../../../components/Icon";
import { cx } from "../../../components/cx";
import windowStyles from "../../../components/Window/Window.module.css";
import { useT } from "../../../i18n";
import type { AppId } from "../../../routes/routeMap";
import { appDefinition } from "../apps";
import { AppContent } from "../content/AppContent";
import styles from "../Desktop.module.css";
import { windowBodyId, windowTitleId } from "../ids";

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
        <Icon name={icon} size={16} className={cx(windowStyles.titleIcon)} />
        <span id={windowTitleId(app)} className={windowStyles.title}>
          {t.apps[app]}
        </span>
        <span className={windowStyles.controls} aria-hidden="true">
          {(["minimize", "maximize", "close"] as const).map((control) => (
            <span
              key={control}
              className={cx(windowStyles.control, control === "close" && windowStyles.close)}
            >
              <Glyph name={control} />
            </span>
          ))}
        </span>
      </header>
      <div
        id={windowBodyId(app)}
        tabIndex={-1}
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
