import { cn } from "@shared/lib/utils/cn";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { cardVariants } from "./card-variants";
import { CardContent } from "./CardContent";
import { CardDescription } from "./CardDescription";
import { CardFooter } from "./CardFooter";
import { CardHeader } from "./CardHeader";
import { CardTitle } from "./CardTitle";

export interface CardProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof cardVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Правый слот шапки: действия, бейдж. */
  extra?: React.ReactNode;
  footer?: React.ReactNode;
  /** Класс `CardContent` в режиме шортката. */
  contentClassName?: string;
}

const hasContent = (node: React.ReactNode): boolean =>
  node !== undefined && node !== null && node !== false;

/**
 * Карточка. Отступы задают секции (`CardHeader`/`CardContent`/`CardFooter`),
 * у корня своих отступов нет. Шорткат `title`/`description`/`extra`/`footer`
 * сам собирает эти секции и кладёт `children` в `CardContent`; без шортката
 * `children` рендерятся как есть — для составной разметки из секций.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      title,
      description,
      extra,
      footer,
      contentClassName,
      children,
      ...props
    },
    ref,
  ) => {
    const hasHeader =
      hasContent(title) || hasContent(description) || hasContent(extra);
    const hasFooter = hasContent(footer);
    const isShorthand = hasHeader || hasFooter;
    const hasBody = hasContent(children);

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant }), className)}
        {...props}
      >
        {hasHeader && (
          <CardHeader extra={extra}>
            {hasContent(title) && <CardTitle>{title}</CardTitle>}
            {hasContent(description) && (
              <CardDescription>{description}</CardDescription>
            )}
          </CardHeader>
        )}
        {isShorthand && hasBody && (
          <CardContent className={contentClassName}>{children}</CardContent>
        )}
        {!isShorthand && children}
        {hasFooter && <CardFooter>{footer}</CardFooter>}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card };
