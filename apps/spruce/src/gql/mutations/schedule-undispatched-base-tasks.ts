import { gql } from "@apollo/client";

const SCHEDULE_UNDISPATCHED_BASE_TASKS = gql`
  mutation ScheduleUndispatchedBaseTasks($versionId: String!) {
    scheduleUndispatchedBaseTasks(versionId: $versionId) {
      id
      displayStatus
      execution
    }
  }
`;

export default SCHEDULE_UNDISPATCHED_BASE_TASKS;
