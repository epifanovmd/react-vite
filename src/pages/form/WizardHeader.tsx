import { useWizardContext } from "@force-dev/react";
import React, { FC, memo } from "react";

export const WizardHeader: FC = memo(() => {
  const { values, step } = useWizardContext();

  return (
    <div style={{ paddingBottom: "30px" }}>
      <h3>{`Current step: ${step}`}</h3>
      <div>
        <h4>{"Wizard values"}</h4>
        <pre>{JSON.stringify(values)}</pre>
      </div>
    </div>
  );
});
