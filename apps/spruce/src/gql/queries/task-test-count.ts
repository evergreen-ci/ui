import { gql } from "@apollo/client";

export const TASK_TEST_COUNT = gql`
  query TaskTestCount($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      execution
      failedTestCount
      totalTestCount
    }
  }
`;
