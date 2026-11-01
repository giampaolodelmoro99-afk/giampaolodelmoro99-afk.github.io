import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom non ha ResizeObserver né layout: lo stub registra e scollega senza
// misurare. Le misure vere dell'area di lavoro si provano negli e2e.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!("ResizeObserver" in globalThis)) {
  Object.assign(globalThis, { ResizeObserver: ResizeObserverStub });
}

afterEach(() => {
  cleanup();
});
