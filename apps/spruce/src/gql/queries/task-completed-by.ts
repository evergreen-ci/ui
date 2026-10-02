import { gql } from "@apollo/client";

export const TASK_COMPLETED_BY = gql`
  query TaskCompletedBy($taskId: String!) {
    task(taskId: $taskId) {
      id
      displayName
      execution
    }
  }
`;
