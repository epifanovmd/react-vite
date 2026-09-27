import { ThemeToggle } from "@features/toggle-theme";
import { Badge, IconButton } from "@shared/ui";
import { Link } from "@tanstack/react-router";
import { LayoutGrid, Menu } from "lucide-react";

export interface UiKitHeaderProps {
  sectionCount: number;
  onMenuClick: () => void;
}

/** Верхняя панель документации: меню на мобильных, логотип, тема. */
export const UiKitHeader = ({
  sectionCount,
  onMenuClick,
}: UiKitHeaderProps) => (
  <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card px-4 lg:px-6">
    <IconButton
      className="lg:hidden"
      variant="ghost"
      aria-label="Открыть меню разделов"
      onClick={onMenuClick}
    >
      <Menu aria-hidden className="h-5 w-5" />
    </IconButton>

    <Link to="/ui" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <LayoutGrid aria-hidden className="h-4 w-4" />
      </span>
      <span className="text-sm font-semibold">UI Kit</span>
    </Link>

    <Badge variant="secondary" className="hidden sm:inline-flex">
      {sectionCount} разделов
    </Badge>

    <div className="ml-auto">
      <ThemeToggle />
    </div>
  </header>
);
