import { useParams } from "react-router-dom";

export const AgentDetailPage: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  return <p>Agent ID: {agentId}</p>;
};
