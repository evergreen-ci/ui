import { gql } from "@apollo/client";

const UNSCHEDULE_VERSION_TASKS = gql`
  mutation UnscheduleVersionTasks($versionId: String!, $abort: Boolean!) {
    unscheduleVersionTasks(versionId: $versionId, abort: $abort)
  }
`;

export default UNSCHEDULE_VERSION_TASKS;
