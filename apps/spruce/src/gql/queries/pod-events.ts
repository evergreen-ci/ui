import { gql } from "@apollo/client";

const POD_EVENTS = gql`
  query PodEvents($id: String!, $limit: Int, $page: Int) {
    pod(podId: $id) {
      id
      events(page: $page, limit: $limit) {
        count
        eventLogEntries {
          id
          data {
            newStatus
            oldStatus
            reason
            task {
              id
              displayName
              execution
            }
            taskExecution
            taskID
            taskStatus
          }
          eventType
          processedAt
          resourceId
          resourceType
          timestamp
        }
      }
    }
  }
`;

export default POD_EVENTS;
