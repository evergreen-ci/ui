import { gql } from "@apollo/client";

const ATTACH_PROJECT_TO_REPO = gql`
  mutation AttachProjectToRepo($projectId: String!) {
    attachProjectToRepo(projectId: $projectId) {
      id
    }
  }
`;

export default ATTACH_PROJECT_TO_REPO;
