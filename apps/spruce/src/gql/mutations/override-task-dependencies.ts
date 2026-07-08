import { gql } from "@apollo/client";

export const OVERRIDE_TASK_DEPENDENCIES = gql`
  mutation OverrideTaskDependencies($taskId: String!) {
    overrideTaskDependencies(taskId: $taskId) {
      id
      displayStatus
      execution
    }
  }
`;
