import {
  FormField,
  IUseWizard,
  typedFormField,
  useWizard,
  useWizardForm,
  Wizard,
} from "@force-dev/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  ComponentProps,
  FC,
  memo,
  PropsWithChildren,
  useMemo,
} from "react";
import { ControllerProps, FieldValues } from "react-hook-form";
import { FieldPath, UseFormStateReturn } from "react-hook-form/dist/types";
import {
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form/dist/types/controller";
import { z } from "zod";

import { WizardFooter } from "./WizardFooter";
import { WizardHeader } from "./WizardHeader";

interface IProps {}

const schema1 = z.object({
  field1: z.string().min(3),
  field2: z.string().min(3),
});

const schema2 = z.object({
  field3: z.string().min(2),
  field4: z.string().min(2),
});

type TWizardForm = Partial<z.infer<typeof schema1 & typeof schema2>>;

export const WizardFormPage: FC<PropsWithChildren<IProps>> = memo(() => {
  const params: IUseWizard<TWizardForm> = useMemo(
    () => ({
      handleSubmit: v => {
        console.log("v", v);
      },
      handleStepSubmit: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(undefined);
          }, 2000);
        });
      },
      watch: ["field2", "field4"],
    }),
    [],
  );

  const wizard = useWizard<TWizardForm>(params);

  const form1 = useWizardForm(wizard, {
    resolver: zodResolver(schema1),
    mode: "onSubmit",
    defaultValues: {
      field1: "1",
      field2: "2",
    },
  });

  const form2 = useWizardForm(wizard, {
    resolver: zodResolver(schema2),
    defaultValues: {
      field3: "3",
      field4: "4",
    },
  });

  return (
    <Wizard {...wizard}>
      <WizardHeader />

      <Wizard.Step form={form1} step={0}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <WizardField name={"field1"} render={InputField} />
          <WizardField name={"field2"} render={InputField} />
        </div>
      </Wizard.Step>
      <Wizard.Step form={form2} step={1}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <WizardField name={"field3"} render={InputField} />
          <WizardField name={"field4"} render={InputField} />
        </div>
      </Wizard.Step>

      <WizardFooter />
    </Wizard>
  );
});

const WizardField = typedFormField<TWizardForm>();

const InputField = <
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({
  field,
}: {
  field: ControllerRenderProps<T, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<T>;
}) => {
  return <input type="text" {...field} />;
};
