import { gql } from "@apollo/client";

const ADMIN_TASKS_TO_RESTART = gql`
  query AdminTasksToRestart($opts: RestartAdminTasksOptions!) {
    adminTasksToRestart(opts: $opts) {
      tasksToRestart {
        id
        execution
      }
    }
  }
`;

export default ADMIN_TASKS_TO_RESTART;
