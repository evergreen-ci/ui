import { gql } from "@apollo/client";
import { UPSTREAM_PROJECT } from "../fragments/upstreamProject";

const MAINLINE_COMMITS_FOR_HISTORY = gql`
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
          revision
          user {
            displayName
            userId
          }
        }
        version {
          ...UpstreamProject
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
          revision
          user {
            displayName
            userId
          }
        }
      }
    }
  }
  ${UPSTREAM_PROJECT}
`;

export default MAINLINE_COMMITS_FOR_HISTORY;
