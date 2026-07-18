import { Table } from "@components/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { useInfiniteScrollExample } from "./useInfiniteScrollExample";

export const InfiniteScrollExample: FC = () => {
  const { data, columns, features, loadedCount, total } =
    useInfiniteScrollExample();

  return (
    <ExampleCard
      title="Бесконечная прокрутка"
      description={`usePaginationFeature с onLoadMore — подгружено ${loadedCount} из ${total} строк.`}
    >
      <Table
        data={data}
        columns={columns}
        size="sm"
        features={features}
        containerClassName="max-h-72"
      />
    </ExampleCard>
  );
};
