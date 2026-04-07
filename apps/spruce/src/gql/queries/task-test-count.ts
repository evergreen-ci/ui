import { gql } from "@apollo/client";

const TASK_TEST_COUNT = gql`
  query TaskTestCount($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      execution
      failedTestCount
      totalTestCount
    }
  }
`;

export default TASK_TEST_COUNT;
