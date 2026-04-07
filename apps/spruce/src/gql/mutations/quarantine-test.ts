import { gql } from "@apollo/client";

const QUARANTINE_TEST = gql`
  mutation QuarantineTest($taskId: String!, $testName: String!) {
    quarantineTest(opts: { taskId: $taskId, testName: $testName }) {
      success
    }
  }
`;

export default QUARANTINE_TEST;
