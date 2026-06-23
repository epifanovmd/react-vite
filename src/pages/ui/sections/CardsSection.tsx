import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui";
import { FC } from "react";

export const CardsSection: FC = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <Card
      variant="default"
      padding="sm"
      style={{ background: "var(--surface-3)" }}
    >
      <CardHeader>
        <CardTitle className="text-sm">Default Card</CardTitle>
        <CardDescription className="text-xs">Standard card</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">Surface level 3</p>
      </CardContent>
    </Card>

    <Card
      variant="elevated"
      padding="sm"
      style={{ background: "var(--surface-3)" }}
    >
      <CardHeader>
        <CardTitle className="text-sm">Elevated Card</CardTitle>
        <CardDescription className="text-xs">Enhanced shadow</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          Hover effect with surface
        </p>
      </CardContent>
    </Card>
  </div>
);
