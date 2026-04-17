import { gql } from "@apollo/client";

export const TASK_OVERVIEW_POPUP = gql`
  query TaskOverviewPopup($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      annotation {
        id
        createdIssues {
          issueKey
          url
        }
        issues {
          issueKey
          jiraTicket {
            fields {
              failingTasks
            }
          }
          url
        }
        suspectedIssues {
          issueKey
          url
        }
      }
      buildVariant
      canRestart
      details {
        description
        failingCommand
      }
      displayName
      displayOnly
      displayStatus
      distroId
      execution
      finishTime
      priority
      status
      stepbackInfo {
        lastFailingStepbackTaskId
        nextStepbackTaskId
      }
      timeTaken
    }
  }
`;
