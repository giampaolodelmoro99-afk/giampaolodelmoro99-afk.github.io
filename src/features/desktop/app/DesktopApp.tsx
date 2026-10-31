import { type Key, useEffect, useRef, useState } from "react";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { Link } from "react-router";
import { useStore } from "zustand";
import { Button } from "../../../components/Button";
import buttonStyles from "../../../components/Button/Button.module.css";
import { DesktopIcons } from "../../../components/DesktopIcon";
import { DragOutline } from "../../../components/DragOutline";
import { MoveControls } from "../../../components/MoveControls";
import type { WindowMenuAction } from "../../../components/WindowMenu";
import { MenuItem } from "../../../components/MenuBar";
import { StartButton } from "../../../components/StartButton";
import { Taskbar, TaskbarButton } from "../../../components/TaskbarButton";
import { cx } from "../../../components/cx";
import { getDictionary, useLocale, useT } from "../../../i18n";
import {
  type AppId,
  type RouteKey,
  appIds,
  intlLocales,
  locales,
  routeMap,
} from "../../../routes/routeMap";
import {
  type DesktopStore,
  createDesktopStore,
  initialStateFor,
  openAppFor,
} from "../../../stores/desktop";
import { apps, appDefinition, desktopApps } from "../apps";
import styles from "../Desktop.module.css";
import { desktopIconsId, taskbarButtonId, windowBodyId } from "../ids";
import { DesktopWindow } from "./DesktopWindow";
import { isTextEntry, matchShortcut } from "../shortcuts";
import { useAnnouncer } from "./Announcer";
import { useKeyboardGesture } from "./useKeyboardGesture";
import { useWindowGestures, windowRect } from "./useWindowGestures";
import { useWorkspaceViewport } from "./useWorkspaceViewport";
import { Clock } from "./Clock";

export type DesktopAppProps = {
  routeKey: RouteKey;
  onReady?: () => void;
};

const isAppId = (key: Key): key is AppId => appIds.some((id) => id === key);

function useIconsReady(onReady: (() => void) | undefined) {
  const [area, setArea] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!area || !onReady) return undefined;
    let frame = 0;
    const check = () => {
      if (area.querySelector("[role=row]")) onReady();
      else frame = requestAnimationFrame(check);
    };
    check();
    return () => cancelAnimationFrame(frame);
  }, [area, onReady]);
  return setArea;
}

const isDesktopLayout = () => window.matchMedia("(width >= 768px)").matches;

function useDesktopStore(routeKey: RouteKey): DesktopStore {
  const [store] = useState(() => createDesktopStore(initialStateFor(routeKey)));
  return store;
}

export function DesktopApp(props: DesktopAppProps) {
  return (
    <I18nProvider locale={intlLocales[useLocale()]}>
      <DesktopScreen {...props} />
    </I18nProvider>
  );
}

function DesktopScreen({ routeKey, onReady }: DesktopAppProps) {
  const t = useT();
  const locale = useLocale();
  const other = locales.find((candidate) => candidate !== locale) ?? locale;
  const store = useDesktopStore(routeKey);
  const routeApp = openAppFor(routeKey);
  const windows = useStore(store, (state) => state.windows);
  const stack = useStore(store, (state) => state.stack);
  const activeId = useStore(store, (state) => state.activeId);
  const { open, close, focus, minimize, toggleMaximize, setViewport } = store.getState();
  const [workspace, setWorkspace] = useState<HTMLElement | null>(null);
  const { workspaceRef, metricsRef } = useWorkspaceViewport(setViewport);
  const { announce, region } = useAnnouncer();
  const [menuOpenFor, setMenuOpenFor] = useState<AppId | null>(null);
  const controls = useRef<HTMLDivElement | null>(null);
  const appName = (id: AppId, text: string) => text.replace("{app}", t.apps[id]);
  const keyboard = useKeyboardGesture({
    viewport: () => store.getState().viewport,
    isOutside: (target) => !controls.current?.contains(target),
    onConfirm: ({ id, kind, current }) => {
      store.getState().place(id, current);
      announce(
        appName(id, kind === "move" ? t.desktop.announce.moved : t.desktop.announce.resized),
      );
      setFocusRequest({ target: windowBodyId(id) });
    },
    onCancel: ({ id }) => {
      announce(t.desktop.announce.cancelled);
      setFocusRequest({ target: windowBodyId(id) });
    },
  });
  const gestures = useWindowGestures({
    workspace,
    viewport: () => store.getState().viewport,
    isEnabled: isDesktopLayout,
    onPlace: store.getState().place,
  });
  const [focusRequest, setFocusRequest] = useState<{ target: string } | null>(null);

  const iconsReady = useIconsReady(onReady);

  useEffect(() => {
    if (!focusRequest) return;
    const element = document.getElementById(focusRequest.target);
    const focusable = element?.matches("[role=grid]")
      ? element.querySelector<HTMLElement>("[role=row]")
      : element;
    focusable?.focus();
  }, [focusRequest]);

  const openApp = (id: Key) => {
    if (!isAppId(id)) return;
    if (!store.getState().windows[id]) announce(appName(id, t.desktop.announce.opened));
    open(id);
    setFocusRequest({ target: windowBodyId(id) });
  };

  const minimizeApp = (id: AppId) => {
    minimize(id);
    announce(appName(id, t.desktop.announce.minimized));
    setFocusRequest({ target: taskbarButtonId(id) });
  };

  const pressTaskbarButton = (id: AppId) => {
    if (id === store.getState().activeId) minimizeApp(id);
    else openApp(id);
  };

  const closeApp = (id: AppId) => {
    close(id);
    announce(appName(id, t.desktop.announce.closed));
    const next = store.getState().activeId;
    setFocusRequest({ target: next ? windowBodyId(next) : desktopIconsId });
  };

  const menuAction = (id: AppId, action: WindowMenuAction, frame: Element | null) => {
    if (action === "restore" || action === "maximize") toggleMaximize(id);
    else if (action === "minimize") minimizeApp(id);
    else if (action === "close") closeApp(id);
    else if (frame && workspace) {
      keyboard.start(id, action, windowRect(frame, workspace));
      announce(
        appName(
          id,
          action === "move" ? t.desktop.announce.moveStart : t.desktop.announce.resizeStart,
        ),
      );
    }
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTextEntry(event.target)) return;
      const action = matchShortcut(event);
      const active = store.getState().activeId;
      if (action !== "windowMenu" || !active) return;
      event.preventDefault();
      setMenuOpenFor(active);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [store]);

  const outline = gestures.outline ?? keyboard.gesture?.current ?? null;

  const skipTarget = activeId ? windowBodyId(activeId) : desktopIconsId;

  return (
    <div className={styles.screen}>
      <a
        href={`#${skipTarget}`}
        className={cx(buttonStyles.root, styles.skipLink)}
        data-focus-key="skip"
      >
        {t.desktop.skipLink}
      </a>
      <main
        className={styles.workspace}
        ref={(element) => {
          workspaceRef(element);
          setWorkspace(element);
        }}
      >
        <div className={styles.metrics} ref={metricsRef} aria-hidden="true">
          <span data-metric="window" />
          <span data-metric="titlebar" />
        </div>
        <div className={styles.iconArea} ref={iconsReady}>
          <DesktopIcons
            id={desktopIconsId}
            label={t.desktop.iconsLabel}
            items={desktopApps.map((app) => ({
              id: app.id,
              label: t.apps[app.id],
              icon: app.icon,
            }))}
            onAction={openApp}
            className={styles.icons}
          />
        </div>
        {Object.values(windows).map((window) =>
          window.minimized ? null : (
            <DesktopWindow
              key={window.id}
              window={window}
              zIndex={stack.indexOf(window.id)}
              isActive={window.id === activeId}
              isResizing={gestures.resizing === window.id}
              headingLevel={window.id === routeApp ? 1 : 2}
              onActivate={focus}
              onMinimize={minimizeApp}
              onToggleMaximize={toggleMaximize}
              onClose={closeApp}
              isMenuOpen={menuOpenFor === window.id}
              onMenuOpenChange={(id, isOpen) => setMenuOpenFor(isOpen ? id : null)}
              onMenuAction={menuAction}
              onGestureStart={(id, edge, event, frame) => {
                focus(id);
                gestures.start(id, edge, event, frame);
              }}
            />
          ),
        )}
        {outline && <DragOutline rect={outline} />}
        {keyboard.gesture && (
          <div ref={controls} className={styles.moveControls}>
            <MoveControls
              onStep={(direction) => keyboard.step(direction)}
              onConfirm={keyboard.confirm}
              onCancel={keyboard.cancel}
            />
          </div>
        )}
        {region}
      </main>
      <Taskbar
        label={t.desktop.taskbarLabel}
        className={styles.taskbar}
        tray={
          <>
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
            <Clock className={styles.clock} />
          </>
        }
      >
        <StartButton onAction={openApp} className={styles.start}>
          {apps.map((app) => (
            <MenuItem key={app.id} id={app.id} icon={app.icon}>
              {t.apps[app.id]}
            </MenuItem>
          ))}
        </StartButton>
        <Button icon="windows" aria-label={t.desktop.windowsButton} isDisabled />
        {Object.values(windows).map(({ id, minimized }) => (
          <TaskbarButton
            key={id}
            id={taskbarButtonId(id)}
            icon={appDefinition(id).icon}
            isSelected={id === activeId}
            onChange={() => pressTaskbarButton(id)}
            {...(minimized ? { "aria-label": `${t.apps[id]}, ${t.desktop.minimizedSuffix}` } : {})}
          >
            {t.apps[id]}
          </TaskbarButton>
        ))}
      </Taskbar>
    </div>
  );
}
