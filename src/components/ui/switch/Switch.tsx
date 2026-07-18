import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@utils/cn";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { switchThumbVariants, switchVariants } from "./switchVariants";

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {}

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size, variant, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchVariants({ size, variant, className }))}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className={cn(switchThumbVariants({ size }))} />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
