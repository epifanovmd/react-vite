import { Drawer as DrawerPrimitive } from "vaul";

import { DrawerContent } from "./components/DrawerContent";
import { DrawerDescription } from "./components/DrawerDescription";
import { DrawerFooter } from "./components/DrawerFooter";
import { DrawerHeader } from "./components/DrawerHeader";
import { DrawerOverlay } from "./components/DrawerOverlay";
import { DrawerTitle } from "./components/DrawerTitle";

export const Drawer = Object.assign(DrawerPrimitive.Root, {
  Trigger: DrawerPrimitive.Trigger,
  Portal: DrawerPrimitive.Portal,
  Close: DrawerPrimitive.Close,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Header: DrawerHeader,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
});
