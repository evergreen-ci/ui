import { gql } from "@apollo/client";

export const BASE_VERSION_AND_TASK = gql`
  query BaseVersionAndTask($taskId: String!) {
    task(taskId: $taskId) {
      id
      baseTask {
        id
        displayStatus
        execution
        order
      }
      buildVariant
      displayName
      displayStatus
      execution
      projectIdentifier
      versionMetadata {
        id
        baseVersion {
          id
          order
        }
        isPatch
      }
    }
  }
`;
