import { PageHeader, PageLayout } from "@components/layouts";
import { ThemeToggle } from "@components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui";
import { LayoutGrid } from "lucide-react";
import { FC } from "react";

import { UI_SECTIONS } from "./sections";

export const UIPage: FC = () => (
  <PageLayout
    header={
      <PageHeader
        title="UI Kit"
        subtitle="Библиотека компонентов на Radix UI, Tailwind CSS и CVA"
        icon={<LayoutGrid size={18} />}
        actions={<ThemeToggle />}
      />
    }
  >
    <Tabs
      defaultValue={UI_SECTIONS[0].value}
      className="flex min-h-0 flex-1 flex-col"
    >
      <TabsList variant="underline" className="shrink-0">
        {UI_SECTIONS.map(section => (
          <TabsTrigger
            key={section.value}
            value={section.value}
            variant="underline"
          >
            {section.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {UI_SECTIONS.map(({ value, Component }) => (
        <TabsContent
          key={value}
          value={value}
          className="flex min-h-0 flex-1 flex-col pt-4"
        >
          <Component />
        </TabsContent>
      ))}
    </Tabs>
  </PageLayout>
);
