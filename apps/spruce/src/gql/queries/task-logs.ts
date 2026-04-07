import { gql } from "@apollo/client";
import { LOG_MESSAGE } from "../fragments/logMessage";

const TASK_LOGS = gql`
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

export default TASK_LOGS;
