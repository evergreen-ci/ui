import { createFileRoute } from "@tanstack/react-router";
import { AgentRunsPage } from "pages/AgentRuns";

export const Route = createFileRoute("/agents/$agentId/runs/$runId")({
  component: AgentRunsPage,
});
