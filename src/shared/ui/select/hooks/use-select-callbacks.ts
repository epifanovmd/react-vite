import * as React from "react";

import type { SelectOption, SelectValue } from "../types";

export interface UseSelectCallbacksOptions<V extends SelectValue> {
  options: SelectOption<V>[];
  selectedValues: V[];
  handleSelect: (v: V) => void;
  handleClear: () => void;
  handleRemoveTag: (v: V) => void;
  onSelect?: (value: V, option: SelectOption<V>) => void;
  onDeselect?: (value: V, option: SelectOption<V>) => void;
}

export interface UseSelectCallbacksResult<V extends SelectValue> {
  handleSelectWrapper: (value: V) => void;
  handleClearWrapper: () => void;
  handleRemoveTagWrapper: (v: V) => void;
}

/**
 * Оборачивает selection-операции вызовами `onSelect`/`onDeselect`.
 */
export function useSelectCallbacks<V extends SelectValue>({
  options,
  selectedValues,
  handleSelect,
  handleClear,
  handleRemoveTag,
  onSelect,
  onDeselect,
}: UseSelectCallbacksOptions<V>): UseSelectCallbacksResult<V> {
  const optionsRef = React.useRef(options);

  optionsRef.current = options;

  const handleSelectWrapper = React.useCallback(
    (value: V) => {
      const option = optionsRef.current.find(o => o.value === value);
      const wasSelected = selectedValues.includes(value);

      handleSelect(value);

      if (option) {
        if (wasSelected) {
          onDeselect?.(value, option);
        } else {
          onSelect?.(value, option);
        }
      }
    },
    [handleSelect, onSelect, onDeselect, selectedValues],
  );

  const handleClearWrapper = React.useCallback(() => {
    if (onDeselect) {
      selectedValues.forEach(v => {
        const option = optionsRef.current.find(o => o.value === v);

        if (option) onDeselect(v, option);
      });
    }
    handleClear();
  }, [selectedValues, onDeselect, handleClear]);

  const handleRemoveTagWrapper = React.useCallback(
    (v: V) => {
      const option = optionsRef.current.find(o => o.value === v);

      if (option && onDeselect) onDeselect(v, option);
      handleRemoveTag(v);
    },
    [onDeselect, handleRemoveTag],
  );

  return { handleSelectWrapper, handleClearWrapper, handleRemoveTagWrapper };
}
