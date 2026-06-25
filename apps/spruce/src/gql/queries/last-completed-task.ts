import { gql } from "@apollo/client";

export const LAST_COMPLETED_TASK = gql`
  query LastCompletedTask($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      execution
      prevTaskCompleted {
        id
        displayStatus
        execution
      }
    }
  }
`;
