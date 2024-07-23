import { useWizardContext } from "@force-dev/react";
import React, { FC, memo } from "react";

export const WizardFooter: FC = memo(() => {
  const { form, prevStep, nextStep, handleReset, step } = useWizardContext();

  return (
    <div style={{ paddingTop: "10px" }}>
      <div>{JSON.stringify(form.formState.errors)}</div>
      <hr />
      {form.formState.isSubmitting && <div>{"Submitting"}</div>}
      <div style={{ display: "flex" }}>
        <button
          style={{ marginRight: "5px" }}
          onClick={prevStep}
          disabled={step === 0}
        >
          {"Prev"}
        </button>
        <button
          style={{ marginRight: "5px" }}
          onClick={nextStep}
          disabled={!form.formState.isValid}
        >
          {"Next"}
        </button>
        <button
          style={{ marginRight: "5px" }}
          onClick={() => {
            form.reset();
          }}
        >
          {"Rest"}
        </button>
        <button style={{ marginRight: "5px" }} onClick={handleReset}>
          {"Rest all"}
        </button>
      </div>
    </div>
  );
});
