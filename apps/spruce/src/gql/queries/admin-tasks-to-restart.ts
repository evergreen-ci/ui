import { gql } from "@apollo/client";

export const ADMIN_TASKS_TO_RESTART = gql`
  query AdminTasksToRestart($opts: RestartAdminTasksOptions!) {
    adminTasksToRestart(opts: $opts) {
      tasksToRestart {
        id
        execution
      }
    }
  }
`;
