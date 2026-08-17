import { fireEvent, render, screen } from "@testing-library/react";
import type { FactoryOpts } from "imask";
import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MaskedInputChangeInfo } from "../../masked-input";
import type { AutocompleteProps, SelectOption } from "../types";

const mocks = vi.hoisted(() => ({
  setValue: vi.fn(),
  useDropdownPlacement: vi.fn(),
  useMaskedInput: vi.fn(),
  useSelectEngine: vi.fn(),
}));

vi.mock("../../masked-input", () => ({
  useMaskedInput: mocks.useMaskedInput,
}));

vi.mock("../hooks", () => ({
  useDropdownPlacement: mocks.useDropdownPlacement,
  useSelectEngine: mocks.useSelectEngine,
}));

vi.mock("../primitives", () => ({
  SelectDropdown: ({
    children,
    disabled,
    hidden,
    open,
    trigger,
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    hidden?: boolean;
    open: boolean;
    trigger: React.ReactNode;
  }) => (
    <section
      data-testid="dropdown"
      data-disabled={disabled || undefined}
      data-hidden={hidden || undefined}
      data-open={open}
    >
      {trigger}
      {!hidden && children}
    </section>
  ),
  SelectTriggerBase: React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
      loading?: boolean;
      onClear?: () => void;
      showClear?: boolean;
    }
  >(({ children, loading, onClear, showClear, ...props }, ref) => (
    <div ref={ref} data-loading={loading || undefined} {...props}>
      {children}
      {showClear && (
        <button type="button" aria-label="clear" onClick={onClear}>
          clear
        </button>
      )}
    </div>
  )),
  OptionsList: <V extends string>({
    empty,
    isSelected,
    loading,
    loadingMore,
    onSelect,
    options,
  }: {
    empty?: React.ReactNode;
    isSelected: (value: V) => boolean;
    loading?: boolean;
    loadingMore?: boolean;
    onSelect: (value: V) => void;
    options: SelectOption<V>[];
  }) => (
    <div
      role="listbox"
      data-loading={loading || undefined}
      data-loading-more={loadingMore || undefined}
    >
      {options.length === 0
        ? empty
        : options.map(option => (
            <button
              type="button"
              role="option"
              aria-selected={isSelected(option.value)}
              key={option.value}
              onClick={() => onSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
    </div>
  ),
}));

import { Autocomplete } from "../Autocomplete";

const options = [
  { value: "one", label: "First" },
  { value: "two", label: "Second" },
];

const engine = {
  clear: vi.fn(),
  focusedIndex: -1,
  handleKeyDown: vi.fn(),
  handleOpen: vi.fn(),
  handleScroll: vi.fn(),
  inputRef: React.createRef<HTMLInputElement>(),
  listRef: React.createRef<HTMLDivElement>(),
  onInteractOutside: vi.fn(),
  open: false,
  select: vi.fn(),
  setFocusedIndex: vi.fn(),
  triggerRef: React.createRef<HTMLDivElement>(),
};

const renderAutocomplete = (props: Partial<AutocompleteProps> = {}) =>
  render(<Autocomplete options={options} {...props} />);

describe("Autocomplete", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useDropdownPlacement.mockReturnValue({
      dropdownAlign: "end",
      dropdownSide: "top",
    });
    mocks.useSelectEngine.mockReturnValue(engine);
    mocks.useMaskedInput.mockReturnValue({
      clear: vi.fn(),
      isComplete: true,
      ref: React.createRef<HTMLInputElement>(),
      setValue: mocks.setValue,
      typedValue: "one",
      unmaskedValue: "one",
      value: "one",
    });
  });

  it("configures the select engine for a searchable single value", () => {
    const onChange = vi.fn();
    const onDeselect = vi.fn();
    const onOpenChange = vi.fn();
    const onScrollEnd = vi.fn();
    const onSelect = vi.fn();

    renderAutocomplete({
      closeOnClear: true,
      onChange,
      onDeselect,
      onOpenChange,
      onScrollEnd,
      onSelect,
      value: "one",
    });

    expect(mocks.useSelectEngine).toHaveBeenCalledWith(
      expect.objectContaining({
        closeOnClear: true,
        multi: false,
        onChange: expect.any(Function),
        onDeselect,
        onOpenChange,
        onScrollEnd,
        onSelect,
        options,
        searchable: true,
        value: "one",
      }),
    );

    const { onChange: handleEngineChange } = mocks.useSelectEngine.mock
      .calls[0][0] as { onChange: (value: string | null) => void };

    handleEngineChange("two");
    expect(mocks.setValue).toHaveBeenCalledWith("two");
    expect(onChange).toHaveBeenCalledWith("two");

    handleEngineChange(null);
    expect(mocks.setValue).toHaveBeenLastCalledWith("");
    expect(onChange).toHaveBeenLastCalledWith("");
  });

  it("reports the masked display value to search and the raw value to change", () => {
    const mask: FactoryOpts = { mask: "00-00" };
    const onChange = vi.fn();
    const onSearch = vi.fn();

    renderAutocomplete({ disabled: true, mask, onChange, onSearch });

    expect(mocks.useMaskedInput).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
        mask,
        onChange: expect.any(Function),
      }),
    );

    const { onChange: handleInputChange } = mocks.useMaskedInput.mock
      .calls[0][0] as {
      onChange: (info: MaskedInputChangeInfo<FactoryOpts>) => void;
    };

    handleInputChange({
      isComplete: true,
      typedValue: "1234",
      unmaskedValue: "1234",
      value: "12-34",
    });

    expect(onSearch).toHaveBeenCalledWith("12-34");
    expect(onChange).toHaveBeenCalledWith("1234");
  });

  it("renders the input contract and forwards input events to the engine", () => {
    const onBlur = vi.fn();
    const onFocus = vi.fn();

    renderAutocomplete({ onBlur, onFocus, placeholder: "Start typing" });

    const input = screen.getByRole("combobox");

    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input).toHaveAttribute("placeholder", "Start typing");

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.blur(input);

    expect(onFocus).toHaveBeenCalledOnce();
    expect(engine.handleKeyDown).toHaveBeenCalledOnce();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it("marks the option matching the unmasked value and delegates selection", () => {
    renderAutocomplete();

    expect(screen.getByRole("option", { name: "First" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("option", { name: "Second" })).toHaveAttribute(
      "aria-selected",
      "false",
    );

    fireEvent.click(screen.getByRole("option", { name: "Second" }));
    expect(engine.select).toHaveBeenCalledWith("two");
  });

  it("shows clear only for a non-empty, non-loading value", () => {
    const view = renderAutocomplete();

    fireEvent.click(screen.getByRole("button", { name: "clear" }));
    expect(engine.clear).toHaveBeenCalledOnce();

    view.rerender(<Autocomplete loading options={options} />);
    expect(screen.queryByRole("button", { name: "clear" })).toBeNull();

    mocks.useMaskedInput.mockReturnValue({
      ...mocks.useMaskedInput.mock.results[0].value,
      value: "",
    });
    view.rerender(<Autocomplete options={options} />);
    expect(screen.queryByRole("button", { name: "clear" })).toBeNull();
  });

  it("hides an empty dropdown by default and can render its empty state", () => {
    const view = render(<Autocomplete empty="Nothing found" options={[]} />);

    expect(screen.getByTestId("dropdown")).toHaveAttribute(
      "data-hidden",
      "true",
    );
    expect(screen.queryByText("Nothing found")).toBeNull();

    view.rerender(
      <Autocomplete empty="Nothing found" hideEmpty={false} options={[]} />,
    );
    expect(screen.getByRole("listbox")).toHaveTextContent("Nothing found");
  });

  it("applies disabled state to both the trigger and input", () => {
    renderAutocomplete({ disabled: true });

    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByTestId("dropdown")).toHaveAttribute(
      "data-disabled",
      "true",
    );
    expect(screen.getByRole("combobox").parentElement).toHaveAttribute(
      "data-disabled",
      "",
    );
    expect(screen.getByRole("combobox").parentElement).toHaveStyle({
      opacity: "0.5",
      pointerEvents: "none",
    });
  });
});
