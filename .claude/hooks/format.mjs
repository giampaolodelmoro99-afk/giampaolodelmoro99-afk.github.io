import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, relative } from "node:path";

// Hook PostToolUse di Claude Code: formatta con Prettier il file appena
// scritto o modificato. Legge il payload JSON da stdin; non blocca mai.

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);

let filePath;
try {
  filePath = JSON.parse(Buffer.concat(chunks).toString("utf8"))?.tool_input?.file_path;
} catch {
  process.exit(0);
}

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const prettier = join(root, "node_modules", ".bin", "prettier");

if (typeof filePath !== "string" || !existsSync(filePath) || !existsSync(prettier)) {
  process.exit(0);
}
if (relative(root, filePath).startsWith("..")) {
  process.exit(0);
}

spawnSync(prettier, ["--write", "--ignore-unknown", "--log-level", "warn", filePath], {
  cwd: root,
  stdio: "inherit",
});
process.exit(0);
