export type ShortcutAction = "switcherNext" | "switcherPrevious" | "windowMenu";

export type ShortcutEvent = Pick<
  KeyboardEvent,
  "key" | "code" | "altKey" | "ctrlKey" | "metaKey" | "shiftKey" | "getModifierState"
>;

const nonAscii = (key: string) => key.length === 1 && key.charCodeAt(0) > 127;

function isKey(
  event: ShortcutEvent,
  key: string,
  code: string,
  canFallBack: (key: string) => boolean,
) {
  if (event.key.toLowerCase() === key) return true;
  return event.code === code && canFallBack(event.key);
}

export function matchShortcut(event: ShortcutEvent): ShortcutAction | null {
  if (!event.altKey || event.ctrlKey || event.metaKey) return null;
  if (event.getModifierState("AltGraph")) return null;
  if (isKey(event, "w", "KeyW", nonAscii)) {
    return event.shiftKey ? "switcherPrevious" : "switcherNext";
  }
  if (isKey(event, " ", "Space", () => true)) return "windowMenu";
  if (isKey(event, "-", "Minus", nonAscii)) {
    return "windowMenu";
  }
  return null;
}

export function isTextEntry(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return (
    target.closest(
      'input, textarea, select, [contenteditable=""], [contenteditable="true"], [data-shortcuts="off"]',
    ) !== null
  );
}

export function isApplePlatform(): boolean {
  const data: unknown = Reflect.get(navigator, "userAgentData");
  const platform =
    typeof data === "object" && data !== null && typeof Reflect.get(data, "platform") === "string"
      ? String(Reflect.get(data, "platform"))
      : navigator.platform;
  return /mac|iphone|ipad|ipod/i.test(platform);
}
