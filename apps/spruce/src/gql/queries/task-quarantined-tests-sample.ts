import { gql } from "@apollo/client";

export const TASK_QUARANTINED_TESTS_SAMPLE = gql`
  query TaskQuarantinedTestsSample(
    $versionId: String!
    $taskIds: [String!]!
    $limit: Int
  ) {
    version(versionId: $versionId) {
      id
      taskQuarantinedTestsSample(taskIds: $taskIds, limit: $limit) {
        execution
        quarantinedTests {
          displayTestName
          testName
        }
        quarantinedTestsSkippedCount
        taskId
      }
    }
  }
`;
