import { gql } from "@apollo/client";

const UNSCHEDULE_TASK = gql`
  mutation UnscheduleTask($taskId: String!) {
    unscheduleTask(taskId: $taskId) {
      id
      canSchedule
      canUnschedule
      displayStatus
      execution
      status
    }
  }
`;

export default UNSCHEDULE_TASK;
