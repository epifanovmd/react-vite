import { cn } from "@shared/lib/utils/cn";
import * as React from "react";

import {
  useDropdownPlacement,
  useLabelCache,
  useLabelInValueBridge,
  useSearchInput,
  useSearchQuery,
  useSelectEngine,
} from "./hooks";
import {
  OptionsList,
  SelectDropdown,
  SelectTriggerBase,
  SelectTriggerContent,
} from "./primitives";
import {
  type ISelectRef,
  type SelectOnChange,
  type SelectProps,
  type SelectValue,
} from "./types";

const SelectInner = <V extends SelectValue = string>(
  props: SelectProps<V>,
  ref: React.ForwardedRef<ISelectRef>,
) => {
  const {
    options,
    loading,
    loadingMore,
    search = false,
    searchValue,
    onSearch,
    onScrollEnd,
    onOpenChange,
    disabled,
    placeholder,
    empty,
    size,
    variant,
    valid,
    className,
    renderOptions,
    optionRender,
    hideEmpty,
    closeOnClear,
    closeOnTriggerClick,
    onSelect,
    onDeselect,
    onFocus,
    onBlur,
  } = props;

  const placement = useDropdownPlacement(props);

  const multi = props.multi === true;
  const clearable = props.clearable === true;
  const tagsDisplay = !multi || props.tagsDisplay !== false;
  const labelInValue = props.labelInValue === true;
  const maxTagCount = (props as { maxTagCount?: number }).maxTagCount;

  const rawOnChange = props.onChange as ((v: unknown) => void) | undefined;

  const { query, setQuery } = useSearchQuery({ searchValue, onSearch });

  const { updateCache, getLabel } = useLabelCache<V>();

  React.useMemo(() => {
    updateCache(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const { normalizedValue, wrappedOnChange } = useLabelInValueBridge<V>({
    value: props.value,
    onChange: rawOnChange,
    multi,
    labelInValue,
    options,
    getLabel: getLabel as (v: V) => string,
  });

  const resolvedValue = labelInValue ? normalizedValue : props.value;
  const resolvedOnChange = labelInValue ? wrappedOnChange : rawOnChange;

  const engine = useSelectEngine<V>({
    ref,
    options,
    multi,
    value: resolvedValue as V | V[] | null | undefined,
    onChange: resolvedOnChange as SelectOnChange<V>,
    onSelect,
    onDeselect,
    onOpenChange,
    onScrollEnd,
    closeOnClear,
    searchable: search,
    onSearchReset: () => setQuery(""),
  });

  const { searchInputProps } = useSearchInput({
    inputRef: engine.inputRef,
    open: engine.open,
    setQuery,
    handleKeyDown: engine.handleKeyDown,
  });

  const showClear = clearable && !loading && engine.hasValue;

  return (
    <SelectDropdown
      open={engine.open}
      onOpenChange={engine.handleOpen}
      disabled={disabled}
      hidden={hideEmpty && options.length === 0}
      closeOnTriggerClick={closeOnTriggerClick ?? !search}
      onInteractOutside={engine.onInteractOutside}
      {...placement}
      trigger={
        <SelectTriggerBase
          ref={engine.triggerRef}
          size={size}
          variant={variant}
          valid={valid}
          className={cn(className, multi && tagsDisplay && "h-auto")}
          loading={loading}
          showClear={showClear}
          onClear={engine.clear}
          cursorText={search}
          tabIndex={!search ? 0 : undefined}
          onKeyDown={!search ? engine.handleKeyDown : undefined}
          onFocus={onFocus}
          onBlur={onBlur}
          data-disabled={disabled ? "" : undefined}
          style={disabled ? { pointerEvents: "none", opacity: 0.5 } : undefined}
        >
          <SelectTriggerContent<V>
            multi={multi}
            tagsDisplay={tagsDisplay}
            search={search}
            open={engine.open}
            query={query}
            placeholder={placeholder}
            disabled={disabled}
            selectedValues={engine.selectedValues}
            hasValue={engine.hasValue}
            getLabel={getLabel}
            searchInputProps={searchInputProps}
            onRemoveTag={engine.removeTag}
            maxTagCount={maxTagCount}
          />
        </SelectTriggerBase>
      }
    >
      <OptionsList<V>
        loading={loading}
        loadingMore={loadingMore}
        options={options}
        multi={multi}
        empty={empty}
        renderOptions={renderOptions}
        optionRender={optionRender}
        focusedIndex={engine.focusedIndex}
        setFocusedIndex={engine.setFocusedIndex}
        isSelected={engine.isSelected}
        onSelect={engine.select}
        listRef={engine.listRef}
        onScroll={onScrollEnd ? engine.handleScroll : undefined}
      />
    </SelectDropdown>
  );
};

export const Select = React.forwardRef(SelectInner) as <
  V extends SelectValue = string,
>(
  props: SelectProps<V> & { ref?: React.Ref<ISelectRef> },
) => React.ReactElement;
