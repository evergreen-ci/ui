import { gql } from "@apollo/client";

export const BUILD_VARIANT_STATS = gql`
  query BuildVariantStats($id: String!, $includeNeverActivatedTasks: Boolean) {
    version(versionId: $id) {
      id
      buildVariantStats(
        options: { includeNeverActivatedTasks: $includeNeverActivatedTasks }
      ) {
        displayName
        statusCounts {
          count
          status
        }
        variant
      }
    }
  }
`;
