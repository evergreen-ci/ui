import { gql } from "@apollo/client";

const TASK_TEST_SAMPLE = gql`
  query TaskTestSample(
    $taskIds: [String!]!
    $filters: [TestFilter!]!
    $versionId: String!
  ) {
    taskTestSample(
      taskIds: $taskIds
      filters: $filters
      versionId: $versionId
    ) {
      execution
      matchingFailedTestNames
      taskId
      totalTestCount
    }
  }
`;

export default TASK_TEST_SAMPLE;
