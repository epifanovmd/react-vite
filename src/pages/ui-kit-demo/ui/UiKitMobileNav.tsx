import { Drawer, DrawerContent, DrawerTitle } from "@shared/ui";

import type { UseSectionSearchResult } from "../model";
import { UiKitSidebar } from "./UiKitSidebar";

export interface UiKitMobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: UseSectionSearchResult;
}

/** Тот же сайдбар в выдвижной панели для узких экранов. */
export const UiKitMobileNav = ({
  open,
  onOpenChange,
  search,
}: UiKitMobileNavProps) => {
  const close = () => onOpenChange(false);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="w-72 bg-card">
        <DrawerTitle className="sr-only">Разделы UI Kit</DrawerTitle>
        <UiKitSidebar search={search} onNavigate={close} className="h-full" />
      </DrawerContent>
    </Drawer>
  );
};
