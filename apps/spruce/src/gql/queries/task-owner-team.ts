import { gql } from "@apollo/client";

const TASK_OWNER_TEAM = gql`
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

export default TASK_OWNER_TEAM;
