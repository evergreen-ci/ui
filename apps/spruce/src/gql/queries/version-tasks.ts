import { gql } from "@apollo/client";

export const VERSION_TASKS = gql`
  query VersionTasks(
    $versionId: String!
    $taskFilterOptions: TaskFilterOptions!
  ) {
    version(versionId: $versionId) {
      id
      isPatch
      tasks(options: $taskFilterOptions) {
        count
        data {
          id
          aborted
          baseTask {
            id
            displayStatus
            execution
            prevTaskCompleted(
              prevTaskOptions: { skipOnParentCompleted: true }
            ) {
              id
              displayStatus
              execution
              timeTaken
            }
            status
            timeTaken
          }
          blocked
          buildVariant
          buildVariantDisplayName
          dependsOn {
            name
          }
          displayName
          displayStatus
          errors
          execution
          executionTasksFull {
            id
            baseTask {
              id
              displayStatus
              execution
              prevTaskCompleted(
                prevTaskOptions: { skipOnParentCompleted: true }
              ) {
                id
                displayStatus
                execution
                timeTaken
              }
              status
              timeTaken
            }
            buildVariant
            buildVariantDisplayName
            displayName
            displayStatus
            execution
            project {
              id
              identifier
            }
            reviewed @client
            timeTaken
          }
          project {
            id
            identifier
          }
          reviewed @client
          timeTaken
        }
      }
    }
  }
`;
