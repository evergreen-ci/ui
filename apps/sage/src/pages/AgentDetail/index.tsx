import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/agents/$agentId/");

export const AgentDetailPage: React.FC = () => {
  const { agentId } = routeApi.useParams();
  return <p>Agent ID: {agentId}</p>;
};
