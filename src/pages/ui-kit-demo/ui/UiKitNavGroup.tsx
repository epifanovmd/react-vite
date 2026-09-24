import { useId } from "react";

import type { UISectionGroupView } from "../model";
import { UiKitNavLink } from "./UiKitNavLink";

export interface UiKitNavGroupProps {
  group: UISectionGroupView;
  onNavigate?: () => void;
}

const TITLE_CLASS =
  "mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70";

export const UiKitNavGroup = ({ group, onNavigate }: UiKitNavGroupProps) => {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId}>
      <h2 id={titleId} className={TITLE_CLASS}>
        {group.label}
      </h2>
      <ul className="flex flex-col gap-0.5">
        {group.sections.map(section => (
          <li key={section.value}>
            <UiKitNavLink section={section} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </section>
  );
};
