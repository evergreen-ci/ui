import { createFileRoute } from "@tanstack/react-router";
import { AgentDetailPage } from "pages/AgentDetail";

export const Route = createFileRoute("/agents/$agentId/")({
  component: AgentDetailPage,
});
