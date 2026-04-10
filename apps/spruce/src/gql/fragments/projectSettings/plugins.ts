import { gql } from "@apollo/client";

export const PROJECT_PLUGINS_SETTINGS = gql`
  fragment ProjectPluginsSettings on Project {
    id
    buildBaronSettings {
      ticketCreateIssueType
      ticketCreateProject
      ticketSearchProjects
    }
    externalLinks {
      displayName
      requesters
      urlTemplate
    }
    perfEnabled
    taskAnnotationSettings {
      fileTicketWebhook {
        endpoint
        secret
      }
    }
  }
`;

export const REPO_PLUGINS_SETTINGS = gql`
  fragment RepoPluginsSettings on RepoRef {
    id
    buildBaronSettings {
      ticketCreateIssueType
      ticketCreateProject
      ticketSearchProjects
    }
    externalLinks {
      displayName
      requesters
      urlTemplate
    }
    perfEnabled
    taskAnnotationSettings {
      fileTicketWebhook {
        endpoint
        secret
      }
    }
  }
`;
