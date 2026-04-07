import { gql } from "@apollo/client";

const BASE_VERSION_AND_TASK = gql`
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

export default BASE_VERSION_AND_TASK;
