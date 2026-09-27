import { Button, useConfirm } from "@shared/ui";
import { useState } from "react";

const wait = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

export const ConfirmDemo = () => {
  const confirm = useConfirm();
  const [result, setResult] = useState<string>("—");

  const askDelete = async () => {
    const ok = await confirm({
      title: "Удалить запись?",
      description: "Это действие нельзя отменить.",
      confirmLabel: "Удалить",
      confirmVariant: "destructive",
      onConfirm: () => wait(600),
    });

    setResult(ok ? "подтверждено" : "отменено");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="destructive" onClick={askDelete}>
        await confirm(…)
      </Button>
      <span className="text-xs text-muted-foreground">Результат: {result}</span>
    </div>
  );
};
