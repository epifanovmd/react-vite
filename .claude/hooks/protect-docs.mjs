#!/usr/bin/env node
/**
 * PreToolUse: запрет записи в защищённые правила и документацию без разблокировки
 * пользователем (`/docs-edit`). Правила — docs/00-meta/protection.md.
 */
import fs from "node:fs";
import path from "node:path";

import {
  isUnlocked,
  PROTECTED,
  ROOT_FROM,
  UNLOCK_FILE,
} from "./docs-lock-state.mjs";

const WRITE_TOOLS = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit"]);

/** Признаки изменяющей shell-команды. */
const WRITE_INTENT =
  /(^|[\s;&|])(>|>>|tee|mv|cp|rm|rmdir|touch|truncate|ln|dd|install|chmod|unlink)(\s|$)|\bsed\s+(-[a-zA-Z]*i|--in-place)|\bperl\s+-[a-zA-Z]*i|--write\b|--fix\b|\bgit\s+(checkout|restore|mv|rm|apply|stash)\b|[^\s<>2&]>|^>/;

const readStdin = async () => {
  let data = "";

  for await (const chunk of process.stdin) data += chunk;

  return data;
};

const deny = reason => {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
};

const toRelative = (root, cwd, target) => {
  const absolute = path.resolve(cwd, target);
  const relative = path.relative(root, absolute).split(path.sep).join("/");

  return relative.startsWith("..") || path.isAbsolute(relative)
    ? null
    : relative;
};

const isProtected = relative =>
  relative !== null && PROTECTED.some(re => re.test(relative));

const LOCKED_REASON =
  "Защищённый файл: правила и документация меняются только по команде пользователя /docs-edit " +
  "(docs/00-meta/protection.md). Предложи правку файлом в docs/inbox/ (/propose-rule) и сообщи пользователю.";

const input = JSON.parse((await readStdin()) || "{}");
const root = ROOT_FROM(input);
const cwd = input.cwd || root;

if (fs.existsSync(UNLOCK_FILE(root)) && !isUnlocked(root))
  fs.rmSync(UNLOCK_FILE(root), { force: true });

const unlockRelative = path
  .relative(root, UNLOCK_FILE(root))
  .split(path.sep)
  .join("/");

if (WRITE_TOOLS.has(input.tool_name)) {
  const target = input.tool_input?.file_path ?? input.tool_input?.notebook_path;
  const relative = target ? toRelative(root, cwd, target) : null;

  if (relative === unlockRelative)
    deny("Флаг разблокировки ставит только пользователь командой /docs-edit.");
  if (isProtected(relative) && !isUnlocked(root)) deny(LOCKED_REASON);
}

if (input.tool_name === "Bash") {
  const command = String(input.tool_input?.command ?? "");
  const tokens = command
    .split(/[\s;&|()]+/)
    .map(token =>
      token.replace(/^[<>0-9&]*>+|^["']|["']$/g, "").replace(/["']$/g, ""),
    )
    .filter(Boolean);
  const relatives = tokens.map(token => toRelative(root, cwd, token));

  if (relatives.includes(unlockRelative) && /docs-unlock/.test(command)) {
    deny(
      "Флаг разблокировки меняет только пользователь командами /docs-edit и /docs-lock.",
    );
  }

  if (
    WRITE_INTENT.test(command) &&
    relatives.some(isProtected) &&
    !isUnlocked(root)
  )
    deny(LOCKED_REASON);
}

process.exit(0);
