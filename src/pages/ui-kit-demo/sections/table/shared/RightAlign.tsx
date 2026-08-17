import type { FC, ReactNode } from "react";

interface RightAlignProps {
  children: ReactNode;
}

export const RightAlign: FC<RightAlignProps> = ({ children }) => (
  <div className="text-right tabular-nums">{children}</div>
);
