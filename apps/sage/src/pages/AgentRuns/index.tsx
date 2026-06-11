import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/agents/$agentId/runs/$runId");

export const AgentRunsPage: React.FC = () => {
  const { agentId, runId } = routeApi.useParams();
  return (
    <p>
      Agent ID: {agentId}, Run ID: {runId}
    </p>
  );
};
