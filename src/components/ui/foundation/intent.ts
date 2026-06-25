/**
 * Semantic intent → token-class maps. Single source of truth for how each
 * meaning looks, so adding a new intent or restyling one touches one place.
 *
 * SOLID — filled background (Button, Tag, Chips).
 * SOFT  — tinted background (Badge, StatCard).
 *
 * Components compose these and append their own extras (hover, shadow, border).
 */
export const INTENT_SOLID = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  info: "bg-info text-info-foreground",
} as const;

export const INTENT_SOFT = {
  destructive: "bg-destructive/15 text-destructive",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
  purple: "bg-purple/15 text-purple",
} as const;
