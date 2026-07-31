import * as React from "react";

import type {
  ISelectRef,
  SelectOnChange,
  SelectOption,
  SelectValue,
} from "../types";
import { useKeyboardNav } from "./use-keyboard-nav";
import { useSelectCallbacks } from "./use-select-callbacks";
import { useSelectDropdown } from "./use-select-dropdown";
import { useSelectRef } from "./use-select-ref";
import { useSelectValue } from "./use-select-value";

export interface UseSelectEngineOptions<V extends SelectValue> {
  ref: React.ForwardedRef<ISelectRef>;
  options: SelectOption<V>[];
  multi?: boolean;
  value: V | V[] | null | undefined;
  onChange?: SelectOnChange<V>;
  onSelect?: (value: V, option: SelectOption<V>) => void;
  onDeselect?: (value: V, option: SelectOption<V>) => void;
  /** Вызывается при любой смене open, включая программное закрытие. */
  onOpenChange?: (open: boolean) => void;
  onScrollEnd?: () => void;
  /** Закрывать дропдаун при очистке значения (по умолчанию true). */
  closeOnClear?: boolean;
  /** Триггер содержит текстовый инпут: автофокус при открытии,
   *  защита от закрытия по клику внутрь триггера. */
  searchable?: boolean;
  /** Сброс поисковой строки: при закрытии дропдауна и после каждого
   *  переключения опции (в multi дропдаун остаётся открытым). */
  onSearchReset?: () => void;
}

export interface UseSelectEngineResult<V extends SelectValue> {
  open: boolean;
  handleOpen: (nextOpen: boolean) => void;
  close: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  selectedValues: V[];
  isSelected: (v: V) => boolean;
  hasValue: boolean;
  select: (v: V) => void;
  clear: () => void;
  removeTag: (v: V) => void;
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  onInteractOutside: (e: Event) => void;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * Headless-ядро выпадающего списка: state открытия, выбор значения,
 * клавиатурная навигация, ref-API и поведение дропдауна. Варианты
 * (Select, Autocomplete, ...) подключают к нему своё представление.
 */
export const useSelectEngine = <V extends SelectValue>({
  ref,
  options,
  multi = false,
  value,
  onChange,
  onSelect,
  onDeselect,
  onOpenChange,
  onScrollEnd,
  closeOnClear,
  searchable = false,
  onSearchReset,
}: UseSelectEngineOptions<V>): UseSelectEngineResult<V> => {
  const [open, setOpen] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const openRef = React.useRef(open);
  const onSearchResetRef = React.useRef(onSearchReset);
  const onOpenChangeRef = React.useRef(onOpenChange);

  openRef.current = open;
  onSearchResetRef.current = onSearchReset;
  onOpenChangeRef.current = onOpenChange;

  const handleOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (openRef.current === nextOpen) return;
      openRef.current = nextOpen;

      setOpen(nextOpen);
      onOpenChangeRef.current?.(nextOpen);

      if (nextOpen) {
        if (searchable) setTimeout(() => inputRef.current?.focus(), 0);
      } else {
        onSearchResetRef.current?.();
      }
    },
    [searchable],
  );

  const close = React.useCallback(() => handleOpen(false), [handleOpen]);

  const {
    selectedValues,
    isSelected,
    hasValue,
    handleSelect,
    handleClear,
    handleRemoveTag,
  } = useSelectValue<V>({ multi, value, onChange, close, closeOnClear });

  const { handleSelectWrapper, handleClearWrapper, handleRemoveTagWrapper } =
    useSelectCallbacks<V>({
      options,
      selectedValues,
      handleSelect,
      handleClear,
      handleRemoveTag,
      onSelect,
      onDeselect,
    });

  const select = React.useCallback(
    (v: V) => {
      handleSelectWrapper(v);
      onSearchResetRef.current?.();
    },
    [handleSelectWrapper],
  );

  const { focusedIndex, setFocusedIndex, handleKeyDown, listRef } =
    useKeyboardNav({
      count: options.length,
      onSelect: i => {
        const opt = options[i];

        if (opt && !opt.disabled) select(opt.value);
      },
      onClose: close,
    });

  useSelectRef({
    ref,
    search: searchable,
    handleOpen,
    inputRef,
    triggerRef,
    listRef,
  });

  const { onInteractOutside, handleScroll } = useSelectDropdown({
    search: searchable,
    inputRef,
    onScrollEnd,
  });

  return {
    open,
    handleOpen,
    close,
    inputRef,
    triggerRef,
    listRef,
    selectedValues,
    isSelected,
    hasValue,
    select,
    clear: handleClearWrapper,
    removeTag: handleRemoveTagWrapper,
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    onInteractOutside,
    handleScroll,
  };
};
