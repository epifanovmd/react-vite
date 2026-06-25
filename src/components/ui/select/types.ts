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

// ─── Filter / Render ──────────────────────────────────────────────────────

export type FilterOptionPredicate<V extends SelectValue = string> = (
  query: string,
  option: SelectOption<V>,
) => boolean;

export interface OptionRenderInfo<V extends SelectValue = string> {
  option: SelectOption<V>;
  index: number;
  selected: boolean;
  focused: boolean;
  disabled: boolean;
}

export type OptionRenderer<V extends SelectValue = string> = (
  info: OptionRenderInfo<V>,
) => React.ReactNode;

// ─── LabelInValue ─────────────────────────────────────────────────────────

export interface LabeledValue<V extends SelectValue = string> {
  value: V;
  label?: string;
  key?: V;
  disabled?: boolean;
}

// ─── Ref API ──────────────────────────────────────────────────────────────

export interface ISelectRef {
  focus: () => void;
  blur: () => void;
  scrollTo: (index: number) => void;
  nativeElement: HTMLElement | null;
}

// ─── Dropdown positioning ─────────────────────────────────────────────────

export type DropdownSide = "top" | "right" | "bottom" | "left";
export type DropdownAlign = "start" | "center" | "end";
export type DropdownCollisionPadding =
  | number
  | Partial<Record<DropdownSide, number>>;
export type DropdownWidth = "trigger" | "auto" | number;
export type DropdownMaxWidth = "trigger" | number;

export interface DropdownPlacementProps {
  dropdownSide?: DropdownSide;
  dropdownAlign?: DropdownAlign;
  dropdownSideOffset?: number;
  dropdownAlignOffset?: number;
  dropdownAvoidCollisions?: boolean;
  dropdownCollisionPadding?: DropdownCollisionPadding;
  dropdownWidth?: DropdownWidth;
  dropdownMaxWidth?: DropdownMaxWidth;
  dropdownContainer?: HTMLElement | null;
}

// ─── Appearance ───────────────────────────────────────────────────────────

export interface SelectTriggerAppearance
  extends VariantProps<typeof selectTriggerVariants> {
  placeholder?: string;
  className?: string;
  valid?: boolean;
}

export interface RenderOptionsContext<V extends SelectValue = string> {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  isSelected: (v: V) => boolean;
  onSelect: (v: V) => void;
}

interface SelectBaseProps<V extends SelectValue = string>
  extends SelectTriggerAppearance,
    SelectDataProps<V>,
    DropdownPlacementProps {
  disabled?: boolean;
  empty?: React.ReactNode;
  renderOptions?: (ctx: RenderOptionsContext<V>) => React.ReactNode;
  optionRender?: OptionRenderer<V>;
  onSelect?: (value: V, option: SelectOption<V>) => void;
  onDeselect?: (value: V, option: SelectOption<V>) => void;
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  /** Скрывать выпадашку, пока нет опций (open флаг всё равно меняется). */
  hideEmpty?: boolean;
}

// ─── Value modes (discriminated union) ────────────────────────────────────

interface SelectSingleProps<V extends SelectValue = string> {
  multi?: false;
  clearable?: false;
  labelInValue?: false;
  value?: V;
  onChange?: (value: V) => void;
}

interface SelectSingleClearableProps<V extends SelectValue = string> {
  multi?: false;
  clearable: true;
  labelInValue?: false;
  value?: V | null;
  onChange?: (value: V | null) => void;
}

interface SelectSingleLabeledProps<V extends SelectValue = string> {
  multi?: false;
  clearable?: false;
  labelInValue: true;
  value?: LabeledValue<V>;
  onChange?: (value: LabeledValue<V>) => void;
}

interface SelectSingleLabeledClearableProps<V extends SelectValue = string> {
  multi?: false;
  clearable: boolean;
  labelInValue: true;
  value?: LabeledValue<V> | null;
  onChange?: (value: LabeledValue<V> | null) => void;
}

interface SelectMultiProps<V extends SelectValue = string> {
  multi: true;
  clearable?: boolean;
  labelInValue?: false;
  value?: V[];
  onChange?: (value: V[]) => void;
  tagsDisplay?: boolean;
  maxTagCount?: number;
}

interface SelectMultiLabeledProps<V extends SelectValue = string> {
  multi: true;
  clearable?: boolean;
  labelInValue: true;
  value?: LabeledValue<V>[];
  onChange?: (value: LabeledValue<V>[]) => void;
  tagsDisplay?: boolean;
  maxTagCount?: number;
}

interface SelectDynamicMultiProps<V extends SelectValue = string> {
  multi: boolean;
  clearable?: boolean;
  labelInValue?: false;
  value?: V | V[] | null;
  onChange?: (value: V | V[] | null) => void;
  tagsDisplay?: boolean;
  maxTagCount?: number;
}

export type SelectProps<V extends SelectValue = string> = SelectBaseProps<V> &
  (
    | SelectSingleProps<V>
    | SelectSingleClearableProps<V>
    | SelectSingleLabeledProps<V>
    | SelectSingleLabeledClearableProps<V>
    | SelectMultiProps<V>
    | SelectMultiLabeledProps<V>
    | SelectDynamicMultiProps<V>
  );

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
