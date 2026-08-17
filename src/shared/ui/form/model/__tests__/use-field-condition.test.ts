import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement, type PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useFieldCondition } from "../use-field-condition";

interface Values {
  customerType: "person" | "company";
  country: "RU" | "KZ";
  inn: string;
}

describe("useFieldCondition", () => {
  it("computes required state and clears a field when it becomes inactive", async () => {
    const form = renderHook(() =>
      useForm<Values>({
        defaultValues: { customerType: "company", country: "RU", inn: "123" },
      }),
    ).result.current;
    const wrapper = ({ children }: PropsWithChildren) =>
      createElement(FormProvider<Values>, { ...form, children });
    const condition = renderHook(
      () =>
        useFieldCondition<Values, "inn", readonly ["customerType", "country"]>({
          name: "inn",
          dependencies: ["customerType", "country"],
          when: ([customerType, country]) =>
            customerType === "company" && country === "RU",
          hiddenValue: "clear",
          clearValue: "",
        }),
      { wrapper },
    );

    expect(condition.result.current).toEqual({ active: true, required: true });

    act(() => form.setValue("customerType", "person"));

    await waitFor(() =>
      expect(condition.result.current).toEqual({
        active: false,
        required: false,
      }),
    );
    expect(form.getValues("inn")).toBe("");
  });
});
