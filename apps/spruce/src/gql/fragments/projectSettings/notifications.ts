import { gql } from "@apollo/client";

export const PROJECT_NOTIFICATION_SETTINGS = gql`
  fragment ProjectNotificationSettings on Project {
    id
    banner {
      text
      theme
    }
    notifyOnBuildFailure
  }
`;

export const REPO_NOTIFICATION_SETTINGS = gql`
  fragment RepoNotificationSettings on RepoRef {
    id
    notifyOnBuildFailure
  }
`;

export const SUBSCRIPTIONS = gql`
  fragment Subscriptions on GeneralSubscription {
    id
    ownerType
    regexSelectors {
      data
      type
    }
    resourceType
    selectors {
      data
      type
    }
    subscriber {
      subscriber {
        emailSubscriber
        githubCheckSubscriber {
          owner
          ref
          repo
        }
        githubPRSubscriber {
          owner
          prNumber
          ref
          repo
        }
        jiraCommentSubscriber
        jiraIssueSubscriber {
          issueType
          project
        }
        slackSubscriber
        webhookSubscriber {
          headers {
            key
            value
          }
          minDelayMs
          retries
          secret
          timeoutMs
          url
        }
      }
      type
    }
    trigger
    triggerData
  }
`;
