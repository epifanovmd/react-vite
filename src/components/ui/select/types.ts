import { VariantProps } from "class-variance-authority";
import * as React from "react";

import { selectTriggerVariants } from "./selectVariants";

export interface SelectOption<V extends string = string> {
  value: V;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectOptionGroup<V extends string = string> {
  group: string;
  options: SelectOption<V>[];
}

export type SelectOptionsArray<V extends string = string> = SelectOption<V>[];

export type SelectOptionsGetter<V extends string = string> = (
  query: string,
) => SelectOption<V>[];

export type SelectOptionsFetcher<TData = unknown> = (
  query: string,
  signal?: AbortSignal,
) => Promise<TData[]>;

export interface SelectTriggerAppearance
  extends VariantProps<typeof selectTriggerVariants> {
  placeholder?: string;

  className?: string;
}

export interface RenderOptionsContext<V extends string = string> {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  isSelected: (v: V) => boolean;
  onSelect: (v: V) => void;
}

interface SelectBaseProps<TData = unknown, V extends string = string>
  extends SelectTriggerAppearance {
  options?: SelectOptionsArray<V> | SelectOptionsGetter<V>;
  fetchOptions?: SelectOptionsFetcher<TData>;
  getOption?: (item: TData) => SelectOption<V>;
  search?: boolean;
  fetchOnMount?: boolean;
  loadOnce?: boolean;
  debounce?: number;
  loading?: boolean;
  disabled?: boolean;
  empty?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  renderOptions?: (ctx: RenderOptionsContext<V>) => React.ReactNode;
}

interface SelectSingleProps<V extends string = string> {
  multi?: false;
  clearable?: false;
  value?: V;
  onChange?: (value: V) => void;
}

interface SelectSingleClearableProps<V extends string = string> {
  multi?: false;
  clearable: true;
  value?: V | null;
  onChange?: (value: V | null) => void;
}

interface SelectMultiProps<V extends string = string> {
  multi: true;
  clearable?: boolean;
  value?: V[];
  onChange?: (value: V[]) => void;
  tagsDisplay?: boolean;
}

export type SelectProps<
  TData = unknown,
  V extends string = string,
> = SelectBaseProps<TData, V> &
  (SelectSingleProps<V> | SelectSingleClearableProps<V> | SelectMultiProps<V>);

export type GroupedSelectProps<V extends string = string> = Omit<
  SelectProps<unknown, V>,
  | "options"
  | "fetchOptions"
  | "getOption"
  | "search"
  | "fetchOnMount"
  | "debounce"
  | "renderOptions"
> & {
  groups?: SelectOptionGroup<V>[];
};
