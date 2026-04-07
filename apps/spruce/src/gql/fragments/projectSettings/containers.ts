import { gql } from "@apollo/client";

export const PROJECT_CONTAINER_SETTINGS = gql`
  fragment ProjectContainerSettings on Project {
    id
    containerSizeDefinitions {
      cpu
      memoryMb
      name
    }
  }
`;

export const REPO_CONTAINER_SETTINGS = gql`
  fragment RepoContainerSettings on RepoRef {
    id
    containerSizeDefinitions {
      cpu
      memoryMb
      name
    }
  }
`;
