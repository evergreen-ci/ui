import { gql } from "@apollo/client";

const DETACH_PROJECT_FROM_REPO = gql`
  mutation DetachProjectFromRepo($projectId: String!) {
    detachProjectFromRepo(projectId: $projectId) {
      id
    }
  }
`;

export default DETACH_PROJECT_FROM_REPO;
