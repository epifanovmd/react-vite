import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { beforeEach, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  clear: vi.fn(),
  removeTag: vi.fn(),
  select: vi.fn(),
  setQuery: vi.fn(),
  useDropdownPlacement: vi.fn(),
  useLabelCache: vi.fn(),
  useLabelInValueBridge: vi.fn(),
  useSearchInput: vi.fn(),
  useSearchQuery: vi.fn(),
  useSelectEngine: vi.fn(),
}));

vi.mock("../hooks", () => ({
  useDropdownPlacement: mocks.useDropdownPlacement,
  useLabelCache: mocks.useLabelCache,
  useLabelInValueBridge: mocks.useLabelInValueBridge,
  useSearchInput: mocks.useSearchInput,
  useSearchQuery: mocks.useSearchQuery,
  useSelectEngine: mocks.useSelectEngine,
}));

vi.mock("../primitives", () => ({
  OptionsList: ({
    onSelect,
    options,
  }: {
    onSelect: (value: string) => void;
    options: { value: string; label: string }[];
  }) => (
    <div role="listbox">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  ),
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
      data-disabled={disabled || undefined}
      data-hidden={hidden || undefined}
      data-open={open}
      data-testid="dropdown"
    >
      {trigger}
      {!hidden && children}
    </section>
  ),
  SelectTriggerBase: React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
      onClear?: () => void;
      showClear?: boolean;
    }
  >(({ children, onClear, showClear, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
      {showClear && (
        <button aria-label="clear" onClick={onClear} type="button">
          clear
        </button>
      )}
    </div>
  )),
  SelectTriggerContent: ({
    multi,
    onRemoveTag,
    selectedValues,
  }: {
    multi: boolean;
    onRemoveTag: (value: string) => void;
    selectedValues: string[];
  }) => (
    <div data-multi={multi} data-testid="trigger-content">
      {selectedValues.map(value => (
        <button key={value} onClick={() => onRemoveTag(value)} type="button">
          remove {value}
        </button>
      ))}
    </div>
  ),
}));

import { Select } from "../Select";

const options = [
  { value: "one", label: "First" },
  { value: "two", label: "Second" },
];

const engine = {
  clear: mocks.clear,
  focusedIndex: -1,
  handleKeyDown: vi.fn(),
  handleOpen: vi.fn(),
  handleScroll: vi.fn(),
  hasValue: true,
  inputRef: React.createRef<HTMLInputElement>(),
  isSelected: vi.fn(),
  listRef: React.createRef<HTMLDivElement>(),
  onInteractOutside: vi.fn(),
  open: false,
  removeTag: mocks.removeTag,
  select: mocks.select,
  selectedValues: ["one"],
  setFocusedIndex: vi.fn(),
  triggerRef: React.createRef<HTMLDivElement>(),
};

describe("Select", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useDropdownPlacement.mockReturnValue({ dropdownSide: "top" });
    mocks.useLabelCache.mockReturnValue({
      getLabel: (value: string) => value,
      seedCache: vi.fn(),
      updateCache: vi.fn(),
    });
    mocks.useLabelInValueBridge.mockReturnValue({
      normalizedValue: "normalized",
      wrappedOnChange: vi.fn(),
    });
    mocks.useSearchInput.mockReturnValue({ searchInputProps: {} });
    mocks.useSearchQuery.mockReturnValue({
      query: "query",
      setQuery: mocks.setQuery,
    });
    mocks.useSelectEngine.mockReturnValue(engine);
  });

  it("configures a default single non-searchable select", () => {
    const onChange = vi.fn();

    render(<Select onChange={onChange} options={options} value="one" />);

    expect(mocks.useSelectEngine).toHaveBeenCalledWith(
      expect.objectContaining({
        multi: false,
        onChange,
        options,
        searchable: false,
        value: "one",
      }),
    );
    const trigger = screen.getByTestId("trigger-content").parentElement;

    expect(trigger).toHaveAttribute("tabindex", "0");
    fireEvent.keyDown(trigger as HTMLElement, { key: "ArrowDown" });
    expect(engine.handleKeyDown).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "Second" }));
    expect(mocks.select).toHaveBeenCalledWith("two");
  });

  it("bridges labeled multi values and supports clear and tag removal", () => {
    render(
      <Select
        clearable
        labelInValue
        multi
        options={options}
        value={[{ value: "one" }]}
      />,
    );

    expect(mocks.useSelectEngine).toHaveBeenCalledWith(
      expect.objectContaining({
        multi: true,
        value: "normalized",
      }),
    );
    expect(screen.getByTestId("trigger-content")).toHaveAttribute(
      "data-multi",
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: "clear" }));
    expect(mocks.clear).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "remove one" }));
    expect(mocks.removeTag).toHaveBeenCalledWith("one");
  });

  it("hides an empty disabled dropdown and resets search through the engine", () => {
    render(<Select disabled hideEmpty options={[]} search />);

    expect(screen.getByTestId("dropdown")).toHaveAttribute(
      "data-hidden",
      "true",
    );
    expect(screen.getByTestId("dropdown")).toHaveAttribute(
      "data-disabled",
      "true",
    );
    const engineOptions = mocks.useSelectEngine.mock.calls[0][0] as {
      onSearchReset: () => void;
      searchable: boolean;
    };

    expect(engineOptions.searchable).toBe(true);
    engineOptions.onSearchReset();
    expect(mocks.setQuery).toHaveBeenCalledWith("");
  });
});
