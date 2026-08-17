import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import { vi } from "vitest";
import { z } from "zod";

import { useZodForm } from "../../model/use-zod-form";
import { Form } from "../../primitives/Form";
import {
  CheckboxFormField,
  DatePickerFormField,
  InputFormField,
  SelectFormField,
} from "..";

const schema = z.object({
  name: z.string(),
  accepted: z.boolean(),
  country: z.string().nullable(),
  date: z.date().optional(),
});

type Values = z.input<typeof schema>;

const createForm = () =>
  renderHook(() =>
    useZodForm(schema, {
      defaultValues: {
        name: "",
        accepted: false,
        country: null,
        date: undefined,
      },
    }),
  );

describe("form field adapters", () => {
  it("composes Input callbacks with RHF updates", () => {
    const form = createForm();
    const onChange = vi.fn();
    const onClear = vi.fn();

    render(
      <Form form={form.result.current} onSubmit={vi.fn()}>
        <InputFormField<Values>
          name="name"
          label="Name"
          clearable
          onChange={onChange}
          onClear={onClear}
        />
      </Form>,
    );

    const input = screen.getByRole("textbox", { name: "Name" });

    fireEvent.change(input, { target: { value: "Alice" } });

    expect(form.result.current.getValues("name")).toBe("Alice");
    expect(onChange).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole("button", { name: "Clear input" }));
    expect(form.result.current.getValues("name")).toBe("");
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("maps boolean controls without losing their semantic label", () => {
    const form = createForm();

    render(
      <Form form={form.result.current} onSubmit={vi.fn()}>
        <CheckboxFormField<Values> name="accepted" label="Accepted" />
      </Form>,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Accepted" }));
    expect(form.result.current.getValues("accepted")).toBe(true);
  });

  it("updates a single Select and marks it touched after closing", () => {
    const form = createForm();

    render(
      <Form form={form.result.current} onSubmit={vi.fn()}>
        <SelectFormField<Values>
          name="country"
          label="Country"
          options={[{ value: "RU", label: "Russia" }]}
        />
      </Form>,
    );

    fireEvent.click(screen.getByRole("combobox", { name: "Country" }));
    fireEvent.click(screen.getByText("Russia"));

    expect(form.result.current.getValues("country")).toBe("RU");
    expect(form.result.current.getFieldState("country").isTouched).toBe(true);
  });

  it("forwards DatePicker blur and ref-compatible accessibility props", () => {
    const form = createForm();

    render(
      <Form form={form.result.current} onSubmit={vi.fn()}>
        <DatePickerFormField<Values> name="date" label="Date" />
      </Form>,
    );

    const trigger = screen.getByRole("button", { name: "Date" });

    fireEvent.blur(trigger);

    expect(form.result.current.getFieldState("date").isTouched).toBe(true);
    expect(trigger).toHaveAttribute("aria-labelledby");
  });
});
