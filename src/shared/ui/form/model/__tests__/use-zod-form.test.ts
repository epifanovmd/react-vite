import { act, renderHook } from "@testing-library/react";
import { z } from "zod";

import { useZodForm } from "../use-zod-form";

const schema = z.object({
  age: z.coerce.number().min(18, "Только 18+"),
});

describe("useZodForm", () => {
  it("validates with the schema and exposes parsed output on submit", async () => {
    const { result } = renderHook(() =>
      useZodForm(schema, { defaultValues: { age: "" } }),
    );
    const submitted: unknown[] = [];

    await act(() =>
      result.current.handleSubmit(values => {
        submitted.push(values);
      })(),
    );
    expect(result.current.getFieldState("age").error?.message).toBe(
      "Только 18+",
    );
    expect(submitted).toHaveLength(0);

    act(() => result.current.setValue("age", "21"));
    await act(() =>
      result.current.handleSubmit(values => {
        submitted.push(values);
      })(),
    );
    expect(submitted).toEqual([{ age: 21 }]);
  });

  it("applies onBlur mode by default and lets options override it", () => {
    const { result } = renderHook(() =>
      useZodForm(schema, { defaultValues: { age: "" } }),
    );

    expect(result.current.control._options.mode).toBe("onBlur");

    const overridden = renderHook(() =>
      useZodForm(schema, {
        defaultValues: { age: "" },
        mode: "onChange",
        shouldFocusError: false,
      }),
    );

    expect(overridden.result.current.control._options.mode).toBe("onChange");
    expect(overridden.result.current.control._options.shouldFocusError).toBe(
      false,
    );
  });
});
