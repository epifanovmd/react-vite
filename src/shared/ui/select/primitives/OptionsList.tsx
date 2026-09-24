import { useInfiniteScrollSentinel } from "@shared/lib/hooks";
import { cn } from "@shared/lib/utils/cn";
import * as React from "react";

import { Spinner } from "../../spinner";
import type {
  OptionRenderer,
  SelectOption,
  SelectOptionGroup,
  SelectValue,
} from "../types";
import { SelectEmpty } from "./SelectEmpty";
import { SelectListGroup } from "./SelectListGroup";
import { SelectListItem } from "./SelectListItem";
import { SelectLoading } from "./SelectLoading";

export interface OptionsListProps<V extends SelectValue> {
  id?: string;
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  error?: unknown;
  options: SelectOption<V>[];
  /** Группы для отображения; индексы опций считаются по `options`. */
  groups?: SelectOptionGroup<V>[];
  multi: boolean;
  empty?: React.ReactNode;
  errorContent?: React.ReactNode;
  optionRender?: OptionRenderer<V>;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  isSelected: (v: V) => boolean;
  onSelect: (v: V) => void;
  getOptionId: (index: number) => string;
  listRef: React.RefObject<HTMLDivElement | null>;
  onScrollEnd?: () => void;
  className?: string;
  maxHeight?: number;
}

const DEFAULT_MAX_HEIGHT = 240;

const LIST_CLASS = "overflow-y-auto p-1";

/** Догрузка стартует чуть раньше, чем sentinel доедет до края списка. */
const SENTINEL_ROOT_MARGIN = "48px";

/**
 * Скроллируемый список опций с состояниями loading / error / empty /
 * items / loadingMore и догрузкой по sentinel-элементу.
 */
export const OptionsList = <V extends SelectValue>({
  id,
  loading,
  loadingMore,
  hasMore,
  error,
  options,
  groups,
  multi,
  empty,
  errorContent = "Не удалось загрузить",
  optionRender,
  focusedIndex,
  setFocusedIndex,
  isSelected,
  onSelect,
  getOptionId,
  listRef,
  onScrollEnd,
  className,
  maxHeight = DEFAULT_MAX_HEIGHT,
}: OptionsListProps<V>): React.ReactElement => {
  const selectByIndex = React.useCallback(
    (index: number) => {
      const option = options[index];

      if (option) onSelect(option.value);
    },
    [options, onSelect],
  );

  const showSentinel = !!onScrollEnd && !loading && options.length > 0;

  const sentinelRef = useInfiniteScrollSentinel<HTMLDivElement>({
    rootRef: listRef,
    hasNextPage: showSentinel && hasMore !== false,
    isFetchingNextPage: !!loadingMore,
    onLoadMore: () => onScrollEnd?.(),
    rootMargin: SENTINEL_ROOT_MARGIN,
  });

  const style = React.useMemo(() => ({ maxHeight }), [maxHeight]);

  const indexByValue = React.useMemo(() => {
    const map = new Map<V, number>();

    options.forEach((option, index) => map.set(option.value, index));

    return map;
  }, [options]);

  const renderItem = (option: SelectOption<V>) => {
    const index = indexByValue.get(option.value) ?? -1;
    const selected = isSelected(option.value);
    const focused = index === focusedIndex;
    const disabled = !!option.disabled;
    const content = optionRender
      ? optionRender({ option, index, selected, focused, disabled })
      : option.label;

    return (
      <SelectListItem
        key={option.value}
        id={getOptionId(index)}
        index={index}
        selected={selected}
        focused={focused}
        disabled={disabled}
        onSelect={selectByIndex}
        onFocus={setFocusedIndex}
      >
        {content}
      </SelectListItem>
    );
  };

  const renderItems = () => {
    if (!groups) return options.map(renderItem);

    // В группах показываются только опции из `options` (после фильтрации).
    return groups
      .map(group => ({
        ...group,
        options: group.options.filter(option => indexByValue.has(option.value)),
      }))
      .filter(group => group.options.length > 0)
      .map(group => (
        <SelectListGroup key={group.group} label={group.group}>
          {group.options.map(renderItem)}
        </SelectListGroup>
      ));
  };

  const renderContent = () => {
    if (loading) return <SelectLoading />;
    if (error) return <SelectEmpty>{errorContent}</SelectEmpty>;
    if (options.length === 0) return <SelectEmpty>{empty}</SelectEmpty>;

    return renderItems();
  };

  return (
    <div
      ref={listRef}
      id={id}
      className={cn(LIST_CLASS, className)}
      style={style}
      role="listbox"
      aria-multiselectable={multi}
    >
      {renderContent()}
      {loadingMore && (
        <div className="flex items-center justify-center py-2">
          <Spinner size="sm" />
        </div>
      )}
      {showSentinel && <div ref={sentinelRef} aria-hidden className="h-px" />}
    </div>
  );
};
