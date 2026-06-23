import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui";
import { FC } from "react";

import { FormDemo } from "../FormDemo";

export const FormSection: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>createFormField factory</CardTitle>
      <CardDescription>
        Each field component is created via{" "}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
          createFormField(Component, mapper)
        </code>
        . The mapper extracts{" "}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
          value / onChange / onBlur
        </code>{" "}
        from the Controller and applies them to the wrapped component. Field
        wrappers (label, hint tooltip, description, error) come from{" "}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
          &lt;Field&gt;
        </code>
        .
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-6">
        {[
          "InputFormField",
          "SelectFormField",
          "CheckboxFormField",
          "SwitchFormField",
          "FormField (render prop)",
          "Field (standalone)",
        ].map(name => (
          <span
            key={name}
            className="inline-flex items-center gap-1.5 bg-muted rounded-md px-2.5 py-1 text-xs font-mono"
          >
            {name}
          </span>
        ))}
      </div>

      <FormDemo />
    </CardContent>
  </Card>
);
