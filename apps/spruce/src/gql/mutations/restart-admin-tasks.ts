import { gql } from "@apollo/client";

const RESTART_ADMIN_TASKS = gql`
  mutation RestartAdminTasks($opts: RestartAdminTasksOptions!) {
    restartAdminTasks(opts: $opts) {
      numRestartedTasks
    }
  }
`;

export default RESTART_ADMIN_TASKS;
