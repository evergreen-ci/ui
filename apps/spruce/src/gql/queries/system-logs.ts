import { gql } from "@apollo/client";
import { LOG_MESSAGE } from "../fragments/logMessage";

export const SYSTEM_LOGS = gql`
  query SystemLogs($id: String!, $execution: Int) {
    task(taskId: $id, execution: $execution) {
      id
      execution
      taskLogs {
        systemLogs {
          ...LogMessage
        }
      }
    }
  }
  ${LOG_MESSAGE}
`;
