import { gql } from "@apollo/client";

const LOGKEEPER_BUILD_METADATA = gql`
  query LogkeeperBuildMetadata($buildId: String!) {
    logkeeperBuildMetadata(buildId: $buildId) {
      id
      builder
      buildNum
      taskExecution
      taskId
      tests {
        id
        name
      }
    }
  }
`;

export default LOGKEEPER_BUILD_METADATA;
