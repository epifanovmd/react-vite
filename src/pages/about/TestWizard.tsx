import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, memo, PropsWithChildren } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { WizardForm } from "../form";
import { IWizard, IWizardFormContext } from "../form/types";

interface IProps {}

const schema1 = z.object({
  firstName: z.string().min(1, { message: "Required firstName" }),
});

const schema2 = z.object({
  lastName: z.string().min(1, { message: "Required lastName" }),
});

type IForm1 = Partial<z.infer<typeof schema1>>;
type IForm2 = Partial<z.infer<typeof schema2>>;

const wizard1: IWizard<IForm1> = {
  name: "step1",
  handleSubmit: values => {
    console.log("handleSubmit step 1", values);
  },
  fields: [
    {
      name: "firstName",
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
            value={field.value ?? ""}
          />
          {fieldState.error && <div>{fieldState.error.message}</div>}
        </div>
      ),
    },
  ],
  formProps: {
    resolver: zodResolver(schema1),
    defaultValues: { firstName: "" },
  },
};

const wizard2: IWizard<IForm2> = {
  name: "step2",
  handleSubmit: values => {
    console.log("handleSubmit step 2", values);
  },
  fields: () => [
    {
      name: "lastName",
      render: ({ field, fieldState, form }) => (
        <div style={{ background: "yellow" }}>
          <div>{JSON.stringify(form.getValues())}</div>
          <input
            ref={field.ref}
            name={field.name}
            placeholder={field.name}
            onBlur={field.onBlur}
            onChange={event => {
              field.onChange(event.target.value);
            }}
            disabled={field.disabled}
            value={field.value ?? ""}
          />
          {fieldState.error && <div>{fieldState.error.message}</div>}
        </div>
      ),
    },
  ],
  formProps: {
    resolver: zodResolver(schema2),
    defaultValues: { lastName: "" },
  },
};

const wizards = [wizard1, wizard2];

export const TestWizard: FC<PropsWithChildren<IProps>> = memo(() => {
  return (
    <WizardForm
      wizards={wizards}
      renderFooter={WizardFooter}
      onSubmit={d => {
        console.log("d", d);
      }}
    />
  );
});

const WizardFooter: FC<IWizardFormContext<IForm1 & IForm2>> = memo(
  ({ currentForm, prevStep, nextStep, formState, step, values }) => {
    return (
      <div>
        <pre>{JSON.stringify(values)}</pre>
        <div style={{ display: "flex" }}>
          {step}
          <button onClick={prevStep}>{"Prev"}</button>
          <button onClick={nextStep} disabled={!formState.isValid}>
            {"Next"}
          </button>
          <button
            onClick={() => {
              currentForm.reset();
            }}
          >
            {"Rest"}
          </button>
        </div>
      </div>
    );
  },
);

const useFormValues = () => {
  const { getValues } = useFormContext();

  return {
    ...useWatch(), // subscribe to form value updates

    ...getValues(), // always merge with latest form values
  };
};
