import { CollapseContent } from "./CollapseContent";
import { CollapseRoot } from "./CollapseRoot";
import { CollapseTrigger } from "./CollapseTrigger";

export const Collapse = Object.assign(CollapseRoot, {
  Trigger: CollapseTrigger,
  Content: CollapseContent,
});
