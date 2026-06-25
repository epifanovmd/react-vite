import { VariantProps } from "class-variance-authority";
import * as React from "react";

import { selectTriggerVariants } from "./selectVariants";

export type SelectValue = string | number | null;

export interface SelectOption<V extends SelectValue = string> {
  value: V;
  label: React.ReactNode;
  disabled?: boolean;
}

export type SelectOnChange<V extends SelectValue = string> =
  | ((v: V) => void)
  | ((v: V | null) => void)
  | ((v: V[]) => void);

export interface SelectOptionGroup<V extends SelectValue = string> {
  group: string;
  options: SelectOption<V>[];
}

export type SelectOptionsArray<V extends SelectValue = string> = SelectOption<V>[];

export type SelectOptionsFetcher<TData = unknown> = (
  query: string,
  signal: AbortSignal,
) => Promise<TData[]>;

export interface SelectDataProps<V extends SelectValue = string> {
  options: SelectOption<V>[];
  loading?: boolean;
  loadingMore?: boolean;
  search?: boolean;
  searchValue?: string;
  onSearch?: (query: string) => void;
  onScrollEnd?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export interface SelectTriggerAppearance
  extends VariantProps<typeof selectTriggerVariants> {
  placeholder?: string;
  className?: string;
}

export interface RenderOptionsContext<V extends SelectValue = string> {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  isSelected: (v: V) => boolean;
  onSelect: (v: V) => void;
}

interface SelectBaseProps<V extends SelectValue = string>
  extends SelectTriggerAppearance,
    SelectDataProps<V> {
  disabled?: boolean;
  empty?: React.ReactNode;
  renderOptions?: (ctx: RenderOptionsContext<V>) => React.ReactNode;
}

interface SelectSingleProps<V extends SelectValue = string> {
  multi?: false;
  clearable?: false;
  value?: V;
  onChange?: (value: V) => void;
}

interface SelectSingleClearableProps<V extends SelectValue = string> {
  multi?: false;
  clearable: true;
  value?: V | null;
  onChange?: (value: V | null) => void;
}

interface SelectMultiProps<V extends SelectValue = string> {
  multi: true;
  clearable?: boolean;
  value?: V[];
  onChange?: (value: V[]) => void;
  tagsDisplay?: boolean;
}

export type SelectProps<V extends SelectValue = string> = SelectBaseProps<V> &
  (SelectSingleProps<V> | SelectSingleClearableProps<V> | SelectMultiProps<V>);

export type GroupedSelectProps<V extends SelectValue = string> = Omit<
  SelectProps<V>,
  | "options"
  | "renderOptions"
  | "search"
  | "searchValue"
  | "onSearch"
  | "onScrollEnd"
  | "loadingMore"
> & {
  groups?: SelectOptionGroup<V>[];
};
