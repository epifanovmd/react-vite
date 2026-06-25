import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";
import { ComponentPropsWithRef } from "react";

import { Spinner } from "../spinner";
import {
  useKeyboardNav,
  useLabelCache,
  useSelectState,
  useSelectValue,
} from "./hooks";
import {
  SelectEmpty,
  SelectListItem,
  SelectLoading,
  SelectPopoverContent,
  SelectTriggerBase,
  SelectTriggerContent,
} from "./primitives";
import { type SelectOnChange, type SelectProps } from "./types";

export interface SelectHandle {
  focus(): void;
}

const SelectInner = <V extends string = string>(
  props: SelectProps<V>,
  ref: React.ForwardedRef<SelectHandle>,
) => {
  const {
    options,
    loading,
    loadingMore,
    search = false,
    searchValue,
    onSearch,
    onScrollEnd,
    onOpenChange: onOpenChangeProp,
    disabled,
    placeholder,
    empty,
    size,
    variant,
    className,
    renderOptions,
  } = props;

  const multi = props.multi === true;
  const clearable = props.clearable === true;
  const tagsDisplay = !multi || props.tagsDisplay !== false;

  const onChange = props.onChange as SelectOnChange | undefined;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const { open, query, setQuery, handleOpen } = useSelectState({
    search,
    searchValue,
    onSearch,
  });

  React.useImperativeHandle(ref, () => ({
    focus() {
      if (search) {
        handleOpen(true);
        inputRef.current?.focus();
      } else {
        triggerRef.current?.focus();
      }
    },
  }));

  const { updateCache, getLabel } = useLabelCache<V>();

  React.useMemo(() => {
    updateCache(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const close = React.useCallback(
    () => handleOpen(false, inputRef),
    [handleOpen],
  );

  const {
    selectedValues,
    isSelected,
    hasValue,
    handleSelect,
    handleClear,
    handleRemoveTag,
  } = useSelectValue<V>({
    multi,
    value: props.value as V | V[] | null | undefined,
    onChange,
    close,
  });

  const { focusedIndex, setFocusedIndex, handleKeyDown, listRef } =
    useKeyboardNav({
      count: options.length,
      onSelect: i => handleSelect(options[i].value as V),
      onClose: close,
    });

  const showClear = clearable && !loading && hasValue;

  const searchInputProps: ComponentPropsWithRef<"input"> = {
    ref: inputRef,
    className:
      "flex-1 min-w-0 bg-transparent outline-none text-inherit placeholder:text-muted-foreground cursor-text text-sm",
    readOnly: !open,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setQuery(e.target.value),
    onKeyDown: handleKeyDown,
    onPointerDown: (e: React.PointerEvent) => {
      if (open) e.stopPropagation();
    },
  };

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      handleOpen(nextOpen, inputRef);
      onOpenChangeProp?.(nextOpen);
    },
    [handleOpen, onOpenChangeProp],
  );

  const onInteractOutside = React.useCallback(
    (e: Event) => {
      if (!search) return;
      if (
        inputRef.current &&
        e.target instanceof Node &&
        inputRef.current
          .closest("[data-radix-popover-trigger]")
          ?.contains(e.target)
      ) {
        e.preventDefault();
      }
    },
    [search],
  );

  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!onScrollEnd) return;
      const el = e.currentTarget;

      if (el.scrollHeight - el.scrollTop - el.clientHeight < 48) onScrollEnd();
    },
    [onScrollEnd],
  );

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <SelectTriggerBase
          ref={triggerRef}
          size={size}
          variant={variant}
          className={className}
          loading={loading}
          showClear={showClear}
          onClear={handleClear}
          cursorText={search}
          tabIndex={!search ? 0 : undefined}
          onKeyDown={!search ? handleKeyDown : undefined}
          data-disabled={disabled ? "" : undefined}
          style={disabled ? { pointerEvents: "none", opacity: 0.5 } : undefined}
        >
          <SelectTriggerContent<V>
            multi={multi}
            tagsDisplay={tagsDisplay}
            search={search}
            open={open}
            query={query}
            placeholder={placeholder}
            disabled={disabled}
            selectedValues={selectedValues}
            hasValue={hasValue}
            getLabel={getLabel}
            searchInputProps={searchInputProps}
            onRemoveTag={handleRemoveTag}
          />
        </SelectTriggerBase>
      </PopoverPrimitive.Trigger>

      <SelectPopoverContent onInteractOutside={onInteractOutside}>
        <div
          ref={listRef}
          className="overflow-y-auto max-h-60 p-1"
          role="listbox"
          aria-multiselectable={multi}
          onScroll={onScrollEnd ? handleScroll : undefined}
        >
          {loading ? (
            <SelectLoading />
          ) : options.length === 0 ? (
            <SelectEmpty>{empty}</SelectEmpty>
          ) : (
            <>
              {renderOptions
                ? renderOptions({
                    focusedIndex,
                    setFocusedIndex,
                    isSelected,
                    onSelect: handleSelect,
                  })
                : options.map((opt, index) => (
                    <SelectListItem
                      key={opt.value}
                      selected={isSelected(opt.value as V)}
                      focused={index === focusedIndex}
                      disabled={opt.disabled}
                      onSelect={() => handleSelect(opt.value as V)}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(-1)}
                    >
                      {opt.label}
                    </SelectListItem>
                  ))}
              {loadingMore && (
                <div className="flex items-center justify-center py-2">
                  <Spinner size="sm" />
                </div>
              )}
            </>
          )}
        </div>
      </SelectPopoverContent>
    </PopoverPrimitive.Root>
  );
};

export const Select = React.forwardRef(SelectInner) as <
  V extends string = string,
>(
  props: SelectProps<V> & { ref?: React.Ref<SelectHandle> },
) => React.ReactElement;

(Select as { displayName?: string }).displayName = "Select";
