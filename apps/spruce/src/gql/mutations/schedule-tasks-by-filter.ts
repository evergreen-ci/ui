import { gql } from "@apollo/client";
import { BASE_TASK } from "../fragments/baseTask";

export const SCHEDULE_TASKS_BY_FILTER = gql`
  mutation ScheduleTasksByFilter(
    $versionId: String!
    $filter: TaskFilterOptions!
  ) {
    scheduleTasksByFilter(versionId: $versionId, filter: $filter) {
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
