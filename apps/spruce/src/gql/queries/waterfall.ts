import { gql } from "@apollo/client";

export const WATERFALL = gql`
  query Waterfall($options: WaterfallOptions!) {
    waterfall(options: $options) {
      pagination {
        activeVersionIds
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
        errors
        gitTags {
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
        waterfallBuilds {
          id
          activated
          buildVariant
          displayName
          tasks {
            id
            displayName
            displayStatusCache
            execution
          }
        }
      }
    }
  }
`;
