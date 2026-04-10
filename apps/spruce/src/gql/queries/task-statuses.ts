import { gql } from "@apollo/client";

export const TASK_STATUSES = gql`
  query TaskStatuses($id: String!) {
    version(versionId: $id) {
      id
      baseVersion {
        id
        taskStatuses
      }
      taskStatuses
    }
  }
`;
