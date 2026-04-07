import { gql } from "@apollo/client";

const TASK_QUEUE_DISTROS = gql`
  query TaskQueueDistros {
    taskQueueDistros {
      id
      hostCount
      taskCount
    }
  }
`;

export default TASK_QUEUE_DISTROS;
