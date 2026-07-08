import { gql } from "@apollo/client";

export const ATTACH_PROJECT_TO_NEW_REPO = gql`
  mutation AttachProjectToNewRepo($project: MoveProjectInput!) {
    attachProjectToNewRepo(project: $project) {
      id
      repoRefId
    }
  }
`;
