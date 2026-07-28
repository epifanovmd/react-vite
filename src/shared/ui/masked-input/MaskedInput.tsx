import { useMergedRef } from "@mantine/hooks";
import type { FactoryOpts } from "imask";
import * as React from "react";

import { Input, type InputProps } from "../input";
import { type MaskedInputChangeInfo, useMaskedInput } from "./hooks";

export interface MaskedInputProps<
  Opts extends FactoryOpts = FactoryOpts,
> extends Omit<InputProps, "value" | "defaultValue" | "onChange" | "type"> {
  mask: Opts;
  value?: string;
  defaultValue?: string;
  onChange?: (info: MaskedInputChangeInfo<Opts>) => void;
  onComplete?: (info: MaskedInputChangeInfo<Opts>) => void;
}

const MaskedInputInner = <Opts extends FactoryOpts>(
  {
    mask,
    value,
    defaultValue,
    onChange,
    onComplete,
    disabled,
    onClear,
    ...props
  }: MaskedInputProps<Opts>,
  forwardedRef: React.Ref<HTMLInputElement>,
) => {
  const {
    ref,
    value: maskedValue,
    clear,
  } = useMaskedInput<Opts>({
    mask,
    value: value ?? defaultValue,
    disabled,
    onChange,
    onComplete,
  });

  const mergedRef = useMergedRef(forwardedRef, ref);

  return (
    <Input
      ref={mergedRef}
      disabled={disabled}
      defaultValue={value ?? defaultValue}
      hasValue={maskedValue.length > 0}
      onClear={() => {
        clear();
        onClear?.();
      }}
      {...props}
    />
  );
};

const MaskedInputComponent = React.forwardRef(MaskedInputInner);

MaskedInputComponent.displayName = "MaskedInput";

export const MaskedInput = MaskedInputComponent as <
  Opts extends FactoryOpts = FactoryOpts,
>(
  props: MaskedInputProps<Opts> & { ref?: React.Ref<HTMLInputElement> },
) => React.ReactElement;
