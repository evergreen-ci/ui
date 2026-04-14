import { gql } from "@apollo/client";
import { BASE_TASK } from "../fragments/baseTask";

export const RESTART_TASK = gql`
  mutation RestartTask($taskId: String!, $failedOnly: Boolean!) {
    restartTask(taskId: $taskId, failedOnly: $failedOnly) {
      ...BaseTask
      execution
      latestExecution
      priority
    }
  }
  ${BASE_TASK}
`;
