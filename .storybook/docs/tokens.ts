import tokensCss from "../../src/styles/tokens.css?raw";

const classicBlock =
  /:root,\s*\[data-theme="classic"\]\s*\{([\s\S]*?)\n\}/.exec(tokensCss)?.[1] ?? "";

const namesIn = (block: string, prefix: string) =>
  [...block.matchAll(new RegExp(`(--${prefix}[\\w-]*)\\s*:`, "g"))].map((match) => match[1] ?? "");

export const colorTokens = namesIn(classicBlock, "color-");
export const bevelTokens = namesIn(classicBlock, "bevel-").filter(
  (name) => name !== "--bevel-none",
);
