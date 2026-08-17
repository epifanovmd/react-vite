import { Form, FormSubmit, InputFormField, useZodForm } from "@shared/ui";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { z } from "zod";

import { FormExampleLayout } from "../FormExampleLayout";

const schema = z.object({ name: z.string().min(1) });

type Values = z.input<typeof schema>;

const DemoForm = () => {
  const [submittedValues, setSubmittedValues] = useState<Values>();
  const form = useZodForm(schema, { defaultValues: { name: "" } });

  return (
    <Form form={form} onSubmit={values => setSubmittedValues(values)}>
      <FormExampleLayout submittedValues={submittedValues}>
        <InputFormField<Values> name="name" label="Name" />
        <FormSubmit>Save</FormSubmit>
      </FormExampleLayout>
    </Form>
  );
};

describe("FormExampleLayout", () => {
  it("shows live values, form state and the last submitted values", async () => {
    render(<DemoForm />);

    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "Alice" },
    });

    const valuesJson = screen.getByRole("heading", {
      name: "Текущие значения",
    }).nextElementSibling;
    const stateJson = screen.getByRole("heading", {
      name: "Состояние формы",
    }).nextElementSibling;

    expect(valuesJson).toHaveTextContent('"name": "Alice"');
    expect(stateJson).toHaveTextContent('"isDirty": true');

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Последний submit" })
          .nextElementSibling,
      ).toHaveTextContent('"name": "Alice"'),
    );
  });
});
