import { FC, ReactNode } from "react";

import type { IAgentAlert } from "../model/types";

/** Пропсы ссылки на агента; маршрут к его странице знает владелец. */
export interface IAlertAgentLinkRenderProps {
  agentId: string;
  className: string;
  children: ReactNode;
}

interface AlertAgentLinkProps {
  alert: IAgentAlert;
  /** Ссылка на страницу агента (например, `Link` роутера). */
  renderLink: (props: IAlertAgentLinkRenderProps) => ReactNode;
}

/** Агент проблемы — ссылкой на его страницу. */
export const AlertAgentLink: FC<AlertAgentLinkProps> = ({
  alert,
  renderLink,
}) =>
  renderLink({
    agentId: alert.agentId,
    className: "font-medium hover:underline",
    children: alert.agentName,
  });
