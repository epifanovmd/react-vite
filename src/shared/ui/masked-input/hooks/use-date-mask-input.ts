import { format as formatDate } from "date-fns";
import type { FactoryOpts } from "imask";
import { RefObject, useCallback } from "react";

import { createDateMask, type CreateDateMaskOptions } from "../masks";
import { useMaskedInput } from "./use-masked-input";

export interface UseDateMaskInputOptions extends CreateDateMaskOptions {
  value?: Date;
  disabled?: boolean;
  onChange?: (date: Date | undefined) => void;
  onComplete?: (date: Date | undefined) => void;
}

export interface UseDateMaskInputResult {
  ref: RefObject<HTMLInputElement | null>;
  displayValue: string;
  isComplete: boolean;
  setDate: (date: Date | undefined) => void;
  clear: () => void;
}

const unwrapDate = (typedValue: unknown): Date | undefined =>
  (typedValue as Date | null) ?? undefined;

export const useDateMaskInput = ({
  value,
  disabled,
  dateFormat = "dd.MM.yyyy",
  min,
  max,
  onChange,
  onComplete,
}: UseDateMaskInputOptions): UseDateMaskInputResult => {
  const mask = createDateMask({ dateFormat, min, max });

  const toDisplay = useCallback(
    (date: Date | undefined) => (date ? formatDate(date, dateFormat) : ""),
    [dateFormat],
  );

  const {
    ref,
    value: displayValue,
    isComplete,
    setValue,
    clear,
  } = useMaskedInput<FactoryOpts>({
    mask,
    value: toDisplay(value),
    disabled,
    onChange: info => onChange?.(unwrapDate(info.typedValue)),
    onComplete: info => onComplete?.(unwrapDate(info.typedValue)),
  });

  const setDate = useCallback(
    (date: Date | undefined) => setValue(toDisplay(date)),
    [setValue, toDisplay],
  );

  return { ref, displayValue, isComplete, setDate, clear };
};
