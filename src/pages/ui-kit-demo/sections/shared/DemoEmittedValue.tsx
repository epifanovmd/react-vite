export interface DemoEmittedValueProps {
  value: string;
}

const VALUE_CLASS = "truncate font-mono text-[10px] text-muted-foreground";

/** Значение, которое контрол отдал через onChange. */
export const DemoEmittedValue = ({ value }: DemoEmittedValueProps) => {
  const text = value === "" ? "—" : `«${value}»`;

  return <p className={VALUE_CLASS}>value: {text}</p>;
};
