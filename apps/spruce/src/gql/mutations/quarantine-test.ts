import { gql } from "@apollo/client";

export const QUARANTINE_TEST = gql`
  mutation QuarantineTest(
    $taskId: String!
    $testName: String!
    $existingJiraTicketsToLink: [String!]
    $justification: String
  ) {
    quarantineTest(
      opts: {
        taskId: $taskId
        testName: $testName
        existingJiraTicketsToLink: $existingJiraTicketsToLink
        justification: $justification
      }
    ) {
      id
      isManuallyQuarantined
    }
  }
`;
