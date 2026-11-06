import { useEffect, useState } from "react";
import type { Viewport } from "../../../stores/desktop";

const sameViewport = (a: Viewport | null, b: Viewport) =>
  a !== null &&
  a.width === b.width &&
  a.height === b.height &&
  a.minWidth === b.minWidth &&
  a.minHeight === b.minHeight &&
  a.keepVisible === b.keepVisible &&
  a.titlebarHeight === b.titlebarHeight;

export function useWorkspaceViewport(onChange: (viewport: Viewport) => void) {
  const [workspace, setWorkspace] = useState<HTMLElement | null>(null);
  const [metrics, setMetrics] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!workspace || !metrics) return undefined;
    let last: Viewport | null = null;
    let frame = 0;
    const size = (name: string) =>
      metrics.querySelector(`[data-metric="${name}"]`)?.getBoundingClientRect();
    const measure = () => {
      frame = 0;
      if (workspace.clientWidth === 0 || workspace.clientHeight === 0) return;
      const window = size("window");
      const titlebar = size("titlebar");
      const viewport = {
        width: workspace.clientWidth,
        height: workspace.clientHeight,
        minWidth: window?.width ?? 0,
        minHeight: window?.height ?? 0,
        keepVisible: titlebar?.width ?? 0,
        titlebarHeight: titlebar?.height ?? 0,
      };
      if (sameViewport(last, viewport)) return;
      last = viewport;
      onChange(viewport);
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };
    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(workspace);
    observer.observe(metrics);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [workspace, metrics, onChange]);

  return { workspaceRef: setWorkspace, metricsRef: setMetrics };
}
