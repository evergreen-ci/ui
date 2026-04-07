import { gql } from "@apollo/client";

const TASK_EVENT_LOGS = gql`
  query TaskEventLogs($id: String!, $execution: Int) {
    task(taskId: $id, execution: $execution) {
      id
      execution
      taskLogs {
        eventLogs {
          id
          data {
            blockedOn
            hostId
            jiraIssue
            jiraLink
            priority
            status
            timestamp
            userId
          }
          eventType
          resourceId
          resourceType
          timestamp
        }
      }
    }
  }
`;

export default TASK_EVENT_LOGS;
