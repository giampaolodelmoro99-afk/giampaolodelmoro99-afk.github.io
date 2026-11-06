import { useEffect, useRef } from "react";

const focusable = "a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])";
const bodySelector = "[id^='window-'][id$='-body']";

export function useFocusMemory() {
  const memory = useRef(new Map<string, number>());

  useEffect(() => {
    const remember = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      const body = event.target.closest<HTMLElement>(bodySelector);
      if (!body || body === event.target) return;
      const index = [...body.querySelectorAll<HTMLElement>(focusable)].indexOf(event.target);
      if (index >= 0) memory.current.set(body.id, index);
    };
    document.addEventListener("focusin", remember);
    return () => document.removeEventListener("focusin", remember);
  }, []);

  return (bodyId: string): HTMLElement | null => {
    const index = memory.current.get(bodyId);
    if (index === undefined) return null;
    const body = document.getElementById(bodyId);
    return body?.querySelectorAll<HTMLElement>(focusable)[index] ?? null;
  };
}
