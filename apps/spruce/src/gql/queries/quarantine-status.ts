import { gql } from "@apollo/client";

export const QUARANTINE_STATUS = gql`
  query QuarantineStatus($taskId: String!, $testName: String!) {
    task(taskId: $taskId) {
      id
      quarantineStatus(testName: $testName) {
        isQuarantined
      }
    }
  }
`;
