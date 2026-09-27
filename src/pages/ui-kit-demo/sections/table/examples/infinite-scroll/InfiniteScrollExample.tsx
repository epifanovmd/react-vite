import { Table } from "@shared/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { useInfiniteScrollExample } from "./useInfiniteScrollExample";

export const InfiniteScrollExample: FC = () => {
  const { data, columns, features, loadedCount, total } =
    useInfiniteScrollExample();

  return (
    <ExampleCard
      title="Бесконечная прокрутка"
      description={`useInfiniteScrollFeature — подгружено ${loadedCount} из ${total} строк.`}
    >
      <Table data={data} columns={columns} size="sm" features={features} />
    </ExampleCard>
  );
};
