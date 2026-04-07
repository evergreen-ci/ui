import { gql } from "@apollo/client";

const TASK_STATUSES = gql`
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

export default TASK_STATUSES;
