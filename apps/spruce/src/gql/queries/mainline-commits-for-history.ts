import { gql } from "@apollo/client";
import { VERSION_TRIGGER_INFO } from "../fragments/versionTriggerInfo";

export const MAINLINE_COMMITS_FOR_HISTORY = gql`
  query MainlineCommitsForHistory(
    $mainlineCommitsOptions: MainlineCommitsOptions!
    $buildVariantOptions: BuildVariantOptions!
  ) {
    mainlineCommits(
      options: $mainlineCommitsOptions
      buildVariantOptions: $buildVariantOptions
    ) {
      nextPageOrderNumber
      prevPageOrderNumber
      versions {
        rolledUpVersions {
          ...VersionTriggerInfo
          id
          createTime
          gitTags {
            pusher
            tag
          }
          message
          order
          requester
          revision
          user {
            displayName
            userId: id
          }
        }
        version {
          ...VersionTriggerInfo
          id
          buildVariants(options: $buildVariantOptions) {
            displayName
            tasks {
              id
              displayName
              displayStatus
              execution
            }
            variant
          }
          createTime
          gitTags {
            pusher
            tag
          }
          message
          order
          requester
          revision
          user {
            displayName
            userId: id
          }
        }
      }
    }
  }
  ${VERSION_TRIGGER_INFO}
`;
