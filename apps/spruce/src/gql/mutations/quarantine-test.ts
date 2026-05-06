import { gql } from "@apollo/client";

export const QUARANTINE_TEST = gql`
  mutation QuarantineTest($taskId: String!, $testName: String!) {
    quarantineTest(opts: { taskId: $taskId, testName: $testName }) {
      success
    }
  }
`;
