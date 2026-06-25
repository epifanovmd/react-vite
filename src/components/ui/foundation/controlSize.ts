const HEIGHT = { sm: "h-8", md: "h-10", lg: "h-12" } as const;
const WIDTH = { sm: "w-8", md: "w-10", lg: "w-12" } as const;

export const CONTROL_HEIGHT = HEIGHT;

export const CONTROL_SQUARE = {
  sm: `${HEIGHT.sm} ${WIDTH.sm}`,
  md: `${HEIGHT.md} ${WIDTH.md}`,
  lg: `${HEIGHT.lg} ${WIDTH.lg}`,
} as const;
