import { gql } from "@apollo/client";

export const UNSCHEDULED_TASKS = gql`
  query UndispatchedTasks($versionId: String!) {
    version(versionId: $versionId) {
      id
      generatedTaskCounts {
        estimatedTasks
        taskId
      }
      tasks(
        options: { statuses: ["unscheduled"], includeNeverActivatedTasks: true }
      ) {
        data {
          id
          buildVariant
          buildVariantDisplayName
          displayName
          execution
        }
      }
    }
  }
`;
