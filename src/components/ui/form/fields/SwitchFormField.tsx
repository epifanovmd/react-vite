import { Switch } from "../../switch";
import { createFormField } from "../createFormField";

export const SwitchFormField = createFormField(Switch, field => ({
  id: field.name,
  ref: field.ref,
  checked: Boolean(field.value) as boolean,
  onCheckedChange: field.onChange,
}));
