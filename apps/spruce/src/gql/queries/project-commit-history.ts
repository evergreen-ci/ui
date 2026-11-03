import { gql } from "@apollo/client";

export const PROJECT_COMMIT_HISTORY = gql`
  query ProjectCommitHistory($options: WaterfallOptions!) {
    waterfall(options: $options) {
      pagination {
        hasNextPage
        hasPrevPage
        mostRecentVersionOrder
        nextPageOrder
        prevPageOrder
      }
      versions {
        id
        activated
        createTime
        message
        order
        requester
        revision
        taskCount
        taskStatusStats {
          counts {
            count
            status
          }
        }
        user {
          displayName
          userId: id
        }
      }
    }
  }
`;
