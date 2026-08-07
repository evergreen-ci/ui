import { gql } from "@apollo/client";

export const VERSION_QUARANTINED_TASKS = gql`
  query VersionQuarantinedTasks($versionId: String!) {
    version(versionId: $versionId) {
      id
      tasks(options: { limit: 0 }) {
        count
        data {
          id
          buildVariantDisplayName
          displayName
          execution
          quarantinedTestsSkippedCount
        }
      }
    }
  }
`;
