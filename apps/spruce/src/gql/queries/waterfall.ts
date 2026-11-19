import { gql } from "@apollo/client";
import { VERSION_TRIGGER_INFO } from "../fragments/versionTriggerInfo";

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
        ...VersionTriggerInfo
        id
        activated
        createTime
        errors
        gitTags {
          tag
        }
        message
        order
        projectMetadata {
          id
          owner
          repo
        }
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
  ${VERSION_TRIGGER_INFO}
`;
