import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui";
import type { FC, ReactNode } from "react";

export interface ExampleCardProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

export const ExampleCard: FC<ExampleCardProps> = ({
  title,
  description,
  children,
}) => (
  <Card className="flex min-h-0 flex-col overflow-hidden">
    <CardHeader className="shrink-0">
      <CardTitle className="text-base">{title}</CardTitle>
      {description && (
        <CardDescription className="text-xs">{description}</CardDescription>
      )}
    </CardHeader>
    <CardContent className="flex flex-1 flex-col overflow-hidden space-y-3">
      {children}
    </CardContent>
  </Card>
);
