import { gql } from "@apollo/client";

// prevTaskCompleted(prevTaskOptions: { skipOnParentCompleted: true } ) {
//
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
            prevTaskCompleted {
              id
              displayStatus
              execution
              finishTime
            }
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
              prevTaskCompleted {
                id
                displayStatus
                execution
                finishTime
              }
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
          }
          project {
            id
            identifier
          }
          reviewed @client
          status
        }
      }
    }
  }
`;
