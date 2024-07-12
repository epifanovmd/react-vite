import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, memo, PropsWithChildren, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "../form";
import { IFormField } from "../form/types";

interface IProps {}

const schema = z.object({
  name: z.string().min(1, { message: "Required name" }),
  age: z.string().min(10),
});

type IForm = Partial<z.infer<typeof schema>>;

export const TestForm: FC<PropsWithChildren<IProps>> = memo(() => {
  const form = useForm<IForm>({
    defaultValues: {
      name: "",
      age: "",
    },
    disabled: true,
    resolver: (values, context, options) => {
      if (schema) {
        return zodResolver(schema)(values, context, options) as any;
      }

      return undefined;
    },
  });

  const onSubmit = (data: IForm) => {
    console.log("data", data);
  };

  const fields = useMemo<IFormField<IForm>[]>(
    () => [
      {
        name: "name",
        // disabled: true,
        // render: ({ field, fieldState, form }) => (
        //   <div>
        //     <input
        //       {...form.register(field.name)}
        //       placeholder="First name"
        //       disabled={field.disabled}
        //     />
        //     {fieldState.error && <div>{fieldState.error.message}</div>}
        //   </div>
        // ),
      },
      {
        name: "age",
        rules: {
          // validate: (value, formValues) => {
          //   // console.log("formValues", formValues);
          //   // console.log("value", value);
          //
          //   return (value?.length || 0) > 15 ? undefined : "Length must be greater than 15";
          // },
        },
        render: ({ field, fieldState, form }) => (
          <div style={{ background: "yellow" }}>
            <div>{JSON.stringify(form.getValues())}</div>
            <input
              ref={field.ref}
              name={field.name}
              placeholder="Age"
              onBlur={field.onBlur}
              onChange={event => {
                field.onChange(event.target.value);
              }}
              disabled={field.disabled}
              value={field.value}
            />
            {fieldState.error && <div>{fieldState.error.message}</div>}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <h1>About Page</h1>

      <Form
        form={form}
        renderFieldLayout={(children, { field, fieldState }) => (
          <div style={{ background: "red", padding: "10px" }}>
            {children ?? (
              <div>
                <input
                  {...form.register(field.name)}
                  disabled={field.disabled}
                  placeholder="First name"
                />
                {fieldState.error && <div>{fieldState.error.message}</div>}
              </div>
            )}
          </div>
        )}
        fields={fields}
      />

      <button onClick={form.handleSubmit(onSubmit)}>{"Submit"}</button>
      <button onClick={() => form.reset()}>{"Rest"}</button>
    </>
  );
});
