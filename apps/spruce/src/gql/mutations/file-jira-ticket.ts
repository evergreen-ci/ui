import { gql } from "@apollo/client";

export const FILE_JIRA_TICKET = gql`
  mutation BuildBaronCreateTicket($taskId: String!, $execution: Int) {
    bbCreateTicket(taskId: $taskId, execution: $execution)
  }
`;
