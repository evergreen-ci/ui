import { gql } from "@apollo/client";

export const VERSION_TASK_DURATIONS = gql`
  query VersionTaskDurations(
    $versionId: String!
    $taskFilterOptions: TaskFilterOptions!
  ) {
    version(versionId: $versionId) {
      id
      childVersions {
        id
        finishTime
        projectMetadata {
          id
          identifier
        }
        startTime
      }
      tasks(options: $taskFilterOptions) {
        count
        data {
          id
          buildVariant
          buildVariantDisplayName
          displayName
          displayStatus
          execution
          finishTime
          startTime
          subRows: executionTasksFull {
            id
            buildVariantDisplayName
            displayName
            displayStatus
            execution
            startTime
            timeTaken
          }
          timeTaken
        }
      }
    }
  }
`;
