import type { ReactNode } from "react";

export interface DemoFieldProps {
  label?: string;
  children: ReactNode;
}

const ROOT_CLASS = "flex flex-col gap-1.5";
const LABEL_CLASS = "text-[10px] text-muted-foreground";

/** Пример контрола с технической подписью над ним. */
export const DemoField = ({ label, children }: DemoFieldProps) => (
  <div className={ROOT_CLASS}>
    {label && <p className={LABEL_CLASS}>{label}</p>}
    {children}
  </div>
);
