import { expect, openPage, test } from "./fixtures";

type Timing = { loadEnd: number; hydratedAt: number; longTasks: number[] };

declare global {
  interface Window {
    hydrationTiming?: { hydratedAt: number; longTasks: number[] };
  }
}

for (const path of ["/", "/en/"]) {
  test(`idratazione dopo load su ${path} con CPU rallentata 4×`, async ({ page }, testInfo) => {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      const timing = { hydratedAt: 0, longTasks: [] as number[] };
      window.hydrationTiming = timing;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) timing.longTasks.push(Math.round(entry.duration));
      }).observe({ type: "longtask", buffered: true });
      new MutationObserver((_, observer) => {
        if (document.documentElement.dataset["hydrated"]) {
          timing.hydratedAt = performance.now();
          observer.disconnect();
        }
      }).observe(document, { attributes: true, subtree: true, attributeFilter: ["data-hydrated"] });
    });

    await openPage(page, path);
    const timing: Timing = await page.evaluate(() => {
      const [navigation] = performance.getEntriesByType("navigation");
      const loadEnd =
        navigation && "loadEventEnd" in navigation ? Number(navigation.loadEventEnd) : 0;
      return {
        loadEnd: Math.round(loadEnd),
        hydratedAt: Math.round(window.hydrationTiming?.hydratedAt ?? 0),
        longTasks: window.hydrationTiming?.longTasks ?? [],
      };
    });

    const hydration = timing.hydratedAt - timing.loadEnd;
    testInfo.annotations.push({
      type: "misura",
      description: `load ${timing.loadEnd} ms, idratazione +${hydration} ms, long task ${JSON.stringify(timing.longTasks)}`,
    });

    expect(timing.hydratedAt).toBeGreaterThan(timing.loadEnd);
    expect(hydration).toBeLessThan(1000);
    expect(Math.max(0, ...timing.longTasks)).toBeLessThan(200);
  });
}
