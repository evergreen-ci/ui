import { gql } from "@apollo/client";
import { LOG_MESSAGE } from "../fragments/logMessage";

export const AGENT_LOGS = gql`
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
