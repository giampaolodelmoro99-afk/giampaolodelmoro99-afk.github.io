import { checkReadOnlyCommand } from "../../scripts/lib/readonly-bash.mjs";

// Hook PreToolUse degli agenti di review (.claude/agents/*.md): blocca ogni
// comando Bash che non sia di lettura o di verifica. Exit code 2 = comando
// bloccato, con il motivo su stderr per l'agente. Regole in
// scripts/lib/readonly-bash.mjs (con test).

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);

/** @type {unknown} */
let command = "";
try {
  command = JSON.parse(Buffer.concat(chunks).toString("utf8"))?.tool_input?.command;
} catch {
  console.error("payload del hook non leggibile: comando bloccato");
  process.exit(2);
}

const result = checkReadOnlyCommand(typeof command === "string" ? command : "");
if (!result.allowed) {
  console.error(`Bloccato (agente di sola lettura): ${result.reason}`);
  process.exit(2);
}
process.exit(0);
