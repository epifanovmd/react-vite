import * as React from "react";
import { useFormContext, useFormState } from "react-hook-form";

import { Button, type ButtonProps } from "../../button";

export interface FormSubmitProps extends Omit<ButtonProps, "type"> {
  disableWhenInvalid?: boolean;
}

/**
 * Submit button connected to the nearest Form. It reflects RHF submitting state.
 *
 * @example
 * <FormSubmit disableWhenInvalid>Save</FormSubmit>
 */
export const FormSubmit = React.forwardRef<HTMLButtonElement, FormSubmitProps>(
  ({ disableWhenInvalid = false, disabled, loading, ...props }, ref) => {
    const { control } = useFormContext();
    const { isSubmitting, isValid } = useFormState({ control });

    return (
      <Button
        {...props}
        ref={ref}
        type="submit"
        disabled={disabled || (disableWhenInvalid && !isValid)}
        loading={loading || isSubmitting}
      />
    );
  },
);

FormSubmit.displayName = "FormSubmit";
