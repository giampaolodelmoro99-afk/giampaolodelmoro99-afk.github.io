import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { checkReadOnlyCommand } from "./readonly-bash.mjs";

const hook = resolve(import.meta.dirname, "../../.claude/hooks/readonly-bash.mjs");

describe("checkReadOnlyCommand", () => {
  it.each([
    "git status",
    "git log --oneline main..HEAD",
    "git diff main...HEAD --stat -- tests",
    "git show HEAD:docs/PLAN.md | head -20",
    "git branch --show-current",
    "npm run build",
    "npm run test:prerender 2>&1 | tail -5",
    "npm audit --omit=dev",
    "npx playwright test --grep-invert @visual --project storybook",
    "grep -rn linkedin docs | head",
    "cd build/client && ls",
    "sha256sum src/assets/icons/*.svg",
    "npm run build >/dev/null 2>&1",
  ])("ammette %s", (command) => {
    expect(checkReadOnlyCommand(command)).toEqual({ allowed: true });
  });

  it.each([
    "git checkout -q main",
    "git switch main",
    "git -C . checkout main",
    "git commit -m x",
    "git add .",
    "git push",
    "git stash",
    "git log --output=/tmp/x",
    "npm install",
    "npm audit fix",
    "npm run analyze",
    "rm -rf build",
    "echo x > src/a.ts",
    "cat $(echo package.json)",
    "find . -name '*.png' -delete",
    "curl -s -o out.html http://localhost:4173/",
    'node -e \'require("fs").writeFileSync("x","y")\'',
    "git status && git checkout main",
    "",
  ])("blocca %s", (command) => {
    expect(checkReadOnlyCommand(command).allowed).toBe(false);
  });
});

/** @param {string} command */
const run = (command) =>
  spawnSync("node", [hook], {
    input: JSON.stringify({ tool_name: "Bash", tool_input: { command } }),
    encoding: "utf8",
  });

describe("hook PreToolUse", () => {
  it("esce con 0 per un comando di lettura", () => {
    expect(run("git status").status).toBe(0);
  });

  it("esce con 2 e spiega il motivo per un comando che cambia il repo", () => {
    const result = run("git checkout -q main");
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("sola lettura");
  });
});
