import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Spinner,
} from "@components/ui";
import { FC } from "react";

export const SpinnerSection: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Spinner</CardTitle>
      <CardDescription className="text-xs">
        Загрузочные индикаторы
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center gap-4 flex-wrap">
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
        <Spinner size="xl" />
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <Spinner variant="primary" label="Primary" />
        <Spinner variant="success" label="Success" />
        <Spinner variant="warning" label="Warning" />
        <Spinner variant="destructive" label="Error" />
        <Spinner variant="info" label="Info" />
      </div>
    </CardContent>
  </Card>
);
