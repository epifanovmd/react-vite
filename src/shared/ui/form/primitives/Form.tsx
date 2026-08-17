import * as React from "react";
import {
  type FieldValues,
  FormProvider,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";

export interface FormProps<
  TFormData extends FieldValues,
  TContext = unknown,
  TOutput extends FieldValues = TFormData,
> extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  "onInvalid" | "onSubmit"
> {
  form: UseFormReturn<TFormData, TContext, TOutput>;
  onSubmit: SubmitHandler<TOutput>;
  onInvalid?: SubmitErrorHandler<TFormData>;
}

/**
 * Native form combined with React Hook Form context.
 *
 * @example
 * <Form form={form} onSubmit={save}>
 *   <InputFormField name="email" label="Email" />
 *   <FormSubmit>Save</FormSubmit>
 * </Form>
 */
export function Form<
  TFormData extends FieldValues,
  TContext = unknown,
  TOutput extends FieldValues = TFormData,
>({
  form,
  onSubmit,
  onInvalid,
  noValidate = true,
  children,
  ...props
}: FormProps<TFormData, TContext, TOutput>): React.ReactElement {
  return (
    <FormProvider {...form}>
      <form
        noValidate={noValidate}
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}
