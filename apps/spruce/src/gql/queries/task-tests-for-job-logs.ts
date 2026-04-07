import { gql } from "@apollo/client";
import { BASE_TASK } from "../fragments/baseTask";

const TASK_TESTS_FOR_JOB_LOGS = gql`
  query TaskTestsForJobLogs($id: String!, $execution: Int) {
    task(taskId: $id, execution: $execution) {
      ...BaseTask
      tests(opts: {}) {
        testResults {
          id
          groupID
          logs {
            urlParsley
          }
          status
          testFile
        }
      }
    }
  }
  ${BASE_TASK}
`;

export default TASK_TESTS_FOR_JOB_LOGS;
