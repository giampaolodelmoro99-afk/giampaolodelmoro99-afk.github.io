import {
  type Key,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { Link } from "react-router";
import { useStore } from "zustand";
import buttonStyles from "../../../components/Button/Button.module.css";
import { DesktopIcons } from "../../../components/DesktopIcon";
import { DragOutline } from "../../../components/DragOutline";
import { MoveControls } from "../../../components/MoveControls";
import type { ShutdownChoice } from "../../../components/ShutdownDialog";
import type { WindowMenuAction } from "../../../components/WindowMenu";
import { ContextMenu, MenuItem, MenuSeparator, Submenu } from "../../../components/MenuBar";
import { StartButton } from "../../../components/StartButton";
import { Taskbar, TaskbarButton, TaskbarIconButton } from "../../../components/TaskbarButton";
import { WindowSwitcher } from "../../../components/WindowSwitcher";
import { cx } from "../../../components/cx";
import { personName, siteUrl } from "../../../config/site";
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
  emptyState,
  openAppFor,
  readLayout,
  restore,
  serialize,
  writeLayout,
} from "../../../stores/desktop";
import { appDefinition, desktopApps, startMenuApps, startMenuSystemApps } from "../apps";
import styles from "../Desktop.module.css";
import { desktopIconsId, taskbarButtonId, windowBodyId } from "../ids";
import { ChunkBoundary } from "./ChunkBoundary";
import { DesktopWindow, type WindowExit } from "./DesktopWindow";
import { resolveCommand } from "../run";
import { isApplePlatform, isTextEntry, matchShortcut } from "../shortcuts";
import { ShortcutText } from "./ShortcutText";
import { useAnnouncer } from "./Announcer";
import { useDesktopContextMenu } from "./useDesktopContextMenu";
import { useKeyboardGesture } from "./useKeyboardGesture";
import { useWindowGestures, windowRect } from "./useWindowGestures";
import { useUrlSync } from "./useUrlSync";
import { useWorkspaceViewport } from "./useWorkspaceViewport";
import { Clock } from "./Clock";

export type DesktopAppProps = {
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

type Switcher = { selected: AppId; viaShortcut: boolean };

function bootFocus(store: DesktopStore): string {
  const active = store.getState().activeId;
  return active ? windowBodyId(active) : desktopIconsId;
}

function focusStart() {
  requestAnimationFrame(() => document.querySelector<HTMLElement>(`.${styles.start}`)?.focus());
}

const loadRunDialog = () => import("../../../components/RunDialog");
const loadShutdownDialog = () => import("../../../components/ShutdownDialog");
const loadFarewellScreen = () => import("../../../components/FarewellScreen");

const RunDialog = lazy(() => loadRunDialog().then((module) => ({ default: module.RunDialog })));

const ShutdownDialog = lazy(() =>
  loadShutdownDialog().then((module) => ({ default: module.ShutdownDialog })),
);

const FarewellScreen = lazy(() =>
  loadFarewellScreen().then((module) => ({ default: module.FarewellScreen })),
);

function usePrefetchDialogs() {
  useEffect(() => {
    const prefetch = () => {
      void Promise.all([loadRunDialog(), loadShutdownDialog(), loadFarewellScreen()]).catch(
        () => undefined,
      );
    };
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(prefetch);
      return () => window.cancelIdleCallback(handle);
    }
    const timer = window.setTimeout(prefetch, 1);
    return () => window.clearTimeout(timer);
  }, []);
}

type Power = "on" | "off" | "restarting";

type Boot = "first" | "resume" | "restart";

function initialState(boot: Boot, routeKey: RouteKey) {
  if (boot === "restart") return emptyState;
  if (boot === "resume") return readLayout() ?? emptyState;
  return restore(readLayout(), routeKey);
}

function useDesktopStore(routeKey: RouteKey, boot: Boot): DesktopStore {
  const [store] = useState(() => createDesktopStore(initialState(boot, routeKey)));
  return store;
}

function usePersistedLayout(store: DesktopStore) {
  useEffect(() => {
    let saved: string | null = null;
    let pending = 0;
    const save = () => {
      pending = 0;
      const state = store.getState();
      if (serialize(state) !== saved) saved = writeLayout(state) ?? saved;
    };
    const schedule = () => {
      if (pending === 0) pending = window.setTimeout(save, 200);
    };
    save();
    const unsubscribe = store.subscribe(schedule);
    window.addEventListener("pagehide", save);
    return () => {
      unsubscribe();
      window.removeEventListener("pagehide", save);
      if (pending !== 0) {
        window.clearTimeout(pending);
        save();
      }
    };
  }, [store]);
}

export function DesktopApp(props: DesktopAppProps) {
  return (
    <I18nProvider locale={intlLocales[useLocale()]}>
      <DesktopPower {...props} />
    </I18nProvider>
  );
}

function DesktopPower({ onReady }: DesktopAppProps) {
  const t = useT();
  usePrefetchDialogs();
  const [power, setPower] = useState<Power>("on");
  const [boot, setBoot] = useState<{ count: number; kind: Boot }>({ count: 0, kind: "first" });
  const turnOn = useCallback((kind: Boot) => {
    setBoot(({ count }) => ({ count: count + 1, kind }));
    setPower("on");
  }, []);
  const resume = useCallback(() => turnOn("resume"), [turnOn]);
  const restart = useCallback(() => turnOn("restart"), [turnOn]);

  useEffect(() => {
    if (power !== "off") return undefined;
    const previous = document.title;
    document.title = t.desktop.farewell.tabTitle.replace("{name}", personName);
    return () => {
      document.title = previous;
    };
  }, [power, t]);

  if (power === "restarting") return <PowerOff onDone={restart} />;
  if (power === "off") {
    return (
      <ChunkBoundary onError={resume}>
        <Suspense fallback={<div className={styles.powerOff} />}>
          <FarewellScreen
            heading={t.desktop.farewell.heading}
            message={t.desktop.farewell.message}
            restartLabel={t.desktop.farewell.restart}
            footer={new URL(siteUrl).host}
            onRestart={resume}
          />
        </Suspense>
      </ChunkBoundary>
    );
  }
  return (
    <DesktopScreen
      key={boot.count}
      boot={boot.kind}
      onPowerChange={setPower}
      {...(boot.kind === "first" && onReady ? { onReady } : {})}
    />
  );
}

function PowerOff({ onDone }: { onDone: () => void }) {
  const [screen, setScreen] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!screen) return undefined;
    const delay = Number.parseFloat(getComputedStyle(screen).getPropertyValue("--restart-delay"));
    const timer = window.setTimeout(onDone, Number.isFinite(delay) ? delay : 0);
    return () => window.clearTimeout(timer);
  }, [screen, onDone]);
  return <div ref={setScreen} className={styles.powerOff} />;
}

type DesktopScreenProps = DesktopAppProps & {
  boot: Boot;
  onPowerChange: (power: Power) => void;
};

function DesktopScreen({ onReady, boot, onPowerChange }: DesktopScreenProps) {
  const t = useT();
  const locale = useLocale();
  const other = locales.find((candidate) => candidate !== locale) ?? locale;
  const fromUrl = useRef<(key: RouteKey) => void>(() => undefined);
  const { routeKey, push, settle } = useUrlSync((key) => fromUrl.current(key));
  const store = useDesktopStore(routeKey, boot);
  usePersistedLayout(store);
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

  const [whenIconsReady] = useState(() =>
    boot === "first" ? onReady : () => setFocusRequest({ target: bootFocus(store) }),
  );
  const iconsReady = useIconsReady(whenIconsReady);

  useEffect(() => {
    if (!focusRequest) return;
    const element = document.getElementById(focusRequest.target);
    const focusable = element?.matches("[role=grid]")
      ? element.querySelector<HTMLElement>("[role=row]")
      : element;
    focusable?.focus();
  }, [focusRequest]);

  const [initialIds] = useState(() => new Set(Object.keys(store.getState().windows)));
  const [exiting, setExiting] = useState<{ id: AppId; kind: WindowExit } | null>(null);
  const afterExit = useRef<(() => void) | null>(null);

  const finishExit = useCallback(() => {
    const done = afterExit.current;
    afterExit.current = null;
    setExiting(null);
    done?.();
  }, []);

  const animateOut = (id: AppId, kind: WindowExit, done: () => void) => {
    finishExit();
    initialIds.delete(id);
    const value = workspace ? getComputedStyle(workspace).getPropertyValue("--duration-base") : "";
    const duration = Number.parseFloat(value);
    if (!Number.isFinite(duration) || duration <= 0) {
      done();
      return;
    }
    afterExit.current = done;
    setExiting({ id, kind });
  };

  const cancelExit = (id: AppId) => {
    if (exiting?.id !== id) return;
    afterExit.current = null;
    setExiting(null);
  };

  const openApp = (id: Key) => {
    if (!isAppId(id)) return;
    cancelExit(id);
    if (!store.getState().windows[id]) announce(appName(id, t.desktop.announce.opened));
    open(id);
    push(id);
    setFocusRequest({ target: windowBodyId(id) });
  };

  const showFromUrl = (key: RouteKey) => {
    const before = store.getState();
    const app = openAppFor(key);
    if (key !== "desktop" || before.windows[app]) cancelExit(app);
    store.getState().followRoute(key);
    const active = store.getState().activeId;
    if (active && !before.windows[active]) announce(appName(active, t.desktop.announce.opened));
    setFocusRequest({ target: active ? windowBodyId(active) : desktopIconsId });
  };

  useLayoutEffect(() => {
    fromUrl.current = showFromUrl;
  });

  const settleAfterBoot = useEffectEvent(() => {
    if (boot !== "first") settle(store.getState().activeId);
  });

  useEffect(() => {
    settleAfterBoot();
  }, []);

  const activate = (id: AppId) => {
    if (id === store.getState().activeId) return;
    focus(id);
    push(id);
    requestAnimationFrame(() => {
      if (document.activeElement === document.body) {
        document.getElementById(windowBodyId(id))?.focus();
      }
    });
  };

  const minimizeApp = (id: AppId) => {
    animateOut(id, "minimize", () => {
      minimize(id);
      settle(store.getState().activeId);
      announce(appName(id, t.desktop.announce.minimized));
      setFocusRequest({ target: taskbarButtonId(id) });
    });
  };

  const pressTaskbarButton = (id: AppId) => {
    if (id === store.getState().activeId) minimizeApp(id);
    else openApp(id);
  };

  const closeApp = (id: AppId) => {
    animateOut(id, "close", () => {
      close(id);
      announce(appName(id, t.desktop.announce.closed));
      const next = store.getState().activeId;
      settle(next);
      setFocusRequest({ target: next ? windowBodyId(next) : desktopIconsId });
    });
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

  const recent = useStore(store, (state) => state.recent);
  const [switcher, setSwitcher] = useState<Switcher | null>(null);
  const [isApple] = useState(isApplePlatform);
  const altShortcut = `${isApple ? t.desktop.optionKey : t.desktop.altKey}W`;

  const activateFromSwitcher = (id: string) => {
    setSwitcher(null);
    openApp(id);
  };

  const openSwitcher = (viaShortcut: boolean, step: 1 | -1) => {
    const order = store.getState().recent;
    if (order.length === 0) return;
    setSwitcher((current) => {
      const from = current ? order.indexOf(current.selected) : 0;
      const next = order[(from + step + order.length) % order.length] ?? order[0] ?? null;
      if (!next) return current;
      return { selected: next, viaShortcut: current?.viaShortcut ?? viaShortcut };
    });
  };

  const [contextMenu, setContextMenu] = useDesktopContextMenu(workspace, isDesktopLayout);
  const [isRunOpen, setRunOpen] = useState(false);
  const [isShutdownOpen, setShutdownOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTextEntry(event.target) || isRunOpen || isShutdownOpen || contextMenu) return;
      const action = matchShortcut(event);
      if (!action) return;
      if (action === "windowMenu") {
        const active = store.getState().activeId;
        if (!active) return;
        setMenuOpenFor(active);
      } else {
        openSwitcher(true, action === "switcherNext" ? 1 : -1);
      }
      event.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!switcher?.viaShortcut) return undefined;
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Alt") activateFromSwitcher(switcher.selected);
    };
    const onBlur = () => setSwitcher(null);
    document.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  });

  const dialogFailed = (setOpen: (isOpen: boolean) => void) => {
    setOpen(false);
    announce(t.desktop.loadFailed);
    focusStart();
  };

  const confirmShutdown = (choice: ShutdownChoice) => {
    setShutdownOpen(false);
    if (choice === "simpleView") openApp("simpleView");
    else onPowerChange(choice === "shutdown" ? "off" : "restarting");
  };

  const ranCommand = useRef(false);

  const startAction = (key: Key) => {
    if (key === "run") {
      ranCommand.current = false;
      setRunOpen(true);
    } else if (key === "shutdown") setShutdownOpen(true);
    else openApp(key);
  };

  const runCommand = (command: string) => {
    const id = resolveCommand(command);
    if (!id) {
      const problem = t.desktop.runNotFound.replace("{command}", command.trim());
      announce(problem);
      return problem;
    }
    ranCommand.current = true;
    openApp(id);
    return null;
  };
  const [iconOrder, setIconOrder] = useState<"type" | "name">("type");
  const [iconsVersion, setIconsVersion] = useState(0);
  const icons = desktopApps
    .map((app) => ({ id: app.id, label: t.apps[app.id], icon: app.icon }))
    .toSorted((a, b) => (iconOrder === "name" ? a.label.localeCompare(b.label, locale) : 0));

  const contextAction = (key: Key) => {
    const iconId = contextMenu?.iconId;
    setContextMenu(null);
    if (key === "open" && iconId) openApp(iconId);
    else if (key === "byName") setIconOrder("name");
    else if (key === "byType" || key === "lineUp") setIconOrder("type");
    else if (key === "refresh") {
      setIconsVersion((version) => version + 1);
      setFocusRequest({ target: desktopIconsId });
    } else if (key === "controlPanel" || key === "properties") openApp("controlPanel");
  };

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
            key={iconsVersion}
            id={desktopIconsId}
            label={t.desktop.iconsLabel}
            items={icons}
            onAction={openApp}
            className={styles.icons}
          />
        </div>
        {Object.values(windows).map((window) =>
          window.minimized ? null : (
            <DesktopWindow
              key={window.id}
              window={window}
              animateIn={!initialIds.has(window.id)}
              exit={exiting?.id === window.id ? exiting.kind : null}
              onExited={finishExit}
              zIndex={stack.indexOf(window.id)}
              isActive={window.id === activeId}
              isResizing={gestures.resizing === window.id}
              headingLevel={window.id === routeApp ? 1 : 2}
              onActivate={activate}
              onMinimize={minimizeApp}
              onToggleMaximize={toggleMaximize}
              onClose={closeApp}
              isMenuOpen={menuOpenFor === window.id}
              onMenuOpenChange={(id, isOpen) => setMenuOpenFor(isOpen ? id : null)}
              onMenuAction={menuAction}
              onGestureStart={(id, edge, event, frame) => {
                activate(id);
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
        {isRunOpen && (
          <ChunkBoundary onError={() => dialogFailed(setRunOpen)}>
            <Suspense fallback={null}>
              <RunDialog
                isOpen
                onOpenChange={(isOpen) => {
                  if (isOpen) return;
                  setRunOpen(false);
                  if (!ranCommand.current) focusStart();
                }}
                suggestions={startMenuApps
                  .concat(startMenuSystemApps)
                  .map((id) => ({ id, label: t.apps[id] }))}
                onRun={runCommand}
              />
            </Suspense>
          </ChunkBoundary>
        )}
        {isShutdownOpen && (
          <ChunkBoundary onError={() => dialogFailed(setShutdownOpen)}>
            <Suspense fallback={null}>
              <ShutdownDialog
                isOpen
                onOpenChange={(isOpen) => {
                  if (isOpen) return;
                  setShutdownOpen(false);
                  focusStart();
                }}
                onConfirm={confirmShutdown}
              />
            </Suspense>
          </ChunkBoundary>
        )}
        {contextMenu && (
          <ContextMenu
            isOpen
            onOpenChange={(isOpen) => {
              if (!isOpen) setContextMenu(null);
            }}
            x={contextMenu.x}
            y={contextMenu.y}
            label={t.desktop.contextMenu.label}
            onAction={contextAction}
          >
            {contextMenu.iconId && <MenuItem id="open">{t.desktop.contextMenu.open}</MenuItem>}
            {contextMenu.iconId && <MenuSeparator />}
            <Submenu label={t.desktop.contextMenu.arrange} onAction={contextAction}>
              <MenuItem id="byName">{t.desktop.contextMenu.byName}</MenuItem>
              <MenuItem id="byType">{t.desktop.contextMenu.byType}</MenuItem>
              <MenuItem id="lineUp">{t.desktop.contextMenu.lineUp}</MenuItem>
            </Submenu>
            <MenuItem id="refresh">{t.desktop.contextMenu.refresh}</MenuItem>
            <MenuSeparator />
            <MenuItem id="controlPanel">{t.apps.controlPanel}</MenuItem>
            <MenuSeparator />
            <MenuItem id="properties">{t.desktop.contextMenu.properties}</MenuItem>
          </ContextMenu>
        )}
        <WindowSwitcher
          isOpen={switcher !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSwitcher(null);
          }}
          items={recent.map((id) => ({ id, label: t.apps[id], icon: appDefinition(id).icon }))}
          selectedId={switcher?.selected ?? null}
          onSelectionChange={(id) => {
            if (isAppId(id)) setSwitcher((current) => current && { ...current, selected: id });
          }}
          onActivate={activateFromSwitcher}
          hint={<ShortcutText text={t.desktop.switcherHint} isApple={isApple} />}
        />
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
        <StartButton onAction={startAction} className={styles.start}>
          {startMenuApps.map((id) => (
            <MenuItem key={id} id={id} icon={appDefinition(id).icon}>
              {t.apps[id]}
            </MenuItem>
          ))}
          <MenuSeparator />
          <MenuItem id="controlPanel" icon="controlpanel">
            {t.apps.controlPanel}
          </MenuItem>
          <MenuItem id="run" icon="run" opensDialog>
            {t.desktop.run}
          </MenuItem>
          <MenuItem id="simpleView" icon="simpleview">
            {t.apps.simpleView}
          </MenuItem>
          <MenuSeparator />
          <MenuItem id="shutdown" icon="power" opensDialog>
            {t.desktop.shutdown}
          </MenuItem>
        </StartButton>
        <TaskbarIconButton
          icon="windows"
          aria-label={
            recent.length === 0
              ? t.desktop.windowsButtonEmpty
              : t.desktop.windowsButton.replace("{shortcut}", altShortcut)
          }
          isUnavailable={recent.length === 0}
          isPressed={switcher !== null && !switcher.viaShortcut}
          onPress={() => openSwitcher(false, 1)}
        />
        {Object.values(windows).map(({ id, minimized }) => (
          <TaskbarButton
            key={id}
            id={taskbarButtonId(id)}
            icon={appDefinition(id).icon}
            isSelected={id === activeId}
            onChange={() => pressTaskbarButton(id)}
            {...(minimized ? { "aria-label": appName(id, t.desktop.minimizedLabel) } : {})}
          >
            {t.apps[id]}
          </TaskbarButton>
        ))}
      </Taskbar>
    </div>
  );
}
