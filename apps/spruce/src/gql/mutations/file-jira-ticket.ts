import { gql } from "@apollo/client";

const FILE_JIRA_TICKET = gql`
  mutation BuildBaronCreateTicket($taskId: String!, $execution: Int) {
    bbCreateTicket(taskId: $taskId, execution: $execution)
  }
`;

export default FILE_JIRA_TICKET;
