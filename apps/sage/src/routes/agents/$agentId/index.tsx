import { createFileRoute, getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/agents/$agentId/");

const AgentDetailPage: React.FC = () => {
  const { agentId } = routeApi.useParams();
  return <p>Agent ID: {agentId}</p>;
};

export const Route = createFileRoute("/agents/$agentId/")({
  component: AgentDetailPage,
});
