type EnumValueType = string | number;

export const getEnumNames = (e: object): string[] =>
  Object.keys(e).filter(key => isNaN(+key));

export const getEnumNamesAndValues = <T extends EnumValueType>(
  e: object,
): { name: string; value: T }[] =>
  getEnumNames(e).map(_name => ({
    name: _name,
    value: (e as Record<string, T>)[_name],
  }));
