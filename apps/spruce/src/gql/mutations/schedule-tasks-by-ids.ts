import { gql } from "@apollo/client";
import { BASE_TASK } from "../fragments/baseTask";

export const SCHEDULE_TASKS_BY_IDS = gql`
  mutation ScheduleTasksByIds($taskIds: [String!]!) {
    scheduleTasksByIds(taskIds: $taskIds) {
      modifiedTasks {
        ...BaseTask
        canSchedule
        canUnschedule
        status
      }
      taskErrors {
        reason
        taskId
      }
    }
  }
  ${BASE_TASK}
`;
