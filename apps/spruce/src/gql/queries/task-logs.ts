import { gql } from "@apollo/client";
import { LOG_MESSAGE } from "../fragments/logMessage";

export const TASK_LOGS = gql`
  query TaskLogs($id: String!, $execution: Int) {
    task(taskId: $id, execution: $execution) {
      id
      execution
      taskLogs {
        taskLogs {
          ...LogMessage
        }
      }
    }
  }
  ${LOG_MESSAGE}
`;
