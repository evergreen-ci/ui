import { gql } from "@apollo/client";

const BUILD_BARON_CONFIGURED = gql`
  query BuildBaronConfigured($taskId: String!, $execution: Int!) {
    buildBaron(taskId: $taskId, execution: $execution) {
      buildBaronConfigured
    }
  }
`;

export default BUILD_BARON_CONFIGURED;
