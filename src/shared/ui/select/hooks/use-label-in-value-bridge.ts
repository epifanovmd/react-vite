import * as React from "react";

import type { LabeledValue, SelectOption, SelectValue } from "../types";

export interface UseLabelInValueBridgeOptions<V extends SelectValue> {
  value?: V | V[] | LabeledValue<V> | LabeledValue<V>[] | null;
  onChange?: (...args: any[]) => void;
  multi: boolean;
  labelInValue: boolean;
  options: SelectOption<V>[];
  getLabel?: (v: V) => string;
}

export interface UseLabelInValueBridgeResult<V extends SelectValue> {
  normalizedValue: V | V[] | null | undefined;
  wrappedOnChange: (...args: any[]) => void;
}

/**
 * Конвертирует `LabeledValue<V>` ↔ `V` для labelInValue-режима.
 *
 * - `normalizedValue`: извлекает `value` из `LabeledValue`, отдаёт голое V.
 * - `wrappedOnChange`: на вход получает голое `V`, находит label в options/кэше,
 *   возвращает `LabeledValue<V>` в оригинальный `onChange`.
 */
export function useLabelInValueBridge<V extends SelectValue>({
  value,
  onChange,
  multi,
  labelInValue,
  options,
  getLabel,
}: UseLabelInValueBridgeOptions<V>): UseLabelInValueBridgeResult<V> {
  const optionsRef = React.useRef(options);

  optionsRef.current = options;

  const getLabelRef = React.useRef(getLabel);

  getLabelRef.current = getLabel;

  const normalizedValue = React.useMemo<V | V[] | null | undefined>(() => {
    if (!labelInValue || value == null) return value as V | V[] | null | undefined;

    if (multi) {
      return (value as LabeledValue<V>[]).map(v => v.value) as V[];
    }

    return (value as LabeledValue<V>).value as V;
  }, [labelInValue, value, multi]);

  const buildLabeledValue = React.useCallback(
    (raw: V): LabeledValue<V> => {
      const option = optionsRef.current.find(o => o.value === raw);

      if (option) {
        return {
          value: raw,
          label: String(option.label ?? ""),
          key: raw,
          disabled: option.disabled,
        };
      }

      if (getLabelRef.current) {
        return { value: raw, label: getLabelRef.current(raw), key: raw };
      }

      return { value: raw, label: String(raw), key: raw };
    },
    [],
  );

  const wrappedOnChange = React.useCallback(
    (...args: any[]) => {
      if (!labelInValue || !onChange) {
        onChange?.(...args);

        return;
      }

      const rawValue = args[0] as V | V[] | null;

      if (multi) {
        const labeled = (rawValue as V[]).map(buildLabeledValue);

        (onChange as (v: LabeledValue<V>[]) => void)(labeled);
      } else {
        const labeled = rawValue != null ? buildLabeledValue(rawValue as V) : null;

        (onChange as (v: LabeledValue<V> | null) => void)(labeled);
      }
    },
    [labelInValue, onChange, multi, buildLabeledValue],
  );

  return { normalizedValue, wrappedOnChange };
}
