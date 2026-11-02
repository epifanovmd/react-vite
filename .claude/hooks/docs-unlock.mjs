#!/usr/bin/env node
/**
 * UserPromptSubmit / SessionStart: разблокировка защищённых документов.
 * Сообщение пользователя, начинающееся с `/docs-edit`, открывает запись на
 * UNLOCK_TTL_MS; `/docs-lock` и новая сессия — закрывают.
 */
import fs from "node:fs";

import { ROOT_FROM, UNLOCK_FILE, UNLOCK_TTL_MS } from "./docs-lock-state.mjs";

const readStdin = async () => {
  let data = "";

  for await (const chunk of process.stdin) data += chunk;

  return data;
};

const input = JSON.parse((await readStdin()) || "{}");
const file = UNLOCK_FILE(ROOT_FROM(input));
const lock = () => fs.rmSync(file, { force: true });

if (input.hook_event_name === "SessionStart") {
  lock();
} else if (input.hook_event_name === "UserPromptSubmit") {
  const prompt = String(input.prompt ?? "").trimStart();

  if (/^\/docs-edit(\s|$)/.test(prompt)) {
    fs.writeFileSync(file, String(Date.now()));
    process.stdout.write(
      `Защищённые правила и документация открыты для правки на ${UNLOCK_TTL_MS / 60000} минут — только в рамках запроса пользователя.`,
    );
  } else if (/^\/docs-lock(\s|$)/.test(prompt)) {
    lock();
    process.stdout.write(
      "Защищённые правила и документация снова закрыты для правки.",
    );
  }
}

process.exit(0);
