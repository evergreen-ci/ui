import { gql } from "@apollo/client";

export const PROJECT_PERMISSION_GROUP_SETTINGS = gql`
  fragment ProjectPermissionGroupSettings on ProjectSettings {
    githubAppAuth {
      appId
    }
    projectRef {
      id
      githubDynamicTokenPermissionGroups {
        name
        permissions
      }
      githubPermissionGroupByRequester
    }
  }
`;

export const PROJECT_EVENT_PERMISSION_GROUP_SETTINGS = gql`
  fragment ProjectEventPermissionGroupSettings on ProjectEventSettings {
    githubAppAuth {
      appId
    }
    projectRef {
      id
      githubDynamicTokenPermissionGroups {
        name
        permissions
      }
      githubPermissionGroupByRequester
    }
  }
`;

export const REPO_PERMISSION_GROUP_SETTINGS = gql`
  fragment RepoPermissionGroupSettings on RepoSettings {
    githubAppAuth {
      appId
    }
    projectRef {
      id
      githubDynamicTokenPermissionGroups {
        name
        permissions
      }
      githubPermissionGroupByRequester
    }
  }
`;
