/** Общее состояние защиты документов для хуков `protect-docs` и `docs-unlock`. */
import fs from "node:fs";
import path from "node:path";

/** Сколько живёт разблокировка после `/docs-edit`. */
export const UNLOCK_TTL_MS = 60 * 60 * 1000;

/** Защищённые пути относительно корня проекта (docs/00-meta/protection.md). */
export const PROTECTED = [
  /^CLAUDE\.md$/,
  /^README\.md$/,
  /^docs\/(?!inbox\/)/,
  /^\.claude\/(settings\.json$|hooks\/|rules\/|skills\/|agents\/)/,
  /^scripts\/(docs|git)\//,
  /^lefthook\.yml$/,
  /^eslint[^/]*\.mjs$/,
];

export const ROOT_FROM = input =>
  process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();

export const UNLOCK_FILE = root => path.join(root, ".claude", ".docs-unlock");

export const isUnlocked = root => {
  try {
    const unlockedAt = Number(fs.readFileSync(UNLOCK_FILE(root), "utf8"));

    return (
      Number.isFinite(unlockedAt) && Date.now() - unlockedAt < UNLOCK_TTL_MS
    );
  } catch {
    return false;
  }
};
