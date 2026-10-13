/**
 * Regole del hook che rende di sola lettura gli agenti di review
 * (.claude/agents/*.md, .claude/hooks/readonly-bash.mjs).
 *
 * Un comando è ammesso solo se ogni segmento (separato da |, &&, || o ;)
 * comincia con un comando di lettura o di verifica dell'elenco. Sono vietati
 * redirezioni verso file, sostituzioni di comando e le opzioni di git che
 * cambiano cartella o scrivono file.
 */

const allowedSegments = [
  /^git (status|log|diff|show|ls-tree|ls-files|rev-parse|blame|grep)\b/,
  /^git branch --show-current$/,
  /^npm run (build|build:site|build:storybook|test|test:coverage|test:prerender|test:e2e:host|lint|typecheck|format:check|size)$/,
  /^npm (audit|ls|view|outdated)\b(?!.*\bfix\b)/,
  /^npx playwright test\b/,
  /^npx (vitest run|tsc --noEmit|oxlint|stylelint|prettier --check)\b/,
  /^gh (run (list|view)|pr (view|diff|checks))\b/,
  /^(ls|cat|head|tail|wc|grep|rg|find|sort|uniq|cut|tr|diff|file|stat|sha256sum|jq|echo|pwd|which|ss)\b/,
  /^curl -s\b/,
  /^node -e\b/,
];

const forbidden = [
  { pattern: /\$\(|`/, reason: "sostituzione di comando" },
  { pattern: /(^|[^0-9&])>(?!\s*\/dev\/null|&1|&2)/, reason: "redirezione verso un file" },
  { pattern: /\bgit\b[^|;&]*\s(-C|--git-dir|--work-tree)\b/, reason: "git in un'altra cartella" },
  { pattern: /\s--output(=|\s)/, reason: "scrittura su file" },
  {
    pattern: /\bfind\b[^|;&]*\s-(delete|exec|execdir|ok|fprint)\b/,
    reason: "find che modifica o esegue",
  },
  {
    pattern: /\bcurl\b[^|;&]*\s(-o|-O|--output|-X|-d|--data)\b/,
    reason: "curl che scrive o invia",
  },
  {
    pattern:
      /\bnode -e\b[^|;&]*\b(writeFile|appendFile|rm|unlink|mkdir|rename|copyFile|spawn|exec)\w*/,
    reason: "node che scrive o esegue",
  },
];

/**
 * @param {string} command
 * @returns {{ allowed: true } | { allowed: false, reason: string }}
 */
export function checkReadOnlyCommand(command) {
  const trimmed = command.trim();
  if (trimmed === "") return { allowed: false, reason: "comando vuoto" };
  for (const { pattern, reason } of forbidden) {
    if (pattern.test(trimmed)) return { allowed: false, reason };
  }
  const segments = trimmed
    .split(/\|\||&&|;|\|/)
    .map((segment) =>
      segment
        .replace(/\s*\d?>\s*\/dev\/null|\s*\d?>&\d/g, "")
        .trim()
        .replace(/^cd [^\s]+$/, "pwd"),
    )
    .filter((segment) => segment !== "");
  const blocked = segments.find((segment) => !allowedSegments.some((rule) => rule.test(segment)));
  return blocked === undefined
    ? { allowed: true }
    : { allowed: false, reason: `comando non ammesso per un agente di sola lettura: ${blocked}` };
}
