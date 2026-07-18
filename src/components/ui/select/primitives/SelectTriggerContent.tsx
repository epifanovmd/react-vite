import { cn } from "@utils/cn";
import * as React from "react";
import { type ComponentPropsWithRef } from "react";

import { SelectTag } from "./SelectTag";

export interface SelectTriggerContentProps<V> {
  multi: boolean;
  tagsDisplay: boolean;
  search: boolean;
  open: boolean;
  query: string;
  placeholder?: string;
  disabled?: boolean;
  selectedValues: V[];
  hasValue: boolean;
  getLabel: (v: V) => React.ReactNode;
  searchInputProps: ComponentPropsWithRef<"input">;
  onRemoveTag: (v: V) => void;
  maxTagCount?: number;
}

export function SelectTriggerContent<V>({
  multi,
  tagsDisplay,
  search,
  open,
  query,
  placeholder,
  disabled,
  selectedValues,
  hasValue,
  getLabel,
  searchInputProps,
  onRemoveTag,
  maxTagCount,
}: SelectTriggerContentProps<V>): React.ReactElement {
  if (multi) {
    const vals = selectedValues;

    if (tagsDisplay) {
      if (!search && vals.length === 0) {
        return (
          <span className="flex-1 truncate text-sm text-muted-foreground">
            {placeholder}
          </span>
        );
      }

      const visibleVals =
        maxTagCount != null && vals.length > maxTagCount
          ? vals.slice(0, maxTagCount)
          : vals;
      const overflowCount =
        maxTagCount != null ? vals.length - maxTagCount : 0;

      return (
        <div className="flex flex-wrap gap-1 flex-1 min-w-0 overflow-hidden items-center py-0.5">
          {visibleVals.map((v, index) => (
            <SelectTag
              key={index}
              label={getLabel(v)}
              onRemove={() => onRemoveTag(v)}
              disabled={disabled}
            />
          ))}
          {overflowCount > 0 && (
            <span className="inline-flex items-center rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-muted-foreground opacity-60">
              +{overflowCount}
            </span>
          )}
          {search && (
            <input
              {...searchInputProps}
              value={open ? query : ""}
              placeholder={vals.length === 0 ? placeholder : undefined}
            />
          )}
        </div>
      );
    }

    const commaLabel =
      vals.length > 0
        ? vals.map(v => String(getLabel(v))).join(", ")
        : undefined;

    if (search) {
      return (
        <input
          {...searchInputProps}
          value={open ? query : (commaLabel ?? "")}
          placeholder={
            open
              ? (commaLabel ?? placeholder)
              : commaLabel
                ? undefined
                : placeholder
          }
        />
      );
    }

    return (
      <span
        className={cn(
          "flex-1 truncate text-sm",
          !commaLabel && "text-muted-foreground",
        )}
      >
        {commaLabel ?? placeholder}
      </span>
    );
  }

  if (search) {
    const displayLabel = hasValue
      ? String(getLabel(selectedValues[0]))
      : undefined;

    return (
      <input
        {...searchInputProps}
        value={open ? query : (displayLabel ?? "")}
        placeholder={
          open
            ? (displayLabel ?? placeholder)
            : hasValue
              ? undefined
              : placeholder
        }
      />
    );
  }

  return (
    <span
      className={cn(
        "flex-1 truncate text-sm",
        !hasValue && "text-muted-foreground",
      )}
    >
      {hasValue ? String(getLabel(selectedValues[0])) : placeholder}
    </span>
  );
}
