import { gql } from "@apollo/client";

const OVERRIDE_TASK_DEPENDENCIES = gql`
  mutation OverrideTaskDependencies($taskId: String!) {
    overrideTaskDependencies(taskId: $taskId) {
      id
      displayStatus
      execution
    }
  }
`;

export default OVERRIDE_TASK_DEPENDENCIES;
