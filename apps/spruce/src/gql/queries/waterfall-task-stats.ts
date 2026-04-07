import { gql } from "@apollo/client";

const WATERFALL_TASK_STATS = gql`
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

export default WATERFALL_TASK_STATS;
