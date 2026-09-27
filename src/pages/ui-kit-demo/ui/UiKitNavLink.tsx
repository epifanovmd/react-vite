import { Link } from "@tanstack/react-router";

import type { UISection } from "../sections";

export interface UiKitNavLinkProps {
  section: UISection;
  onNavigate?: () => void;
}

/** Активный пункт подсвечивается по `data-status="active"` от роутера. */
const LINK_CLASS =
  "block truncate rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[status=active]:bg-accent data-[status=active]:font-medium data-[status=active]:text-foreground";

export const UiKitNavLink = ({ section, onNavigate }: UiKitNavLinkProps) => (
  <Link
    to="/ui/$section"
    params={{ section: section.value }}
    onClick={onNavigate}
    className={LINK_CLASS}
  >
    {section.label}
  </Link>
);
