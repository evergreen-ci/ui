import { gql } from "@apollo/client";

const TASK_ALL_EXECUTIONS = gql`
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

export default TASK_ALL_EXECUTIONS;
