import { gql } from "@apollo/client";

export const PROJECT_PATCH_ALIAS_SETTINGS = gql`
  fragment ProjectPatchAliasSettings on Project {
    id
    githubMQTriggerAliases
    githubPRTriggerAliases
    patchTriggerAliases {
      alias
      childProjectIdentifier
      downstreamRevision
      parentAsModule
      status
      taskSpecifiers {
        patchAlias
        taskRegex
        variantRegex
      }
    }
  }
`;

export const REPO_PATCH_ALIAS_SETTINGS = gql`
  fragment RepoPatchAliasSettings on RepoRef {
    id
    githubMQTriggerAliases
    githubPRTriggerAliases
    patchTriggerAliases {
      alias
      childProjectIdentifier
      downstreamRevision
      parentAsModule
      status
      taskSpecifiers {
        patchAlias
        taskRegex
        variantRegex
      }
    }
  }
`;
