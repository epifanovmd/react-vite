import * as React from "react";
import { type ComponentPropsWithRef } from "react";

import { cn } from "../../foundation";
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

      return (
        <div className="flex flex-wrap gap-1 flex-1 min-w-0 overflow-hidden items-center py-0.5">
          {vals.map((v, index) => (
            <SelectTag
              key={index}
              label={getLabel(v)}
              onRemove={() => onRemoveTag(v)}
              disabled={disabled}
            />
          ))}
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
