import { zodResolver } from "@hookform/resolvers/zod";
import {
  type FieldValues,
  useForm,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { z } from "zod";

/**
 * Creates an RHF form while preserving different Zod input/output types.
 *
 * @example
 * const form = useZodForm(schema, { defaultValues: { name: "" } });
 */
export const useZodForm = <
  TInput extends FieldValues,
  TOutput extends FieldValues,
>(
  schema: z.ZodType<TOutput, TInput>,
  options: Omit<UseFormProps<TInput, unknown, TOutput>, "resolver"> = {},
): UseFormReturn<TInput, unknown, TOutput> => {
  return useForm<TInput, unknown, TOutput>({
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
    ...options,
    resolver: zodResolver(schema),
  });
};
