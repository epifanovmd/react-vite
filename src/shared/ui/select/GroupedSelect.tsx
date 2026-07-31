import * as React from "react";

import { useFlatOptions } from "./hooks";
import { SelectListGroup, SelectListItem } from "./primitives";
import { Select } from "./Select";
import {
  type GroupedSelectProps,
  type ISelectRef,
  type OptionRenderer,
  type RenderOptionsContext,
  type SelectOption,
  type SelectOptionGroup,
  type SelectProps,
  type SelectValue,
} from "./types";

export { GroupedSelectProps };

/**
 * Строит renderOptions-колбэк для сгруппированных опций.
 */
const createGroupedRenderOptions = <V extends SelectValue>({
  groups,
  flatOptions,
  optionRender,
}: {
  groups: SelectOptionGroup<V>[];
  flatOptions: SelectOption<V>[];
  optionRender?: OptionRenderer<V>;
}): ((ctx: RenderOptionsContext<V>) => React.ReactNode) => {
  // Строим карту значение → индекс для O(1) вместо indexOf
  const indexByValue = new Map<V, number>();

  flatOptions.forEach((opt, i) => indexByValue.set(opt.value, i));

  return ({ focusedIndex, setFocusedIndex, isSelected, onSelect }) =>
    groups.map(group => (
      <SelectListGroup key={group.group} label={group.group}>
        {group.options.map(opt => {
          const flatIdx = indexByValue.get(opt.value) ?? -1;

          return (
            <SelectListItem
              key={opt.value}
              selected={isSelected(opt.value as V)}
              focused={flatIdx === focusedIndex}
              disabled={opt.disabled}
              onSelect={() => onSelect(opt.value as V)}
              onFocus={() => setFocusedIndex(flatIdx)}
              onBlur={() => setFocusedIndex(-1)}
            >
              {optionRender
                ? optionRender({
                    option: opt as SelectOption<V>,
                    index: flatIdx,
                    selected: isSelected(opt.value as V),
                    focused: flatIdx === focusedIndex,
                    disabled: !!opt.disabled,
                  })
                : opt.label}
            </SelectListItem>
          );
        })}
      </SelectListGroup>
    ));
};

const GroupedSelectInner = <V extends SelectValue = string>(
  props: GroupedSelectProps<V>,
  ref: React.ForwardedRef<ISelectRef>,
) => {
  const { groups = [], optionRender, ...rest } = props;

  const flatOptions = useFlatOptions({ groups });

  const renderOptions = React.useMemo(
    () => createGroupedRenderOptions({ groups, flatOptions, optionRender }),
    [groups, flatOptions, optionRender],
  );

  return (
    <Select<V>
      ref={ref}
      {...({
        ...rest,
        options: flatOptions,
        renderOptions,
      } as SelectProps<V>)}
    />
  );
};

export const GroupedSelect = React.forwardRef(GroupedSelectInner) as <
  V extends SelectValue = string,
>(
  props: GroupedSelectProps<V> & { ref?: React.Ref<ISelectRef> },
) => React.ReactElement;
