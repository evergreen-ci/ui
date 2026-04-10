import { gql } from "@apollo/client";

export const JIRA_TICKET = gql`
  fragment JiraTicket on JiraTicket {
    fields {
      assignedTeam
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
`;
