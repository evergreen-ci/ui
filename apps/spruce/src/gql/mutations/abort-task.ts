import { gql } from "@apollo/client";
import { BASE_TASK } from "../fragments/baseTask";

export const ABORT_TASK = gql`
  mutation AbortTask($taskId: String!) {
    abortTask(taskId: $taskId) {
      ...BaseTask
      priority
    }
  }
  ${BASE_TASK}
`;
