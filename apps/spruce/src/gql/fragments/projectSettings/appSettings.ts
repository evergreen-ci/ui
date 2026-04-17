import { gql } from "@apollo/client";

export const PROJECT_APP_SETTINGS = gql`
  fragment ProjectAppSettings on ProjectSettings {
    githubAppAuth {
      appId
      privateKey
    }
    projectRef {
      id
      githubPermissionGroupByRequester
    }
  }
`;

export const PROJECT_EVENT_APP_SETTINGS = gql`
  fragment ProjectEventAppSettings on ProjectEventSettings {
    githubAppAuth {
      appId
      privateKey
    }
    projectRef {
      id
      githubPermissionGroupByRequester
    }
  }
`;

export const REPO_APP_SETTINGS = gql`
  fragment RepoAppSettings on RepoSettings {
    githubAppAuth {
      appId
      privateKey
    }
    projectRef {
      id
      githubPermissionGroupByRequester
    }
  }
`;
