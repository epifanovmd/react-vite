import { PageHeader, PageLayout } from "@components/layouts";
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
      />
    }
  >
    <Tabs defaultValue={UI_SECTIONS[0].value}>
      <TabsList variant="underline">
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
        <TabsContent key={value} value={value} className="pt-4">
          <Component />
        </TabsContent>
      ))}
    </Tabs>
  </PageLayout>
);
