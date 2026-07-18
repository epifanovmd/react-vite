import { Segmented, Table } from "@components/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { useDisplayOptionsExample } from "./useDisplayOptionsExample";

const VARIANT_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Striped", value: "striped" },
  { label: "Bordered", value: "bordered" },
];

const SIZE_OPTIONS = [
  { label: "S", value: "sm" },
  { label: "M", value: "md" },
  { label: "L", value: "lg" },
];

const DISPLAY_OPTIONS = [
  { label: "Данные", value: "data" },
  { label: "Loading", value: "loading" },
  { label: "Empty", value: "empty" },
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
  } = useDisplayOptionsExample();

  return (
    <ExampleCard
      title="Варианты отображения"
      description="variant, size, loading и empty state — управляются обычными пропами Table."
    >
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          size="sm"
          options={VARIANT_OPTIONS}
          value={variant}
          onChange={v => setVariant(v as typeof variant)}
        />
        <Segmented
          size="sm"
          options={SIZE_OPTIONS}
          value={size}
          onChange={v => setSize(v as typeof size)}
        />
        <Segmented
          size="sm"
          options={DISPLAY_OPTIONS}
          value={display}
          onChange={v => setDisplay(v as typeof display)}
        />
      </div>
      <Table
        data={data}
        columns={columns}
        variant={variant}
        size={size}
        loading={loading}
      />
    </ExampleCard>
  );
};
