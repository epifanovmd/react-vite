import type { ReactNode } from "react";

import { DemoGroupTitle } from "./DemoGroupTitle";

export interface DemoBlockProps {
  title: ReactNode;
  children: ReactNode;
}

const BLOCK_CLASS = "flex flex-col gap-3";

/** Группа примеров: заголовок и содержимое с единым вертикальным ритмом. */
export const DemoBlock = ({ title, children }: DemoBlockProps) => (
  <section className={BLOCK_CLASS}>
    <DemoGroupTitle>{title}</DemoGroupTitle>
    {children}
  </section>
);
