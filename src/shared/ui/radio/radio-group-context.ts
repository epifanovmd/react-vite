import * as React from "react";

export type RadioSize = "sm" | "md" | "lg";
export type RadioVariant = "default" | "error" | "success";

export interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  size?: RadioSize;
  variant?: RadioVariant;
  disabled?: boolean;
}

export const RadioGroupContext =
  React.createContext<RadioGroupContextValue | null>(null);

export const useRadioGroup = () => React.useContext(RadioGroupContext);
