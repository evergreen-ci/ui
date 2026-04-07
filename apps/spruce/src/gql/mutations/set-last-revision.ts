import { gql } from "@apollo/client";

const SET_LAST_REVISION = gql`
  mutation SetLastRevision($projectIdentifier: String!, $revision: String!) {
    setLastRevision(
      opts: { projectIdentifier: $projectIdentifier, revision: $revision }
    ) {
      mergeBaseRevision
    }
  }
`;

export default SET_LAST_REVISION;
