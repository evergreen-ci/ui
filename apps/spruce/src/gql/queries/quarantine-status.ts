import { gql } from "@apollo/client";

export const QUARANTINE_STATUS = gql`
  query QuarantineStatus($taskId: String!, $testName: String!) {
    quarantineStatus(taskId: $taskId, testName: $testName) {
      isQuarantined
    }
  }
`;
