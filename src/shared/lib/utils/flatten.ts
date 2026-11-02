type DeepFlatten<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends object
    ? DeepFlatten<T[K], `${Uncapitalize<Prefix>}${Capitalize<string & K>}`>
    : { [P in `${Uncapitalize<Prefix>}${Capitalize<string & K>}`]: T[K] };
}[keyof T];

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type FlattenObject<T> = UnionToIntersection<DeepFlatten<T>>;

export const flattenObject = <T extends object>(obj: T): FlattenObject<T> => {
  const result: Record<string, unknown> = {};

  const flat = (data: object, prefix = "", root = true): void => {
    Object.entries(data).forEach(([k, v]) => {
      const key = root
        ? k[0].toLowerCase() + k.slice(1)
        : prefix + k[0].toUpperCase() + k.slice(1);

      if (v && typeof v === "object" && !Array.isArray(v)) {
        flat(v, key, false);
      } else {
        result[key] = v;
      }
    });
  };

  flat(obj);

  return result as FlattenObject<T>;
};
