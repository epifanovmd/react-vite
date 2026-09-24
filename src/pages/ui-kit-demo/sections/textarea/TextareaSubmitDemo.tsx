import { formatHotkey } from "@shared/lib/hotkeys";
import { Textarea } from "@shared/ui";
import { useState } from "react";

import { DemoEmittedValue } from "../shared";

const SUBMIT_HINT = `${formatHotkey("mod+enter")} — отправить, Enter — новая строка`;

/** Поле сообщения: растёт с одной строки, отправка по Ctrl/Cmd+Enter. */
export const TextareaSubmitDemo = () => {
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState("");

  const submit = () => {
    setSent(draft.trim());
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-1">
      <Textarea
        value={draft}
        onChange={event => setDraft(event.target.value)}
        onSubmitShortcut={submit}
        minRows={1}
        maxRows={4}
        clearable
        placeholder="Сообщение"
      />
      <p className="text-xs text-muted-foreground">{SUBMIT_HINT}</p>
      <DemoEmittedValue value={sent} />
    </div>
  );
};
