import { cn } from "@shared/lib/utils/cn";
import * as React from "react";

import {
  RadioGroupContext,
  type RadioSize,
  type RadioVariant,
} from "./radio-group-context";

export interface RadioGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  size?: RadioSize;
  variant?: RadioVariant;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
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
  ...props
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
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};
