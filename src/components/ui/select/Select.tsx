import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@utils/cn";
import * as React from "react";
import { ComponentPropsWithRef } from "react";

import { Spinner } from "../spinner";
import {
  useKeyboardNav,
  useLabelCache,
  useLabelInValueBridge,
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
import { type ISelectRef, type SelectProps, type SelectValue } from "./types";

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
    onOpenChange: onOpenChangeProp,
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
    onSelect,
    onDeselect,
    onFocus,
    onBlur,
    // Dropdown positioning
    dropdownSide,
    dropdownAlign,
    dropdownSideOffset,
    dropdownAlignOffset,
    dropdownAvoidCollisions,
    dropdownCollisionPadding,
    dropdownWidth,
    dropdownMaxWidth,
    dropdownContainer,
    ...rest
  } = props;

  const multi = props.multi === true;
  const clearable = props.clearable === true;
  const tagsDisplay = !multi || props.tagsDisplay !== false;
  const labelInValue = props.labelInValue === true;
  const maxTagCount = (props as any).maxTagCount as number | undefined;

  const rawOnChange = props.onChange as ((v: unknown) => void) | undefined;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const { open, query, setQuery, handleOpen } = useSelectState({
    search,
    searchValue,
    onSearch,
  });

  // ── Label cache ───────────────────────────────────────────────────────
  const { updateCache, getLabel } = useLabelCache<V>();

  React.useMemo(() => {
    updateCache(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  // ── labelInValue bridge ───────────────────────────────────────────────
  const { normalizedValue, wrappedOnChange } = useLabelInValueBridge<V>({
    value: (props as any).value,
    onChange: rawOnChange,
    multi,
    labelInValue,
    options,
    getLabel: getLabel as (v: V) => string,
  });

  const resolvedValue = labelInValue ? normalizedValue : (props as any).value;
  const resolvedOnChange = labelInValue ? wrappedOnChange : rawOnChange;

  // ── Selection logic ──────────────────────────────────────────────────
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
    value: resolvedValue as V | V[] | null | undefined,
    onChange: resolvedOnChange as any,
    close,
  });

  // ── onSelect / onDeselect wrappers ─────────────────────────────────────
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

  // ── Keyboard nav ──────────────────────────────────────────────────────
  const { focusedIndex, setFocusedIndex, handleKeyDown, listRef } =
    useKeyboardNav({
      count: options.length,
      onSelect: i => handleSelectWrapper(options[i].value as V),
      onClose: close,
    });

  // ── Ref API ───────────────────────────────────────────────────────────
  React.useImperativeHandle(
    ref,
    () => ({
      focus() {
        if (search) {
          handleOpen(true);
          inputRef.current?.focus();
        } else {
          triggerRef.current?.focus();
        }
      },
      blur() {
        inputRef.current?.blur();
        triggerRef.current?.blur();
      },
      scrollTo(index: number) {
        const el = listRef.current?.children[index] as HTMLElement | undefined;

        el?.scrollIntoView({ block: "nearest" });
      },
      get nativeElement() {
        return triggerRef.current;
      },
    }),
    [search, handleOpen, listRef],
  );

  const showClear = clearable && !loading && hasValue;

  // ── Search input props ────────────────────────────────────────────────
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

  // ── Закрывать дропдаун, если hideEmpty и опции пропали ──────────────
  React.useEffect(() => {
    if (hideEmpty && options.length === 0 && open) {
      handleOpen(false, inputRef);
    }
  }, [hideEmpty, options.length, open, handleOpen]);

  // ── Event handlers ────────────────────────────────────────────────────
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

  const handleTriggerFocus = React.useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleTriggerBlur = React.useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      onBlur?.(e);
    },
    [onBlur],
  );

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <SelectTriggerBase
          ref={triggerRef}
          size={size}
          variant={variant}
          valid={valid}
          className={cn(className, multi && tagsDisplay && "h-auto")}
          loading={loading}
          showClear={showClear}
          onClear={handleClearWrapper}
          cursorText={search}
          tabIndex={!search ? 0 : undefined}
          onKeyDown={!search ? handleKeyDown : undefined}
          onFocus={handleTriggerFocus}
          onBlur={handleTriggerBlur}
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
            onRemoveTag={handleRemoveTagWrapper}
            maxTagCount={maxTagCount}
          />
        </SelectTriggerBase>
      </PopoverPrimitive.Trigger>

      {hideEmpty && options.length === 0 ? null : (
        <SelectPopoverContent
          onInteractOutside={onInteractOutside}
          dropdownSide={dropdownSide}
          dropdownAlign={dropdownAlign}
          dropdownSideOffset={dropdownSideOffset}
          dropdownAlignOffset={dropdownAlignOffset}
          dropdownAvoidCollisions={dropdownAvoidCollisions}
          dropdownCollisionPadding={dropdownCollisionPadding}
          dropdownWidth={dropdownWidth}
          dropdownMaxWidth={dropdownMaxWidth}
          dropdownContainer={dropdownContainer}
        >
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
                      onSelect: handleSelectWrapper,
                    })
                  : options.map((opt, index) => (
                      <SelectListItem
                        key={opt.value}
                        selected={isSelected(opt.value as V)}
                        focused={index === focusedIndex}
                        disabled={opt.disabled}
                        onSelect={() => handleSelectWrapper(opt.value as V)}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(-1)}
                      >
                        {optionRender
                          ? optionRender({
                              option: opt,
                              index,
                              selected: isSelected(opt.value as V),
                              focused: index === focusedIndex,
                              disabled: !!opt.disabled,
                            })
                          : opt.label}
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
      )}
    </PopoverPrimitive.Root>
  );
};

export const Select = React.forwardRef(SelectInner) as <
  V extends SelectValue = string,
>(
  props: SelectProps<V> & { ref?: React.Ref<ISelectRef> },
) => React.ReactElement;

(Select as { displayName?: string }).displayName = "Select";
