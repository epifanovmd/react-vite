import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui";
import type { ReactNode } from "react";

export interface DemoCardProps {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}

/** Карточка демо-примера: заголовок, пояснение и содержимое. */
export const DemoCard = ({ title, description, children }: DemoCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">{title}</CardTitle>
      {description && (
        <CardDescription className="text-xs">{description}</CardDescription>
      )}
    </CardHeader>
    <CardContent className="flex flex-col gap-6">{children}</CardContent>
  </Card>
);
