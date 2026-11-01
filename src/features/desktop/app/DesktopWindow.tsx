import { useEffect, useRef, useState } from "react";
import { ResizeHandles } from "../../../components/ResizeHandles";
import { Window } from "../../../components/Window";
import { WindowMenu, type WindowMenuAction } from "../../../components/WindowMenu";
import { cx } from "../../../components/cx";
import { useT } from "../../../i18n";
import type { AppId } from "../../../routes/routeMap";
import type { Edge, WindowState } from "../../../stores/desktop";
import { appDefinition } from "../apps";
import { AppContent, type HeadingLevel } from "../content/AppContent";
import styles from "../Desktop.module.css";
import { windowBodyId, windowTitleId } from "../ids";

export type WindowExit = "close" | "minimize";

export type DesktopWindowProps = {
  window: WindowState;
  animateIn: boolean;
  exit: WindowExit | null;
  onExited: () => void;
  zIndex: number;
  isActive: boolean;
  isResizing: boolean;
  headingLevel: HeadingLevel;
  onActivate: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onToggleMaximize: (id: AppId) => void;
  onClose: (id: AppId) => void;
  onGestureStart: (id: AppId, edge: Edge | null, event: PointerEvent, frame: Element) => void;
  isMenuOpen: boolean;
  onMenuOpenChange: (id: AppId, isOpen: boolean) => void;
  onMenuAction: (id: AppId, action: WindowMenuAction, frame: Element | null) => void;
};

export function DesktopWindow({
  window,
  animateIn,
  exit,
  onExited,
  zIndex,
  isActive,
  isResizing,
  headingLevel,
  onActivate,
  onMinimize,
  onToggleMaximize,
  onClose,
  onGestureStart,
  isMenuOpen,
  onMenuOpenChange,
  onMenuAction,
}: DesktopWindowProps) {
  const frame = useRef<HTMLElement | null>(null);
  const t = useT();
  const { id, geometry, maximized, cascade } = window;
  const { icon, variant } = appDefinition(id);
  const [titleBar, setTitleBar] = useState<HTMLElement | null>(null);
  const [enters] = useState(animateIn);

  useEffect(() => {
    const element = frame.current;
    if (!exit || !element) return undefined;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onExited();
    };
    const style = getComputedStyle(element);
    const exitAnimation = style.animationName;
    const onEnd = (event: AnimationEvent) => {
      if (event.target === element && event.animationName === exitAnimation) finish();
    };
    const seconds = Number.parseFloat(style.animationDuration);
    const timer = setTimeout(finish, (Number.isFinite(seconds) ? seconds * 1000 : 0) + 100);
    element.addEventListener("animationend", onEnd);
    return () => {
      clearTimeout(timer);
      element.removeEventListener("animationend", onEnd);
    };
  }, [exit, onExited]);

  useEffect(() => {
    if (!titleBar) return undefined;
    const onButton = (event: Event) =>
      event.target instanceof Element && event.target.closest("button") !== null;
    const onPointerDown = (event: PointerEvent) => {
      if (maximized || !frame.current || onButton(event)) return;
      onGestureStart(id, null, event, frame.current);
    };
    const onDoubleClick = (event: MouseEvent) => {
      if (!onButton(event)) onToggleMaximize(id);
    };
    titleBar.addEventListener("pointerdown", onPointerDown);
    titleBar.addEventListener("dblclick", onDoubleClick);
    return () => {
      titleBar.removeEventListener("pointerdown", onPointerDown);
      titleBar.removeEventListener("dblclick", onDoubleClick);
    };
  }, [titleBar, maximized, id, onGestureStart, onToggleMaximize]);

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
      isBodyInert={!isActive || exit !== null}
      onActivate={() => onActivate(id)}
      onMinimize={() => onMinimize(id)}
      onToggleMaximize={() => onToggleMaximize(id)}
      onClose={() => onClose(id)}
      titleBarRef={setTitleBar}
      windowMenu={
        <WindowMenu
          icon={icon}
          isMaximized={maximized}
          isOpen={isMenuOpen}
          onOpenChange={(isOpen) => onMenuOpenChange(id, isOpen)}
          onAction={(action) => onMenuAction(id, action, frame.current)}
        />
      }
      overlay={
        maximized ? null : (
          <ResizeHandles
            isResizing={isResizing}
            className={styles.resizeHandles}
            onResizeStart={(edge, event) => {
              if (frame.current) onGestureStart(id, edge, event, frame.current);
            }}
          />
        )
      }
      frameRef={(element) => {
        frame.current = element;
      }}
      bodyId={windowBodyId(id)}
      bodyClassName={styles.windowBody}
      className={cx(
        styles.window,
        geometry && styles.placed,
        enters && !exit && styles.entering,
        exit === "close" && styles.closing,
        exit === "minimize" && styles.minimizing,
      )}
      style={{ "--window-z": zIndex, "--window-cascade": cascade, ...placement }}
    >
      <AppContent app={id} headingLevel={headingLevel} />
    </Window>
  );
}
