import { useControllableState, useEvent } from "@shared/lib/hooks";
import * as React from "react";

import type { SelectOption, SelectRef, SelectValue } from "../types";
import { useKeyboardNav } from "./use-keyboard-nav";

export interface UseSelectEngineOptions<V extends SelectValue> {
  ref: React.ForwardedRef<SelectRef>;
  options: SelectOption<V>[];
  multi?: boolean;
  value: V | V[] | null | undefined;
  onChange?: (value: V | V[] | null) => void;
  onSelect?: (value: V, option: SelectOption<V>) => void;
  onDeselect?: (value: V, option: SelectOption<V>) => void;
  /** Управляемое открытие. */
  open?: boolean;
  /** Вызывается при любой смене open, включая программное закрытие. */
  onOpenChange?: (open: boolean) => void;
  /** Закрывать дропдаун при очистке значения (по умолчанию true). */
  closeOnClear?: boolean;
  /** Триггер содержит текстовый инпут: автофокус при открытии,
   *  печать открывает список. */
  searchable?: boolean;
  /** Сброс поисковой строки: при закрытии дропдауна и после каждого
   *  переключения опции (в multi дропдаун остаётся открытым). */
  onSearchReset?: () => void;
}

export interface UseSelectEngineResult<V extends SelectValue> {
  open: boolean;
  handleOpen: (nextOpen: boolean) => void;
  close: () => void;
  /** Поисковый инпут (search-режим). */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** Кнопка-триггер (режим без поиска). */
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  /** Внешняя оболочка поля — `nativeElement` ref-API. */
  triggerRef: React.RefObject<HTMLDivElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  listboxId: string;
  getOptionId: (index: number) => string;
  activeDescendant: string | undefined;
  selectedValues: V[];
  isSelected: (v: V) => boolean;
  hasValue: boolean;
  select: (v: V) => void;
  clear: () => void;
  removeTag: (v: V) => void;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

const isEmptyValue = (value: unknown): boolean => value == null || value === "";

/**
 * Headless-ядро выпадающего списка: state открытия, выбор значения,
 * клавиатурная навигация и ref-API. Варианты (Select, Autocomplete, ...)
 * подключают к нему своё представление.
 */
export const useSelectEngine = <V extends SelectValue>({
  ref,
  options,
  multi = false,
  value,
  onChange,
  onSelect,
  onDeselect,
  open: openProp,
  onOpenChange,
  closeOnClear = true,
  searchable = false,
  onSearchReset,
}: UseSelectEngineOptions<V>): UseSelectEngineResult<V> => {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: false,
    onChange: onOpenChange,
  });

  const inputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const listboxId = React.useId();

  const getOptionId = React.useCallback(
    (index: number) => `${listboxId}-option-${index}`,
    [listboxId],
  );

  const selectedValues = React.useMemo<V[]>(() => {
    if (multi) return (value as V[] | undefined) ?? [];

    return isEmptyValue(value) ? [] : [value as V];
  }, [multi, value]);

  const isSelected = React.useCallback(
    (v: V) => selectedValues.includes(v),
    [selectedValues],
  );

  const hasValue = selectedValues.length > 0;

  const resetFocusRef = React.useRef<() => void>(() => {});

  const handleOpen = useEvent((nextOpen: boolean) => {
    if (open === nextOpen) return;
    setOpen(nextOpen);

    if (nextOpen) {
      resetFocusRef.current();
    } else {
      onSearchReset?.();
    }
  });

  const close = React.useCallback(() => handleOpen(false), [handleOpen]);

  React.useEffect(() => {
    if (open && searchable) inputRef.current?.focus();
  }, [open, searchable]);

  const findOption = useEvent((v: V) => options.find(o => o.value === v));

  const select = useEvent((v: V) => {
    const option = findOption(v);
    const wasSelected = selectedValues.includes(v);

    if (multi) {
      const next = wasSelected
        ? selectedValues.filter(x => x !== v)
        : [...selectedValues, v];

      onChange?.(next);
    } else {
      onChange?.(v);
      close();
    }

    if (option) {
      if (multi && wasSelected) onDeselect?.(v, option);
      else onSelect?.(v, option);
    }

    onSearchReset?.();
  });

  const clear = useEvent(() => {
    selectedValues.forEach(v => {
      const option = findOption(v);

      if (option) onDeselect?.(v, option);
    });
    onChange?.(multi ? [] : null);
    if (closeOnClear) close();
  });

  const removeTag = useEvent((v: V) => {
    if (!multi) return;
    const option = findOption(v);

    if (option) onDeselect?.(v, option);
    onChange?.(selectedValues.filter(x => x !== v));
  });

  const isDisabled = useEvent((index: number) => !!options[index]?.disabled);

  const selectByIndex = useEvent((index: number) => {
    const option = options[index];

    if (option && !option.disabled) select(option.value);
  });

  const openList = React.useCallback(() => handleOpen(true), [handleOpen]);

  const { focusedIndex, setFocusedIndex, handleKeyDown, listRef, resetFocus } =
    useKeyboardNav({
      open,
      count: options.length,
      isDisabled,
      onSelect: selectByIndex,
      onOpen: openList,
      onClose: close,
      openOnType: searchable,
      resetKey: options,
    });

  resetFocusRef.current = resetFocus;

  const activeDescendant =
    open && focusedIndex >= 0 ? getOptionId(focusedIndex) : undefined;

  React.useImperativeHandle(
    ref,
    () => ({
      focus() {
        (inputRef.current ?? buttonRef.current)?.focus();
      },
      blur() {
        inputRef.current?.blur();
        buttonRef.current?.blur();
      },
      open(nextOpen = true) {
        handleOpen(nextOpen);
      },
      scrollTo(index: number) {
        const item =
          listRef.current?.querySelectorAll<HTMLElement>('[role="option"]')[
            index
          ];

        item?.scrollIntoView?.({ block: "nearest" });
      },
      get nativeElement() {
        return triggerRef.current;
      },
    }),
    [handleOpen, listRef],
  );

  return {
    open,
    handleOpen,
    close,
    inputRef,
    buttonRef,
    triggerRef,
    listRef,
    listboxId,
    getOptionId,
    activeDescendant,
    selectedValues,
    isSelected,
    hasValue,
    select,
    clear,
    removeTag,
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
  };
};
