import type { FactoryOpts, InputMask } from "imask";
import { RefObject, useEffect, useMemo, useRef } from "react";
import { useIMask } from "react-imask";

const maskToKey = (mask: FactoryOpts): string =>
  JSON.stringify(mask, (_key, val) =>
    typeof val === "function" ? undefined : val,
  );

export interface MaskedInputChangeInfo<Opts extends FactoryOpts> {
  value: string;
  unmaskedValue: string;
  typedValue: InputMask<Opts>["typedValue"];
  isComplete: boolean;
}

export interface UseMaskedInputOptions<Opts extends FactoryOpts> {
  mask: Opts;
  value?: string;
  disabled?: boolean;
  onChange?: (info: MaskedInputChangeInfo<Opts>) => void;
  onComplete?: (info: MaskedInputChangeInfo<Opts>) => void;
}

export interface UseMaskedInputResult<Opts extends FactoryOpts> {
  ref: RefObject<HTMLInputElement | null>;
  value: string;
  unmaskedValue: string;
  typedValue: InputMask<Opts>["typedValue"];
  isComplete: boolean;
  setValue: (value: string) => void;
  clear: () => void;
}

const buildChangeInfo = <Opts extends FactoryOpts>(
  maskInstance: InputMask<Opts>,
): MaskedInputChangeInfo<Opts> => ({
  value: maskInstance.value,
  unmaskedValue: maskInstance.unmaskedValue,
  typedValue: maskInstance.typedValue,
  isComplete: maskInstance.masked.isComplete,
});

export const useMaskedInput = <Opts extends FactoryOpts>({
  mask,
  value: externalValue,
  disabled,
  onChange,
  onComplete,
}: UseMaskedInputOptions<Opts>): UseMaskedInputResult<Opts> => {
  const maskKey = maskToKey(mask);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableMask = useMemo(() => mask, [maskKey]);

  const imaskOptions = useRef({
    defaultValue: externalValue,
    _onChange: onChange,
    _onComplete: onComplete,
    onAccept: (_: unknown, m: InputMask<Opts>) =>
      imaskOptions._onChange?.(buildChangeInfo(m)),
    onComplete: (_: unknown, m: InputMask<Opts>) =>
      imaskOptions._onComplete?.(buildChangeInfo(m)),
  }).current;

  imaskOptions._onChange = onChange;
  imaskOptions._onComplete = onComplete;

  const {
    ref,
    maskRef,
    value: maskedValue,
    unmaskedValue,
    typedValue,
    setValue,
  } = useIMask<HTMLInputElement, Opts>(stableMask, imaskOptions);

  useEffect(() => {
    if (externalValue !== undefined && externalValue !== maskedValue) {
      setValue(externalValue);
    }
  }, [externalValue]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (ref.current) ref.current.disabled = !!disabled;
  }, [disabled, ref]);

  return {
    ref,
    value: maskedValue as string,
    unmaskedValue: unmaskedValue as string,
    typedValue,
    isComplete: !!maskRef.current?.masked.isComplete,
    setValue: setValue as (v: string) => void,
    clear: () => setValue(""),
  };
};
