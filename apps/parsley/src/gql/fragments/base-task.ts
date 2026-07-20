import { gql } from "@apollo/client";

export const BASE_TASK = gql`
  fragment BaseTask on Task {
    id
    displayName
    displayStatus
    execution
    patchNumber
    versionMetadata: version {
      id
      isPatch
      message
      projectMetadata: project {
        id
        identifier
      }
      revision
    }
  }
`;
