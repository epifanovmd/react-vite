import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui";
import type { FC } from "react";

import { TABLE_EXAMPLES } from "./table/examples";

export const TableSection: FC = () => (
  <Tabs
    defaultValue={TABLE_EXAMPLES[0]!.value}
    className="flex min-h-0 flex-1 flex-col"
  >
    <TabsList variant="underline" size="sm" className="shrink-0">
      {TABLE_EXAMPLES.map(example => (
        <TabsTrigger
          key={example.value}
          value={example.value}
          variant="underline"
          size="sm"
        >
          {example.label}
        </TabsTrigger>
      ))}
    </TabsList>

    {TABLE_EXAMPLES.map(({ value, Component }) => (
      <TabsContent
        key={value}
        value={value}
        className="flex min-h-0 flex-1 flex-col pt-4"
      >
        <Component />
      </TabsContent>
    ))}
  </Tabs>
);
