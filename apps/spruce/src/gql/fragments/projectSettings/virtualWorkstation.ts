import { gql } from "@apollo/client";

export const PROJECT_VIRTUAL_WORKSTATION_SETTINGS = gql`
  fragment ProjectVirtualWorkstationSettings on Project {
    id
    workstationConfig {
      gitClone
      setupCommands {
        command
        directory
      }
    }
  }
`;

export const REPO_VIRTUAL_WORKSTATION_SETTINGS = gql`
  fragment RepoVirtualWorkstationSettings on RepoRef {
    id
    workstationConfig {
      gitClone
      setupCommands {
        command
        directory
      }
    }
  }
`;
