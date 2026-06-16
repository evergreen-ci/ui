import { createFileRoute, getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/agents/$agentId/runs/$runId");

const AgentRunsPage: React.FC = () => {
  const { agentId, runId } = routeApi.useParams();
  return (
    <p>
      Agent ID: {agentId}, Run ID: {runId}
    </p>
  );
};

export const Route = createFileRoute("/agents/$agentId/runs/$runId")({
  component: AgentRunsPage,
});
