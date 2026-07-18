import { Table } from "@components/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { useStickyExample } from "./useStickyExample";

export const StickyExample: FC = () => {
  const { data, columns } = useStickyExample();

  return (
    <ExampleCard
      title="Липкие шапка и подвал"
      description="stickyHeader + stickyFooter — остаются на месте при скролле тела таблицы."
    >
      <Table
        data={data}
        columns={columns}
        size="sm"
        stickyHeader
        stickyFooter
        containerClassName="max-h-72"
      />
    </ExampleCard>
  );
};
