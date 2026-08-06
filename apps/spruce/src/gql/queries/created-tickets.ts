import { gql } from "@apollo/client";

export const CREATED_TICKETS = gql`
  query CreatedTickets($taskId: String!, $execution: Int!) {
    task(taskId: $taskId, execution: $execution) {
      id
      buildBaronCreatedTickets {
        fields {
          assigneeDisplayName
          created
          resolutionName
          status {
            id
            name
          }
          summary
          updated
        }
        key
      }
      execution
    }
  }
`;
