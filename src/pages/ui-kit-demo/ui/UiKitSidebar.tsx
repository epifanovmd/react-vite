import { cn } from "@shared/lib/utils/cn";
import { Input } from "@shared/ui";
import { Search } from "lucide-react";
import type { ChangeEvent } from "react";

import type { UseSectionSearchResult } from "../model";
import { UiKitNavGroup } from "./UiKitNavGroup";

export interface UiKitSidebarProps {
  search: UseSectionSearchResult;
  /** Закрыть мобильную панель после перехода. */
  onNavigate?: () => void;
  className?: string;
}

const SEARCH_ICON = <Search aria-hidden className="h-4 w-4" />;

/** Поиск и список разделов, сгруппированных как в документации UI-китов. */
export const UiKitSidebar = ({
  search,
  onNavigate,
  className,
}: UiKitSidebarProps) => {
  const { query, setQuery, groups } = search;
  const hasResults = groups.length > 0;

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) =>
    setQuery(event.target.value);

  const handleClear = () => setQuery("");

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="shrink-0 p-4 pb-2">
        <Input
          size="sm"
          type="search"
          value={query}
          onChange={handleQueryChange}
          onClear={handleClear}
          clearable
          leftIcon={SEARCH_ICON}
          placeholder="Поиск компонента"
          aria-label="Поиск компонента"
        />
      </div>

      <nav
        aria-label="Компоненты"
        className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-2 py-3"
      >
        {groups.map(group => (
          <UiKitNavGroup key={group.id} group={group} onNavigate={onNavigate} />
        ))}
        {!hasResults && (
          <p className="px-3 text-sm text-muted-foreground">
            Ничего не найдено
          </p>
        )}
      </nav>
    </div>
  );
};
