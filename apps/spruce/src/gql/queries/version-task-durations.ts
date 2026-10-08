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
      isPatch
      tasks(options: $taskFilterOptions) {
        count
        data {
          id
          baseTask {
            id
            displayStatus
            execution
            finishTime
            timeTaken
          }
          buildVariant
          buildVariantDisplayName
          displayName
          displayStatus
          execution
          finishTime
          startTime
          subRows: executionTasksFull {
            id
            baseTask {
              id
              displayStatus
              execution
              finishTime
              timeTaken
            }
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
