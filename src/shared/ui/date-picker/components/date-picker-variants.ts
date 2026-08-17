import { cn } from "@shared/lib/utils/cn";

import {
  type FieldVariantProps,
  fieldVariants,
} from "../../foundation/field-variants";

export const datePickerTriggerVariants = ({
  size,
  variant,
}: DatePickerTriggerVariantProps = {}) =>
  cn(
    fieldVariants({ focusMode: "open", size, variant }),
    "cursor-pointer items-center gap-2",
  );

export type DatePickerTriggerVariantProps = FieldVariantProps;
