import { gql } from "@apollo/client";

export const WATERFALL = gql`
  query Waterfall($options: WaterfallOptions!) {
    waterfall(options: $options) {
      flattenedVersions {
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
        user: userLite {
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
      pagination {
        activeVersionIds
        hasNextPage
        hasPrevPage
        mostRecentVersionOrder
        nextPageOrder
        prevPageOrder
      }
    }
  }
`;
