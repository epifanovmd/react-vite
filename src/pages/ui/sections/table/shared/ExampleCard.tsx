import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui";
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
  <Card
    className="flex overflow-hidden"
    contentClassName="flex flex-col min-h-0 flex-1 gap-4 overflow-hidden p-6 pt-0"
  >
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
