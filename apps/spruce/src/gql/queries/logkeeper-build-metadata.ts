import { gql } from "@apollo/client";

export const LOGKEEPER_BUILD_METADATA = gql`
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
