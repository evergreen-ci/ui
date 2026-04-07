import { gql } from "@apollo/client";
import { BASE_TASK } from "../fragments/baseTask";

const SCHEDULE_TASKS = gql`
  mutation ScheduleTasks($taskIds: [String!]!, $versionId: String!) {
    scheduleTasks(taskIds: $taskIds, versionId: $versionId) {
      ...BaseTask
      canSchedule
      canUnschedule
      status
    }
  }
  ${BASE_TASK}
`;

export default SCHEDULE_TASKS;
