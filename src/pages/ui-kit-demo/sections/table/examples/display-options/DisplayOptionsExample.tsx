import type { SegmentedOption, TableSize, TableVariant } from "@shared/ui";
import { Segmented, Table } from "@shared/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import {
  type DisplayState,
  useDisplayOptionsExample,
} from "./useDisplayOptionsExample";

const VARIANT_OPTIONS: SegmentedOption<TableVariant>[] = [
  { label: "Обычный", value: "default" },
  { label: "Полосы", value: "striped" },
  { label: "Рамки", value: "bordered" },
];

const SIZE_OPTIONS: SegmentedOption<TableSize>[] = [
  { label: "S", value: "sm" },
  { label: "M", value: "md" },
  { label: "L", value: "lg" },
];

const DISPLAY_OPTIONS: SegmentedOption<DisplayState>[] = [
  { label: "Данные", value: "data" },
  { label: "Загрузка", value: "loading" },
  { label: "Пусто", value: "empty" },
  { label: "Ошибка", value: "error" },
];

export const DisplayOptionsExample: FC = () => {
  const {
    data,
    columns,
    variant,
    setVariant,
    size,
    setSize,
    display,
    setDisplay,
    loading,
    error,
  } = useDisplayOptionsExample();

  return (
    <ExampleCard
      title="Варианты отображения"
      description="variant, size, loading, empty и error state — управляются обычными пропами Table."
    >
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          size="sm"
          options={VARIANT_OPTIONS}
          value={variant}
          onValueChange={setVariant}
        />
        <Segmented
          size="sm"
          options={SIZE_OPTIONS}
          value={size}
          onValueChange={setSize}
        />
        <Segmented
          size="sm"
          options={DISPLAY_OPTIONS}
          value={display}
          onValueChange={setDisplay}
        />
      </div>
      <Table
        data={data}
        columns={columns}
        variant={variant}
        size={size}
        loading={loading}
        error={error}
      />
    </ExampleCard>
  );
};
