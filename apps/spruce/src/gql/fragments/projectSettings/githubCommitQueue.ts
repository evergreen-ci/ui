import { gql } from "@apollo/client";

export const PROJECT_GITHUB_SETTINGS = gql`
  fragment ProjectGithubSettings on Project {
    id
    commitQueue {
      enabled
    }
    githubChecksEnabled
    githubMQTriggerAliases
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
    githubMQTriggerAliases
    githubPRTriggerAliases
    gitTagAuthorizedTeams
    gitTagAuthorizedUsers
    gitTagVersionsEnabled
    manualPrTestingEnabled
    oldestAllowedMergeBase
    prTestingEnabled
  }
`;

export const PROJECT_GITHUB_COMMIT_QUEUE = gql`
  fragment ProjectGithubCommitQueue on ProjectSettings {
    githubWebhooksEnabled

    projectRef {
      ...ProjectGithubSettings
    }
  }
`;

export const REPO_GITHUB_COMMIT_QUEUE = gql`
  fragment RepoGithubCommitQueue on RepoSettings {
    githubWebhooksEnabled

    projectRef {
      ...RepoGithubSettings
    }
  }
`;

export const PROJECT_EVENT_GITHUB_COMMIT_QUEUE = gql`
  fragment ProjectEventGithubCommitQueue on ProjectEventSettings {
    githubWebhooksEnabled

    projectRef {
      ...ProjectGithubSettings
    }
  }
`;
