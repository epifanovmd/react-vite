import { Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { useSectionSearch } from "../model";
import { UI_SECTIONS } from "../sections";
import { UiKitHeader } from "./UiKitHeader";
import { UiKitMobileNav } from "./UiKitMobileNav";
import { UiKitSidebar } from "./UiKitSidebar";

/**
 * Каркас документации: шапка, сайдбар разделов и прокручиваемая область
 * контента. При смене раздела контент прокручивается к началу.
 */
export const UiKitLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const search = useSectionSearch();
  const mainRef = useRef<HTMLElement>(null);
  const pathname = useLocation({ select: location => location.pathname });

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  const openMenu = () => setMenuOpen(true);

  return (
    <div className="flex h-dvh flex-col bg-background">
      <UiKitHeader sectionCount={UI_SECTIONS.length} onMenuClick={openMenu} />

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 border-r bg-card/40 lg:flex">
          <UiKitSidebar search={search} className="w-full" />
        </aside>

        <main ref={mainRef} className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <UiKitMobileNav
        open={menuOpen}
        onOpenChange={setMenuOpen}
        search={search}
      />
    </div>
  );
};
