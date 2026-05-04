import { gql } from "@apollo/client";

export const PROJECT_GITHUB_SETTINGS = gql`
  fragment ProjectGithubSettings on Project {
    id
    commitQueue {
      enabled
    }
    githubChecksEnabled
    githubDynamicTokenPermissionGroups {
      name
      permissions
    }
    githubMQTriggerAliases
    githubPermissionGroupByRequester
    githubPRTriggerAliases
    gitTagAuthorizedTeams
    gitTagAuthorizedUsers
    gitTagVersionsEnabled
    manualPrTestingEnabled
    oldestAllowedMergeBase
    prTestingEnabled
  }
`;

export const REPO_GITHUB_SETTINGS = gql`
  fragment RepoGithubSettings on RepoRef {
    id
    commitQueue {
      enabled
    }
    githubChecksEnabled
    githubDynamicTokenPermissionGroups {
      name
      permissions
    }
    githubMQTriggerAliases
    githubPermissionGroupByRequester
    githubPRTriggerAliases
    gitTagAuthorizedTeams
    gitTagAuthorizedUsers
    gitTagVersionsEnabled
    manualPrTestingEnabled
    oldestAllowedMergeBase
    prTestingEnabled
  }
`;

export const PROJECT_GITHUB_SECTIONS = gql`
  fragment ProjectGithubSections on ProjectSettings {
    githubAppAuth {
      appId
      privateKey
    }
    githubWebhooksEnabled
    projectRef {
      ...ProjectGithubSettings
    }
  }
`;

export const REPO_GITHUB_SECTIONS = gql`
  fragment RepoGithubSections on RepoSettings {
    githubAppAuth {
      appId
      privateKey
    }
    githubWebhooksEnabled
    projectRef {
      ...RepoGithubSettings
      githubDynamicTokenPermissionGroups {
        name
        permissions
      }
      githubPermissionGroupByRequester
    }
  }
`;

// Project events.
export const PROJECT_EVENT_GITHUB_SECTIONS = gql`
  fragment ProjectEventGithubSections on ProjectEventSettings {
    githubAppAuth {
      appId
      privateKey
    }
    githubWebhooksEnabled
    projectRef {
      ...ProjectGithubSettings
    }
  }
`;
