import type { AgentAlertDto } from "@shared/api/gen/main/model";
import { Link } from "@tanstack/react-router";
import { FC } from "react";

interface AlertAgentLinkProps {
  alert: AgentAlertDto;
}

/** Агент проблемы — ссылкой на его страницу. */
export const AlertAgentLink: FC<AlertAgentLinkProps> = ({ alert }) => (
  <Link
    to="/agents/$agentId"
    params={{ agentId: alert.agentId }}
    className="font-medium hover:underline"
  >
    {alert.agentName}
  </Link>
);
