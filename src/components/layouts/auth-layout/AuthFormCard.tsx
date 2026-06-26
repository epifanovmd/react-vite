import { Card } from "@components/ui";
import { FC, ReactNode } from "react";

interface AuthFormCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Карточка экрана авторизации со стандартной шапкой.
 * Используется на всех auth-экранах и странице сброса пароля.
 */
export const AuthFormCard: FC<AuthFormCardProps> = ({
  title,
  subtitle,
  children,
}) => (
  <Card className="p-6">
    {title && (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    )}
    {children}
  </Card>
);
