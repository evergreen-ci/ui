import { gql } from "@apollo/client";

export const SET_TASK_PRIORITY = gql`
  mutation SetTaskPriority($taskId: String!, $priority: Int!) {
    setTaskPriority(taskId: $taskId, priority: $priority) {
      id
      execution
      priority
    }
  }
`;
