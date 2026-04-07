import { gql } from "@apollo/client";

export const TASK_ALL_EXECUTIONS = gql`
  query TaskAllExecutions($taskId: String!) {
    taskAllExecutions(taskId: $taskId) {
      id
      activatedTime
      displayStatus
      execution
      ingestTime
    }
  }
`;
