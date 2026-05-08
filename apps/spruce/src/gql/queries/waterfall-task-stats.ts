import { gql } from "@apollo/client";

export const WATERFALL_TASK_STATS = gql`
  query WaterfallTaskStats($versionId: String!) {
    version(versionId: $versionId) {
      id
      taskStatusStats(options: {}) {
        counts {
          count
          status
        }
      }
    }
  }
`;
