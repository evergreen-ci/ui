import { useParams } from "react-router-dom";

export const AgentRunsPage: React.FC = () => {
  const { agentId, runId } = useParams<{ agentId: string; runId: string }>();
  return (
    <p>
      Agent ID: {agentId}, Run ID: {runId}
    </p>
  );
};
