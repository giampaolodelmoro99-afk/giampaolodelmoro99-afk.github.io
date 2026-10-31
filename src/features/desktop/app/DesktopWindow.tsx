import { Window } from "../../../components/Window";
import { cx } from "../../../components/cx";
import { useT } from "../../../i18n";
import type { AppId } from "../../../routes/routeMap";
import type { WindowState } from "../../../stores/desktop";
import { appDefinition } from "../apps";
import { AppContent, type HeadingLevel } from "../content/AppContent";
import styles from "../Desktop.module.css";
import { windowBodyId, windowTitleId } from "../ids";

export type DesktopWindowProps = {
  window: WindowState;
  zIndex: number;
  isActive: boolean;
  headingLevel: HeadingLevel;
  onActivate: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onToggleMaximize: (id: AppId) => void;
  onClose: (id: AppId) => void;
};

export function DesktopWindow({
  window,
  zIndex,
  isActive,
  headingLevel,
  onActivate,
  onMinimize,
  onToggleMaximize,
  onClose,
}: DesktopWindowProps) {
  const t = useT();
  const { id, geometry, maximized, cascade } = window;
  const { icon, variant } = appDefinition(id);
  const placement = geometry
    ? {
        "--window-x": `${geometry.x}px`,
        "--window-y": `${geometry.y}px`,
        "--window-w": `${geometry.width}px`,
        "--window-h": `${geometry.height}px`,
      }
    : {};

  return (
    <Window
      title={t.apps[id]}
      titleId={windowTitleId(id)}
      icon={icon}
      variant={variant}
      isActive={isActive}
      isMaximized={maximized}
      isBodyInert={!isActive}
      onActivate={() => onActivate(id)}
      onMinimize={() => onMinimize(id)}
      onToggleMaximize={() => onToggleMaximize(id)}
      onClose={() => onClose(id)}
      bodyId={windowBodyId(id)}
      bodyClassName={styles.windowBody}
      className={cx(styles.window, geometry && styles.placed)}
      style={{ "--window-z": zIndex, "--window-cascade": cascade, ...placement }}
    >
      <AppContent app={id} headingLevel={headingLevel} />
    </Window>
  );
}
