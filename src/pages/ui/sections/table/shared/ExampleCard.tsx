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
  <Card>
    <CardHeader>
      <CardTitle className="text-base">{title}</CardTitle>
      {description && (
        <CardDescription className="text-xs">{description}</CardDescription>
      )}
    </CardHeader>
    <CardContent className="space-y-3">{children}</CardContent>
  </Card>
);
