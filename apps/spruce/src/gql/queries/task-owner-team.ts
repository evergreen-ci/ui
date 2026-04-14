import { gql } from "@apollo/client";

export const TASK_OWNER_TEAM = gql`
  query TaskOwnerTeamsForTask($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      execution
      taskOwnerTeam {
        messages
        teamName
      }
    }
  }
`;
