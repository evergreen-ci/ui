import { gql } from "@apollo/client";

export const ATTACH_PROJECT_TO_REPO = gql`
  mutation AttachProjectToRepo($projectId: String!) {
    attachProjectToRepo(projectId: $projectId) {
      id
    }
  }
`;
