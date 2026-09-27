import { Avatar, Badge, Spinner, VirtualList } from "@shared/ui";
import { type FC, useCallback, useState } from "react";

import { DemoBlock, DemoCard, DemoRow } from "./shared";

interface DemoRowItem {
  id: number;
  name: string;
  text: string;
}

const TOTAL = 10_000;
const PAGE = 50;
const PAGE_LIMIT = 500;

const PHRASES = [
  "Короткое сообщение",
  "Сообщение подлиннее: строки разной высоты меряются после рендера, поэтому список не прыгает при прокрутке",
  "Готово",
  "Нужно обсудить детали задачи и сроки, а ещё согласовать макеты с дизайнером до пятницы",
];

const makeRow = (index: number): DemoRowItem => ({
  id: index + 1,
  name: `Пользователь ${index + 1}`,
  text: PHRASES[index % PHRASES.length] ?? "",
});

const ROWS = Array.from({ length: TOTAL }, (_, index) => makeRow(index));

const LIST_CLASS = "rounded-lg border";
const COMPACT_LIST_CLASS = "rounded-lg border p-2";
const COMPACT_ROW_CLASS =
  "flex h-8 items-center justify-between rounded-md bg-muted/50 px-3 text-sm";
const ROW_CLASS = "flex items-start gap-3 border-b px-3 py-2";
const ROW_BODY_CLASS = "flex min-w-0 flex-col gap-0.5";
const ROW_NAME_CLASS = "text-sm font-medium";
const ROW_TEXT_CLASS = "text-xs text-muted-foreground";
const FOOTER_CLASS = "flex items-center gap-2 text-xs text-muted-foreground";

const getRowKey = (row: DemoRowItem) => row.id;

const renderRow = (row: DemoRowItem) => (
  <div className={ROW_CLASS}>
    <Avatar size="sm" name={row.name} />
    <div className={ROW_BODY_CLASS}>
      <span className={ROW_NAME_CLASS}>{row.name}</span>
      <span className={ROW_TEXT_CLASS}>{row.text}</span>
    </div>
  </div>
);

const renderCompactRow = (row: DemoRowItem) => (
  <div className={COMPACT_ROW_CLASS}>
    <span>{row.name}</span>
    <Badge variant="secondary">#{row.id}</Badge>
  </div>
);

export const VirtualListSection: FC = () => {
  const [loaded, setLoaded] = useState(() => ROWS.slice(0, PAGE));
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoaded(prev =>
        ROWS.slice(0, Math.min(prev.length + PAGE, PAGE_LIMIT)),
      );
      setLoading(false);
    }, 600);
  }, []);

  const hasMore = loaded.length < PAGE_LIMIT;

  return (
    <DemoCard
      title="VirtualList"
      description="В DOM только видимое окно строк; высота строк меряется динамически, onEndReached — для догрузки"
    >
      <DemoRow columns={2}>
        <DemoBlock title={`${TOTAL.toLocaleString("ru")} строк разной высоты`}>
          <VirtualList
            items={ROWS}
            estimateSize={56}
            height={360}
            getItemKey={getRowKey}
            renderItem={renderRow}
            className={LIST_CLASS}
          />
        </DemoBlock>

        <DemoBlock title="Фиксированная высота, gap">
          <VirtualList
            items={ROWS}
            estimateSize={32}
            gap={4}
            overscan={10}
            height={360}
            getItemKey={getRowKey}
            renderItem={renderCompactRow}
            className={COMPACT_LIST_CLASS}
          />
        </DemoBlock>
      </DemoRow>

      <DemoBlock title="Бесконечная загрузка (onEndReached)">
        <VirtualList
          items={loaded}
          estimateSize={56}
          height={280}
          getItemKey={getRowKey}
          renderItem={renderRow}
          onEndReached={hasMore ? loadMore : undefined}
          endReachedThreshold={5}
          emptyContent="Нет данных"
          className={LIST_CLASS}
        />
        <div className={FOOTER_CLASS}>
          {loading && <Spinner size="sm" />}
          <span>
            загружено {loaded.length} из {PAGE_LIMIT}
          </span>
        </div>
      </DemoBlock>
    </DemoCard>
  );
};
