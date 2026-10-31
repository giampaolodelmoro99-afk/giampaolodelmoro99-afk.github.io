import { type Key, Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
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
  initialStateFor,
  openAppFor,
} from "../../../stores/desktop";
import { appDefinition, desktopApps, startMenuApps, startMenuSystemApps } from "../apps";
import styles from "../Desktop.module.css";
import { desktopIconsId, taskbarButtonId, windowBodyId } from "../ids";
import { DesktopWindow } from "./DesktopWindow";
import { resolveCommand } from "../run";
import { isApplePlatform, isTextEntry, matchShortcut } from "../shortcuts";
import { ShortcutText } from "./ShortcutText";
import { useAnnouncer } from "./Announcer";
import { useDesktopContextMenu } from "./useDesktopContextMenu";
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

type Switcher = { selected: AppId; viaShortcut: boolean };

function focusStart() {
  requestAnimationFrame(() => document.querySelector<HTMLElement>(`.${styles.start}`)?.focus());
}

const RunDialog = lazy(() =>
  import("../../../components/RunDialog").then((module) => ({ default: module.RunDialog })),
);

const ShutdownDialog = lazy(() =>
  import("../../../components/ShutdownDialog").then((module) => ({
    default: module.ShutdownDialog,
  })),
);

const FarewellScreen = lazy(() =>
  import("../../../components/FarewellScreen").then((module) => ({
    default: module.FarewellScreen,
  })),
);

type Power = "on" | "off" | "restarting";

function useDesktopStore(routeKey: RouteKey, isClean: boolean): DesktopStore {
  const [store] = useState(() =>
    createDesktopStore(isClean ? emptyState : initialStateFor(routeKey)),
  );
  return store;
}

export function DesktopApp(props: DesktopAppProps) {
  return (
    <I18nProvider locale={intlLocales[useLocale()]}>
      <DesktopPower {...props} />
    </I18nProvider>
  );
}

function DesktopPower({ routeKey, onReady }: DesktopAppProps) {
  const t = useT();
  const [power, setPower] = useState<Power>("on");
  const [boot, setBoot] = useState(0);
  const turnOn = useCallback(() => {
    setBoot((count) => count + 1);
    setPower("on");
  }, []);

  useEffect(() => {
    if (power !== "off") return undefined;
    const previous = document.title;
    document.title = t.desktop.farewell.tabTitle.replace("{name}", personName);
    return () => {
      document.title = previous;
    };
  }, [power, t]);

  if (power === "restarting") return <PowerOff onDone={turnOn} />;
  if (power === "off") {
    return (
      <Suspense fallback={<div className={styles.powerOff} />}>
        <FarewellScreen
          heading={t.desktop.farewell.heading}
          message={t.desktop.farewell.message}
          restartLabel={t.desktop.farewell.restart}
          footer={new URL(siteUrl).host}
          onRestart={turnOn}
        />
      </Suspense>
    );
  }
  return (
    <DesktopScreen
      key={boot}
      routeKey={routeKey}
      isClean={boot > 0}
      onPowerChange={setPower}
      {...(boot === 0 && onReady ? { onReady } : {})}
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
  isClean: boolean;
  onPowerChange: (power: Power) => void;
};

function DesktopScreen({ routeKey, onReady, isClean, onPowerChange }: DesktopScreenProps) {
  const t = useT();
  const locale = useLocale();
  const other = locales.find((candidate) => candidate !== locale) ?? locale;
  const store = useDesktopStore(routeKey, isClean);
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
    isClean ? () => setFocusRequest({ target: desktopIconsId }) : onReady,
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

  const recent = useStore(store, (state) => state.recent);
  const [switcher, setSwitcher] = useState<Switcher | null>(null);
  const [isApple] = useState(isApplePlatform);
  const altShortcut = `${isApple ? "Option" : "Alt"}+W`;

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

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTextEntry(event.target)) return;
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

  const [contextMenu, setContextMenu] = useDesktopContextMenu(workspace, isDesktopLayout);
  const [isRunOpen, setRunOpen] = useState(false);
  const [isShutdownOpen, setShutdownOpen] = useState(false);

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
    if (!id) return t.desktop.runNotFound.replace("{command}", command.trim());
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
    else if (key === "refresh") setIconsVersion((version) => version + 1);
    else if (key === "controlPanel" || key === "properties") openApp("controlPanel");
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
        {isRunOpen && (
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
        )}
        {isShutdownOpen && (
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
          <MenuItem id="run" icon="run">
            {t.desktop.run}
          </MenuItem>
          <MenuItem id="simpleView" icon="simpleview">
            {t.apps.simpleView}
          </MenuItem>
          <MenuSeparator />
          <MenuItem id="shutdown" icon="power">
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
            {...(minimized ? { "aria-label": `${t.apps[id]}, ${t.desktop.minimizedSuffix}` } : {})}
          >
            {t.apps[id]}
          </TaskbarButton>
        ))}
      </Taskbar>
    </div>
  );
}
