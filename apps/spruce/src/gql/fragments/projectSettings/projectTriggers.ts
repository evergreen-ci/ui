import { gql } from "@apollo/client";

export const PROJECT_TRIGGERS_SETTINGS = gql`
  fragment ProjectTriggersSettings on Project {
    id
    triggers {
      alias
      buildVariantRegex
      configFile
      dateCutoff
      level
      project
      status
      taskRegex
      unscheduleDownstreamVersions
    }
  }
`;

export const REPO_TRIGGERS_SETTINGS = gql`
  fragment RepoTriggersSettings on RepoRef {
    id
    triggers {
      alias
      buildVariantRegex
      configFile
      dateCutoff
      level
      project
      status
      taskRegex
      unscheduleDownstreamVersions
    }
  }
`;
