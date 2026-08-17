import { act, renderHook } from "@testing-library/react";
import { createElement, type PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useAsyncFieldValidation } from "../use-async-field-validation";

interface Values {
  username: string;
}

const validateUsername = async (value: string): Promise<string | undefined> =>
  value === "admin" ? "Already used" : undefined;

const shouldValidate = (value: string): boolean => value.length > 0;

describe("useAsyncFieldValidation", () => {
  afterEach(() => vi.useRealTimers());

  it("sets and clears its own debounced error", async () => {
    vi.useFakeTimers();
    const form = renderHook(() =>
      useForm<Values>({ defaultValues: { username: "" } }),
    ).result.current;

    form.register("username");
    const wrapper = ({ children }: PropsWithChildren) =>
      createElement(FormProvider<Values>, { ...form, children });

    renderHook(
      () =>
        useAsyncFieldValidation<Values, "username">({
          name: "username",
          debounce: 100,
          validate: validateUsername,
          shouldValidate,
        }),
      { wrapper },
    );

    act(() => form.setValue("username", "admin"));
    await act(() => vi.advanceTimersByTimeAsync(100));
    expect(form.getFieldState("username").error?.message).toBe("Already used");

    act(() => form.setValue("username", "available"));
    await act(() => vi.advanceTimersByTimeAsync(100));
    expect(form.getFieldState("username").error).toBeUndefined();
  });
});
