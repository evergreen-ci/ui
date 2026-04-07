import { gql } from "@apollo/client";
import { LOG_MESSAGE } from "../fragments/logMessage";

const ALL_LOGS = gql`
  query AllLogs($id: String!, $execution: Int) {
    task(taskId: $id, execution: $execution) {
      id
      execution
      taskLogs {
        allLogs {
          ...LogMessage
        }
      }
    }
  }
  ${LOG_MESSAGE}
`;

export default ALL_LOGS;
