import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@components/ui";
import { Search } from "lucide-react";
import { FC } from "react";

export const InputsSection: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Inputs</CardTitle>
      <CardDescription className="text-xs">Текстовые поля</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <Input placeholder="Default input" size="sm" />
      <Input
        placeholder="With left icon"
        leftIcon={<Search className="h-4 w-4" />}
        size="sm"
      />
      <Input
        placeholder="Clearable input"
        clearable
        onClear={() => {}}
        size="sm"
      />
      <Input placeholder="Filled variant" variant="filled" size="sm" />
      <Input placeholder="Filled error" variant="filled-error" size="sm" />
      <Input placeholder="Filled success" variant="filled-success" size="sm" />
      <Input placeholder="Error state" variant="error" size="sm" />
      <Input placeholder="Success state" variant="success" size="sm" />
      <Input type="password" placeholder="Password" size="sm" />
      <Input placeholder="Loading..." loading size="sm" />
    </CardContent>
  </Card>
);
