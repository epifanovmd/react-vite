import type { Column } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Input } from "../../../../input";
import { FacetedFilterControl } from "./FacetedFilterControl";
import type { FilterControlProps } from "./FilterControlProps";

const TEXT_DEBOUNCE_MS = 300;

export interface TextFilterConfig {
  type: "text";
  placeholder?: string;
  faceted?: boolean;
  queryKey?: string;
}

export const TextFilterControl = <TData,>({
  config,
  column,
}: FilterControlProps<TextFilterConfig, TData>) => {
  if (config.faceted) return <FacetedFilterControl column={column} />;

  return <PlainTextControl column={column} placeholder={config.placeholder} />;
};

interface PlainTextControlProps<TData> {
  column: Column<TData, unknown>;
  placeholder?: string;
}

const PlainTextControl = <TData,>({
  column,
  placeholder,
}: PlainTextControlProps<TData>) => {
  const [value, setValue] = useState(
    () => (column.getFilterValue() as string | undefined) ?? "",
  );
  const columnRef = useRef(column);

  columnRef.current = column;
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;

      return;
    }

    const timer = setTimeout(() => {
      const next = value.trim();

      columnRef.current.setFilterValue(next.length ? next : undefined);
    }, TEXT_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <Input
      size="sm"
      clearable
      leftIcon={<Search className="h-3.5 w-3.5" />}
      placeholder={placeholder ?? "Поиск…"}
      value={value}
      onChange={e => setValue(e.target.value)}
      onClear={() => setValue("")}
    />
  );
};
