import { type ComponentType, startTransition, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { routeKeyFromPathname } from "../../routes/routeMap";
import type { DesktopAppProps } from "./app/DesktopApp";
import styles from "./Desktop.module.css";
import { type FocusKey, focusKeyOf, focusTarget } from "./ids";
import { DesktopShell } from "./shell/DesktopShell";

const desktopApp: Promise<ComponentType<DesktopAppProps>> | null = import.meta.env.SSR
  ? null
  : import("./app/DesktopApp").then((module) => module.DesktopApp);

type Swap = { App: ComponentType<DesktopAppProps>; focus: FocusKey | null; isReady: boolean };

export function Desktop() {
  const routeKey = routeKeyFromPathname(useLocation().pathname) ?? "desktop";
  const [swap, setSwap] = useState<Swap | null>(null);

  useEffect(() => {
    let live = true;
    void desktopApp
      ?.then((App) => {
        if (live) startTransition(() => setSwap({ App, focus: null, isReady: false }));
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (swap?.isReady && swap.focus) focusTarget(swap.focus)?.focus();
  }, [swap]);

  const onReady = () =>
    setSwap((current) =>
      !current || current.isReady
        ? current
        : { ...current, isReady: true, focus: focusKeyOf(document.activeElement) },
    );

  return (
    <>
      {!swap?.isReady && <DesktopShell routeKey={routeKey} />}
      {swap && (
        <div className={styles.swap} hidden={!swap.isReady}>
          <swap.App key={routeKey} routeKey={routeKey} onReady={onReady} />
        </div>
      )}
    </>
  );
}
