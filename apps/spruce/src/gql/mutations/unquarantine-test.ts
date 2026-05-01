import { gql } from "@apollo/client";

export const UNQUARANTINE_TEST = gql`
  mutation UnquarantineTest($taskId: String!, $testName: String!) {
    unquarantineTest(opts: { taskId: $taskId, testName: $testName }) {
      id
      isManuallyQuarantined
    }
  }
`;
