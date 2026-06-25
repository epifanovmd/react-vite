import * as React from "react";

import { cn } from "../foundation/cn";
import {
  RadioGroupContext,
  type RadioSize,
  type RadioVariant,
} from "./RadioGroupContext";

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  size?: RadioSize;
  variant?: RadioVariant;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
  children?: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  defaultValue,
  onChange,
  name,
  size,
  variant,
  disabled,
  orientation = "vertical",
  className,
  children,
}) => {
  const generatedName = React.useId();
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const current = isControlled ? value : internal;

  const handleChange = React.useCallback(
    (v: string) => {
      if (!isControlled) setInternal(v);
      onChange?.(v);
    },
    [isControlled, onChange],
  );

  const ctx = React.useMemo(
    () => ({
      name: name ?? generatedName,
      value: current,
      onChange: handleChange,
      size,
      variant,
      disabled,
    }),
    [name, generatedName, current, handleChange, size, variant, disabled],
  );

  return (
    <RadioGroupContext.Provider value={ctx}>
      <div
        role="radiogroup"
        aria-orientation={orientation}
        className={cn(
          "flex",
          orientation === "vertical"
            ? "flex-col gap-2.5"
            : "flex-row flex-wrap gap-4",
          className,
        )}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};
