import { gql } from "@apollo/client";

export const TASK_HISTORY = gql`
  query TaskHistory($options: TaskHistoryOpts!, $includeGenerator: Boolean!) {
    taskHistory(options: $options) {
      pagination {
        mostRecentTaskOrder
        oldestTaskOrder
      }
      tasks {
        id
        activated
        canRestart
        canSchedule
        canSetPriority
        displayStatus
        execution
        generator @include(if: $includeGenerator) {
          id
          execution
          ingestTime
        }
        ingestTime
        order
        priority
        requester
        revision
        tests(opts: { statuses: ["fail", "silentfail"] }) {
          testResults {
            id
            logs {
              urlParsley
            }
            status
            testFile
          }
        }
        version {
          id
          message
          user {
            id
            displayName
          }
        }
      }
    }
  }
`;
