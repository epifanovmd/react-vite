import { Button, Table } from "@shared/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { usePersistedSettingsExample } from "./usePersistedSettingsExample";

export const PersistedSettingsExample: FC = () => {
  const { data, columns, features, settings, reset } =
    usePersistedSettingsExample();

  return (
    <ExampleCard
      title="Сохранение настроек колонок"
      description="useTableSettings + createLocalStorageTableSettings — видимость, порядок, ширина и закрепление колонок переживают перезагрузку. Хранилище выбирает потребитель."
    >
      <Table
        data={data}
        columns={columns}
        size="sm"
        features={features}
        showColumnVisibility
        toolbar={
          <Button size="sm" variant="ghost" onClick={reset}>
            Сбросить настройки
          </Button>
        }
      />
      <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs text-muted-foreground">
        {JSON.stringify(settings, null, 2)}
      </pre>
    </ExampleCard>
  );
};
