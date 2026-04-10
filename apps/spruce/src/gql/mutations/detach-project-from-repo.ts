import { gql } from "@apollo/client";

export const DETACH_PROJECT_FROM_REPO = gql`
  mutation DetachProjectFromRepo($projectId: String!) {
    detachProjectFromRepo(projectId: $projectId) {
      id
    }
  }
`;
