import { gql } from "@apollo/client";

export const PROJECT_PERIODIC_BUILDS_SETTINGS = gql`
  fragment ProjectPeriodicBuildsSettings on Project {
    id
    periodicBuilds {
      id
      alias
      configFile
      cron
      intervalHours
      message
      nextRunTime
    }
  }
`;

export const REPO_PERIODIC_BUILDS_SETTINGS = gql`
  fragment RepoPeriodicBuildsSettings on RepoRef {
    id
    periodicBuilds {
      id
      alias
      configFile
      cron
      intervalHours
      message
      nextRunTime
    }
  }
`;
