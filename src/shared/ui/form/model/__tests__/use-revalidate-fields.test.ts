import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement, type PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useRevalidateFields } from "../use-revalidate-fields";

interface Values {
  password: string;
  confirmPassword: string;
}

describe("useRevalidateFields", () => {
  it("revalidates a touched target after its dependency changes", async () => {
    const form = renderHook(() =>
      useForm<Values>({
        defaultValues: { password: "secret", confirmPassword: "secret" },
      }),
    ).result.current;

    form.register("password");
    form.register("confirmPassword", {
      validate: value => value === form.getValues("password") || "Mismatch",
    });
    form.setValue("confirmPassword", "secret", { shouldTouch: true });

    const wrapper = ({ children }: PropsWithChildren) =>
      createElement(FormProvider<Values>, { ...form, children });

    renderHook(
      () =>
        useRevalidateFields<
          Values,
          readonly ["password"],
          readonly ["confirmPassword"]
        >({
          dependencies: ["password"],
          targets: ["confirmPassword"],
        }),
      { wrapper },
    );

    act(() => form.setValue("password", "changed"));

    await waitFor(() =>
      expect(form.getFieldState("confirmPassword").error?.message).toBe(
        "Mismatch",
      ),
    );
  });
});
