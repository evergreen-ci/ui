import { gql } from "@apollo/client";

export const VERSION_TASK_DURATIONS = gql`
  query VersionTaskDurations(
    $versionId: String!
    $taskFilterOptions: TaskFilterOptions!
    $includeNeverActivatedTasks: Boolean
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
      taskCount(
        options: { includeNeverActivatedTasks: $includeNeverActivatedTasks }
      )
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
            finishTime
            startTime
            timeTaken
          }
          timeTaken
        }
      }
    }
  }
`;
