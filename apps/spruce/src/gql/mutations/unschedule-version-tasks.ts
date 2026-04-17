import { gql } from "@apollo/client";

export const UNSCHEDULE_VERSION_TASKS = gql`
  mutation UnscheduleVersionTasks($versionId: String!, $abort: Boolean!) {
    unscheduleVersionTasks(versionId: $versionId, abort: $abort)
  }
`;
