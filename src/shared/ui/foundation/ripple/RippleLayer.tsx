import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { type Ripple } from "./use-ripple";

export interface RippleLayerProps {
  ripples: Ripple[];
  onRippleComplete: (id: number) => void;
}

export const RippleLayer: React.FC<RippleLayerProps> = ({
  ripples,
  onRippleComplete,
}) => (
  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
    <AnimatePresence>
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-current"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0, opacity: 0.35 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onAnimationComplete={() => onRippleComplete(ripple.id)}
        />
      ))}
    </AnimatePresence>
  </span>
);

RippleLayer.displayName = "RippleLayer";
