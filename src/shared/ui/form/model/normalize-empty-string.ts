/**
 * Converts an empty HTML control value to `undefined` for Zod preprocessors.
 *
 * @example
 * z.preprocess(normalizeEmptyString, z.string().email().optional())
 */
export const normalizeEmptyString = (value: unknown): unknown =>
  value === "" ? undefined : value;
