import { useEffect, useState } from "react";
import type { Viewport } from "../../../stores/desktop";

export function useWorkspaceViewport(onChange: (viewport: Viewport) => void) {
  const [workspace, setWorkspace] = useState<HTMLElement | null>(null);
  const [metrics, setMetrics] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!workspace || !metrics) return undefined;
    const size = (name: string) =>
      metrics.querySelector(`[data-metric="${name}"]`)?.getBoundingClientRect();
    const measure = () => {
      if (workspace.clientWidth === 0 || workspace.clientHeight === 0) return;
      const window = size("window");
      const titlebar = size("titlebar");
      onChange({
        width: workspace.clientWidth,
        height: workspace.clientHeight,
        minWidth: window?.width ?? 0,
        minHeight: window?.height ?? 0,
        keepVisible: titlebar?.width ?? 0,
        titlebarHeight: titlebar?.height ?? 0,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(workspace);
    observer.observe(metrics);
    return () => observer.disconnect();
  }, [workspace, metrics, onChange]);

  return { workspaceRef: setWorkspace, metricsRef: setMetrics };
}
