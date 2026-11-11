import { gql } from "@apollo/client";

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
`;
