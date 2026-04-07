import { gql } from "@apollo/client";
import { LOG_MESSAGE } from "../fragments/logMessage";

const AGENT_LOGS = gql`
  query AgentLogs($id: String!, $execution: Int) {
    task(taskId: $id, execution: $execution) {
      id
      execution
      taskLogs {
        agentLogs {
          ...LogMessage
        }
      }
    }
  }
  ${LOG_MESSAGE}
`;

export default AGENT_LOGS;
