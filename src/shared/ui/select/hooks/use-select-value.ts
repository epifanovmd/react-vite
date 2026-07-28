import * as React from "react";

import { SelectOnChange } from "../types";

export interface UseSelectValueOptions<V> {
  multi: boolean;
  value: V | V[] | null | undefined;
  onChange: SelectOnChange | undefined;
  close: () => void;
}

export interface UseSelectValueResult<V> {
  selectedValues: V[];
  isSelected: (v: V) => boolean;
  hasValue: boolean;
  handleSelect: (v: V) => void;
  handleClear: () => void;
  handleRemoveTag: (v: V) => void;
}

export function useSelectValue<V>({
  multi,
  value,
  onChange,
  close,
}: UseSelectValueOptions<V>): UseSelectValueResult<V> {
  const selectedValues = React.useMemo<V[]>(
    () =>
      multi
        ? ((value as V[] | undefined) ?? [])
        : value != null
          ? [value as V]
          : [],
    [multi, value],
  );

  const isSelected = React.useCallback(
    (v: V) => selectedValues.includes(v),
    [selectedValues],
  );

  const handleSelect = React.useCallback(
    (optValue: V) => {
      if (multi) {
        const cur = (value as V[] | undefined) ?? [];
        const next = cur.includes(optValue)
          ? cur.filter(v => v !== optValue)
          : [...cur, optValue];

        (onChange as (v: V[]) => void)?.(next);
      } else {
        (onChange as (v: V) => void)?.(optValue);
        close();
      }
    },
    [multi, value, onChange, close],
  );

  const handleClear = React.useCallback(() => {
    if (multi) {
      (onChange as (v: V[]) => void)?.([]);
    } else {
      (onChange as (v: V | null) => void)?.(null);
    }
    close();
  }, [multi, onChange, close]);

  const handleRemoveTag = React.useCallback(
    (v: V) => {
      if (!multi) return;
      const cur = (value as V[] | undefined) ?? [];

      (onChange as (v: V[]) => void)?.(cur.filter(x => x !== v));
    },
    [multi, value, onChange],
  );

  const hasValue = multi
    ? selectedValues.length > 0
    : value != null && value !== "";

  return {
    selectedValues,
    isSelected,
    hasValue,
    handleSelect,
    handleClear,
    handleRemoveTag,
  };
}
