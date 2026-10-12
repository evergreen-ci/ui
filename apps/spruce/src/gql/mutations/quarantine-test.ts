import { gql } from "@apollo/client";

export const QUARANTINE_TEST = gql`
  mutation QuarantineTest(
    $taskId: String!
    $testName: String!
    $comment: String!
  ) {
    quarantineTest(
      opts: { taskId: $taskId, testName: $testName, comment: $comment }
    ) {
      id
      isManuallyQuarantined
    }
  }
`;
