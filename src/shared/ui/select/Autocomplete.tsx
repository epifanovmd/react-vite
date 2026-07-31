import { useMergedRef } from "@mantine/hooks";
import { cn } from "@shared/lib/utils/cn";
import type { FactoryOpts } from "imask";
import * as React from "react";

import { type MaskedInputChangeInfo, useMaskedInput } from "../masked-input";
import { useDropdownPlacement, useSelectEngine } from "./hooks";
import { OptionsList, SelectDropdown, SelectTriggerBase } from "./primitives";
import { selectSearchInputClasses } from "./select-variants";
import { type AutocompleteProps, type ISelectRef } from "./types";

const FREE_TEXT_MASK: FactoryOpts = { mask: /^.*$/ };

const AutocompleteInner = <V extends string = string>(
  props: AutocompleteProps<V>,
  ref: React.ForwardedRef<ISelectRef>,
) => {
  const {
    options,
    mask = FREE_TEXT_MASK,
    loading,
    loadingMore,
    onSearch,
    onScrollEnd,
    onOpenChange,
    disabled,
    placeholder,
    empty,
    optionRender,
    renderOptions,
    hideEmpty = true,
    onSelect,
    onDeselect,
    onFocus,
    onBlur,
    value,
    onChange,
    clearable = true,
    size,
    variant,
    valid,
    className,
  } = props;

  const placement = useDropdownPlacement(props);

  const text = value ?? "";

  const setValueRef = React.useRef<(v: string) => void>(() => {});

  const handleEngineChange = React.useCallback(
    (v: V | null) => {
      const next = v == null ? "" : String(v);

      setValueRef.current(next);
      onChange?.(next);
    },
    [onChange],
  );

  const engine = useSelectEngine<V>({
    ref,
    options,
    multi: false,
    value: text === "" ? null : (text as V),
    onChange: handleEngineChange,
    onSelect,
    onDeselect,
    onOpenChange,
    onScrollEnd,
    searchable: true,
  });

  const handleInputChange = (info: MaskedInputChangeInfo<FactoryOpts>) => {
    onSearch?.(info.value);
    onChange?.(info.unmaskedValue);
    if (!engine.open) engine.handleOpen(true);
  };

  const {
    ref: maskRef,
    value: displayValue,
    unmaskedValue,
    setValue,
  } = useMaskedInput<FactoryOpts>({
    mask,
    disabled,
    onChange: handleInputChange,
  });

  setValueRef.current = setValue;

  const isOptionSelected = React.useCallback(
    (v: V) => unmaskedValue !== "" && String(v) === unmaskedValue,
    [unmaskedValue],
  );

  const mergedInputRef = useMergedRef(engine.inputRef, maskRef);

  const showClear = clearable && !loading && displayValue !== "";

  return (
    <SelectDropdown
      open={engine.open}
      onOpenChange={engine.handleOpen}
      disabled={disabled}
      hidden={hideEmpty && options.length === 0 && !loading}
      onInteractOutside={engine.onInteractOutside}
      {...placement}
      trigger={
        <SelectTriggerBase
          ref={engine.triggerRef}
          size={size}
          variant={variant}
          valid={valid}
          className={cn("cursor-text", className)}
          loading={loading}
          showClear={showClear}
          onClear={engine.clear}
          cursorText
          hideChevron
          onFocus={onFocus}
          onBlur={onBlur}
          data-disabled={disabled ? "" : undefined}
          style={disabled ? { pointerEvents: "none", opacity: 0.5 } : undefined}
        >
          <input
            ref={mergedInputRef}
            className={selectSearchInputClasses}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            role="combobox"
            aria-expanded={engine.open}
            aria-autocomplete="list"
            onKeyDown={engine.handleKeyDown}
            onPointerDown={e => {
              // не даём Popover.Trigger закрыть открытый дропдаун
              if (engine.open) e.stopPropagation();
            }}
          />
        </SelectTriggerBase>
      }
    >
      <OptionsList<V>
        loading={loading}
        loadingMore={loadingMore}
        options={options}
        multi={false}
        empty={empty}
        optionRender={optionRender}
        renderOptions={renderOptions}
        focusedIndex={engine.focusedIndex}
        setFocusedIndex={engine.setFocusedIndex}
        isSelected={isOptionSelected}
        onSelect={engine.select}
        listRef={engine.listRef}
        onScroll={onScrollEnd ? engine.handleScroll : undefined}
      />
    </SelectDropdown>
  );
};

export const Autocomplete = React.forwardRef(AutocompleteInner) as <
  V extends string = string,
>(
  props: AutocompleteProps<V> & { ref?: React.Ref<ISelectRef> },
) => React.ReactElement;
