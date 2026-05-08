import { gql } from "@apollo/client";

export const BUILD_BARON_CONFIGURED = gql`
  query BuildBaronConfigured($taskId: String!, $execution: Int!) {
    buildBaron(taskId: $taskId, execution: $execution) {
      buildBaronConfigured
    }
  }
`;
