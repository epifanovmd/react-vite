import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@shared/lib/utils/cn";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { TabsContext } from "./tabs-context";
import { tabsTriggerVariants } from "./tabs-variants";

export interface TabsTriggerProps
  extends
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(
  (
    { className, variant: variantProp, size: sizeProp, children, ...props },
    ref,
  ) => {
    const { variant: contextVariant, size: contextSize } =
      React.useContext(TabsContext);
    const variant = variantProp || contextVariant;
    const size = sizeProp || contextSize;

    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(tabsTriggerVariants({ variant, size, className }))}
        {...props}
      >
        {/* flex + gap: иначе иконка липнет к подписи и садится на базовую линию */}
        <span className="relative z-10 flex min-w-0 shrink items-center justify-center gap-1.5 overflow-hidden">
          {children}
        </span>
      </TabsPrimitive.Trigger>
    );
  },
);

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export { TabsTrigger };
