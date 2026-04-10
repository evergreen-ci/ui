import { gql } from "@apollo/client";

export const RESTART_ADMIN_TASKS = gql`
  mutation RestartAdminTasks($opts: RestartAdminTasksOptions!) {
    restartAdminTasks(opts: $opts) {
      numRestartedTasks
    }
  }
`;
