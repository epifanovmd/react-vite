import { Separator } from "@shared/ui";
import { ChevronRight } from "lucide-react";

import type { UISection } from "../sections";

export interface UiKitSectionHeaderProps {
  section: UISection;
  groupLabel?: string;
}

const CRUMB_SEPARATOR = <ChevronRight aria-hidden className="h-3.5 w-3.5" />;

/** Хлебные крошки, заголовок и описание раздела. */
export const UiKitSectionHeader = ({
  section,
  groupLabel,
}: UiKitSectionHeaderProps) => (
  <header className="flex flex-col gap-3">
    <nav aria-label="Хлебные крошки">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <li>UI Kit</li>
        <li aria-hidden>{CRUMB_SEPARATOR}</li>
        <li>{groupLabel}</li>
        <li aria-hidden>{CRUMB_SEPARATOR}</li>
        <li aria-current="page" className="font-medium text-foreground">
          {section.label}
        </li>
      </ol>
    </nav>

    <h1 className="m-0 text-3xl font-semibold tracking-tight">
      {section.label}
    </h1>
    <p className="max-w-3xl text-base text-muted-foreground">
      {section.description}
    </p>
    <Separator className="mt-3" />
  </header>
);
