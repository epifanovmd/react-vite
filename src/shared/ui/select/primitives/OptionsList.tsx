import * as React from "react";

import { Spinner } from "../../spinner";
import type {
  OptionRenderer,
  OptionRenderInfo,
  RenderOptionsContext,
  SelectOption,
  SelectValue,
} from "../types";
import { SelectEmpty } from "./SelectEmpty";
import { SelectListItem } from "./SelectListItem";
import { SelectLoading } from "./SelectLoading";

export interface OptionsListProps<V extends SelectValue> {
  loading?: boolean;
  loadingMore?: boolean;
  options: SelectOption<V>[];
  multi: boolean;
  empty?: React.ReactNode;
  renderOptions?: (ctx: RenderOptionsContext<V>) => React.ReactNode;
  optionRender?: OptionRenderer<V>;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  isSelected: (v: V) => boolean;
  onSelect: (v: V) => void;
  listRef: React.Ref<HTMLDivElement>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * Рендерит скроллируемый список опций с состояниями:
 * loading, empty, items, loadingMore.
 */
export function OptionsList<V extends SelectValue>({
  loading,
  loadingMore,
  options,
  multi,
  empty,
  renderOptions,
  optionRender,
  focusedIndex,
  setFocusedIndex,
  isSelected,
  onSelect,
  listRef,
  onScroll,
}: OptionsListProps<V>): React.ReactElement {
  return (
    <div
      ref={listRef}
      className="overflow-y-auto max-h-60 p-1"
      role="listbox"
      aria-multiselectable={multi}
      onScroll={onScroll}
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
                onSelect,
              })
            : options.map((opt, index) => (
                <SelectListItem
                  key={opt.value}
                  selected={isSelected(opt.value as V)}
                  focused={index === focusedIndex}
                  disabled={opt.disabled}
                  onSelect={() => onSelect(opt.value as V)}
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
                      } satisfies OptionRenderInfo<V>)
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
  );
}
